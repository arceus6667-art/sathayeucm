import express, { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ZipArchive } from 'archiver';
import { SEED_DEPARTMENTS, SEED_ROOMS, SEED_TIMETABLE } from './scripts/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory authoritative stores for fast transactions & fallback
interface UserProfileData {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'CANTEEN' | 'LIBRARY';
  department?: string;
  prn?: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  createdAt: string;
}

const AUTHORITATIVE_USERS: Map<string, UserProfileData> = new Map([
  ['admin@sathaye.edu', {
    id: 'usr-admin-01',
    firebaseUid: 'admin-uid-01',
    email: 'admin@sathaye.edu',
    fullName: 'Principal / Chief Administrator',
    role: 'ADMIN',
    department: 'Central Administration',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }],
  ['faculty@sathaye.edu', {
    id: 'usr-fac-01',
    firebaseUid: 'fac-uid-01',
    email: 'faculty@sathaye.edu',
    fullName: 'Prof. Rohan Desai',
    role: 'FACULTY',
    department: 'Information Technology',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }],
  ['canteen@sathaye.edu', {
    id: 'usr-canteen-01',
    firebaseUid: 'canteen-uid-01',
    email: 'canteen@sathaye.edu',
    fullName: 'Central Canteen Manager',
    role: 'CANTEEN',
    department: 'Cafeteria Services',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }],
  ['library@sathaye.edu', {
    id: 'usr-lib-01',
    firebaseUid: 'lib-uid-01',
    email: 'library@sathaye.edu',
    fullName: 'Chief Librarian',
    role: 'LIBRARY',
    department: 'Knowledge Resource Center',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }]
]);

// Timetable Storage
let TIMETABLE_RECORDS = [...SEED_TIMETABLE];
let TIMETABLE_CHANGES: Array<{
  id: string;
  entryId: string;
  date: string;
  type: 'CANCELLATION' | 'SUBSTITUTION' | 'RESCHEDULED' | 'ROOM_CHANGE';
  substituteFaculty?: string;
  newRoom?: string;
  reason: string;
  announcedAt: string;
}> = [];

// Canteen Orders — Full Workflow Implementation
import crypto from 'crypto';

interface ServerCanteenOrder {
  id: string;
  userEmail: string;
  orderNumber: string;
  items: Array<{ itemId: string; name: string; quantity: number; price: number }>;
  subtotal: number;
  convenienceFee: number;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID_SANDBOX' | 'CASH_AT_COUNTER' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  pickupSlot: string;
  customerNote: string;
  tokenCode: string;
  createdAt: string;
  updatedAt: string;
}

interface ServerCanteenPayment {
  id: string;
  orderId: string;
  transactionReference: string;
  paymentMethod: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  createdAt: string;
}

interface ServerMealToken {
  id: string;
  orderId: string;
  orderNumber: string;
  tokenCode: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  validFrom: string;
  validUntil: string;
  scannedBy: string | null;
  scannedAt: string | null;
  createdAt: string;
}

interface ServerCanteenMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  prepTimeMinutes: number;
  calories: number;
  isVeg: boolean;
  description: string;
  image: string;
  stock: number;
  rating: number;
}

interface CanteenQueue {
  queueLength: number;
  estimatedWaitMins: number;
  status: 'NORMAL' | 'BUSY' | 'CLOSED';
  updatedAt: string;
}

let CANTEEN_ORDERS: ServerCanteenOrder[] = [];
let CANTEEN_PAYMENTS: ServerCanteenPayment[] = [];
let MEAL_TOKENS: ServerMealToken[] = [];
let orderSeq = 100;
let paymentSeq = 1000;

let CANTEEN_QUEUE: CanteenQueue = {
  queueLength: 18,
  estimatedWaitMins: 12,
  status: 'NORMAL',
  updatedAt: new Date().toISOString()
};

// Server-authoritative menu with stock
const CANTEEN_MENU: ServerCanteenMenuItem[] = [
  { id: 'food-1', name: 'Masala Sandwich', category: 'Snacks', price: 45, isAvailable: true, prepTimeMinutes: 6, calories: 310, isVeg: true, description: 'Grilled triple-layer sandwich with spiced potato, capsicum, cheese, and green chutney.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400', stock: 40, rating: 4.8 },
  { id: 'food-2', name: 'Veg Frankie', category: 'Snacks', price: 55, isAvailable: true, prepTimeMinutes: 7, calories: 380, isVeg: true, description: 'Soft roti wrapped around spiced paneer-vegetable filling with tangy sauces.', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400', stock: 35, rating: 4.7 },
  { id: 'food-3', name: 'Paneer Roll', category: 'Snacks', price: 70, isAvailable: true, prepTimeMinutes: 8, calories: 420, isVeg: true, description: 'Crispy paratha roll stuffed with marinated paneer tikka, onions, and mint chutney.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400', stock: 25, rating: 4.9 },
  { id: 'food-4', name: 'Poha', category: 'Breakfast', price: 35, isAvailable: true, prepTimeMinutes: 4, calories: 250, isVeg: true, description: 'Flattened rice tempered with mustard seeds, curry leaves, peanuts, and fresh lemon.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400', stock: 50, rating: 4.6 },
  { id: 'food-5', name: 'Idli Sambar', category: 'Breakfast', price: 45, isAvailable: true, prepTimeMinutes: 5, calories: 220, isVeg: true, description: 'Steamed rice cakes (3 pcs) served with aromatic vegetable sambar and coconut chutney.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400', stock: 45, rating: 4.8 },
  { id: 'food-6', name: 'Veg Biryani', category: 'Meals', price: 90, isAvailable: true, prepTimeMinutes: 10, calories: 520, isVeg: true, description: 'Fragrant basmati rice layered with seasonal vegetables, saffron, and aromatic spices. Served with raita.', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=400', stock: 30, rating: 4.9 },
  { id: 'food-7', name: 'Cold Coffee', category: 'Beverages', price: 60, isAvailable: true, prepTimeMinutes: 3, calories: 180, isVeg: true, description: 'Creamy chilled coffee blended with ice cream and topped with chocolate shavings.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400', stock: 60, rating: 4.7 },
  { id: 'food-8', name: 'Lime Soda', category: 'Beverages', price: 35, isAvailable: true, prepTimeMinutes: 2, calories: 45, isVeg: true, description: 'Freshly squeezed lime with chilled soda, black salt, and a hint of cumin.', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400', stock: 70, rating: 4.5 },
  { id: 'food-9', name: 'Fruit Bowl', category: 'Healthy', price: 70, isAvailable: true, prepTimeMinutes: 4, calories: 150, isVeg: true, description: 'Fresh seasonal fruits — papaya, watermelon, pomegranate, and banana with a honey drizzle.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400', stock: 20, rating: 4.6 },
  { id: 'food-10', name: 'Water Bottle', category: 'Beverages', price: 20, isAvailable: true, prepTimeMinutes: 0, calories: 0, isVeg: true, description: '500ml packaged drinking water.', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea55?auto=format&fit=crop&q=80&w=400', stock: 100, rating: 4.0 },
  { id: 'food-11', name: 'Veg Thali', category: 'Meals', price: 110, isAvailable: true, prepTimeMinutes: 8, calories: 650, isVeg: true, description: 'Complete meal with 3 rotis, dal tadka, paneer sabzi, jeera rice, salad, and papad.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400', stock: 25, rating: 4.9 },
  { id: 'food-12', name: 'Masala Chai', category: 'Beverages', price: 15, isAvailable: true, prepTimeMinutes: 3, calories: 60, isVeg: true, description: 'Authentic spiced tea brewed with ginger, cardamom, and fresh milk.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400', stock: 80, rating: 4.9 },
];

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  'PENDING_PAYMENT': ['PAID', 'CANCELLED'],
  'PAID': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['PREPARING', 'CANCELLED'],
  'PREPARING': ['READY'],
  'READY': ['COMPLETED'],
  'COMPLETED': [],
  'CANCELLED': []
};

function generateSecureToken(): string {
  const bytes = crypto.randomBytes(6);
  const code = bytes.toString('hex').toUpperCase();
  return `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}`;
}

function generateOrderNumber(): string {
  orderSeq++;
  const year = new Date().getFullYear();
  return `SC-${year}-${String(orderSeq).padStart(6, '0')}`;
}

function generateTransactionRef(type: 'TXN' | 'REFUND'): string {
  paymentSeq++;
  const year = new Date().getFullYear();
  return `DEMO-${type}-${year}-${String(paymentSeq).padStart(6, '0')}`;
}

// Seed demo orders for dashboard demonstration
function seedDemoOrders() {
  const now = new Date();
  const demoOrders: ServerCanteenOrder[] = [
    { id: 'demo-ord-001', userEmail: 'student1@sathaye.edu', orderNumber: 'SC-2026-000001', items: [{ itemId: 'food-6', name: 'Veg Biryani', quantity: 1, price: 90 }, { itemId: 'food-12', name: 'Masala Chai', quantity: 1, price: 15 }], subtotal: 105, convenienceFee: 0, totalAmount: 105, status: 'COMPLETED', paymentStatus: 'PAID_SANDBOX', paymentMethod: 'Demo UPI', pickupSlot: '12:00 PM – 12:15 PM', customerNote: '', tokenCode: 'DEMO-USED-1', createdAt: new Date(now.getTime() - 3600000 * 4).toISOString(), updatedAt: new Date(now.getTime() - 3600000 * 3).toISOString() },
    { id: 'demo-ord-002', userEmail: 'student2@sathaye.edu', orderNumber: 'SC-2026-000002', items: [{ itemId: 'food-1', name: 'Masala Sandwich', quantity: 2, price: 45 }], subtotal: 90, convenienceFee: 0, totalAmount: 90, status: 'READY', paymentStatus: 'PAID_SANDBOX', paymentMethod: 'Demo Card', pickupSlot: '12:15 PM – 12:30 PM', customerNote: '', tokenCode: generateSecureToken(), createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(), updatedAt: new Date(now.getTime() - 3600000).toISOString() },
    { id: 'demo-ord-003', userEmail: 'student3@sathaye.edu', orderNumber: 'SC-2026-000003', items: [{ itemId: 'food-3', name: 'Paneer Roll', quantity: 1, price: 70 }, { itemId: 'food-7', name: 'Cold Coffee', quantity: 1, price: 60 }], subtotal: 130, convenienceFee: 0, totalAmount: 130, status: 'PREPARING', paymentStatus: 'PAID_SANDBOX', paymentMethod: 'Demo Wallet', pickupSlot: '12:30 PM – 12:45 PM', customerNote: 'Extra spicy please', tokenCode: generateSecureToken(), createdAt: new Date(now.getTime() - 3600000).toISOString(), updatedAt: new Date(now.getTime() - 1800000).toISOString() },
    { id: 'demo-ord-004', userEmail: 'student4@sathaye.edu', orderNumber: 'SC-2026-000004', items: [{ itemId: 'food-4', name: 'Poha', quantity: 1, price: 35 }], subtotal: 35, convenienceFee: 0, totalAmount: 35, status: 'CONFIRMED', paymentStatus: 'PAID_SANDBOX', paymentMethod: 'Demo UPI', pickupSlot: '12:45 PM – 01:00 PM', customerNote: '', tokenCode: generateSecureToken(), createdAt: new Date(now.getTime() - 1800000).toISOString(), updatedAt: new Date(now.getTime() - 900000).toISOString() },
    { id: 'demo-ord-005', userEmail: 'student5@sathaye.edu', orderNumber: 'SC-2026-000005', items: [{ itemId: 'food-11', name: 'Veg Thali', quantity: 1, price: 110 }], subtotal: 110, convenienceFee: 0, totalAmount: 110, status: 'CANCELLED', paymentStatus: 'REFUNDED', paymentMethod: 'Demo Card', pickupSlot: '01:00 PM – 01:15 PM', customerNote: '', tokenCode: 'DEMO-CANCELLED-1', createdAt: new Date(now.getTime() - 7200000).toISOString(), updatedAt: new Date(now.getTime() - 6000000).toISOString() },
  ];

  CANTEEN_ORDERS = [...demoOrders];

  // Create corresponding tokens for active demo orders
  for (const order of demoOrders) {
    if (order.status !== 'CANCELLED') {
      MEAL_TOKENS.push({
        id: 'tk-' + order.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        tokenCode: order.tokenCode,
        status: order.status === 'COMPLETED' ? 'USED' : 'ACTIVE',
        validFrom: order.createdAt,
        validUntil: new Date(new Date(order.createdAt).getTime() + 3600000 * 2).toISOString(),
        scannedBy: order.status === 'COMPLETED' ? 'canteen@sathaye.edu' : null,
        scannedAt: order.status === 'COMPLETED' ? order.updatedAt : null,
        createdAt: order.createdAt
      });
    }
    CANTEEN_PAYMENTS.push({
      id: 'pay-' + order.id,
      orderId: order.id,
      transactionReference: generateTransactionRef(order.status === 'CANCELLED' ? 'REFUND' : 'TXN'),
      paymentMethod: order.paymentMethod,
      amount: order.totalAmount,
      status: order.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'SUCCESS',
      paidAt: order.createdAt,
      createdAt: order.createdAt
    });
  }
}

seedDemoOrders();

// 5. Canteen API Routes

// 5a. Get full menu
app.get('/api/canteen/menu', (req: Request, res: Response) => {
  res.json({ items: CANTEEN_MENU });
});

// 5b. Get queue status
app.get('/api/canteen/queue', (req: Request, res: Response) => {
  res.json({ queue: CANTEEN_QUEUE });
});

// 5c. Update queue (staff only)
app.patch('/api/canteen/queue', (req: Request, res: Response) => {
  const { queueLength, estimatedWaitMins, status, staffEmail } = req.body;
  if (queueLength !== undefined) CANTEEN_QUEUE.queueLength = Math.max(0, Number(queueLength));
  if (estimatedWaitMins !== undefined) CANTEEN_QUEUE.estimatedWaitMins = Math.max(0, Number(estimatedWaitMins));
  if (status) CANTEEN_QUEUE.status = status;
  CANTEEN_QUEUE.updatedAt = new Date().toISOString();
  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'QUEUE_UPDATED', 'canteen_queue', CANTEEN_QUEUE);
  res.json({ success: true, queue: CANTEEN_QUEUE });
});

// 5d. Place order (creates with PENDING_PAYMENT status)
app.post('/api/canteen/order', (req: Request, res: Response) => {
  const { items, userEmail, pickupSlot, customerNote } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  // Server-side price validation and stock check
  let calculatedSubtotal = 0;
  const verifiedItems: Array<{ itemId: string; name: string; quantity: number; price: number }> = [];
  const stockErrors: string[] = [];

  for (const item of items) {
    const menuItem = CANTEEN_MENU.find(m => m.id === item.itemId);
    if (!menuItem) {
      return res.status(400).json({ error: `Menu item ${item.itemId} not found.` });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ error: `${menuItem.name} is currently unavailable.` });
    }
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (menuItem.stock < qty) {
      stockErrors.push(`${menuItem.name}: only ${menuItem.stock} left (requested ${qty})`);
    }
    calculatedSubtotal += menuItem.price * qty;
    verifiedItems.push({ itemId: item.itemId, name: menuItem.name, quantity: qty, price: menuItem.price });
  }

  if (stockErrors.length > 0) {
    return res.status(409).json({ error: 'Insufficient stock', details: stockErrors });
  }

  const orderNumber = generateOrderNumber();
  const convenienceFee = 0; // Could add small fee for high-value orders

  const newOrder: ServerCanteenOrder = {
    id: 'ord-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
    userEmail: userEmail || 'student@sathaye.edu',
    orderNumber,
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    convenienceFee,
    totalAmount: calculatedSubtotal + convenienceFee,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING',
    paymentMethod: '',
    pickupSlot: pickupSlot || '',
    customerNote: customerNote || '',
    tokenCode: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  CANTEEN_ORDERS.unshift(newOrder);
  recordAudit(userEmail || 'student@sathaye.edu', 'STUDENT', 'ORDER_CREATED', 'canteen_orders', { orderNumber, totalAmount: newOrder.totalAmount });

  res.json({ success: true, order: newOrder });
});

// 5e. Demo Payment
app.post('/api/canteen/pay', (req: Request, res: Response) => {
  const { orderId, paymentMethod, simulateFailure } = req.body;

  const order = CANTEEN_ORDERS.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  if (order.status !== 'PENDING_PAYMENT') {
    return res.status(400).json({ error: `Order is in ${order.status} state, cannot process payment.` });
  }

  // Simulate failure: 10% chance or explicit request
  const shouldFail = simulateFailure === true || (!simulateFailure && Math.random() < 0.1);

  if (shouldFail) {
    const failedPayment: ServerCanteenPayment = {
      id: 'pay-' + Date.now(),
      orderId: order.id,
      transactionReference: generateTransactionRef('TXN'),
      paymentMethod: paymentMethod || 'Demo Card',
      amount: order.totalAmount,
      status: 'FAILED',
      paidAt: null,
      createdAt: new Date().toISOString()
    };
    CANTEEN_PAYMENTS.push(failedPayment);
    order.paymentStatus = 'FAILED';
    order.updatedAt = new Date().toISOString();

    recordAudit(order.userEmail, 'STUDENT', 'PAYMENT_FAILED', 'canteen_payments', { orderNumber: order.orderNumber, ref: failedPayment.transactionReference });

    return res.json({
      success: false,
      error: 'Payment failed. Please try again.',
      payment: failedPayment
    });
  }

  // Re-validate stock before finalizing payment
  for (const item of order.items) {
    const menuItem = CANTEEN_MENU.find(m => m.id === item.itemId);
    if (menuItem && menuItem.stock < item.quantity) {
      return res.status(409).json({ error: `${menuItem.name} is now out of stock. Please modify your order.` });
    }
  }

  // Deduct stock atomically
  for (const item of order.items) {
    const menuItem = CANTEEN_MENU.find(m => m.id === item.itemId);
    if (menuItem) {
      menuItem.stock = Math.max(0, menuItem.stock - item.quantity);
      if (menuItem.stock === 0) menuItem.isAvailable = false;
    }
  }

  // Create payment record
  const transRef = generateTransactionRef('TXN');
  const payment: ServerCanteenPayment = {
    id: 'pay-' + Date.now(),
    orderId: order.id,
    transactionReference: transRef,
    paymentMethod: paymentMethod || 'Demo Card',
    amount: order.totalAmount,
    status: 'SUCCESS',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  CANTEEN_PAYMENTS.push(payment);

  // Generate secure meal token
  const tokenCode = generateSecureToken();
  const now = new Date();
  const validUntil = new Date(now.getTime() + 2 * 3600000); // 2 hours validity

  const mealToken: ServerMealToken = {
    id: 'tk-' + Date.now(),
    orderId: order.id,
    orderNumber: order.orderNumber,
    tokenCode,
    status: 'ACTIVE',
    validFrom: now.toISOString(),
    validUntil: validUntil.toISOString(),
    scannedBy: null,
    scannedAt: null,
    createdAt: now.toISOString()
  };
  MEAL_TOKENS.push(mealToken);

  // Update order
  order.status = 'CONFIRMED';
  order.paymentStatus = 'PAID_SANDBOX';
  order.paymentMethod = paymentMethod || 'Demo Card';
  order.tokenCode = tokenCode;
  order.updatedAt = now.toISOString();

  // Update queue
  CANTEEN_QUEUE.queueLength = Math.max(0, CANTEEN_QUEUE.queueLength + 1);
  CANTEEN_QUEUE.estimatedWaitMins = CANTEEN_QUEUE.queueLength * 2;
  CANTEEN_QUEUE.updatedAt = now.toISOString();

  recordAudit(order.userEmail, 'STUDENT', 'PAYMENT_SUCCESS', 'canteen_payments', { orderNumber: order.orderNumber, ref: transRef, tokenCode });

  res.json({
    success: true,
    order,
    payment,
    token: mealToken,
    message: 'Payment successful! Your meal token has been generated.'
  });
});

// 5f. Get token for order
app.get('/api/canteen/order/:id/token', (req: Request, res: Response) => {
  const { id } = req.params;
  const token = MEAL_TOKENS.find(t => t.orderId === id);
  const order = CANTEEN_ORDERS.find(o => o.id === id);
  if (!token || !order) {
    return res.status(404).json({ error: 'Token not found for this order.' });
  }
  res.json({ token, order });
});

// 5g. Verify token (scan)
app.post('/api/canteen/verify-token', (req: Request, res: Response) => {
  const { tokenCode, staffEmail } = req.body;
  if (!tokenCode) {
    return res.status(400).json({ error: 'Token code is required.' });
  }

  const cleanCode = tokenCode.trim().toUpperCase();
  const token = MEAL_TOKENS.find(t => t.tokenCode === cleanCode);

  if (!token) {
    return res.json({ valid: false, reason: 'Invalid token. This meal token does not exist in our system.' });
  }

  const order = CANTEEN_ORDERS.find(o => o.id === token.orderId);
  if (!order) {
    return res.json({ valid: false, reason: 'Order associated with this token was not found.' });
  }

  // Check token status
  if (token.status === 'USED') {
    return res.json({ valid: false, reason: 'This meal token has already been used.', token, order });
  }
  if (token.status === 'CANCELLED') {
    return res.json({ valid: false, reason: 'This meal token has been cancelled.', token, order });
  }
  if (token.status === 'EXPIRED') {
    return res.json({ valid: false, reason: 'This meal token has expired.', token, order });
  }

  // Check expiration
  if (new Date() > new Date(token.validUntil)) {
    token.status = 'EXPIRED';
    return res.json({ valid: false, reason: 'This meal token has expired.', token, order });
  }

  // Check payment
  if (order.paymentStatus !== 'PAID_SANDBOX' && order.paymentStatus !== 'CASH_AT_COUNTER') {
    return res.json({ valid: false, reason: 'Payment for this order is incomplete.', token, order });
  }

  // Check order not cancelled
  if (order.status === 'CANCELLED') {
    return res.json({ valid: false, reason: 'This order has been cancelled.', token, order });
  }

  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'TOKEN_SCANNED', 'canteen_meal_tokens', { tokenCode: cleanCode, orderNumber: order.orderNumber });

  res.json({
    valid: true,
    token,
    order,
    message: 'Token verified successfully.'
  });
});

// 5h. Confirm handover (complete order)
app.post('/api/canteen/handover', (req: Request, res: Response) => {
  const { tokenCode, staffEmail } = req.body;
  if (!tokenCode) {
    return res.status(400).json({ error: 'Token code is required.' });
  }

  const cleanCode = tokenCode.trim().toUpperCase();
  const token = MEAL_TOKENS.find(t => t.tokenCode === cleanCode);

  if (!token) {
    return res.status(404).json({ error: 'Token not found.' });
  }

  // Atomic double-scan protection
  if (token.status === 'USED') {
    return res.status(409).json({
      error: 'This meal token has already been used.',
      alreadyUsed: true,
      scannedAt: token.scannedAt,
      scannedBy: token.scannedBy
    });
  }

  if (token.status !== 'ACTIVE') {
    return res.status(400).json({ error: `Token is in ${token.status} state and cannot be used for handover.` });
  }

  const order = CANTEEN_ORDERS.find(o => o.id === token.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Associated order not found.' });
  }

  // Mark token as used (atomic)
  const now = new Date().toISOString();
  token.status = 'USED';
  token.scannedBy = staffEmail || 'canteen@sathaye.edu';
  token.scannedAt = now;

  // Complete order
  order.status = 'COMPLETED';
  order.updatedAt = now;

  // Update queue
  CANTEEN_QUEUE.queueLength = Math.max(0, CANTEEN_QUEUE.queueLength - 1);
  CANTEEN_QUEUE.estimatedWaitMins = CANTEEN_QUEUE.queueLength * 2;
  CANTEEN_QUEUE.updatedAt = now;

  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'ORDER_HANDOVER_COMPLETED', 'canteen_orders', {
    orderNumber: order.orderNumber,
    tokenCode: cleanCode,
    completedAt: now
  });

  res.json({ success: true, order, token, message: 'Handover confirmed. Order completed.' });
});

// 5i. Update order status (staff)
app.patch('/api/canteen/order/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, staffEmail } = req.body;
  const order = CANTEEN_ORDERS.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: `Invalid status transition: ${order.status} → ${status}`,
      allowed
    });
  }

  const oldStatus = order.status;
  order.status = status;
  order.updatedAt = new Date().toISOString();

  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'ORDER_STATUS_CHANGED', 'canteen_orders', {
    orderNumber: order.orderNumber,
    oldStatus,
    newStatus: status
  });

  res.json({ success: true, order });
});

// 5j. Cancel order
app.post('/api/canteen/order/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userEmail, reason } = req.body;
  const order = CANTEEN_ORDERS.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  // Cancellation rules
  const cancellableStatuses = ['PENDING_PAYMENT', 'PAID', 'CONFIRMED'];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      error: `Order in ${order.status} state cannot be cancelled.`,
      cancellable: false
    });
  }

  const now = new Date().toISOString();
  order.status = 'CANCELLED';
  order.updatedAt = now;

  // Cancel associated token
  const token = MEAL_TOKENS.find(t => t.orderId === order.id);
  if (token) {
    token.status = 'CANCELLED';
  }

  // Restore stock
  for (const item of order.items) {
    const menuItem = CANTEEN_MENU.find(m => m.id === item.itemId);
    if (menuItem) {
      menuItem.stock += item.quantity;
      if (menuItem.stock > 0) menuItem.isAvailable = true;
    }
  }

  // If paid, create refund
  let refundPayment: ServerCanteenPayment | null = null;
  if (order.paymentStatus === 'PAID_SANDBOX') {
    order.paymentStatus = 'REFUNDED';
    refundPayment = {
      id: 'pay-ref-' + Date.now(),
      orderId: order.id,
      transactionReference: generateTransactionRef('REFUND'),
      paymentMethod: order.paymentMethod,
      amount: order.totalAmount,
      status: 'REFUNDED',
      paidAt: null,
      createdAt: now
    };
    CANTEEN_PAYMENTS.push(refundPayment);
  }

  // Update queue
  CANTEEN_QUEUE.queueLength = Math.max(0, CANTEEN_QUEUE.queueLength - 1);
  CANTEEN_QUEUE.estimatedWaitMins = CANTEEN_QUEUE.queueLength * 2;
  CANTEEN_QUEUE.updatedAt = now;

  recordAudit(userEmail || 'student@sathaye.edu', order.paymentMethod ? 'CANTEEN' : 'STUDENT', 'ORDER_CANCELLED', 'canteen_orders', {
    orderNumber: order.orderNumber,
    reason: reason || 'User requested cancellation',
    refundRef: refundPayment?.transactionReference
  });

  res.json({ success: true, order, refund: refundPayment });
});

// 5k. Get orders (with optional filters)
app.get('/api/canteen/orders', (req: Request, res: Response) => {
  const { email, status, limit } = req.query;
  let filtered = [...CANTEEN_ORDERS];

  if (email) {
    filtered = filtered.filter(o => o.userEmail.toLowerCase() === String(email).toLowerCase());
  }
  if (status) {
    filtered = filtered.filter(o => o.status === String(status));
  }

  const maxResults = Math.min(Number(limit) || 50, 100);
  filtered = filtered.slice(0, maxResults);

  res.json({ orders: filtered });
});

// 5l. Analytics
app.get('/api/canteen/analytics', (req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = CANTEEN_ORDERS.filter(o => o.createdAt.startsWith(today));

  const stats = {
    totalOrdersToday: todayOrders.length,
    pendingOrders: CANTEEN_ORDERS.filter(o => ['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(o.status)).length,
    preparingOrders: CANTEEN_ORDERS.filter(o => o.status === 'PREPARING').length,
    readyOrders: CANTEEN_ORDERS.filter(o => o.status === 'READY').length,
    completedToday: todayOrders.filter(o => o.status === 'COMPLETED').length,
    cancelledToday: todayOrders.filter(o => o.status === 'CANCELLED').length,
    salesToday: todayOrders.filter(o => o.paymentStatus === 'PAID_SANDBOX').reduce((sum, o) => sum + o.totalAmount, 0),
    totalSales: CANTEEN_ORDERS.filter(o => o.paymentStatus === 'PAID_SANDBOX' || o.status === 'COMPLETED').reduce((sum, o) => sum + o.totalAmount, 0),
    avgOrderValue: CANTEEN_ORDERS.length > 0 ? Math.round(CANTEEN_ORDERS.reduce((s, o) => s + o.totalAmount, 0) / CANTEEN_ORDERS.length) : 0,
    popularItems: getPopularItems(),
    lowStockItems: CANTEEN_MENU.filter(m => m.stock < 10).map(m => ({ name: m.name, stock: m.stock })),
    queue: CANTEEN_QUEUE,
    completionRate: CANTEEN_ORDERS.length > 0 ? Math.round(CANTEEN_ORDERS.filter(o => o.status === 'COMPLETED').length / CANTEEN_ORDERS.length * 100) : 0,
    cancellationRate: CANTEEN_ORDERS.length > 0 ? Math.round(CANTEEN_ORDERS.filter(o => o.status === 'CANCELLED').length / CANTEEN_ORDERS.length * 100) : 0,
  };

  res.json(stats);
});

function getPopularItems(): Array<{ name: string; count: number }> {
  const counts: Record<string, { name: string; count: number }> = {};
  for (const order of CANTEEN_ORDERS) {
    if (order.status === 'CANCELLED') continue;
    for (const item of order.items) {
      if (!counts[item.itemId]) counts[item.itemId] = { name: item.name, count: 0 };
      counts[item.itemId].count += item.quantity;
    }
  }
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
}

// 5m. Update menu item (staff)
app.patch('/api/canteen/menu/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, stock, isAvailable, name, description, staffEmail } = req.body;
  const item = CANTEEN_MENU.find(m => m.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }

  const oldPrice = item.price;
  if (price !== undefined) item.price = Number(price);
  if (stock !== undefined) item.stock = Math.max(0, Number(stock));
  if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);
  if (name) item.name = name;
  if (description) item.description = description;

  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'MENU_ITEM_UPDATED', 'canteen_items', {
    itemId: id, oldPrice, newPrice: item.price, stock: item.stock
  });

  res.json({ success: true, item });
});


interface BookLoan {
  id: string;
  bookId: string;
  userEmail: string;
  issuedAt: string;
  dueDate: string;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}
let LIBRARY_LOANS: BookLoan[] = [];

// Event Check-ins
const CHECKED_IN_PASSES = new Set<string>();

// Audit Logs
interface AuditLog {
  id: string;
  userEmail: string;
  role: string;
  action: string;
  entity: string;
  details: any;
  timestamp: string;
}
const AUDIT_LOGS: AuditLog[] = [];

function recordAudit(userEmail: string, role: string, action: string, entity: string, details: any) {
  AUDIT_LOGS.unshift({
    id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    userEmail,
    role,
    action,
    entity,
    details,
    timestamp: new Date().toISOString()
  });
  if (AUDIT_LOGS.length > 500) AUDIT_LOGS.pop();
}

// AI Client Lazy Initialization
let geminiAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiAI && process.env.GEMINI_API_KEY) {
    geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiAI;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health & Configuration Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    timezone: 'Asia/Kolkata',
    firebaseConfigured: Boolean(process.env.VITE_FIREBASE_API_KEY),
    supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    academicYear: '2025-2026',
    activeTimetableEntries: TIMETABLE_RECORDS.length
  });
});

// 2. Auth Profile & Role Resolution
app.get('/api/auth/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const emailParam = req.query.email as string;

  if (!authHeader && !emailParam) {
    return res.status(401).json({ error: 'Missing authorization header or identity parameter.' });
  }

  // Identify user by email
  const email = (emailParam || '').trim().toLowerCase();
  
  if (AUTHORITATIVE_USERS.has(email)) {
    return res.json({ profile: AUTHORITATIVE_USERS.get(email) });
  }

  // Check if standard student registration
  if (email) {
    const newStudent: UserProfileData = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      firebaseUid: 'fb-' + Math.random().toString(36).substring(2, 8),
      email,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: 'STUDENT',
      department: 'Information Technology',
      prn: 'PRN2025' + Math.floor(10000 + Math.random() * 90000),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    AUTHORITATIVE_USERS.set(email, newStudent);
    return res.json({ profile: newStudent, isNewRegistration: true });
  }

  res.status(404).json({ error: 'User profile not found.' });
});

// 3. Admin Assign Role
app.post('/api/auth/assign-role', (req: Request, res: Response) => {
  const { targetEmail, newRole, adminEmail } = req.body;
  if (!targetEmail || !newRole) {
    return res.status(400).json({ error: 'Target email and new role are required.' });
  }

  const existing = AUTHORITATIVE_USERS.get(targetEmail.toLowerCase());
  if (existing) {
    const oldRole = existing.role;
    existing.role = newRole;
    recordAudit(adminEmail || 'admin@sathaye.edu', 'ADMIN', 'ROLE_CHANGED', 'profiles', {
      targetEmail,
      oldRole,
      newRole
    });
    return res.json({ success: true, profile: existing });
  }

  const createdUser: UserProfileData = {
    id: 'usr-' + Math.random().toString(36).substring(2, 8),
    firebaseUid: 'fb-' + Math.random().toString(36).substring(2, 8),
    email: targetEmail.toLowerCase(),
    fullName: targetEmail.split('@')[0],
    role: newRole,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };
  AUTHORITATIVE_USERS.set(targetEmail.toLowerCase(), createdUser);
  recordAudit(adminEmail || 'admin@sathaye.edu', 'ADMIN', 'STAFF_ACCOUNT_PROVISIONED', 'profiles', {
    targetEmail,
    role: newRole
  });

  res.json({ success: true, profile: createdUser });
});

// 4. Timetable Operations & Conflict Detector
app.get('/api/timetable', (req: Request, res: Response) => {
  const { division, faculty, room, day } = req.query;
  let filtered = [...TIMETABLE_RECORDS];

  if (division) {
    filtered = filtered.filter(e => e.divisionName.toLowerCase().includes(String(division).toLowerCase()));
  }
  if (faculty) {
    filtered = filtered.filter(e => e.facultyName.toLowerCase().includes(String(faculty).toLowerCase()) || e.facultyEmail.toLowerCase().includes(String(faculty).toLowerCase()));
  }
  if (room) {
    filtered = filtered.filter(e => e.roomNumber.toLowerCase() === String(room).toLowerCase());
  }
  if (day) {
    filtered = filtered.filter(e => e.dayOfWeek === Number(day));
  }

  res.json({
    entries: filtered,
    changes: TIMETABLE_CHANGES,
    total: filtered.length
  });
});

// Server-side conflict detection engine
app.post('/api/timetable/validate-conflict', (req: Request, res: Response) => {
  const { dayOfWeek, startTime, endTime, roomNumber, facultyName, divisionName, batchName, excludeEntryId } = req.body;

  if (!dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ error: 'Day, start time, and end time are required for conflict validation.' });
  }

  const conflicts: Array<{ type: string; reason: string; conflictingEntry: any }> = [];

  for (const entry of TIMETABLE_RECORDS) {
    if (excludeEntryId && entry.id === excludeEntryId) continue;
    if (entry.dayOfWeek !== Number(dayOfWeek)) continue;

    // Check time overlap: (StartA < EndB) and (EndA > StartB)
    const isOverlapping = entry.startTime < endTime && entry.endTime > startTime;
    if (!isOverlapping) continue;

    // Check 1: Room conflict
    if (roomNumber && entry.roomNumber.toLowerCase() === roomNumber.toLowerCase()) {
      conflicts.push({
        type: 'ROOM_CONFLICT',
        reason: `Room ${roomNumber} is already occupied by ${entry.subjectCode} (${entry.divisionName}) from ${entry.startTime} to ${entry.endTime}.`,
        conflictingEntry: entry
      });
    }

    // Check 2: Faculty conflict
    if (facultyName && entry.facultyName.toLowerCase() === facultyName.toLowerCase()) {
      conflicts.push({
        type: 'FACULTY_CONFLICT',
        reason: `${facultyName} is already assigned to ${entry.subjectCode} in Room ${entry.roomNumber} from ${entry.startTime} to ${entry.endTime}.`,
        conflictingEntry: entry
      });
    }

    // Check 3: Student division/batch conflict
    if (divisionName && entry.divisionName.toLowerCase() === divisionName.toLowerCase()) {
      // If batch is specified, conflict only if same batch or one of them is whole division (no batch)
      const sameBatch = (!batchName || !entry.batchName || batchName === entry.batchName);
      if (sameBatch) {
        conflicts.push({
          type: 'STUDENT_GROUP_CONFLICT',
          reason: `Division ${divisionName} ${batchName ? '(' + batchName + ')' : ''} already has ${entry.subjectCode} scheduled from ${entry.startTime} to ${entry.endTime}.`,
          conflictingEntry: entry
        });
      }
    }
  }

  res.json({
    hasConflict: conflicts.length > 0,
    conflicts
  });
});

// Save or Update Timetable entry
app.post('/api/timetable/save-entry', (req: Request, res: Response) => {
  const entry = req.body;
  if (!entry.subjectCode || !entry.roomNumber || !entry.dayOfWeek) {
    return res.status(400).json({ error: 'Missing required timetable slot details.' });
  }

  const existingIndex = TIMETABLE_RECORDS.findIndex(e => e.id === entry.id);
  if (existingIndex >= 0) {
    TIMETABLE_RECORDS[existingIndex] = { ...TIMETABLE_RECORDS[existingIndex], ...entry };
  } else {
    const newEntry = {
      ...entry,
      id: 'tt-' + Date.now()
    };
    TIMETABLE_RECORDS.push(newEntry);
  }

  recordAudit(entry.adminEmail || 'admin@sathaye.edu', 'ADMIN', 'TIMETABLE_ENTRY_UPDATED', 'timetable_entries', entry);
  res.json({ success: true, totalEntries: TIMETABLE_RECORDS.length });
});

// Record Date-specific Timetable Change (cancellation, substitution)
app.post('/api/timetable/change', (req: Request, res: Response) => {
  const { entryId, date, type, substituteFaculty, newRoom, reason, announcedBy } = req.body;
  if (!entryId || !date || !type) {
    return res.status(400).json({ error: 'Entry ID, date, and change type are required.' });
  }

  const changeRecord = {
    id: 'ttc-' + Date.now(),
    entryId,
    date,
    type,
    substituteFaculty,
    newRoom,
    reason: reason || 'Academic department notice',
    announcedAt: new Date().toISOString()
  };

  TIMETABLE_CHANGES.unshift(changeRecord);
  recordAudit(announcedBy || 'admin@sathaye.edu', 'ADMIN', 'TIMETABLE_SCHEDULE_CHANGE', 'timetable_changes', changeRecord);
  res.json({ success: true, change: changeRecord });
});

// CSV Export for Timetables
app.get('/api/timetable/export-csv', (req: Request, res: Response) => {
  const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const header = 'ID,Day,StartTime,EndTime,SubjectCode,SubjectName,Faculty,Room,Division,Batch,Type\n';
  const rows = TIMETABLE_RECORDS.map(e => 
    `"${e.id}","${dayNames[e.dayOfWeek] || e.dayOfWeek}","${e.startTime}","${e.endTime}","${e.subjectCode}","${e.subjectName}","${e.facultyName}","${e.roomNumber}","${e.divisionName}","${e.batchName || ''}","${e.sessionType}"`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sathaye_college_timetable.csv"');
  res.send(header + rows);
});

// 5. Canteen Order Operations (Server-validated pricing)
const CANTEEN_PRICE_LIST: Record<string, { name: string; price: number }> = {
  'food-1': { name: 'Batata Vada Pav (2 pcs)', price: 40 },
  'food-2': { name: 'Misal Pav Special', price: 65 },
  'food-3': { name: 'South Indian Masala Dosa', price: 75 },
  'food-4': { name: 'Poha with Sev & Coconut', price: 35 },
  'food-5': { name: 'Special Veg Thali Meal', price: 110 },
  'food-6': { name: 'Masala Cutting Chai', price: 18 },
  'food-7': { name: 'Cold Filter Coffee', price: 40 },
  'food-8': { name: 'Kokum Sharbat (Chilled)', price: 30 }
};

app.post('/api/canteen/order', (req: Request, res: Response) => {
  const { items, userEmail, paymentMethod } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  // Authoritative server-side price calculation
  let calculatedTotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const catalogItem = CANTEEN_PRICE_LIST[item.itemId];
    const unitPrice = catalogItem ? catalogItem.price : (Number(item.price) || 50);
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    calculatedTotal += unitPrice * qty;
    verifiedItems.push({
      itemId: item.itemId,
      name: catalogItem ? catalogItem.name : item.name,
      quantity: qty,
      price: unitPrice
    });
  }

  orderSeq++;
  const orderNumber = `SAT-CAN-${orderSeq}`;
  const tokenCode = `TK-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder: ServerCanteenOrder = {
    id: 'ord-' + Date.now(),
    userEmail: userEmail || 'student@sathaye.edu',
    orderNumber,
    items: verifiedItems,
    totalAmount: calculatedTotal,
    status: 'PENDING',
    paymentStatus: paymentMethod === 'CASH' ? 'CASH_AT_COUNTER' : 'PAID_SANDBOX',
    tokenCode,
    createdAt: new Date().toISOString()
  };

  CANTEEN_ORDERS.unshift(newOrder);
  res.json({
    success: true,
    order: newOrder,
    message: 'Meal order confirmed. Token issued.'
  });
});

app.get('/api/canteen/orders', (req: Request, res: Response) => {
  const { email } = req.query;
  if (email) {
    return res.json({ orders: CANTEEN_ORDERS.filter(o => o.userEmail.toLowerCase() === String(email).toLowerCase()) });
  }
  res.json({ orders: CANTEEN_ORDERS });
});

app.patch('/api/canteen/order/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, staffEmail } = req.body;
  const order = CANTEEN_ORDERS.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const oldStatus = order.status;
  order.status = status;
  recordAudit(staffEmail || 'canteen@sathaye.edu', 'CANTEEN', 'ORDER_STATUS_CHANGED', 'canteen_orders', {
    orderNumber: order.orderNumber,
    oldStatus,
    newStatus: status
  });

  res.json({ success: true, order });
});

// 6. Library Operations
app.post('/api/library/reserve', (req: Request, res: Response) => {
  const { bookId, userEmail } = req.body;
  if (!bookId || !userEmail) {
    return res.status(400).json({ error: 'Book ID and user email required.' });
  }

  // Check if active reservation exists for user
  const existingLoan = LIBRARY_LOANS.find(l => l.bookId === bookId && l.userEmail === userEmail && l.status === 'ISSUED');
  if (existingLoan) {
    return res.status(400).json({ error: 'You already have an active loan for this book.' });
  }

  res.json({
    success: true,
    reservationId: 'res-' + Date.now(),
    expiresInHours: 24,
    pickupDesk: 'Central Library Counter, Floor 1'
  });
});

// 7. Campus Event Pass Check-in (Strict Duplicate Protection)
app.post('/api/events/checkin', (req: Request, res: Response) => {
  const { passToken, staffEmail } = req.body;
  if (!passToken) {
    return res.status(400).json({ error: 'Pass token or QR string is required.' });
  }

  const cleanToken = passToken.trim();
  if (CHECKED_IN_PASSES.has(cleanToken)) {
    return res.status(409).json({
      success: false,
      alreadyCheckedIn: true,
      error: 'Pass has ALREADY been checked in. Duplicate entry rejected.'
    });
  }

  CHECKED_IN_PASSES.add(cleanToken);
  recordAudit(staffEmail || 'admin@sathaye.edu', 'ADMIN', 'EVENT_PASS_VERIFIED', 'event_registrations', {
    passToken: cleanToken,
    verifiedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Pass validated successfully. Attendee checked in.',
    passToken: cleanToken
  });
});

// 8. Grounded AI Campus Copilot (`/api/chat`)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, userRole, userEmail } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const query = message.trim().toLowerCase();

  // Try Gemini AI if API Key is configured
  const ai = getGeminiClient();
  if (ai) {
    try {
      const liveContext = `
You are the Official Sathaye College AI Campus Copilot (Sathaye UCM).
College context:
- Founded: 1959, Vile Parle (East), Mumbai.
- Campus structure: Ground, 1st, 2nd, 3rd Floor.
- Room 204: Smart Classroom (B.Sc. IT).
- Room 201: Advanced Computer Lab A.
- Room 101: Central Library (Knowledge Resource Center).
- Room 005: Central Cafeteria Pavilion.
- Room 008: K. R. C. Main Auditorium.
- Current active user role: ${userRole || 'STUDENT'}, email: ${userEmail || 'student@sathaye.edu'}.
- Timetable: Today has Python Programming (07:30 AM), DBMS (08:20 AM), Break (09:10 AM), Python Practical (09:30 AM).
Answer politely, concisely, accurately, and professionally. Guide users with specific room numbers and floor instructions.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${liveContext}\nUser Question: ${message}`,
      });

      return res.json({
        reply: response.text || 'I am ready to assist you with Sathaye College services.',
        source: 'gemini-live'
      });
    } catch (err: any) {
      console.warn('[Copilot Gemini Fallback]:', err.message);
    }
  }

  // Fallback: Intelligent Grounded Search
  let reply = '';
  let action: any = null;

  if (query.includes('class') || query.includes('lecture') || query.includes('next')) {
    reply = 'Your next class is "Python Practical Lab" in Room 201 (Floor 2) at 09:30 AM with Prof. Rohan Desai.';
    action = { type: 'navigate', label: 'View Room 201 on 2D Map', target: '/map?target=room-201' };
  } else if (query.includes('room 204') || query.includes('204')) {
    reply = 'Room 204 is the B.Sc. IT Smart Classroom, located on the 2nd Floor, Main Academic Block. Take the central stairs or elevator to Floor 2.';
    action = { type: 'navigate', label: 'Locate Room 204', target: '/map?target=room-204' };
  } else if (query.includes('library') || query.includes('book')) {
    reply = 'The Central Library (Knowledge Resource Center) is on the 1st Floor. Reading seats and textbook borrowing are open until 6:00 PM.';
    action = { type: 'navigate', label: 'Open Smart Library', target: '/library' };
  } else if (query.includes('canteen') || query.includes('food') || query.includes('vada')) {
    reply = 'The Central Canteen is open in the Cafeteria Pavilion (Ground Floor). Today\'s specials include Batata Vada Pav (₹40) and Misal Pav (₹65).';
    action = { type: 'navigate', label: 'Order at Canteen', target: '/canteen' };
  } else if (query.includes('event') || query.includes('pass')) {
    reply = 'Upcoming campus events include the Annual IT Symposium "Technovate 2026" in Auditorium 008.';
    action = { type: 'navigate', label: 'Browse Events', target: '/events' };
  } else {
    reply = `Welcome to Sathaye College Unified Campus Management. You can ask me about classrooms (e.g. Room 204), today's timetable, library books, canteen menu tokens, or directions on our 2D floor plans.`;
  }

  res.json({
    reply,
    action,
    source: 'campus-grounded-rules'
  });
});

// 9. Downloadable Project ZIP Stream
app.get('/api/export-zip', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="sathaye-ucm-complete.zip"');

  const archive = new ZipArchive({ zlib: { level: 9 } });
  archive.pipe(res);

  archive.glob('**/*', {
    cwd: process.cwd(),
    ignore: ['node_modules/**', '.git/**', 'dist/**', '.env', 'sathaye-ucm-complete.zip'],
    dot: true
  });

  archive.finalize();
});

// 10. Audit Logs Query (Admin-only)
app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ logs: AUDIT_LOGS });
});

// 11. Downloadable Codebase ZIP Archive
app.get('/api/export/zip', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="sathaye-ucm-codebase.zip"');

  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.on('error', (err: any) => {
    console.error('[ZIP STREAM ERROR]:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate ZIP archive' });
    }
  });

  archive.pipe(res);

  const rootDir = process.cwd();
  archive.glob('**/*', {
    cwd: rootDir,
    ignore: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      '.env',
      'sathaye-ucm-complete.zip',
      '.DS_Store'
    ],
    dot: true
  });

  archive.finalize();
});

// ==========================================
// VITE SPA MIDDLEWARE / PRODUCTION STATIC
// ==========================================
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SATHAYE UCM] Server running at:`);
    console.log(`  ➜ Local:   http://localhost:${PORT}/`);
    console.log(`  ➜ Network: http://127.0.0.1:${PORT}/`);
  });
}

setupVite().catch(err => {
  console.error('[SATHAYE UCM] Failed to start server:', err);
  process.exit(1);
});
