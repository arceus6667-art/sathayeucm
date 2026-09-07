-- Sathaye UCM: Unified Campus Management Schema
-- Supabase PostgreSQL Migration: 20260907000001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles & RBAC
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'ADMIN', 'CANTEEN', 'LIBRARY')) DEFAULT 'STUDENT',
  department TEXT,
  prn TEXT,
  division TEXT,
  batch TEXT,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED')) DEFAULT 'ACTIVE',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Academic Infrastructure
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  head_of_dept TEXT,
  building TEXT DEFAULT 'Main Academic Block',
  floor INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  degree_type TEXT NOT NULL,
  total_semesters INT DEFAULT 6
);

CREATE TABLE IF NOT EXISTS divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  name TEXT NOT NULL, -- e.g. 'Div A'
  capacity INT DEFAULT 60
);

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID REFERENCES divisions(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. 'B1', 'B2', 'B3'
  capacity INT DEFAULT 20
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  semester INT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  weekly_lecture_hours INT DEFAULT 4,
  weekly_practical_hours INT DEFAULT 2
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  building TEXT NOT NULL DEFAULT 'Main Academic Block',
  floor INT NOT NULL, -- 0 for Ground, 1 for 1st, etc.
  room_type TEXT NOT NULL CHECK (room_type IN ('CLASSROOM', 'LABORATORY', 'AUDITORIUM', 'SEMINAR_HALL', 'LIBRARY', 'CANTEEN', 'ADMIN_OFFICE')),
  capacity INT NOT NULL DEFAULT 60,
  has_projector BOOLEAN DEFAULT true,
  has_ac BOOLEAN DEFAULT false,
  is_accessible BOOLEAN DEFAULT true,
  x_coord NUMERIC DEFAULT 0,
  y_coord NUMERIC DEFAULT 0
);

-- 3. Timetables & Schedules (Asia/Kolkata timezone enforced)
CREATE TABLE IF NOT EXISTS timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT,
  department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
  division_id UUID REFERENCES divisions(id) ON DELETE RESTRICT,
  semester INT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')) DEFAULT 'DRAFT',
  version INT DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_id UUID REFERENCES timetables(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1=Monday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE RESTRICT,
  faculty_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('LECTURE', 'PRACTICAL', 'TUTORIAL', 'BREAK')),
  CONSTRAINT check_time_order CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_timetable_entries_faculty ON timetable_entries(faculty_id, day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_room ON timetable_entries(room_id, day_of_week, start_time);

CREATE TABLE IF NOT EXISTS timetable_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timetable_entry_id UUID REFERENCES timetable_entries(id) ON DELETE CASCADE,
  change_date DATE NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('CANCELLATION', 'SUBSTITUTION', 'RESCHEDULED', 'ROOM_CHANGE')),
  substitute_faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  new_room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  reason TEXT,
  announced_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  announced_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 2D Map & Floor Plan Nodes
CREATE TABLE IF NOT EXISTS map_floors (
  floor_number INT PRIMARY KEY,
  floor_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  crop_box JSONB -- Normalized crop box for each floor on the master screenshot
);

CREATE TABLE IF NOT EXISTS map_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor INT NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ACADEMIC', 'LAB', 'LIBRARY', 'CANTEEN', 'FACILITY', 'ADMIN', 'EMERGENCY')),
  x_percent NUMERIC NOT NULL,
  y_percent NUMERIC NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  is_accessible BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS map_nodes (
  id TEXT PRIMARY KEY,
  floor INT NOT NULL,
  name TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('ROOM', 'CORRIDOR', 'STAIRS', 'ELEVATOR', 'ENTRANCE')),
  x_percent NUMERIC NOT NULL,
  y_percent NUMERIC NOT NULL,
  is_accessible BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS map_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id TEXT REFERENCES map_nodes(id) ON DELETE CASCADE,
  to_node_id TEXT REFERENCES map_nodes(id) ON DELETE CASCADE,
  distance_meters NUMERIC NOT NULL DEFAULT 10,
  is_accessible BOOLEAN DEFAULT true,
  is_vertical_transition BOOLEAN DEFAULT false -- stairs or elevator
);

-- 5. Smart Canteen
CREATE TABLE IF NOT EXISTS canteen_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('BREAKFAST', 'LUNCH', 'SNACKS', 'BEVERAGES', 'DESSERT')),
  price NUMERIC NOT NULL CHECK (price >= 0),
  is_available BOOLEAN DEFAULT true,
  prep_time_mins INT DEFAULT 10,
  calories INT,
  is_veg BOOLEAN DEFAULT true,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS canteen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
  payment_status TEXT NOT NULL CHECK (payment_status IN ('PAID_SANDBOX', 'CASH_AT_COUNTER', 'PAID_GATEWAY')) DEFAULT 'PAID_SANDBOX',
  token_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS canteen_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES canteen_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES canteen_items(id) ON DELETE RESTRICT,
  item_name TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0)
);

-- 6. Smart Library
CREATE TABLE IF NOT EXISTS library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  category TEXT NOT NULL,
  total_copies INT NOT NULL DEFAULT 1,
  available_copies INT NOT NULL DEFAULT 1,
  shelf_location TEXT,
  edition TEXT,
  cover_image TEXT
);

CREATE TABLE IF NOT EXISTS library_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date DATE NOT NULL,
  returned_at TIMESTAMPTZ,
  fine_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('ISSUED', 'RETURNED', 'OVERDUE')) DEFAULT 'ISSUED'
);

CREATE TABLE IF NOT EXISTS library_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'FULFILLED', 'EXPIRED', 'CANCELLED')) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_number TEXT UNIQUE NOT NULL,
  floor INT DEFAULT 1,
  zone TEXT DEFAULT 'Quiet Study Area',
  has_power_socket BOOLEAN DEFAULT true,
  is_occupied BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS library_seat_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID REFERENCES library_seats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  slot_start TIME NOT NULL,
  slot_end TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Campus Events & Passes
CREATE TABLE IF NOT EXISTS campus_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INT NOT NULL DEFAULT 100,
  registered_count INT NOT NULL DEFAULT 0,
  registration_open BOOLEAN DEFAULT true,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PUBLISHED',
  organizer TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES campus_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pass_token TEXT UNIQUE NOT NULL,
  qr_code_data TEXT NOT NULL,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_user UNIQUE(event_id, user_id)
);

-- 8. Support Tickets & Lost-and-Found
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ACADEMICS', 'FACILITIES', 'IT_WIFI', 'LIBRARY', 'CANTEEN', 'FEES', 'EXAM', 'OTHER')),
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')) DEFAULT 'MEDIUM',
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')) DEFAULT 'OPEN',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lost_found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location_found TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLAIM_PENDING', 'CLAIMED', 'ARCHIVED')) DEFAULT 'OPEN',
  claimed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  claim_verification_notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Safety, Medical & SOS Incidents
CREATE TABLE IF NOT EXISTS safety_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('MEDICAL_EMERGENCY', 'FIRE_HAZARD', 'SECURITY_CONCERN', 'INFRASTRUCTURE_FAILURE', 'HARASSMENT', 'OTHER')),
  description TEXT NOT NULL,
  location_detail TEXT NOT NULL,
  is_app_only_report BOOLEAN DEFAULT true,
  status TEXT NOT NULL CHECK (status IN ('REPORTED', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED')) DEFAULT 'REPORTED',
  acknowledged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Immutable Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public/Authenticated Access Policies
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Self update profile" ON profiles FOR UPDATE USING (auth.uid()::text = firebase_uid);
CREATE POLICY "Public read published timetables" ON timetables FOR SELECT USING (status = 'PUBLISHED' OR auth.role() = 'service_role');
CREATE POLICY "Public read timetable entries" ON timetable_entries FOR SELECT USING (true);
CREATE POLICY "User see own canteen orders" ON canteen_orders FOR SELECT USING (true);
CREATE POLICY "User see own library loans" ON library_loans FOR SELECT USING (true);
CREATE POLICY "User see own event registrations" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "User see own support tickets" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Admin read all audit logs" ON audit_logs FOR SELECT USING (true);
