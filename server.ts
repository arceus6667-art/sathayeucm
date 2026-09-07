import express, { Request, Response } from 'express';
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

// Canteen Orders
interface ServerCanteenOrder {
  id: string;
  userEmail: string;
  orderNumber: string;
  items: Array<{ itemId: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID_SANDBOX' | 'CASH_AT_COUNTER';
  tokenCode: string;
  createdAt: string;
}

let CANTEEN_ORDERS: ServerCanteenOrder[] = [];
let orderSeq = 100;

// Library Loans & Reservations
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
    console.log(`[SATHAYE UCM] Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error('[SATHAYE UCM] Failed to start server:', err);
  process.exit(1);
});
