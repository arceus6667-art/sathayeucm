import { 
  UserRole, UserProfile, CampusBuilding, CampusLocation, 
  ClassScheduleItem, AttendanceRecord, Assignment, AssignmentSubmission, 
  StudyResource, Announcement, CampusEvent, CampusIssue, LostFoundItem, 
  CanteenItem, CanteenOrder, LibraryBook, LibraryBorrowing, 
  LibrarySeatZone, LibraryIssue, CampusNotification, EmergencyContact, NavigationRoute,
  CampusAsset, MaintenanceTicket, CampusTechnician, AdminAuditLog, DigitalCampusID
} from '../types/campus';

export type { 
  UserRole, UserProfile, CampusBuilding, CampusLocation, 
  ClassScheduleItem, AttendanceRecord, Assignment, AssignmentSubmission, 
  StudyResource, Announcement, CampusEvent, CampusIssue, LostFoundItem, 
  CanteenItem, CanteenOrder, LibraryBook, LibraryBorrowing, 
  LibrarySeatZone, LibraryIssue, CampusNotification, EmergencyContact, NavigationRoute,
  CampusAsset, MaintenanceTicket, CampusTechnician, AdminAuditLog, DigitalCampusID
};
export type CampusUser = UserProfile;
export type TimetableEntry = ClassScheduleItem;

// --- AUTHENTICATION & DEMO ACCOUNTS ---

export interface AuthAccount {
  user: UserProfile;
  passwordHash: string;
}

export const DEMO_ACCOUNTS: AuthAccount[] = [
  // Student Demo
  {
    user: {
      id: 'stu-001',
      username: 'demo.student',
      name: 'Aarav Mehta',
      role: 'STUDENT',
      department: 'B.Sc. IT',
      studentId: 'DEMO-STU-2026-001',
      email: 'aarav.mehta@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      division: 'Div A',
      semester: 'Semester IV'
    },
    passwordHash: 'DemoStudent@123'
  },
  // 10 Distinct Demo Faculty Accounts
  {
    user: {
      id: 'fac-001',
      username: 'math.faculty01',
      name: 'Prof. S. R. Joshi',
      role: 'FACULTY',
      department: 'Mathematics',
      facultyId: 'DEMO-FAC-MATH-01',
      email: 'joshi.math@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Math@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-002',
      username: 'physics.faculty01',
      name: 'Dr. A. V. Kulkarni',
      role: 'FACULTY',
      department: 'Physics',
      facultyId: 'DEMO-FAC-PHYS-02',
      email: 'kulkarni.phys@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Phys@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-003',
      username: 'chem.faculty01',
      name: 'Dr. R. M. Date',
      role: 'FACULTY',
      department: 'Chemistry',
      facultyId: 'DEMO-FAC-CHEM-03',
      email: 'date.chem@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Chem@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-004',
      username: 'micro.faculty01',
      name: 'Dr. Neeta Deshmukh',
      role: 'FACULTY',
      department: 'Microbiology',
      facultyId: 'DEMO-FAC-MICRO-04',
      email: 'deshmukh.micro@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Micro@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-005',
      username: 'english.faculty01',
      name: 'Prof. Sunita Patil',
      role: 'FACULTY',
      department: 'English',
      facultyId: 'DEMO-FAC-ENG-05',
      email: 'patil.eng@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Eng@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-006',
      username: 'eco.faculty01',
      name: 'Dr. V. N. Bapat',
      role: 'FACULTY',
      department: 'Economics',
      facultyId: 'DEMO-FAC-ECO-06',
      email: 'bapat.eco@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Eco@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-007',
      username: 'psych.faculty01',
      name: 'Dr. Medha Dixit',
      role: 'FACULTY',
      department: 'Psychology',
      facultyId: 'DEMO-FAC-PSYCH-07',
      email: 'dixit.psych@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Psych@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-008',
      username: 'commerce.faculty01',
      name: 'Prof. K. G. Shah',
      role: 'FACULTY',
      department: 'Commerce',
      facultyId: 'DEMO-FAC-COMM-08',
      email: 'shah.comm@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Comm@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-009',
      username: 'accounts.faculty01',
      name: 'Prof. R. T. Mehta',
      role: 'FACULTY',
      department: 'Accountancy',
      facultyId: 'DEMO-FAC-ACCT-09',
      email: 'mehta.acct@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Accts@Sathaye2026!'
  },
  {
    user: {
      id: 'fac-010',
      username: 'it.faculty01',
      name: 'Prof. Rohan Desai',
      role: 'FACULTY',
      department: 'B.Sc. IT',
      facultyId: 'DEMO-FAC-IT-10',
      email: 'rohan.it@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'IT@Sathaye2026!'
  },
  // Canteen Demo Account
  {
    user: {
      id: 'can-001',
      username: 'canteen@123',
      name: 'Central Canteen Manager',
      role: 'CANTEEN',
      department: 'Campus Hospitality Services',
      email: 'canteen@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'Canteen@1234'
  },
  // Library Demo Account
  {
    user: {
      id: 'lib-001',
      username: 'librarymanagement@123',
      name: 'Sathaye Central Librarian',
      role: 'LIBRARY',
      department: 'Library Information Systems',
      email: 'library@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'library@123'
  },
  // Admin Demo Account
  {
    user: {
      id: 'adm-001',
      username: 'demo.admin',
      name: 'Registrar & System Administrator',
      role: 'ADMIN',
      department: 'General Administration',
      email: 'admin@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    passwordHash: 'DemoAdmin@123'
  }
];

// --- SATHAYE ACADEMIC STREAMS ---
export const SATHAYE_ACADEMIC_STREAMS = {
  science: [
    'Mathematics', 'Statistics', 'Physics', 'Chemistry', 
    'Botany', 'Zoology', 'Microbiology'
  ],
  arts: [
    'English', 'Economics', 'Psychology', 'History', 'Geography', 
    'Political Science', 'Sociology', 'Marathi', 'Hindi', 'Sanskrit', 
    'Philosophy', 'Education', 'Defence Studies', 'AIC'
  ],
  commerce: [
    'Commerce', 'Accountancy'
  ],
  selfFinanced: [
    'B.Sc. IT', 'Management Studies', 'Accountancy & Finance', 
    'Sports Management', 'Logistics & Supply Chain Management', 
    'Event Management & PR', 'BAMMC'
  ]
};

// --- CAMPUS BUILDINGS ---
export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: 'bldg-main',
    name: 'Main Heritage Building',
    code: 'MB',
    floors: [0, 1, 2, 3],
    x: 420,
    y: 190,
    width: 280,
    height: 160,
    color: '#003366',
    description: 'Central academic wing housing Arts, Commerce, Classrooms 101-308, Examination Hall & Registrar.',
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'bldg-science',
    name: 'Science & Research Block',
    code: 'SB',
    floors: [0, 1, 2, 3, 4],
    x: 180,
    y: 180,
    width: 190,
    height: 170,
    color: '#0d5a99',
    description: 'Specialized laboratories for Physics, Chemistry, Botany, Zoology, and Microbiology.',
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'bldg-it',
    name: 'IT & Self-Finance Complex',
    code: 'ITB',
    floors: [0, 1, 2, 3, 4],
    x: 740,
    y: 180,
    width: 200,
    height: 170,
    color: '#1a73e8',
    description: 'Computer Labs 1-4, B.Sc. IT Department, Management Studies (BMS), and Media Studio.',
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'bldg-library',
    name: 'Knowledge Resource & Library',
    code: 'LIB',
    floors: [0, 1, 2],
    x: 310,
    y: 400,
    width: 180,
    height: 130,
    color: '#8b5cf6',
    description: 'Two-tier library, air-conditioned reading halls, digital repository, and silent study zones.',
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'bldg-canteen',
    name: 'Central Cafeteria & Food Court',
    code: 'CAN',
    floors: [0, 1],
    x: 540,
    y: 400,
    width: 160,
    height: 120,
    color: '#eab308',
    description: 'Subsidized hygienic student dining, beverage kiosks, express pre-order pickup counters.',
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'bldg-auditorium',
    name: 'P. L. Deshpande Auditorium',
    code: 'AUD',
    floors: [0, 1],
    x: 740,
    y: 400,
    width: 200,
    height: 130,
    color: '#059669',
    description: 'Air-conditioned 600-seater performing auditorium for fests, seminars, and convocations.',
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'bldg-sports',
    name: 'Gymkhana & Multi-Sport Arena',
    code: 'GYM',
    floors: [0],
    x: 180,
    y: 400,
    width: 100,
    height: 140,
    color: '#10b981',
    description: 'Synthetic turf ground, badminton court, table tennis hall, gymnasium, and sports pavilion.',
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'bldg-medical',
    name: 'Health & First Aid Center',
    code: 'MED',
    floors: [0],
    x: 480,
    y: 355,
    width: 70,
    height: 40,
    color: '#ef4444',
    description: 'Resident medical officer, first-aid unit, emergency stabilization bed, and wheelchair hub.',
    hasElevator: false,
    hasRamp: true
  }
];

// --- CAMPUS LOCATIONS / ROOMS ---
export const CAMPUS_LOCATIONS: CampusLocation[] = [
  // Classrooms & Labs
  {
    id: 'loc-room-204',
    name: 'Room 204 - Mathematics Hall',
    code: 'R-204',
    type: 'classroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Heritage Building',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    x: 520,
    y: 240,
    capacity: 90,
    department: 'Mathematics',
    isAccessible: true,
    description: 'Senior lecture hall with digital podium, acoustics, and tiered seating.',
    status: 'available',
    openingHours: '07:00 AM - 06:00 PM'
  },
  {
    id: 'loc-room-102',
    name: 'Room 102 - Lecture Room',
    code: 'R-102',
    type: 'classroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Heritage Building',
    floorNumber: 1,
    floorLabel: '1st Floor',
    x: 450,
    y: 220,
    capacity: 100,
    department: 'Commerce',
    isAccessible: true,
    description: 'Large general lecture hall for Commerce and Economics divisions.',
    status: 'available',
    openingHours: '07:00 AM - 05:00 PM'
  },
  {
    id: 'loc-room-301',
    name: 'Room 301 - Arts Seminar Room',
    code: 'R-301',
    type: 'classroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Heritage Building',
    floorNumber: 3,
    floorLabel: '3rd Floor',
    x: 580,
    y: 230,
    capacity: 80,
    department: 'English',
    isAccessible: true,
    description: 'Humanities interactive lecture and discussion room.',
    status: 'available',
    openingHours: '07:30 AM - 04:30 PM'
  },
  {
    id: 'loc-it-lab-1',
    name: 'Computer Lab 1 (High-Performance Computing)',
    code: 'IT-LAB-1',
    type: 'lab',
    buildingId: 'bldg-it',
    buildingName: 'IT & Self-Finance Complex',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    x: 820,
    y: 230,
    capacity: 65,
    department: 'B.Sc. IT',
    isAccessible: true,
    description: 'Modern terminal lab with Linux workstations, dual gigabit ethernet, and projector.',
    status: 'available',
    openingHours: '08:00 AM - 06:00 PM'
  },
  {
    id: 'loc-it-lab-2',
    name: 'Embedded Systems & IoT Lab',
    code: 'IT-LAB-2',
    type: 'lab',
    buildingId: 'bldg-it',
    buildingName: 'IT & Self-Finance Complex',
    floorNumber: 3,
    floorLabel: '3rd Floor',
    x: 840,
    y: 240,
    capacity: 50,
    department: 'B.Sc. IT',
    isAccessible: true,
    description: 'Hardware workbench equipped with Raspberry Pi, Arduino, and oscilloscope units.',
    status: 'available',
    openingHours: '08:00 AM - 05:30 PM'
  },
  {
    id: 'loc-physics-lab',
    name: 'C. V. Raman Physics Laboratory',
    code: 'PHY-LAB',
    type: 'lab',
    buildingId: 'bldg-science',
    buildingName: 'Science & Research Block',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    x: 260,
    y: 220,
    capacity: 60,
    department: 'Physics',
    isAccessible: true,
    description: 'Optics darkrooms, spectrophotometers, and mechanics test benches.',
    status: 'available',
    openingHours: '08:00 AM - 05:00 PM'
  },
  {
    id: 'loc-chem-lab',
    name: 'P. C. Ray Chemistry Laboratory',
    code: 'CHEM-LAB',
    type: 'lab',
    buildingId: 'bldg-science',
    buildingName: 'Science & Research Block',
    floorNumber: 3,
    floorLabel: '3rd Floor',
    x: 270,
    y: 250,
    capacity: 70,
    department: 'Chemistry',
    isAccessible: true,
    description: 'Analytical titration stands, fume hoods, and organic synthesis benches.',
    status: 'available',
    openingHours: '08:00 AM - 05:00 PM'
  },
  {
    id: 'loc-micro-lab',
    name: 'Microbiology & Biotechnology Lab',
    code: 'MICRO-LAB',
    type: 'lab',
    buildingId: 'bldg-science',
    buildingName: 'Science & Research Block',
    floorNumber: 4,
    floorLabel: '4th Floor',
    x: 275,
    y: 260,
    capacity: 45,
    department: 'Microbiology',
    isAccessible: true,
    description: 'Biosafety Level 2 facility with laminar airflow, incubators, and autoclaves.',
    status: 'available',
    openingHours: '08:00 AM - 05:00 PM'
  },
  // Library, Canteen, Auditorium, Admin
  {
    id: 'loc-library-central',
    name: 'Sathaye Central Library & Reference Hall',
    code: 'LIB-MAIN',
    type: 'library',
    buildingId: 'bldg-library',
    buildingName: 'Knowledge Resource & Library',
    floorNumber: 1,
    floorLabel: '1st Floor',
    x: 390,
    y: 440,
    capacity: 250,
    department: 'Library Services',
    isAccessible: true,
    description: 'Circulation desk, open stack collection with 85,000+ volumes, OPAC kiosks.',
    status: 'available',
    openingHours: '07:30 AM - 07:00 PM'
  },
  {
    id: 'loc-library-reading',
    name: 'Air-Conditioned Study & Digital Lounge',
    code: 'LIB-DIGI',
    type: 'library',
    buildingId: 'bldg-library',
    buildingName: 'Knowledge Resource & Library',
    floorNumber: 2,
    floorLabel: '2nd Floor',
    x: 400,
    y: 450,
    capacity: 120,
    department: 'Library Services',
    isAccessible: true,
    description: 'Quiet study pods, power charging stations, high-speed Wi-Fi, e-journals terminal.',
    status: 'available',
    openingHours: '07:30 AM - 08:00 PM'
  },
  {
    id: 'loc-canteen-counter',
    name: 'Sathaye Central Canteen - Food Court',
    code: 'CAN-FOOD',
    type: 'canteen',
    buildingId: 'bldg-canteen',
    buildingName: 'Central Cafeteria & Food Court',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 610,
    y: 450,
    capacity: 180,
    department: 'Canteen',
    isAccessible: true,
    description: 'Main food counter, breakfast specialties (Misal, Idli), beverages, and digital order pickup.',
    status: 'available',
    openingHours: '07:00 AM - 06:30 PM'
  },
  {
    id: 'loc-auditorium-main',
    name: 'P. L. Deshpande Auditorium',
    code: 'AUD-PLD',
    type: 'auditorium',
    buildingId: 'bldg-auditorium',
    buildingName: 'P. L. Deshpande Auditorium',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 820,
    y: 450,
    capacity: 600,
    department: 'Cultural Affairs',
    isAccessible: true,
    description: 'Primary campus stage with green rooms, Dolby surround audio, and stage lighting.',
    status: 'available',
    openingHours: 'Event Dependent'
  },
  {
    id: 'loc-sports-turf',
    name: 'Multi-Sport Synthetic Turf & Gymkhana',
    code: 'SPORTS-TURF',
    type: 'sports',
    buildingId: 'bldg-sports',
    buildingName: 'Gymkhana & Multi-Sport Arena',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 230,
    y: 450,
    capacity: 200,
    department: 'Physical Education',
    isAccessible: true,
    description: 'All-weather turf for Box Cricket, Football, Volleyball, and Kho-Kho.',
    status: 'available',
    openingHours: '06:00 AM - 08:00 PM'
  },
  {
    id: 'loc-medical-room',
    name: 'Campus Medical & First-Aid Center',
    code: 'MED-CTR',
    type: 'medical',
    buildingId: 'bldg-medical',
    buildingName: 'Health & First Aid Center',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 510,
    y: 370,
    capacity: 10,
    department: 'Student Health',
    isAccessible: true,
    description: 'Resident medical attendant, emergency oxygen, BP/sugar monitoring, ambulance dispatch.',
    status: 'available',
    openingHours: '24 Hours Emergency'
  },
  {
    id: 'loc-admin-office',
    name: 'Registrar & Student Services Counter',
    code: 'ADM-OFFICE',
    type: 'admin',
    buildingId: 'bldg-main',
    buildingName: 'Main Heritage Building',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 460,
    y: 280,
    capacity: 40,
    department: 'General Administration',
    isAccessible: true,
    description: 'Bonafide certificates, fee receipts, rail concessions, and scholarship verification.',
    status: 'available',
    openingHours: '10:00 AM - 04:00 PM'
  },
  {
    id: 'loc-washroom-accessible',
    name: 'Wheelchair Accessible Restrooms',
    code: 'WASH-ACC',
    type: 'washroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Heritage Building',
    floorNumber: 0,
    floorLabel: 'Ground Floor',
    x: 430,
    y: 270,
    capacity: 6,
    department: 'Facilities',
    isAccessible: true,
    description: 'ADA-compliant barrier-free washrooms with support grab bars and call alarms.',
    status: 'available',
    openingHours: 'Always Open'
  }
];

// --- TIMETABLE / CLASS SCHEDULE ---
export const STUDENT_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'cs-01',
    subject: 'Core Java & OOP Concepts',
    subjectCode: 'USIT401',
    room: 'Room 204',
    roomId: 'loc-room-204',
    building: 'Main Heritage Building',
    floor: '2nd Floor',
    facultyName: 'Prof. Rohan Desai',
    facultyId: 'fac-010',
    department: 'B.Sc. IT',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    batch: 'Div A'
  },
  {
    id: 'cs-02',
    subject: 'Computer Oriented Statistical Techniques',
    subjectCode: 'USIT403',
    room: 'Room 204',
    roomId: 'loc-room-204',
    building: 'Main Heritage Building',
    floor: '2nd Floor',
    facultyName: 'Prof. S. R. Joshi',
    facultyId: 'fac-001',
    department: 'Mathematics',
    day: 'Monday',
    startTime: '10:45 AM',
    endTime: '12:15 PM',
    batch: 'Div A',
    isNext: true
  },
  {
    id: 'cs-03',
    subject: 'Embedded Systems & IoT Practical',
    subjectCode: 'USIT402P',
    room: 'Computer Lab 1',
    roomId: 'loc-it-lab-1',
    building: 'IT & Self-Finance Complex',
    floor: '2nd Floor',
    facultyName: 'Prof. Rohan Desai',
    facultyId: 'fac-010',
    department: 'B.Sc. IT',
    day: 'Monday',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    batch: 'Batch A1'
  },
  {
    id: 'cs-04',
    subject: 'Software Engineering Methodologies',
    subjectCode: 'USIT404',
    room: 'Room 102',
    roomId: 'loc-room-102',
    building: 'Main Heritage Building',
    floor: '1st Floor',
    facultyName: 'Dr. Priya Sharma',
    facultyId: 'fac-010',
    department: 'B.Sc. IT',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    batch: 'Div A'
  }
];

// --- CANTEEN MENU ITEMS ---
export const INITIAL_CANTEEN_ITEMS: CanteenItem[] = [
  {
    id: 'can-1',
    name: 'Special Kolhapuri Misal Pav',
    category: 'Breakfast',
    price: 60,
    isAvailable: true,
    prepTimeMinutes: 5,
    calories: 380,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    isVeg: true,
    description: 'Signature spiced sprout curry with farsan, chopped onions, lemon, and fresh pav.'
  },
  {
    id: 'can-2',
    name: 'Steamed Idli Sambar (2 Pcs)',
    category: 'Breakfast',
    price: 45,
    isAvailable: true,
    prepTimeMinutes: 4,
    calories: 220,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    isVeg: true,
    description: 'Hot fluffy rice cakes served with aromatic vegetable sambar and fresh coconut chutney.'
  },
  {
    id: 'can-3',
    name: 'Crispy Medu Vada (2 Pcs)',
    category: 'Breakfast',
    price: 50,
    isAvailable: true,
    prepTimeMinutes: 6,
    calories: 310,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    isVeg: true,
    description: 'Golden fried lentil donuts seasoned with peppercorns, curry leaves, and ginger.'
  },
  {
    id: 'can-4',
    name: 'Mumbai Batata Vada Pav (Single)',
    category: 'Snacks',
    price: 22,
    isAvailable: true,
    prepTimeMinutes: 2,
    calories: 290,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    isVeg: true,
    description: 'College staple spiced potato fritter with dry garlic chutney in a warm pav.'
  },
  {
    id: 'can-5',
    name: 'Schezwan Veg Grilled Sandwich',
    category: 'Snacks',
    price: 75,
    isAvailable: true,
    prepTimeMinutes: 8,
    calories: 420,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    isVeg: true,
    description: 'Triple-decker grilled sandwich filled with capsicum, cheese, and spicy schezwan sauce.'
  },
  {
    id: 'can-6',
    name: 'Veg Deluxe Thali Meal',
    category: 'Meals',
    price: 110,
    isAvailable: true,
    prepTimeMinutes: 7,
    calories: 650,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    isVeg: true,
    description: 'Wholesome student meal: 2 seasonal sabzis, dal tadka, jeera rice, 3 rotis, salad, and sweet.'
  },
  {
    id: 'can-7',
    name: 'South Indian Filter Coffee',
    category: 'Beverages',
    price: 25,
    isAvailable: true,
    prepTimeMinutes: 3,
    calories: 90,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    isVeg: true,
    description: 'Frothy freshly brewed chicory-infused coffee in traditional dabarah.'
  },
  {
    id: 'can-8',
    name: 'Spiced Masala Buttermilk (Chaas)',
    category: 'Healthy',
    price: 20,
    isAvailable: true,
    prepTimeMinutes: 2,
    calories: 60,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    isVeg: true,
    description: 'Cooling churned curd with roasted cumin, green chillies, and fresh coriander.'
  }
];

// --- LIBRARY BOOKS ---
export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'book-1',
    title: 'Core Java: Fundamentals (12th Edition)',
    author: 'Cay S. Horstmann',
    isbn: '978-0137871070',
    department: 'B.Sc. IT',
    totalCopies: 8,
    availableCopies: 5,
    shelfLocation: 'Rack IT-04 / Shelf B',
    tags: ['Programming', 'Java', 'OOP', 'USIT401'],
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'book-2',
    title: 'Fundamentals of Mathematical Statistics',
    author: 'S. C. Gupta & V. K. Kapoor',
    isbn: '978-8180545283',
    department: 'Mathematics',
    totalCopies: 12,
    availableCopies: 4,
    shelfLocation: 'Rack MATH-02 / Shelf A',
    tags: ['Probability', 'Statistics', 'Distribution', 'USIT403'],
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'book-3',
    title: 'Software Engineering: A Practitioner\'s Approach',
    author: 'Roger S. Pressman',
    isbn: '978-0078022128',
    department: 'B.Sc. IT',
    totalCopies: 10,
    availableCopies: 7,
    shelfLocation: 'Rack IT-06 / Shelf C',
    tags: ['Agile', 'Architecture', 'Testing', 'USIT404'],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'book-4',
    title: 'Concepts of Modern Physics',
    author: 'Arthur Beiser',
    isbn: '978-9352601752',
    department: 'Physics',
    totalCopies: 15,
    availableCopies: 9,
    shelfLocation: 'Rack SCI-01 / Shelf D',
    tags: ['Quantum Mechanics', 'Relativity', 'Nuclear'],
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'book-5',
    title: 'Organic Chemistry (7th Edition)',
    author: 'Robert T. Morrison & Robert N. Boyd',
    isbn: '978-8131704813',
    department: 'Chemistry',
    totalCopies: 14,
    availableCopies: 6,
    shelfLocation: 'Rack SCI-03 / Shelf A',
    tags: ['Reactions', 'Stereochemistry', 'Organic'],
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'book-6',
    title: 'Principles of Economics (9th Edition)',
    author: 'N. Gregory Mankiw',
    isbn: '978-0357038314',
    department: 'Economics',
    totalCopies: 10,
    availableCopies: 8,
    shelfLocation: 'Rack ARTS-05 / Shelf B',
    tags: ['Microeconomics', 'Macroeconomics', 'Markets'],
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=300'
  }
];

// --- EMERGENCY SAFETY CONTACTS ---
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'sos-sec',
    title: 'Campus Security Control Room',
    dept: 'Vigilance & Gate 1 Post',
    phone: '+91-22-2614-1149',
    location: 'Main Gate & Perimeter Booth',
    description: 'Immediate on-campus response unit, gate lock-down, guard dispatch.',
    is24x7: true
  },
  {
    id: 'sos-med',
    title: 'Medical Emergency & First-Aid',
    dept: 'Student Health Clinic',
    phone: '+91-9820-041-112',
    location: 'Health Center, Ground Floor',
    description: 'Dr. Deshmukh & duty nurses, emergency stretchers, oxygen support.',
    is24x7: true
  },
  {
    id: 'sos-fire',
    title: 'Vile Parle Fire Station',
    dept: 'Mumbai Fire Brigade',
    phone: '101 / +91-22-2611-2222',
    location: 'Vile Parle East (1.2 km away)',
    description: 'Rapid municipal fire and rescue tender dispatch.',
    is24x7: true
  },
  {
    id: 'sos-police',
    title: 'Vile Parle Police Station',
    dept: 'Mumbai City Police',
    phone: '112 / +91-22-2618-3567',
    location: 'Subhash Road, Vile Parle East',
    description: 'Police squad dispatch, female safety desk, beat marshals.',
    is24x7: true
  },
  {
    id: 'sos-anti-ragging',
    title: 'Sathaye Anti-Ragging Helpline',
    dept: 'Autonomous Discipline Committee',
    phone: '+91-22-2614-2200',
    location: 'Principal Office Secretariat',
    description: 'Zero-tolerance student protection and confidential grievance reporting.',
    is24x7: true
  }
];

// --- PROMPT 3 ADMIN DATASETS ---

export const INITIAL_TECHNICIANS: CampusTechnician[] = [
  { id: 'tech-1', name: 'Prakash Gawde', trade: 'Electrical', phone: '+91 98201 10001', activeTickets: 2, status: 'Available' },
  { id: 'tech-2', name: 'Rajesh Shinde', trade: 'HVAC / AC', phone: '+91 98201 10002', activeTickets: 3, status: 'On Job' },
  { id: 'tech-3', name: 'Santosh Parab', trade: 'IT & Hardware', phone: '+91 98201 10003', activeTickets: 1, status: 'Available' },
  { id: 'tech-4', name: 'Dilip Salvi', trade: 'Plumbing', phone: '+91 98201 10004', activeTickets: 1, status: 'Available' },
  { id: 'tech-5', name: 'Mahesh Kadam', trade: 'Carpentry', phone: '+91 98201 10005', activeTickets: 0, status: 'Available' }
];

export const INITIAL_ASSETS: CampusAsset[] = [
  {
    id: 'AST-PROJ-01',
    name: 'EPSON EB-2250U Laser Interactive Projector',
    category: 'Projector',
    locationId: 'loc-it-lab-1',
    locationName: 'IT Laboratory 1 (Ground Floor)',
    purchaseDate: '2024-06-15',
    status: 'Operational',
    lastMaintenanceDate: '2026-08-10',
    nextScheduledMaintenance: '2026-11-15',
    assignedTeam: 'IT & Hardware',
    serialNumber: 'EP-2250-9941A',
    healthScore: 94
  },
  {
    id: 'AST-AC-02',
    name: 'Daikin 2.5-Ton Inverter Cassette AC Unit',
    category: 'AC',
    locationId: 'loc-room-204',
    locationName: 'Seminar Hall 2 / Room 204',
    purchaseDate: '2023-04-10',
    status: 'Under Maintenance',
    lastMaintenanceDate: '2026-07-20',
    nextScheduledMaintenance: '2026-09-12',
    assignedTeam: 'HVAC / AC',
    serialNumber: 'DK-CAS-8812B',
    healthScore: 68
  },
  {
    id: 'AST-PC-03',
    name: 'Dell OptiPlex 7090 Desktop Computer Cluster (30 Nodes)',
    category: 'Computer',
    locationId: 'loc-it-lab-2',
    locationName: 'Advanced Computing Lab 2',
    purchaseDate: '2025-01-20',
    status: 'Operational',
    lastMaintenanceDate: '2026-08-01',
    nextScheduledMaintenance: '2026-12-01',
    assignedTeam: 'IT & Hardware',
    serialNumber: 'DLL-CLUST-7090',
    healthScore: 96
  },
  {
    id: 'AST-MIC-04',
    name: 'Olympus CX23 Binocular Research Microscopes (15 Units)',
    category: 'Laboratory equipment',
    locationId: 'loc-micro-lab',
    locationName: 'Microbiology & Biotechnology Lab',
    purchaseDate: '2024-09-05',
    status: 'Operational',
    lastMaintenanceDate: '2026-07-15',
    nextScheduledMaintenance: '2026-10-20',
    assignedTeam: 'General Facilities',
    serialNumber: 'OLY-CX23-SET',
    healthScore: 92
  },
  {
    id: 'AST-PRN-05',
    name: 'Canon ImageRUNNER ADVANCE Heavy Duplex Network Printer',
    category: 'Printer',
    locationId: 'loc-library-central',
    locationName: 'Central Library Circulation Desk',
    purchaseDate: '2023-11-18',
    status: 'Needs Service',
    lastMaintenanceDate: '2026-08-05',
    nextScheduledMaintenance: '2026-09-14',
    assignedTeam: 'IT & Hardware',
    serialNumber: 'CN-IR-4551-D',
    healthScore: 74
  },
  {
    id: 'AST-REF-06',
    name: 'Blue Star Double Door Commercial Deep Freezer',
    category: 'Electrical',
    locationId: 'loc-canteen-main',
    locationName: 'Central Cafeteria Kitchen',
    purchaseDate: '2024-02-14',
    status: 'Operational',
    lastMaintenanceDate: '2026-08-20',
    nextScheduledMaintenance: '2026-11-30',
    assignedTeam: 'Electrical',
    serialNumber: 'BS-DF-500L',
    healthScore: 89
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'MNT-2026-01',
    title: 'Daikin Cassette AC Coil Cleaning & Gas Recharge',
    assetId: 'AST-AC-02',
    assetName: 'Daikin 2.5-Ton Inverter Cassette AC Unit',
    locationId: 'loc-room-204',
    locationName: 'Seminar Hall 2 / Room 204',
    category: 'AC',
    priority: 'High',
    technician: 'Rajesh Shinde',
    status: 'In Progress',
    estimatedCompletion: '2026-09-10',
    notes: 'Drainage pipe inspected, coil de-scaling ongoing. Filter replacement required.',
    reportedBy: 'Dr. Anand Joshi',
    createdAt: '2026-09-04',
    sparePartsUsed: ['Coil Cleaner Spray', 'Mesh Filter 2x']
  },
  {
    id: 'MNT-2026-02',
    title: 'Laser Projector Optical Realignment & HDMI Re-cabling',
    assetId: 'AST-PROJ-01',
    assetName: 'EPSON EB-2250U Laser Interactive Projector',
    locationId: 'loc-it-lab-1',
    locationName: 'IT Laboratory 1 (Ground Floor)',
    category: 'Projector',
    priority: 'Medium',
    technician: 'Santosh Parab',
    status: 'Scheduled',
    estimatedCompletion: '2026-09-12',
    notes: 'Scheduled for after 4 PM to avoid lab schedule disruption.',
    reportedBy: 'Dr. Priya Sharma',
    createdAt: '2026-09-05',
    sparePartsUsed: ['High-speed 4K HDMI 10m Cable']
  },
  {
    id: 'MNT-2026-03',
    title: 'Canon Network Printer Roller Drum Degreasing',
    assetId: 'AST-PRN-05',
    assetName: 'Canon ImageRUNNER ADVANCE Heavy Duplex Network Printer',
    locationId: 'loc-library-central',
    locationName: 'Central Library Circulation Desk',
    category: 'Printer',
    priority: 'Medium',
    technician: 'Santosh Parab',
    status: 'Assigned',
    estimatedCompletion: '2026-09-14',
    notes: 'Tray 2 paper jam sensor needs cleaning.',
    reportedBy: 'V. R. Chitnis (Librarian)',
    createdAt: '2026-09-06',
    sparePartsUsed: []
  },
  {
    id: 'MNT-2026-04',
    title: 'Central Cafeteria Commercial Water Purifier Filter Swap',
    locationId: 'loc-canteen-main',
    locationName: 'Central Cafeteria Kitchen',
    category: 'Plumbing',
    priority: 'Low',
    technician: 'Dilip Salvi',
    status: 'Completed',
    estimatedCompletion: '2026-09-03',
    actualCompletion: '2026-09-03',
    notes: 'All 3 pre-filters replaced. Water output tested: TDS 42 ppm.',
    reportedBy: 'Central Canteen Manager',
    createdAt: '2026-09-02',
    sparePartsUsed: ['Activated Carbon Block', 'Spun Sediment Filter']
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'AUD-801',
    actorName: 'Prof. Sudhir Mhatre',
    actorRole: 'ADMIN',
    action: 'ASSIGN_TECHNICIAN',
    entity: 'MaintenanceTicket',
    entityId: 'MNT-2026-01',
    previousValue: 'Status: Ticket • Technician: None',
    newValue: 'Status: In Progress • Technician: Rajesh Shinde',
    timestamp: '2026-09-04 10:30 AM'
  },
  {
    id: 'AUD-802',
    actorName: 'Prof. Sudhir Mhatre',
    actorRole: 'ADMIN',
    action: 'DISPATCH_EMERGENCY_NOTICE',
    entity: 'CampusNotification',
    entityId: 'notif-bc-01',
    previousValue: 'Draft',
    newValue: 'Published to ALL (Lab Safety Advisory)',
    timestamp: '2026-09-05 08:45 AM'
  },
  {
    id: 'AUD-803',
    actorName: 'V. R. Chitnis',
    actorRole: 'LIBRARY',
    action: 'UPDATE_READING_ZONE',
    entity: 'LibrarySeatZone',
    entityId: 'zone-ground',
    previousValue: 'Occupied: 72',
    newValue: 'Occupied: 78',
    timestamp: '2026-09-06 11:15 AM'
  },
  {
    id: 'AUD-804',
    actorName: 'Central Canteen Manager',
    actorRole: 'CANTEEN',
    action: 'ADVANCE_ORDER_STATUS',
    entity: 'CanteenOrder',
    entityId: 'ord-8101',
    previousValue: 'PAID',
    newValue: 'PREPARING (Token #42)',
    timestamp: '2026-09-06 12:20 PM'
  }
];

export const INITIAL_DIGITAL_IDS: DigitalCampusID[] = [
  {
    id: 'DID-STU-01',
    studentOrStaffId: 'STU-2026-001',
    name: 'Aarav Mehta',
    role: 'STUDENT',
    department: 'B.Sc. Information Technology',
    year: 'TY (Semester IV)',
    division: 'Div A - Roll #42',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    qrToken: 'SATHAYE://ID/VERIFY/STU-2026-001/a84f3e9c',
    validUntil: '2027-06-30',
    status: 'Active',
    permissions: {
      library: 'VALID',
      event: 'REGISTERED',
      lab: 'AUTHORIZED',
      facility: 'AUTHORIZED'
    }
  },
  {
    id: 'DID-FAC-01',
    studentOrStaffId: 'FAC-MATH-01',
    name: 'Prof. S. R. Joshi',
    role: 'FACULTY',
    department: 'Mathematics',
    year: 'Permanent Faculty',
    division: 'HOD',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    qrToken: 'SATHAYE://ID/VERIFY/FAC-MATH-01/d901b22e',
    validUntil: '2028-12-31',
    status: 'Active',
    permissions: {
      library: 'VALID',
      event: 'REGISTERED',
      lab: 'AUTHORIZED',
      facility: 'AUTHORIZED'
    }
  },
  {
    id: 'DID-CAN-01',
    studentOrStaffId: 'CAN-2026-001',
    name: 'Central Canteen Manager',
    role: 'CANTEEN',
    department: 'Hospitality & Food Services',
    year: 'Campus Operations',
    division: 'Food Court Gate 2',
    avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200',
    qrToken: 'SATHAYE://ID/VERIFY/CAN-2026-001/f47b8190',
    validUntil: '2027-12-31',
    status: 'Active',
    permissions: {
      library: 'VALID',
      event: 'REGISTERED',
      lab: 'AUTHORIZED',
      facility: 'AUTHORIZED'
    }
  },
  {
    id: 'DID-LIB-01',
    studentOrStaffId: 'LIB-2026-001',
    name: 'Central Library Desk',
    role: 'LIBRARY',
    department: 'Knowledge Resource Center',
    year: 'Library Staff',
    division: 'Circulation Unit',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
    qrToken: 'SATHAYE://ID/VERIFY/LIB-2026-001/3a8c1992',
    validUntil: '2027-12-31',
    status: 'Active',
    permissions: {
      library: 'VALID',
      event: 'REGISTERED',
      lab: 'AUTHORIZED',
      facility: 'AUTHORIZED'
    }
  }
];

// --- STORE SINGLETON WITH LOCALSTORAGE PERSISTENCE ---

class CampusStore {
  private static instance: CampusStore;
  private listeners: Set<() => void> = new Set();

  private currentUser: UserProfile | null = null;
  private canteenOrders: CanteenOrder[] = [];
  private libraryBorrowings: LibraryBorrowing[] = [];
  private libraryIssues: LibraryIssue[] = [];
  private campusIssues: CampusIssue[] = [];
  private lostFoundItems: LostFoundItem[] = [];
  private assignments: Assignment[] = [];
  private attendanceRecords: AttendanceRecord[] = [];
  private announcements: Announcement[] = [];
  private studyResources: StudyResource[] = [];
  private notifications: CampusNotification[] = [];
  private locations: CampusLocation[] = CAMPUS_LOCATIONS;
  private assets: CampusAsset[] = INITIAL_ASSETS;
  private technicians: CampusTechnician[] = INITIAL_TECHNICIANS;
  private maintenanceTickets: MaintenanceTicket[] = INITIAL_MAINTENANCE_TICKETS;
  private auditLogs: AdminAuditLog[] = INITIAL_AUDIT_LOGS;
  private digitalIds: DigitalCampusID[] = INITIAL_DIGITAL_IDS;
  private users: UserProfile[] = DEMO_ACCOUNTS.map(a => a.user);
  private canteenItems: CanteenItem[] = INITIAL_CANTEEN_ITEMS;
  private libraryBooks: LibraryBook[] = INITIAL_LIBRARY_BOOKS;
  private readingZones: LibrarySeatZone[] = [
    { name: 'Ground Floor Reading Hall', total: 120, occupied: 78, isAccessible: true },
    { name: '1st Floor Reference & Periodicals', total: 80, occupied: 45, isAccessible: true },
    { name: '2nd Floor AC Digital Lounge', total: 50, occupied: 38, isAccessible: true }
  ];
  private readingSeatsOccupied: number = 161;
  private classSchedule: ClassScheduleItem[] = STUDENT_SCHEDULE;
  private events: CampusEvent[] = [
    {
      id: 'evt-saptarang',
      title: 'Saptarang 2026: Annual Cultural Fest',
      category: 'cultural',
      date: '2026-10-15',
      time: '10:00 AM - 08:00 PM',
      location: 'Kashinath Dhuru Auditorium & Quadrangle',
      locationId: 'loc-auditorium',
      description: 'The flagship annual festival of Sathaye College showcasing street plays, classical and western dance, music battles, and celebrity guest talks.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      organizer: 'Sathaye Cultural Council',
      registrationOpen: true,
      registeredCount: 420,
      isFeatured: true
    },
    {
      id: 'evt-hackathon',
      title: 'Sathaye TechSprint: 24-Hour Smart Cities Hackathon',
      category: 'hackathon',
      date: '2026-09-26',
      time: '09:00 AM Onwards',
      location: 'IT Laboratory 1 & Seminar Hall 3',
      locationId: 'loc-it-lab-1',
      description: 'Build open-source AI and IoT solutions tackling Mumbai urban mobility, waste segregation, and campus energy conservation.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      organizer: 'B.Sc. IT & Computer Science Club',
      registrationOpen: true,
      registeredCount: 110,
      isFeatured: true
    },
    {
      id: 'evt-ai-workshop',
      title: 'Hands-on Generative AI Bootcamp',
      category: 'workshop',
      date: '2026-09-18',
      time: '02:00 PM - 05:00 PM',
      location: 'Seminar Hall 2 (Main Building)',
      locationId: 'loc-room-204',
      description: 'Learn modern Google Gemini SDK, LLM function calling, and full-stack web application rapid prototyping.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      organizer: 'Tech Innovations Club',
      registrationOpen: true,
      registeredCount: 95,
      isFeatured: false
    }
  ];

  private constructor() {
    this.initFromStorage();
  }

  public static getInstance(): CampusStore {
    if (!CampusStore.instance) {
      CampusStore.instance = new CampusStore();
    }
    return CampusStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  private initFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('sathaye_auth_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        // Default demo session fallback to student
        const demoRole = localStorage.getItem('demo_role');
        if (demoRole === 'faculty') {
          this.currentUser = DEMO_ACCOUNTS.find(a => a.user.role === 'FACULTY')?.user || null;
        } else if (demoRole === 'admin') {
          this.currentUser = DEMO_ACCOUNTS.find(a => a.user.role === 'ADMIN')?.user || null;
        } else {
          this.currentUser = DEMO_ACCOUNTS[0].user; // Student
        }
      }

      const orders = localStorage.getItem('sathaye_canteen_orders');
      if (orders) this.canteenOrders = JSON.parse(orders);
      else {
        // Initial sample orders
        this.canteenOrders = [
          {
            id: 'ord-8101',
            studentId: 'stu-001',
            studentName: 'Aarav Mehta',
            items: [
              { itemId: 'can-1', name: 'Special Kolhapuri Misal Pav', price: 60, quantity: 1 },
              { itemId: 'can-7', name: 'South Indian Filter Coffee', price: 25, quantity: 1 }
            ],
            totalAmount: 85,
            status: 'PREPARING',
            tokenNumber: 42,
            estimatedTime: '5 mins',
            createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
            pickupSlot: 'Counter 1'
          }
        ];
      }

      const borrowings = localStorage.getItem('sathaye_library_borrowings');
      if (borrowings) this.libraryBorrowings = JSON.parse(borrowings);
      else {
        this.libraryBorrowings = [
          {
            id: 'bor-101',
            bookId: 'book-1',
            bookTitle: 'Core Java: Fundamentals (12th Edition)',
            author: 'Cay S. Horstmann',
            studentId: 'stu-001',
            studentName: 'Aarav Mehta',
            issuedDate: '2026-08-25',
            dueDate: '2026-09-15',
            status: 'ISSUED'
          }
        ];
      }

      const issues = localStorage.getItem('sathaye_campus_issues');
      if (issues) this.campusIssues = JSON.parse(issues);
      else {
        this.campusIssues = [
          {
            id: 'iss-501',
            title: 'Projector HDMI port flickering in Room 204',
            category: 'Equipment',
            description: 'The overhead ceiling projector loses signal intermittently during mathematics lectures.',
            locationId: 'loc-room-204',
            locationName: 'Room 204 - Mathematics Hall',
            reportedByUserId: 'fac-001',
            reportedByName: 'Prof. S. R. Joshi',
            reportedByRole: 'FACULTY',
            status: 'In Progress',
            priority: 'Medium',
            createdAt: '2026-09-06T10:15:00Z',
            assignedTo: 'IT Maintenance Team'
          },
          {
            id: 'iss-502',
            title: 'Water cooler drain clog near Gymkhana',
            category: 'Plumbing',
            description: 'Slow drainage causing minor puddle on synthetic walkway.',
            locationId: 'loc-sports-turf',
            locationName: 'Multi-Sport Synthetic Turf & Gymkhana',
            reportedByUserId: 'stu-001',
            reportedByName: 'Aarav Mehta',
            reportedByRole: 'STUDENT',
            status: 'Reported',
            priority: 'Low',
            createdAt: '2026-09-07T08:00:00Z'
          }
        ];
      }

      const lostFound = localStorage.getItem('sathaye_lost_found');
      if (lostFound) this.lostFoundItems = JSON.parse(lostFound);
      else {
        this.lostFoundItems = [
          {
            id: 'lf-01',
            type: 'FOUND',
            title: 'Blue Fastrack Scientific Calculator',
            category: 'Electronics',
            description: 'Found on bench in 2nd floor corridor outside Room 204 after 11 AM lecture.',
            location: 'Main Building, 2nd Floor Corridor',
            date: '2026-09-06',
            reportedBy: 'Security Staff Pawar',
            contact: 'Security Desk Gate 1',
            status: 'OPEN',
            imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=300'
          },
          {
            id: 'lf-02',
            type: 'LOST',
            title: 'Black Wildcraft College Backpack',
            category: 'Bags & Accessories',
            description: 'Contains B.Sc. IT Semester IV practical journal and blue water bottle.',
            location: 'Central Canteen or Reading Hall',
            date: '2026-09-06',
            reportedBy: 'Aarav Mehta (B.Sc. IT)',
            contact: '+91-9820-112233',
            status: 'OPEN',
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300',
            matchedItemId: 'lf-01',
            similarityScore: 35
          }
        ];
      }

      const assignments = localStorage.getItem('sathaye_assignments');
      if (assignments) this.assignments = JSON.parse(assignments);
      else {
        this.assignments = [
          {
            id: 'asg-01',
            title: 'Assignment 2: Java Multithreading & Concurrency',
            description: 'Implement producer-consumer problem with blocking queues and test with 4 consumer threads.',
            subject: 'Core Java & OOP Concepts',
            department: 'B.Sc. IT',
            facultyId: 'fac-010',
            facultyName: 'Prof. Rohan Desai',
            deadline: '2026-09-18',
            submissionsCount: 48,
            totalStudents: 60,
            createdAt: '2026-09-04'
          },
          {
            id: 'asg-02',
            title: 'Statistical Hypothesis Testing: Chi-Square Practical',
            description: 'Analyze sample dataset for independence of attributes and calculate p-values.',
            subject: 'Computer Oriented Statistical Techniques',
            department: 'Mathematics',
            facultyId: 'fac-001',
            facultyName: 'Prof. S. R. Joshi',
            deadline: '2026-09-22',
            submissionsCount: 32,
            totalStudents: 60,
            createdAt: '2026-09-05'
          }
        ];
      }

      const notices = localStorage.getItem('sathaye_notifications');
      if (notices) this.notifications = JSON.parse(notices);
      else {
        this.notifications = [
          {
            id: 'notif-1',
            title: 'Next Class Reminder',
            message: 'Computer Oriented Statistical Techniques begins at 10:45 AM in Room 204.',
            type: 'class',
            timestamp: 'Just now',
            read: false,
            linkUrl: '/map?target=loc-room-204',
            linkAction: 'Navigate Me'
          },
          {
            id: 'notif-2',
            title: 'Canteen Order Status Update',
            message: 'Order #42 is now PREPARING! Estimated ready time: 5 minutes.',
            type: 'canteen',
            timestamp: '5m ago',
            read: false,
            linkUrl: '/canteen'
          },
          {
            id: 'notif-3',
            title: 'Library Due Date Notice',
            message: 'Book "Core Java: Fundamentals" is due on 15-Sep-2026.',
            type: 'library',
            timestamp: '1h ago',
            read: true,
            linkUrl: '/library'
          },
          {
            id: 'notif-4',
            title: 'Annual Cultural Fest - Saptarang 2026',
            message: 'Auditions for inter-collegiate street play and dance are open at Auditorium.',
            type: 'event',
            timestamp: '1d ago',
            read: true,
            linkUrl: '/events'
          }
        ];
      }

      const storedAssets = localStorage.getItem('sathaye_assets');
      if (storedAssets) this.assets = JSON.parse(storedAssets);

      const storedMnt = localStorage.getItem('sathaye_maintenance_tickets');
      if (storedMnt) this.maintenanceTickets = JSON.parse(storedMnt);

      const storedLogs = localStorage.getItem('sathaye_audit_logs');
      if (storedLogs) this.auditLogs = JSON.parse(storedLogs);

      const storedDids = localStorage.getItem('sathaye_digital_ids');
      if (storedDids) this.digitalIds = JSON.parse(storedDids);

      const storedLocs = localStorage.getItem('sathaye_locations');
      if (storedLocs) this.locations = JSON.parse(storedLocs);

      const storedUsers = localStorage.getItem('sathaye_all_users');
      if (storedUsers) this.users = JSON.parse(storedUsers);

    } catch (e) {
      console.error('Failed to initialize campus store from storage', e);
    }
  }

  private saveToStorage(): void {
    try {
      if (this.currentUser) {
        localStorage.setItem('sathaye_auth_user', JSON.stringify(this.currentUser));
      }
      localStorage.setItem('sathaye_canteen_orders', JSON.stringify(this.canteenOrders));
      localStorage.setItem('sathaye_library_borrowings', JSON.stringify(this.libraryBorrowings));
      localStorage.setItem('sathaye_campus_issues', JSON.stringify(this.campusIssues));
      localStorage.setItem('sathaye_lost_found', JSON.stringify(this.lostFoundItems));
      localStorage.setItem('sathaye_assignments', JSON.stringify(this.assignments));
      localStorage.setItem('sathaye_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('sathaye_assets', JSON.stringify(this.assets));
      localStorage.setItem('sathaye_maintenance_tickets', JSON.stringify(this.maintenanceTickets));
      localStorage.setItem('sathaye_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('sathaye_digital_ids', JSON.stringify(this.digitalIds));
      localStorage.setItem('sathaye_locations', JSON.stringify(this.locations));
      localStorage.setItem('sathaye_all_users', JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  // --- AUTHENTICATION METHODS ---

  public login(username: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.user.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!account) {
      return { success: false, error: 'User account not found. Please check username.' };
    }

    const p = password.trim();
    const altPasswordMap: Record<string, string[]> = {
      'math.faculty01': ['Math@Sathaye2026!', 'MathFaculty@2026', 'DemoFaculty@123'],
      'physics.faculty01': ['Phys@Sathaye2026!', 'PhysFaculty@2026', 'DemoFaculty@123'],
      'chem.faculty01': ['Chem@Sathaye2026!', 'ChemFaculty@2026', 'DemoFaculty@123'],
      'micro.faculty01': ['Micro@Sathaye2026!', 'MicroFaculty@2026', 'DemoFaculty@123'],
      'english.faculty01': ['Eng@Sathaye2026!', 'EngFaculty@2026', 'DemoFaculty@123'],
      'eco.faculty01': ['Eco@Sathaye2026!', 'EcoFaculty@2026', 'DemoFaculty@123'],
      'psych.faculty01': ['Psych@Sathaye2026!', 'PsychFaculty@2026', 'DemoFaculty@123'],
      'commerce.faculty01': ['Comm@Sathaye2026!', 'CommFaculty@2026', 'DemoFaculty@123'],
      'accounts.faculty01': ['Accts@Sathaye2026!', 'AccFaculty@2026', 'DemoFaculty@123'],
      'it.faculty01': ['IT@Sathaye2026!', 'ItFaculty@2026', 'DemoFaculty@123'],
      'canteen@123': ['Canteen@1234'],
      'librarymanagement@123': ['library@123'],
      'demo.student': ['DemoStudent@123'],
      'demo.admin': ['DemoAdmin@123']
    };

    const uname = account.user.username.toLowerCase();
    const allowed = [account.passwordHash, ...(altPasswordMap[uname] || [])];

    if (!allowed.includes(p)) {
      return { success: false, error: 'Incorrect password for demo account.' };
    }

    this.currentUser = account.user;
    localStorage.setItem('demo_role', account.user.role.toLowerCase());
    this.notify();
    return { success: true, user: account.user };
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem('sathaye_auth_user');
    localStorage.removeItem('demo_role');
    this.notify();
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile | null): void {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('sathaye_auth_user', JSON.stringify(user));
      localStorage.setItem('demo_role', user.role.toLowerCase());
    } else {
      localStorage.removeItem('sathaye_auth_user');
      localStorage.removeItem('demo_role');
    }
    this.notify();
  }

  public getTimetableForRoom(roomCode: string): ClassScheduleItem[] {
    const clean = roomCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    return STUDENT_SCHEDULE.filter(s => {
      const sRoom = (s.room || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const sId = (s.roomId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return sRoom.includes(clean) || clean.includes(sRoom) || sId.includes(clean) || clean.includes(sId);
    });
  }

  public switchDemoAccount(username: string): boolean {
    const account = DEMO_ACCOUNTS.find(a => a.user.username === username);
    if (account) {
      this.currentUser = account.user;
      localStorage.setItem('demo_role', account.user.role.toLowerCase());
      this.notify();
      return true;
    }
    return false;
  }

  // --- MAP & NAVIGATION ---

  public getBuildings(): CampusBuilding[] {
    return CAMPUS_BUILDINGS;
  }

  public getLocations(): CampusLocation[] {
    return this.locations;
  }

  public getLocationById(id: string): CampusLocation | undefined {
    return this.locations.find(loc => loc.id === id);
  }

  public searchLocations(query: string): CampusLocation[] {
    const q = query.toLowerCase().trim();
    if (!q) return CAMPUS_LOCATIONS;
    return CAMPUS_LOCATIONS.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.buildingName.toLowerCase().includes(q) ||
      (l.department && l.department.toLowerCase().includes(q)) ||
      l.type.toLowerCase().includes(q)
    );
  }

  public calculateRoute(fromId: string, toId: string, wheelchairOnly: boolean = false): NavigationRoute | null {
    const from = this.getLocationById(fromId) || CAMPUS_LOCATIONS[CAMPUS_LOCATIONS.length - 2]; // default entrance
    const to = this.getLocationById(toId);
    if (!to) return null;

    // Optical distance based on coordinates
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    // Scale 1 px ~ 0.5 meter
    const distanceMeters = Math.max(25, Math.round(distPx * 0.45));
    const durationMinutes = Math.max(1, Math.ceil(distanceMeters / 65)); // 65 m/min brisk walk

    const steps: string[] = [];
    if (from.id === to.id) {
      steps.push(`You are already at ${to.name}.`);
    } else {
      steps.push(`Start from ${from.name} (${from.buildingName}, ${from.floorLabel}).`);
      
      if (from.buildingId !== to.buildingId) {
        if (wheelchairOnly) {
          steps.push(`Take the barrier-free ground exit ramp towards Central Quadrangle.`);
          steps.push(`Cross along paved illuminated walkway to ${to.buildingName} accessible entrance.`);
        } else {
          steps.push(`Exit ${from.buildingName} and walk across the central campus quadrangle.`);
          steps.push(`Enter ${to.buildingName} via main doorway.`);
        }
      }

      if (to.floorNumber > 0) {
        if (wheelchairOnly || to.buildingId === 'bldg-main' || to.buildingId === 'bldg-it') {
          steps.push(`Use ${to.buildingName} Central Elevator to ascend to ${to.floorLabel}.`);
        } else {
          steps.push(`Take the staircase to ${to.floorLabel}.`);
        }
      }

      steps.push(`Proceed down the corridor to ${to.name} (${to.code}).`);
    }

    // Interpolate path for visualization
    const pathPoints = [
      { x: from.x, y: from.y },
      { x: (from.x + to.x) / 2 + (from.buildingId !== to.buildingId ? 30 : 0), y: (from.y + to.y) / 2 },
      { x: to.x, y: to.y }
    ];

    return {
      fromLocation: from,
      toLocation: to,
      distanceMeters,
      durationMinutes,
      isWheelchairAccessible: from.isAccessible && to.isAccessible,
      steps,
      pathPoints
    };
  }

  // --- ACADEMICS (STUDENT & FACULTY) ---

  public getStudentSchedule(): ClassScheduleItem[] {
    return STUDENT_SCHEDULE;
  }

  public getNextClass(): ClassScheduleItem | null {
    return STUDENT_SCHEDULE.find(s => s.isNext) || STUDENT_SCHEDULE[0] || null;
  }

  // Faculty data isolation: ONLY returns data matching authenticated facultyId
  public getFacultySchedule(facultyId?: string): ClassScheduleItem[] {
    const facId = facultyId || this.currentUser?.facultyId || this.currentUser?.id;
    if (!facId) return [];
    return STUDENT_SCHEDULE.filter(s => s.facultyId === facId);
  }

  public getAssignments(facultyId?: string): Assignment[] {
    if (facultyId) {
      return this.assignments.filter(a => a.facultyId === facultyId);
    }
    return this.assignments;
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount'>): Assignment {
    const newAsg: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      submissionsCount: 0
    };
    this.assignments.unshift(newAsg);

    // Trigger notification to students
    this.addNotification({
      title: `New Assignment: ${newAsg.title}`,
      message: `${newAsg.subject} assignment has been posted by ${newAsg.facultyName}. Due date: ${newAsg.deadline}`,
      type: 'assignment',
      targetRole: 'STUDENT',
      linkUrl: '/portal'
    });

    this.notify();
    return newAsg;
  }

  public markAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const existingIndex = this.attendanceRecords.findIndex(
      r => r.studentId === record.studentId && r.classId === record.classId && r.date === record.date
    );

    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };

    if (existingIndex >= 0) {
      this.attendanceRecords[existingIndex] = newRecord;
    } else {
      this.attendanceRecords.push(newRecord);
    }

    if (record.status === 'Absent') {
      this.addNotification({
        userId: record.studentId,
        targetRole: 'STUDENT',
        title: 'Attendance Alert',
        message: `You were marked Absent for ${record.subject} on ${record.date}.`,
        type: 'attendance'
      });
    }

    this.notify();
    return newRecord;
  }

  public publishAnnouncement(announcement: Omit<Announcement, 'id'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`
    };
    this.announcements.unshift(newAnn);

    this.addNotification({
      title: `Faculty Announcement: ${newAnn.title}`,
      message: `${newAnn.message} (From: ${newAnn.facultyName}, ${newAnn.targetDepartment})`,
      type: 'alert',
      targetRole: 'STUDENT',
      linkUrl: '/portal'
    });

    this.notify();
    return newAnn;
  }

  public getAnnouncements(): Announcement[] {
    return this.announcements;
  }

  // --- CANTEEN ---

  public getCanteenItems(): CanteenItem[] {
    return this.canteenItems;
  }

  public updateCanteenItemAvailability(itemId: string, isAvailable: boolean): void {
    const item = this.canteenItems.find(i => i.id === itemId);
    if (item) {
      item.isAvailable = isAvailable;
      this.notify();
    }
  }

  public getCanteenOrders(): CanteenOrder[] {
    return this.canteenOrders;
  }

  public getOrdersForStudent(studentId: string): CanteenOrder[] {
    return this.canteenOrders.filter(o => o.studentId === studentId);
  }

  public placeCanteenOrder(items: { itemId: string; name: string; price: number; quantity: number }[]): CanteenOrder {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const token = Math.floor(10 + Math.random() * 90);

    const order: CanteenOrder = {
      id: `ord-${Date.now()}`,
      studentId: this.currentUser?.id || 'stu-001',
      studentName: this.currentUser?.name || 'Aarav Mehta',
      items,
      totalAmount: total,
      status: 'CONFIRMED',
      tokenNumber: token,
      estimatedTime: '8-10 mins',
      createdAt: new Date().toISOString(),
      pickupSlot: 'Counter 1'
    };

    this.canteenOrders.unshift(order);

    this.addNotification({
      userId: order.studentId,
      targetRole: 'STUDENT',
      title: `Canteen Order Placed (Token #${token})`,
      message: `Your food order of ₹${total} has been confirmed. Current queue position: #3.`,
      type: 'canteen',
      linkUrl: '/canteen'
    });

    this.notify();
    return order;
  }

  public updateOrderStatus(orderId: string, status: CanteenOrder['status']): void {
    const order = this.canteenOrders.find(o => o.id === orderId);
    if (!order) return;

    order.status = status;

    if (status === 'PREPARING') {
      this.addNotification({
        userId: order.studentId,
        targetRole: 'STUDENT',
        title: `Canteen Order #${order.tokenNumber} is Preparing`,
        message: 'The kitchen has started preparing your order. Estimated time: 4 minutes.',
        type: 'canteen',
        linkUrl: '/canteen'
      });
    } else if (status === 'READY') {
      this.addNotification({
        userId: order.studentId,
        targetRole: 'STUDENT',
        title: `Food Ready for Pickup! (Token #${order.tokenNumber})`,
        message: `Your order is ready at ${order.pickupSlot || 'Counter 1'}. Please collect your tray.`,
        type: 'canteen',
        linkUrl: '/canteen',
        linkAction: 'Navigate to Canteen'
      });
    }

    this.notify();
  }

  // --- LIBRARY ---

  public getLibraryBooks(): LibraryBook[] {
    return this.libraryBooks;
  }

  public getLibraryBorrowings(): LibraryBorrowing[] {
    return this.libraryBorrowings;
  }

  public getBorrowingsForStudent(studentId: string): LibraryBorrowing[] {
    return this.libraryBorrowings.filter(b => b.studentId === studentId);
  }

  public requestBookBorrow(bookId: string): LibraryBorrowing {
    const book = this.libraryBooks.find(b => b.id === bookId);
    const newBorrow: LibraryBorrowing = {
      id: `bor-${Date.now()}`,
      bookId,
      bookTitle: book?.title || 'Library Book',
      author: book?.author || 'Author',
      studentId: this.currentUser?.id || 'stu-001',
      studentName: this.currentUser?.name || 'Aarav Mehta',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'REQUESTED'
    };

    this.libraryBorrowings.unshift(newBorrow);

    this.addNotification({
      title: `Library Book Requested`,
      message: `Request for "${newBorrow.bookTitle}" received. You can collect it once approved.`,
      type: 'library',
      userId: newBorrow.studentId
    });

    this.notify();
    return newBorrow;
  }

  public updateBorrowingStatus(borrowingId: string, status: LibraryBorrowing['status']): void {
    const borrowing = this.libraryBorrowings.find(b => b.id === borrowingId);
    if (!borrowing) return;

    borrowing.status = status;

    if (status === 'APPROVED' || status === 'ISSUED') {
      this.addNotification({
        userId: borrowing.studentId,
        targetRole: 'STUDENT',
        title: `Book Issued: ${borrowing.bookTitle}`,
        message: `Your book has been approved. Due date is ${borrowing.dueDate}.`,
        type: 'library'
      });
    }

    this.notify();
  }

  public reportLibraryIssue(issue: Omit<LibraryIssue, 'id' | 'createdAt' | 'visibleInAdmin'>): LibraryIssue {
    const newIssue: LibraryIssue = {
      ...issue,
      id: `lib-iss-${Date.now()}`,
      createdAt: new Date().toISOString(),
      visibleInAdmin: true // Synced canonically to Admin
    };

    this.libraryIssues.unshift(newIssue);

    // Also register as a general campus issue so Admin sees it in Library Issues
    this.createCampusIssue({
      title: `[Library] ${newIssue.title}`,
      category: 'Equipment',
      description: newIssue.description,
      locationId: 'loc-library-central',
      locationName: 'Sathaye Central Library',
      reportedByUserId: newIssue.studentId,
      reportedByName: newIssue.studentName,
      reportedByRole: 'STUDENT',
      priority: 'Medium'
    });

    this.notify();
    return newIssue;
  }

  public getLibraryIssues(): LibraryIssue[] {
    return this.libraryIssues;
  }

  public getLibrarySeatStatus(): { total: number; occupied: number; zones: LibrarySeatZone[] } {
    const total = this.readingZones.reduce((sum, z) => sum + z.total, 0);
    const occupied = this.readingZones.reduce((sum, z) => sum + z.occupied, 0);
    return { total, occupied, zones: this.readingZones };
  }

  // --- CAMPUS SUPPORT & ISSUES ---

  public getCampusIssues(): CampusIssue[] {
    return this.campusIssues;
  }

  public createCampusIssue(data: Omit<CampusIssue, 'id' | 'createdAt' | 'status'>): CampusIssue {
    const newIssue: CampusIssue = {
      ...data,
      id: `iss-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Reported'
    };

    this.campusIssues.unshift(newIssue);

    this.addNotification({
      title: `Maintenance Ticket #${newIssue.id.slice(-4)} Created`,
      message: `Report for ${newIssue.category} issue at ${newIssue.locationName} has been logged.`,
      type: 'maintenance',
      userId: newIssue.reportedByUserId
    });

    this.notify();
    return newIssue;
  }

  public updateIssueStatus(issueId: string, status: CampusIssue['status'], assignedTo?: string): void {
    const issue = this.campusIssues.find(i => i.id === issueId);
    if (!issue) return;

    issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;
    if (status === 'Resolved') issue.resolvedAt = new Date().toISOString();

    this.addNotification({
      userId: issue.reportedByUserId,
      title: `Ticket #${issue.id.slice(-4)} Updated: ${status}`,
      message: `Your issue regarding "${issue.title}" is now ${status}.`,
      type: 'maintenance'
    });

    this.notify();
  }

  // --- LOST & FOUND ---

  public getLostFoundItems(): LostFoundItem[] {
    return this.lostFoundItems;
  }

  public reportLostFoundItem(item: Omit<LostFoundItem, 'id' | 'status'>): LostFoundItem {
    // Simple algorithmic similarity check with existing items
    let matchedItem: LostFoundItem | undefined;
    let maxSimilarity = 0;

    for (const existing of this.lostFoundItems) {
      if (existing.type !== item.type && existing.status === 'OPEN') {
        let score = 0;
        if (existing.category.toLowerCase() === item.category.toLowerCase()) score += 45;
        const itemWords = item.title.toLowerCase().split(' ');
        const existWords = existing.title.toLowerCase().split(' ');
        const commonWords = itemWords.filter(w => existWords.includes(w) && w.length > 3);
        score += commonWords.length * 25;
        if (score > maxSimilarity) {
          maxSimilarity = Math.min(score, 94);
          matchedItem = existing;
        }
      }
    }

    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      status: 'OPEN',
      matchedItemId: matchedItem?.id,
      similarityScore: maxSimilarity > 40 ? maxSimilarity : undefined
    };

    this.lostFoundItems.unshift(newItem);

    if (newItem.similarityScore && matchedItem) {
      this.addNotification({
        title: `Potential Lost & Found Match (${newItem.similarityScore}% Similarity)!`,
        message: `An item matching "${newItem.title}" was reported: "${matchedItem.title}".`,
        type: 'lost_found',
        linkUrl: '/support'
      });
    }

    this.notify();
    return newItem;
  }

  // --- NOTIFICATIONS ---

  public getNotifications(): CampusNotification[] {
    const role = this.currentUser?.role;
    const userId = this.currentUser?.id;

    return this.notifications.filter(n => {
      if (n.userId && n.userId === userId) return true;
      if (n.targetRole && (n.targetRole === 'ALL' || n.targetRole === role)) return true;
      if (!n.userId && !n.targetRole) return true;
      return false;
    });
  }

  public addNotification(notif: Omit<CampusNotification, 'id' | 'timestamp' | 'read'>): CampusNotification {
    const newNotif: CampusNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };
    this.notifications.unshift(newNotif);
    this.notify();
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.notify();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  public getTimetable(): ClassScheduleItem[] {
    return this.getStudentSchedule();
  }

  public getCampusEvents(): CampusEvent[] {
    return this.events;
  }

  public registerForEvent(eventId: string, studentId?: string): boolean {
    const ev = this.events.find(e => e.id === eventId);
    if (ev) {
      ev.registeredCount = (ev.registeredCount || 0) + 1;
      this.notify();
      return true;
    }
    return false;
  }

  public updateCanteenOrderStatus(orderId: string, status: CanteenOrder['status']): void {
    this.updateOrderStatus(orderId, status);
  }

  public toggleCanteenItemAvailability(itemId: string, isAvailable: boolean): void {
    this.updateCanteenItemAvailability(itemId, isAvailable);
  }

  public addCanteenItem(item: Omit<CanteenItem, 'id'>): CanteenItem {
    const newItem: CanteenItem = {
      ...item,
      id: `can-${Date.now()}`
    };
    this.canteenItems.push(newItem);
    this.notify();
    return newItem;
  }

  public approveBookBorrow(borrowId: string): void {
    const b = this.libraryBorrowings.find(item => item.id === borrowId);
    if (b) {
      b.status = 'ISSUED';
      const bk = this.libraryBooks.find(item => item.id === b.bookId);
      if (bk && bk.availableCopies > 0) bk.availableCopies--;
      this.saveToStorage();
      this.notify();
    }
  }

  public returnBook(borrowId: string): void {
    const b = this.libraryBorrowings.find(item => item.id === borrowId);
    if (b) {
      b.status = 'RETURNED';
      const bk = this.libraryBooks.find(item => item.id === b.bookId);
      if (bk) bk.availableCopies = Math.min(bk.totalCopies, bk.availableCopies + 1);
      this.saveToStorage();
      this.notify();
    }
  }

  public resolveLibraryIssue(issueId: string): void {
    const iss = this.libraryIssues.find(i => i.id === issueId);
    if (iss) {
      iss.status = 'Resolved';
      this.notify();
    }
  }

  public addLibraryBook(book: Omit<LibraryBook, 'id'>): LibraryBook {
    const newBook: LibraryBook = {
      ...book,
      id: `book-${Date.now()}`
    };
    this.libraryBooks.push(newBook);
    this.notify();
    return newBook;
  }

  public updateBookShelf(bookId: string, shelf: string): void {
    const b = this.libraryBooks.find(bk => bk.id === bookId);
    if (b) {
      b.shelfLocation = shelf;
      this.notify();
    }
  }

  public updateReadingZoneOccupancy(zoneName: string, count: number): void {
    const z = this.readingZones.find(item => item.name === zoneName);
    if (z) {
      z.occupied = count;
      this.notify();
    }
  }

  public switchRole(role: UserRole): UserProfile {
    let target = DEMO_ACCOUNTS.find(a => a.user.role === role)?.user;
    if (!target) {
      target = {
        id: `usr-${role.toLowerCase()}`,
        username: `${role.toLowerCase()}.user`,
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} Desk`,
        role: role,
        department: 'Operations',
        email: `${role.toLowerCase()}@sathaye.edu.in`
      };
    }
    this.currentUser = target;
    this.saveToStorage();
    this.notify();
    return target;
  }

  public getNotificationsForRole(role: UserRole): CampusNotification[] {
    return this.notifications.filter(n => {
      if (n.targetRole && (n.targetRole === 'ALL' || n.targetRole === role)) return true;
      if (!n.targetRole) return true;
      return false;
    });
  }

  // --- PROMPT 3: ADMIN COMMAND CENTER, MAINTENANCE, AUDIT & ANALYTICS ---

  public getCampusStatus() {
    const openComplaints = this.campusIssues.filter(i => i.status !== 'Resolved');
    const emergencyIssues = openComplaints.filter(i => i.priority === 'Emergency');
    const highIssues = openComplaints.filter(i => i.priority === 'High');
    const criticalNotifs = this.notifications.filter(n => n.type === 'emergency' || n.type === 'alert');

    let status: 'NORMAL' | 'ATTENTION REQUIRED' | 'CRITICAL' = 'NORMAL';
    let reason = 'All campus subsystems, power distribution, and learning halls operational within nominal parameters.';
    let securityStatus: 'Normal' | 'Attention' | 'Emergency' = 'Normal';

    if (emergencyIssues.length > 0 || criticalNotifs.some(n => n.type === 'emergency')) {
      status = 'CRITICAL';
      securityStatus = 'Emergency';
      reason = 'Critical emergency condition reported! Immediate administrative intervention required.';
    } else if (highIssues.length > 0 || openComplaints.length >= 4) {
      status = 'ATTENTION REQUIRED';
      securityStatus = 'Attention';
      reason = `${openComplaints.length} open maintenance/support grievances pending resolution across campus facilities.`;
    }

    const totalSeats = this.readingZones.reduce((acc, z) => acc + z.total, 0);
    const occupiedSeats = this.readingZones.reduce((acc, z) => acc + z.occupied, 0);
    const occupancyPercent = Math.round((occupiedSeats / Math.max(1, totalSeats)) * 100);

    return {
      status,
      reason,
      studentCount: 5240,
      facultyCount: 185,
      activeClassesCount: 42,
      occupancyPercent: Math.min(94, Math.max(45, occupancyPercent + 22)),
      openComplaintsCount: openComplaints.length,
      activeAlertsCount: criticalNotifs.length,
      eventsCount: this.events.length,
      energyKWh: 1420,
      waterKL: 86.4,
      wasteKg: 180,
      securityStatus
    };
  }

  // Location / Room Management
  public updateLocation(locationId: string, updates: Partial<CampusLocation>): void {
    const idx = this.locations.findIndex(l => l.id === locationId);
    if (idx !== -1) {
      this.locations[idx] = { ...this.locations[idx], ...updates };
      this.saveToStorage();
      this.notify();
    }
  }

  public addLocation(loc: Omit<CampusLocation, 'id'>): CampusLocation {
    const newLoc: CampusLocation = {
      ...loc,
      id: `loc-${Date.now()}`
    };
    this.locations.push(newLoc);
    this.saveToStorage();
    this.notify();
    return newLoc;
  }

  // Assets Management
  public getAssets(): CampusAsset[] {
    return this.assets;
  }

  public addAsset(asset: Omit<CampusAsset, 'id'>): CampusAsset {
    const newAsset: CampusAsset = {
      ...asset,
      id: `AST-${Date.now().toString().slice(-4)}`
    };
    this.assets.push(newAsset);
    this.addAuditLog({
      actorName: this.currentUser?.name || 'Administrator',
      actorRole: this.currentUser?.role || 'ADMIN',
      action: 'CREATE_ASSET',
      entity: 'CampusAsset',
      entityId: newAsset.id,
      newValue: `${newAsset.name} (${newAsset.category})`
    });
    this.saveToStorage();
    this.notify();
    return newAsset;
  }

  public updateAsset(assetId: string, updates: Partial<CampusAsset>): void {
    const idx = this.assets.findIndex(a => a.id === assetId);
    if (idx !== -1) {
      const prev = this.assets[idx];
      this.assets[idx] = { ...prev, ...updates };
      this.addAuditLog({
        actorName: this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: 'UPDATE_ASSET',
        entity: 'CampusAsset',
        entityId: assetId,
        previousValue: `Status: ${prev.status}`,
        newValue: `Status: ${updates.status || prev.status}`
      });
      this.saveToStorage();
      this.notify();
    }
  }

  // Technicians
  public getTechnicians(): CampusTechnician[] {
    return this.technicians;
  }

  // Maintenance Tickets
  public getMaintenanceTickets(): MaintenanceTicket[] {
    return this.maintenanceTickets;
  }

  public createMaintenanceTicket(ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>, adminActor?: string): MaintenanceTicket {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MNT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.maintenanceTickets.unshift(newTicket);
    this.addAuditLog({
      actorName: adminActor || this.currentUser?.name || 'Administrator',
      actorRole: this.currentUser?.role || 'ADMIN',
      action: 'CREATE_MAINTENANCE_TICKET',
      entity: 'MaintenanceTicket',
      entityId: newTicket.id,
      newValue: `${newTicket.title} -> Assigned: ${newTicket.technician}`
    });

    // Cross-module notification
    this.addNotification({
      title: `Maintenance Ticket Created: ${newTicket.id}`,
      message: `${newTicket.title} assigned to ${newTicket.technician} at ${newTicket.locationName}.`,
      type: 'maintenance',
      targetRole: 'ALL'
    });

    this.saveToStorage();
    this.notify();
    return newTicket;
  }

  public updateMaintenanceTicket(ticketId: string, updates: Partial<MaintenanceTicket>, adminActor?: string): void {
    const idx = this.maintenanceTickets.findIndex(t => t.id === ticketId);
    if (idx !== -1) {
      const prev = this.maintenanceTickets[idx];
      this.maintenanceTickets[idx] = { ...prev, ...updates };

      this.addAuditLog({
        actorName: adminActor || this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: 'UPDATE_MAINTENANCE_TICKET',
        entity: 'MaintenanceTicket',
        entityId: ticketId,
        previousValue: `Status: ${prev.status}`,
        newValue: `Status: ${updates.status || prev.status}`
      });

      if (updates.status === 'Completed' || updates.status === 'Verified') {
        this.addNotification({
          title: `Maintenance Verified: ${prev.title}`,
          message: `The ticket at ${prev.locationName} has been marked as ${updates.status}.`,
          type: 'maintenance',
          targetRole: 'ALL'
        });
      }

      this.saveToStorage();
      this.notify();
    }
  }

  // Audit Logs
  public getAuditLogs(): AdminAuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(entry: Omit<AdminAuditLog, 'id' | 'timestamp'>): AdminAuditLog {
    const newLog: AdminAuditLog = {
      ...entry,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      })
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    this.saveToStorage();
    return newLog;
  }

  // Digital IDs
  public getDigitalIds(): DigitalCampusID[] {
    return this.digitalIds;
  }

  public getDigitalIdForUser(studentOrStaffId: string): DigitalCampusID | undefined {
    return this.digitalIds.find(d => 
      d.studentOrStaffId.toLowerCase() === studentOrStaffId.toLowerCase() ||
      d.id.toLowerCase() === studentOrStaffId.toLowerCase()
    );
  }

  public verifyDigitalId(token: string): { valid: boolean; idRecord?: DigitalCampusID; error?: string } {
    const cleanToken = token.trim();
    const match = this.digitalIds.find(d => d.qrToken === cleanToken || d.studentOrStaffId.toLowerCase() === cleanToken.toLowerCase());
    if (!match) {
      return { valid: false, error: 'Cryptographic QR token not recognized or record non-existent in Autonomous Registrar Database.' };
    }
    if (match.status !== 'Active') {
      return { valid: false, idRecord: match, error: `Credentials status is ${match.status.toUpperCase()}. Access restricted.` };
    }
    return { valid: true, idRecord: match };
  }

  // Enhanced Complaint Management Workflow
  public updateIssueWorkflow(
    issueId: string, 
    updates: { status?: CampusIssue['status']; priority?: CampusIssue['priority']; assignedTo?: string; note?: string },
    adminActor?: string
  ): void {
    const issue = this.campusIssues.find(i => i.id === issueId);
    if (issue) {
      const prevStatus = issue.status;
      const prevAssign = issue.assignedTo;
      if (updates.status) issue.status = updates.status;
      if (updates.priority) issue.priority = updates.priority;
      if (updates.assignedTo) issue.assignedTo = updates.assignedTo;
      if (updates.status === 'Resolved') issue.resolvedAt = new Date().toISOString();

      this.addAuditLog({
        actorName: adminActor || this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: 'UPDATE_COMPLAINT_WORKFLOW',
        entity: 'CampusIssue',
        entityId: issueId,
        previousValue: `Status: ${prevStatus}, Assigned: ${prevAssign || 'None'}`,
        newValue: `Status: ${issue.status}, Assigned: ${issue.assignedTo || 'None'}`
      });

      // Cross module notification to reporting user
      this.addNotification({
        title: `Grievance Status: ${issue.title}`,
        message: `Your reported complaint has been updated to "${issue.status}". Assigned: ${issue.assignedTo || 'Technician Queue'}.`,
        type: 'maintenance',
        targetRole: issue.reportedByRole
      });

      this.saveToStorage();
      this.notify();
    }
  }

  // Enhanced Lost & Found Claim Verification
  public verifyLostFoundClaim(itemId: string, approved: boolean, notes: string, adminActor?: string): void {
    const item = this.lostFoundItems.find(i => i.id === itemId);
    if (item) {
      const prev = item.status;
      item.status = approved ? 'RESOLVED' : 'OPEN';

      this.addAuditLog({
        actorName: adminActor || this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: approved ? 'APPROVE_LOST_FOUND_CLAIM' : 'REJECT_LOST_FOUND_CLAIM',
        entity: 'LostFoundItem',
        entityId: itemId,
        previousValue: `Status: ${prev}`,
        newValue: `Status: ${item.status} (${notes})`
      });

      this.addNotification({
        title: `Lost & Found Verification: ${item.title}`,
        message: approved 
          ? `Claim verified and approved by Administrator desk! Please collect your item from Gate 1 Security.`
          : `Claim could not be verified with current description proof. Contact Admin Support.`,
        type: 'lost_found',
        targetRole: 'ALL'
      });

      this.saveToStorage();
      this.notify();
    }
  }

  // Events Admin Management
  public createEvent(event: Omit<CampusEvent, 'id' | 'registeredCount'>, adminActor?: string): CampusEvent {
    const newEvent: CampusEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      registeredCount: 0
    };
    this.events.unshift(newEvent);

    this.addAuditLog({
      actorName: adminActor || this.currentUser?.name || 'Administrator',
      actorRole: this.currentUser?.role || 'ADMIN',
      action: 'PUBLISH_CAMPUS_EVENT',
      entity: 'CampusEvent',
      entityId: newEvent.id,
      newValue: `${newEvent.title} at ${newEvent.location}`
    });

    this.addNotification({
      title: `New Campus Event: ${newEvent.title}`,
      message: `Registrations are open for ${newEvent.title} scheduled on ${newEvent.date} at ${newEvent.location}.`,
      type: 'event',
      targetRole: 'ALL'
    });

    this.saveToStorage();
    this.notify();
    return newEvent;
  }

  public updateEvent(eventId: string, updates: Partial<CampusEvent>, adminActor?: string): void {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      this.events[idx] = { ...this.events[idx], ...updates };
      this.addAuditLog({
        actorName: adminActor || this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: 'UPDATE_EVENT',
        entity: 'CampusEvent',
        entityId: eventId,
        newValue: `Event details updated: ${this.events[idx].title}`
      });
      this.saveToStorage();
      this.notify();
    }
  }

  public cancelEvent(eventId: string, adminActor?: string): void {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      const title = this.events[idx].title;
      this.events.splice(idx, 1);
      this.addAuditLog({
        actorName: adminActor || this.currentUser?.name || 'Administrator',
        actorRole: this.currentUser?.role || 'ADMIN',
        action: 'CANCEL_EVENT',
        entity: 'CampusEvent',
        entityId: eventId,
        previousValue: title,
        newValue: 'Cancelled and Removed'
      });
      this.saveToStorage();
      this.notify();
    }
  }

  // Campus User Management
  public getAllUsers(): UserProfile[] {
    return this.users;
  }

  public updateUserRole(userId: string, newRole: UserRole): void {
    const u = this.users.find(user => user.id === userId);
    if (u) {
      const prev = u.role;
      u.role = newRole;
      this.addAuditLog({
        actorName: this.currentUser?.name || 'Administrator',
        actorRole: 'ADMIN',
        action: 'CHANGE_USER_ROLE',
        entity: 'UserProfile',
        entityId: userId,
        previousValue: `Role: ${prev}`,
        newValue: `Role: ${newRole}`
      });
      this.saveToStorage();
      this.notify();
    }
  }

  // Analytics Dynamic Aggregation
  public getAnalytics(range: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly') {
    const multiplier = range === 'Daily' ? 1 : range === 'Weekly' ? 7 : range === 'Monthly' ? 30 : 365;

    return {
      range,
      occupancyData: [
        { label: '08:00', occupancy: 42 },
        { label: '10:00', occupancy: 88 },
        { label: '12:00', occupancy: 94 },
        { label: '14:00', occupancy: 78 },
        { label: '16:00', occupancy: 62 },
        { label: '18:00', occupancy: 35 }
      ],
      classroomUtilization: [
        { name: 'Room 204 (Math)', rate: 86, department: 'Mathematics' },
        { name: 'Room 102 (Comm)', rate: 92, department: 'Commerce' },
        { name: 'Room 301 (Arts)', rate: 74, department: 'Arts & Lang' },
        { name: 'Room 205 (Sci)', rate: 81, department: 'Science' }
      ],
      labUtilization: [
        { name: 'IT Lab 1', rate: 94, category: 'Computing' },
        { name: 'Chemistry Lab', rate: 78, category: 'Research' },
        { name: 'Physics Lab', rate: 72, category: 'Optics' },
        { name: 'Microbiology Lab', rate: 85, category: 'Bio-Safety' }
      ],
      utilities: {
        energyKWh: Math.round(1420 * multiplier * 0.95),
        waterKL: Math.round(86.4 * multiplier * 0.92),
        solarGeneratedKWh: Math.round(410 * multiplier * 0.9),
        wasteSegregatedKg: Math.round(180 * multiplier * 0.98)
      },
      complaintResolutionAvgHours: 4.8,
      parkingUtilizationRate: 82,
      canteenPeakCrowdRate: 91,
      libraryCheckoutsCount: 142 * multiplier
    };
  }

  // Canonical Aliases & Utility methods for Admin Command Center
  public getEvents(): CampusEvent[] {
    return this.events;
  }

  public getMenuItems(): CanteenItem[] {
    return this.canteenItems;
  }

  public getOrders(): CanteenOrder[] {
    return this.canteenOrders;
  }

  public getBooks(): LibraryBook[] {
    return this.libraryBooks;
  }

  public updateMenuItem(itemId: string, updates: Partial<CanteenItem>): void {
    const item = this.canteenItems.find(i => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.saveToStorage();
      this.notify();
    }
  }

  public updateUser(userId: string, updates: Partial<UserProfile>): void {
    const u = this.users.find(user => user.id === userId);
    if (u) {
      Object.assign(u, updates);
      this.saveToStorage();
      this.notify();
    }
  }
}

export type MenuItem = CanteenItem;

export const campusStore = CampusStore.getInstance();
