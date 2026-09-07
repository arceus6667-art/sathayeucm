// Centralized Smart Sathaye Campus Reactive Store
// Handles state persistence, cross-module notifications, role-based session data, and real-time triggers

import {
  UserProfile,
  DEMO_USERS,
  LectureClass,
  STUDENT_TIMETABLE,
  Assignment,
  INITIAL_ASSIGNMENTS,
  AttendanceRecord,
  FacultyResource,
  INITIAL_RESOURCES,
  SmartEvent,
  INITIAL_EVENTS,
  CampusTicket,
  INITIAL_TICKETS,
  LostFoundItem,
  INITIAL_LOST_FOUND,
  CanteenItem,
  INITIAL_CANTEEN_MENU,
  CanteenOrder,
  INITIAL_CANTEEN_ORDERS,
  LibraryBook,
  INITIAL_LIBRARY_BOOKS,
  LibraryBorrowRecord,
  INITIAL_LIBRARY_BORROWINGS,
  LibraryRequestOrIssue,
  INITIAL_LIBRARY_ISSUES,
  LibrarySeat,
  INITIAL_LIBRARY_SEATS,
  SmartNotification,
  INITIAL_NOTIFICATIONS
} from './smartCampusData';

// Storage Keys
const KEYS = {
  USER: 'sathaye_auth_user',
  ASSIGNMENTS: 'sathaye_assignments',
  ATTENDANCE: 'sathaye_attendance',
  RESOURCES: 'sathaye_resources',
  EVENTS: 'sathaye_events',
  TICKETS: 'sathaye_support_tickets',
  LOST_FOUND: 'sathaye_lost_found',
  CANTEEN_MENU: 'sathaye_canteen_menu',
  CANTEEN_ORDERS: 'sathaye_canteen_orders',
  LIBRARY_BOOKS: 'sathaye_library_books',
  LIBRARY_BORROWINGS: 'sathaye_library_borrowings',
  LIBRARY_ISSUES: 'sathaye_library_issues',
  LIBRARY_SEATS: 'sathaye_library_seats',
  NOTIFICATIONS: 'sathaye_notifications',
  ACCESSIBILITY: 'sathaye_accessibility_prefs'
};

function loadItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function saveItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('sathaye_store_updated', { detail: { key } }));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export class SmartCampusStore {
  // --- AUTH & USER ---
  static getCurrentUser(): UserProfile {
    const cached = loadItem<UserProfile | null>(KEYS.USER, null);
    if (cached) return cached;
    
    // Check legacy role if present
    const legacyRole = localStorage.getItem('demo_role');
    if (legacyRole === 'faculty') return DEMO_USERS['it.faculty01'].user;
    if (legacyRole === 'admin') return DEMO_USERS['demo.admin'].user;
    return DEMO_USERS['demo.student'].user;
  }

  static setCurrentUser(user: UserProfile | null) {
    saveItem(KEYS.USER, user);
    if (user) {
      localStorage.setItem('demo_role', user.role);
    } else {
      localStorage.removeItem('demo_role');
    }
  }

  static logout() {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem('demo_role');
    window.dispatchEvent(new CustomEvent('sathaye_store_updated', { detail: { key: KEYS.USER } }));
  }

  // --- NOTIFICATIONS ---
  static getNotifications(): SmartNotification[] {
    return loadItem<SmartNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static addNotification(notif: Omit<SmartNotification, 'id' | 'timestamp' | 'isRead'>) {
    const existing = this.getNotifications();
    const newNotif: SmartNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: 'Just now',
      isRead: false
    };
    const updated = [newNotif, ...existing];
    saveItem(KEYS.NOTIFICATIONS, updated);
    return newNotif;
  }

  static markNotificationRead(id: string) {
    const existing = this.getNotifications();
    const updated = existing.map(n => (n.id === id ? { ...n, isRead: true } : n));
    saveItem(KEYS.NOTIFICATIONS, updated);
  }

  static markAllNotificationsRead() {
    const existing = this.getNotifications();
    const updated = existing.map(n => ({ ...n, isRead: true }));
    saveItem(KEYS.NOTIFICATIONS, updated);
  }

  // --- TIMETABLE & ATTENDANCE ---
  static getTimetableForUser(user: UserProfile): LectureClass[] {
    if (user.role === 'faculty') {
      // Faculty specific schedule
      return STUDENT_TIMETABLE.filter(
        c => c.facultyId === user.facultyId || c.department.toLowerCase().includes(user.department?.toLowerCase() || '')
      );
    }
    return STUDENT_TIMETABLE;
  }

  static getAttendanceRecords(): AttendanceRecord[] {
    return loadItem<AttendanceRecord[]>(KEYS.ATTENDANCE, [
      {
        id: 'att-1',
        date: new Date().toISOString().split('T')[0],
        subject: 'Software Engineering (USIT404)',
        classId: 'lec-1',
        facultyId: 'FAC-IT-01',
        studentId: 'STU-2026-001',
        studentName: 'Aarav Mehta',
        rollNumber: 'TYIT-26-042',
        status: 'Present'
      },
      {
        id: 'att-2',
        date: new Date().toISOString().split('T')[0],
        subject: 'Core Java Lab (USIT401)',
        classId: 'lec-2',
        facultyId: 'FAC-IT-01',
        studentId: 'STU-2026-001',
        studentName: 'Aarav Mehta',
        rollNumber: 'TYIT-26-042',
        status: 'Present'
      }
    ]);
  }

  static markAttendance(record: Omit<AttendanceRecord, 'id'>) {
    const records = this.getAttendanceRecords();
    // Check duplicate
    const exists = records.find(
      r => r.date === record.date && r.classId === record.classId && r.studentId === record.studentId
    );
    if (exists) {
      const updated = records.map(r => (r.id === exists.id ? { ...r, status: record.status } : r));
      saveItem(KEYS.ATTENDANCE, updated);
      return;
    }
    const newRecord: AttendanceRecord = {
      ...record,
      id: 'att-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    };
    saveItem(KEYS.ATTENDANCE, [newRecord, ...records]);
  }

  // --- ASSIGNMENTS ---
  static getAssignments(): Assignment[] {
    return loadItem<Assignment[]>(KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }

  static createAssignment(asg: Omit<Assignment, 'id' | 'status'>): Assignment {
    const list = this.getAssignments();
    const newAsg: Assignment = {
      ...asg,
      id: 'asg-' + Date.now(),
      status: 'Pending'
    };
    saveItem(KEYS.ASSIGNMENTS, [newAsg, ...list]);

    // Cross-module trigger: notify students
    this.addNotification({
      recipientRole: 'student',
      category: 'academic',
      title: `New Assignment Published: ${newAsg.title}`,
      message: `${newAsg.subject} by ${newAsg.facultyName}. Due date: ${newAsg.deadline}`,
      actionUrl: '/portal?tab=assignments',
      priority: 'urgent'
    });

    return newAsg;
  }

  static submitAssignment(id: string, attachmentName: string) {
    const list = this.getAssignments();
    const updated = list.map(a =>
      a.id === id
        ? {
            ...a,
            status: 'Submitted' as const,
            submittedDate: new Date().toISOString().split('T')[0],
            attachmentName
          }
        : a
    );
    saveItem(KEYS.ASSIGNMENTS, updated);
  }

  // --- NOTES & RESOURCES ---
  static getResources(): FacultyResource[] {
    return loadItem<FacultyResource[]>(KEYS.RESOURCES, INITIAL_RESOURCES);
  }

  static uploadResource(res: Omit<FacultyResource, 'id' | 'uploadDate' | 'downloadCount'>) {
    const list = this.getResources();
    const newRes: FacultyResource = {
      ...res,
      id: 'res-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };
    saveItem(KEYS.RESOURCES, [newRes, ...list]);

    // Notify students
    this.addNotification({
      recipientRole: 'student',
      category: 'academic',
      title: `New Resource Uploaded: ${newRes.title}`,
      message: `${newRes.subject} (${newRes.fileType}, ${newRes.fileSize})`,
      actionUrl: '/portal?tab=resources'
    });

    return newRes;
  }

  // --- EVENTS ---
  static getEvents(): SmartEvent[] {
    return loadItem<SmartEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
  }

  static toggleEventRegistration(eventId: string) {
    const list = this.getEvents();
    const updated = list.map(evt => {
      if (evt.id === eventId) {
        const isRegistered = !evt.isRegistered;
        return {
          ...evt,
          isRegistered,
          registeredCount: isRegistered ? evt.registeredCount + 1 : Math.max(0, evt.registeredCount - 1),
          qrCode: isRegistered ? `SATHAYE-EVT-${evt.id.toUpperCase()}-USER` : undefined
        };
      }
      return evt;
    });
    saveItem(KEYS.EVENTS, updated);
  }

  // --- CAMPUS SUPPORT / MAINTENANCE ---
  static getTickets(): CampusTicket[] {
    return loadItem<CampusTicket[]>(KEYS.TICKETS, INITIAL_TICKETS);
  }

  static createTicket(ticket: Omit<CampusTicket, 'id' | 'ticketNumber' | 'reportedAt' | 'status'>): CampusTicket {
    const list = this.getTickets();
    const num = Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    const newTkt: CampusTicket = {
      ...ticket,
      id: 'tkt-' + Date.now(),
      ticketNumber: `SAT-SUP-${num}`,
      reportedAt: now,
      status: 'Reported'
    };
    saveItem(KEYS.TICKETS, [newTkt, ...list]);

    // Notify Admin
    this.addNotification({
      recipientRole: 'admin',
      category: 'support',
      title: `New Campus Issue Reported: ${newTkt.category}`,
      message: `${newTkt.locationName}: ${newTkt.description.substring(0, 60)}...`,
      actionUrl: '/portal?tab=maintenance',
      priority: newTkt.priority === 'High' || newTkt.priority === 'Emergency' ? 'urgent' : 'normal'
    });

    return newTkt;
  }

  static updateTicketStatus(id: string, status: CampusTicket['status'], note?: string) {
    const list = this.getTickets();
    const updated = list.map(t =>
      t.id === id ? { ...t, status, resolutionNote: note ?? t.resolutionNote } : t
    );
    saveItem(KEYS.TICKETS, updated);
  }

  // --- LOST & FOUND ---
  static getLostFound(): LostFoundItem[] {
    return loadItem<LostFoundItem[]>(KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
  }

  static createLostFound(item: Omit<LostFoundItem, 'id' | 'status' | 'date' | 'time'>): LostFoundItem {
    const list = this.getLostFound();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // AI Similarity Match calculation
    let similarityMatchId: string | undefined;
    let similarityScore: number | undefined;

    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const candidates = list.filter(c => c.type === oppositeType && c.category === item.category);

    if (candidates.length > 0) {
      // Find highest keyword/text overlap
      const itemKeywords = (item.title + ' ' + item.description).toLowerCase().split(/\s+/);
      let bestCandidate = candidates[0];
      let bestScore = 70;

      for (const cand of candidates) {
        const candText = (cand.title + ' ' + cand.description).toLowerCase();
        let matches = 0;
        for (const kw of itemKeywords) {
          if (kw.length > 3 && candText.includes(kw)) matches++;
        }
        const score = Math.min(96, 65 + matches * 10);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand;
        }
      }

      similarityMatchId = bestCandidate.id;
      similarityScore = bestScore;
    }

    const newItem: LostFoundItem = {
      ...item,
      id: 'lf-' + Date.now(),
      date: dateStr,
      time: timeStr,
      status: 'Open',
      similarityMatchId,
      similarityScore
    };

    saveItem(KEYS.LOST_FOUND, [newItem, ...list]);
    return newItem;
  }

  static claimLostFound(id: string) {
    const list = this.getLostFound();
    const updated = list.map(item => (item.id === id ? { ...item, status: 'Claim Requested' as const } : item));
    saveItem(KEYS.LOST_FOUND, updated);
  }

  // --- CANTEEN ---
  static getCanteenMenu(): CanteenItem[] {
    return loadItem<CanteenItem[]>(KEYS.CANTEEN_MENU, INITIAL_CANTEEN_MENU);
  }

  static updateCanteenItemAvailability(itemId: string, isAvailable: boolean) {
    const menu = this.getCanteenMenu();
    const updated = menu.map(m => (m.id === itemId ? { ...m, isAvailable } : m));
    saveItem(KEYS.CANTEEN_MENU, updated);
  }

  static getCanteenOrders(): CanteenOrder[] {
    return loadItem<CanteenOrder[]>(KEYS.CANTEEN_ORDERS, INITIAL_CANTEEN_ORDERS);
  }

  static placeCanteenOrder(
    user: UserProfile,
    items: { itemId: string; name: string; price: number; quantity: number }[],
    pickupSlot: string,
    paymentMethod: 'Demo UPI / GPay' | 'Demo Campus SmartCard' | 'Demo Cash'
  ): CanteenOrder {
    const orders = this.getCanteenOrders();
    const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const tokenNumber = Math.floor(10 + Math.random() * 90);
    const orderNum = `ORD-SAT-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: CanteenOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      items,
      totalAmount,
      pickupSlot,
      status: 'CONFIRMED',
      paymentMethod,
      paymentRef: `DEMO-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: 10,
      tokenNumber
    };

    saveItem(KEYS.CANTEEN_ORDERS, [newOrder, ...orders]);

    // Cross-module trigger: notify canteen
    this.addNotification({
      recipientRole: 'all',
      recipientUserId: 'CAN-2026-001',
      category: 'canteen',
      title: `New Order #${newOrder.orderNumber}`,
      message: `Token #${tokenNumber} for ${user.name} - ₹${totalAmount}`,
      actionUrl: '/portal?tab=canteen-orders'
    });

    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: CanteenOrder['status']) {
    const orders = this.getCanteenOrders();
    let updatedOrder: CanteenOrder | undefined;

    const updated = orders.map(o => {
      if (o.id === orderId) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });

    saveItem(KEYS.CANTEEN_ORDERS, updated);

    // If order transitions to READY, notify the student!
    if (updatedOrder && status === 'READY') {
      this.addNotification({
        recipientUserId: updatedOrder.userId,
        category: 'canteen',
        title: `Your Order is Ready for Pickup! 🍱`,
        message: `Token #${updatedOrder.tokenNumber} is ready at the counter.`,
        actionUrl: '/canteen',
        priority: 'urgent'
      });
    }
  }

  // --- LIBRARY ---
  static getLibraryBooks(): LibraryBook[] {
    return loadItem<LibraryBook[]>(KEYS.LIBRARY_BOOKS, INITIAL_LIBRARY_BOOKS);
  }

  static getLibraryBorrowings(): LibraryBorrowRecord[] {
    return loadItem<LibraryBorrowRecord[]>(KEYS.LIBRARY_BORROWINGS, INITIAL_LIBRARY_BORROWINGS);
  }

  static borrowBook(user: UserProfile, bookId: string) {
    const books = this.getLibraryBooks();
    const borrowings = this.getLibraryBorrowings();
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook || targetBook.availableCopies <= 0) return false;

    // Decrement copies
    const updatedBooks = books.map(b => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    saveItem(KEYS.LIBRARY_BOOKS, updatedBooks);

    // Add borrowing
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan

    const newBorrow: LibraryBorrowRecord = {
      id: 'bor-' + Date.now(),
      userId: user.id,
      userName: user.name,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      borrowedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'Issued',
      fineAmount: 0
    };

    saveItem(KEYS.LIBRARY_BORROWINGS, [newBorrow, ...borrowings]);

    // Notification
    this.addNotification({
      recipientUserId: user.id,
      category: 'library',
      title: `Book Issued: ${targetBook.title}`,
      message: `Return date: ${dueDate.toLocaleDateString()}. Please handle with care.`,
      actionUrl: '/library'
    });

    return true;
  }

  static returnBook(borrowingId: string) {
    const borrowings = this.getLibraryBorrowings();
    const books = this.getLibraryBooks();
    const record = borrowings.find(b => b.id === borrowingId);
    if (!record) return;

    const updatedBorrowings = borrowings.map(b =>
      b.id === borrowingId
        ? {
            ...b,
            status: 'Returned' as const,
            returnDate: new Date().toISOString().split('T')[0]
          }
        : b
    );
    saveItem(KEYS.LIBRARY_BORROWINGS, updatedBorrowings);

    // Increase copy count
    const updatedBooks = books.map(bk => (bk.id === record.bookId ? { ...bk, availableCopies: bk.availableCopies + 1 } : bk));
    saveItem(KEYS.LIBRARY_BOOKS, updatedBooks);
  }

  // Canonical Library Issues / Requests shared between Library & Admin
  static getLibraryIssues(): LibraryRequestOrIssue[] {
    return loadItem<LibraryRequestOrIssue[]>(KEYS.LIBRARY_ISSUES, INITIAL_LIBRARY_ISSUES);
  }

  static submitLibraryIssue(issue: Omit<LibraryRequestOrIssue, 'id' | 'createdAt' | 'status'>) {
    const list = this.getLibraryIssues();
    const now = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newIssue: LibraryRequestOrIssue = {
      ...issue,
      id: 'lib-req-' + Date.now(),
      createdAt: now,
      status: 'Under Review'
    };

    saveItem(KEYS.LIBRARY_ISSUES, [newIssue, ...list]);

    // Notify Library role & Admin
    this.addNotification({
      recipientRole: 'admin',
      category: 'library',
      title: `New Library ${newIssue.type}`,
      message: `${newIssue.title} by ${newIssue.userName}`,
      actionUrl: '/portal?tab=library-issues'
    });

    return newIssue;
  }

  static updateLibraryIssueStatus(id: string, status: LibraryRequestOrIssue['status'], notes?: string) {
    const list = this.getLibraryIssues();
    const updated = list.map(item =>
      item.id === id ? { ...item, status, librarianNotes: notes ?? item.librarianNotes } : item
    );
    saveItem(KEYS.LIBRARY_ISSUES, updated);
  }

  static getLibrarySeats(): LibrarySeat[] {
    return loadItem<LibrarySeat[]>(KEYS.LIBRARY_SEATS, INITIAL_LIBRARY_SEATS);
  }

  static toggleSeatStatus(seatId: string, status: LibrarySeat['status']) {
    const seats = this.getLibrarySeats();
    const updated = seats.map(s => (s.id === seatId ? { ...s, status } : s));
    saveItem(KEYS.LIBRARY_SEATS, updated);
  }

  // --- ACCESSIBILITY ---
  static getAccessibilityPrefs(): { highContrast: boolean; largeText: boolean; ttsEnabled: boolean } {
    return loadItem(KEYS.ACCESSIBILITY, {
      highContrast: false,
      largeText: false,
      ttsEnabled: false
    });
  }

  static setAccessibilityPrefs(prefs: { highContrast: boolean; largeText: boolean; ttsEnabled: boolean }) {
    saveItem(KEYS.ACCESSIBILITY, prefs);
  }
}
