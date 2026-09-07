-- Sathaye UCM: Smart Canteen & Meal Tokens Extension
-- Migration: 20260907000002_canteen_tokens.sql

-- Extend canteen_items with stock and description
ALTER TABLE canteen_items ADD COLUMN IF NOT EXISTS stock INT DEFAULT 50;
ALTER TABLE canteen_items ADD COLUMN IF NOT EXISTS description TEXT;

-- Extend canteen_orders with full workflow fields
ALTER TABLE canteen_orders ADD COLUMN IF NOT EXISTS pickup_slot TEXT;
ALTER TABLE canteen_orders ADD COLUMN IF NOT EXISTS customer_note TEXT;
ALTER TABLE canteen_orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0;
ALTER TABLE canteen_orders ADD COLUMN IF NOT EXISTS convenience_fee NUMERIC DEFAULT 0;
ALTER TABLE canteen_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Drop and recreate status constraint to support full workflow
ALTER TABLE canteen_orders DROP CONSTRAINT IF EXISTS canteen_orders_status_check;
ALTER TABLE canteen_orders ADD CONSTRAINT canteen_orders_status_check 
  CHECK (status IN ('PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'));

-- Drop and recreate payment_status constraint
ALTER TABLE canteen_orders DROP CONSTRAINT IF EXISTS canteen_orders_payment_status_check;
ALTER TABLE canteen_orders ADD CONSTRAINT canteen_orders_payment_status_check 
  CHECK (payment_status IN ('PENDING', 'PAID_SANDBOX', 'CASH_AT_COUNTER', 'PAID_GATEWAY', 'REFUNDED', 'FAILED'));

-- Payment records
CREATE TABLE IF NOT EXISTS canteen_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES canteen_orders(id) ON DELETE CASCADE,
  transaction_reference TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'REFUNDED')) DEFAULT 'SUCCESS',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_canteen_payments_order ON canteen_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_canteen_payments_ref ON canteen_payments(transaction_reference);

-- Meal tokens
CREATE TABLE IF NOT EXISTS canteen_meal_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES canteen_orders(id) ON DELETE CASCADE,
  token_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED')) DEFAULT 'ACTIVE',
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ NOT NULL,
  scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_canteen_meal_tokens_code ON canteen_meal_tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_canteen_meal_tokens_order ON canteen_meal_tokens(order_id);

-- Queue status
CREATE TABLE IF NOT EXISTS canteen_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_length INT NOT NULL DEFAULT 0,
  estimated_wait_mins INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('NORMAL', 'BUSY', 'CLOSED')) DEFAULT 'NORMAL',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Insert default queue row
INSERT INTO canteen_queue (queue_length, estimated_wait_mins, status)
VALUES (0, 0, 'NORMAL')
ON CONFLICT DO NOTHING;

-- RLS for new tables
ALTER TABLE canteen_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteen_meal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteen_queue ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users read own payments" ON canteen_payments FOR SELECT USING (true);
CREATE POLICY "Users read own tokens" ON canteen_meal_tokens FOR SELECT USING (true);
CREATE POLICY "Public read queue" ON canteen_queue FOR SELECT USING (true);
