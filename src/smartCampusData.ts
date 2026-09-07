// Smart Sathaye Campus Canonical Data Model & Demo Seed Data
// Context: Sathaye College (Autonomous), Vile Parle (East), Mumbai

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'faculty' | 'admin' | 'canteen' | 'library';
  email: string;
  avatar: string;
  department?: string;
  rollNumber?: string;
  program?: string;
  semester?: string;
  designation?: string;
  facultyId?: string;
  phone?: string;
}

// 10 Faculty Demo Accounts + Student + Admin + Canteen + Library
export const DEMO_USERS: Record<string, { user: UserProfile; pass: string }> = {
  // Student
  'demo.student': {
    user: {
      id: 'STU-2026-001',
      username: 'demo.student',
      name: 'Aarav Mehta',
      role: 'student',
      email: 'aarav.mehta@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      department: 'Information Technology',
      program: 'B.Sc. Information Technology',
      semester: 'Semester IV',
      rollNumber: 'TYIT-26-042',
      phone: '+91 98201 23456'
    },
    pass: 'DemoStudent@123'
  },
  // 10 Distinct Faculty Accounts
  'math.faculty01': {
    user: {
      id: 'FAC-MATH-01',
      username: 'math.faculty01',
      name: 'Dr. Ramesh Tendulkar',
      role: 'faculty',
      email: 'ramesh.math@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      department: 'Mathematics',
      designation: 'Head of Department & Professor',
      facultyId: 'FAC-MATH-01',
      phone: '+91 98200 11001'
    },
    pass: 'MathFaculty@2026'
  },
  'physics.faculty01': {
    user: {
      id: 'FAC-PHYS-01',
      username: 'physics.faculty01',
      name: 'Dr. Sunita Kulkarni',
      role: 'faculty',
      email: 'sunita.phys@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      department: 'Physics',
      designation: 'Associate Professor',
      facultyId: 'FAC-PHYS-01',
      phone: '+91 98200 11002'
    },
    pass: 'PhysFaculty@2026'
  },
  'chem.faculty01': {
    user: {
      id: 'FAC-CHEM-01',
      username: 'chem.faculty01',
      name: 'Dr. Anand Joshi',
      role: 'faculty',
      email: 'anand.chem@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      department: 'Chemistry',
      designation: 'Associate Professor & Lab Head',
      facultyId: 'FAC-CHEM-01',
      phone: '+91 98200 11003'
    },
    pass: 'ChemFaculty@2026'
  },
  'micro.faculty01': {
    user: {
      id: 'FAC-MICRO-01',
      username: 'micro.faculty01',
      name: 'Dr. Shalini Gokhale',
      role: 'faculty',
      email: 'shalini.micro@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      department: 'Microbiology',
      designation: 'Head of Department',
      facultyId: 'FAC-MICRO-01',
      phone: '+91 98200 11004'
    },
    pass: 'MicroFaculty@2026'
  },
  'english.faculty01': {
    user: {
      id: 'FAC-ENG-01',
      username: 'english.faculty01',
      name: 'Prof. Alok Deshpande',
      role: 'faculty',
      email: 'alok.eng@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      department: 'English',
      designation: 'Assistant Professor',
      facultyId: 'FAC-ENG-01',
      phone: '+91 98200 11005'
    },
    pass: 'EngFaculty@2026'
  },
  'eco.faculty01': {
    user: {
      id: 'FAC-ECO-01',
      username: 'eco.faculty01',
      name: 'Dr. Meera Iyer',
      role: 'faculty',
      email: 'meera.eco@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      department: 'Economics',
      designation: 'Associate Professor',
      facultyId: 'FAC-ECO-01',
      phone: '+91 98200 11006'
    },
    pass: 'EcoFaculty@2026'
  },
  'psych.faculty01': {
    user: {
      id: 'FAC-PSYCH-01',
      username: 'psych.faculty01',
      name: 'Dr. Radhika Sen',
      role: 'faculty',
      email: 'radhika.psych@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      department: 'Psychology',
      designation: 'Head of Department & Student Counselor',
      facultyId: 'FAC-PSYCH-01',
      phone: '+91 98200 11007'
    },
    pass: 'PsychFaculty@2026'
  },
  'commerce.faculty01': {
    user: {
      id: 'FAC-COMM-01',
      username: 'commerce.faculty01',
      name: 'Prof. Suresh Bhagat',
      role: 'faculty',
      email: 'suresh.comm@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      department: 'Commerce',
      designation: 'Head of Commerce Faculty',
      facultyId: 'FAC-COMM-01',
      phone: '+91 98200 11008'
    },
    pass: 'CommFaculty@2026'
  },
  'accounts.faculty01': {
    user: {
      id: 'FAC-ACC-01',
      username: 'accounts.faculty01',
      name: 'Dr. Nitin Ranade',
      role: 'faculty',
      email: 'nitin.acc@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      department: 'Accountancy',
      designation: 'Associate Professor & CA Mentor',
      facultyId: 'FAC-ACC-01',
      phone: '+91 98200 11009'
    },
    pass: 'AccFaculty@2026'
  },
  'it.faculty01': {
    user: {
      id: 'FAC-IT-01',
      username: 'it.faculty01',
      name: 'Dr. Priya Sharma',
      role: 'faculty',
      email: 'priya.sharma@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
      department: 'B.Sc. IT',
      designation: 'Coordinator - Information Technology',
      facultyId: 'FAC-IT-01',
      phone: '+91 98200 11010'
    },
    pass: 'ItFaculty@2026'
  },
  // Admin Account
  'demo.admin': {
    user: {
      id: 'ADM-2026-001',
      username: 'demo.admin',
      name: 'Prof. Sudhir Mhatre',
      role: 'admin',
      email: 'admin.office@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      designation: 'Campus Administrator & Dean of Affairs',
      phone: '+91 98200 99999'
    },
    pass: 'DemoAdmin@123'
  },
  // Canteen Role (Explicitly from Prompt 2)
  'canteen@123': {
    user: {
      id: 'CAN-2026-001',
      username: 'canteen@123',
      name: 'Ganesh Food Services (Campus Canteen)',
      role: 'canteen',
      email: 'canteen@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200',
      designation: 'Canteen Operations Lead',
      phone: '+91 98200 44444'
    },
    pass: 'Canteen@1234'
  },
  // Library Role (Explicitly from Prompt 2)
  'librarymanagement@123': {
    user: {
      id: 'LIB-2026-001',
      username: 'librarymanagement@123',
      name: 'Sathaye Central Library Desk',
      role: 'library',
      email: 'library@sathaye.edu.in',
      avatar: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=200',
      designation: 'Chief Librarian & Information Officer',
      phone: '+91 98200 55555'
    },
    pass: 'library@123'
  }
};

// Map Locations & Buildings (Sathaye College Campus layout)
export interface CampusLocation {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'library' | 'canteen' | 'auditorium' | 'sports' | 'admin' | 'medical' | 'washroom' | 'facility';
  buildingId: string;
  buildingName: string;
  floor: number;
  floorLabel: string;
  roomNumber?: string;
  x: number; // 0-100 normalized canvas coordinates for 2D floor plan rendering
  y: number;
  z: number;
  capacity?: number;
  department?: string;
  isAccessible: boolean;
  elevatorNearby: boolean;
  description: string;
  currentStatus: 'Available' | 'In Use' | 'Occupied' | 'Open' | 'Closed';
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-room-204',
    name: 'Lecture Room 204',
    type: 'classroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 2,
    floorLabel: '2nd Floor',
    roomNumber: '204',
    x: 42,
    y: 35,
    z: 2,
    capacity: 75,
    department: 'Mathematics & Science',
    isAccessible: true,
    elevatorNearby: true,
    description: 'Smart lecture hall with projector, acoustic treatment, and Wi-Fi access.',
    currentStatus: 'In Use'
  },
  {
    id: 'loc-room-402',
    name: 'Lecture Room 402',
    type: 'classroom',
    buildingId: 'bldg-it',
    buildingName: 'IT & Self-Finance Wing',
    floor: 4,
    floorLabel: '4th Floor',
    roomNumber: '402',
    x: 70,
    y: 30,
    z: 4,
    capacity: 65,
    department: 'B.Sc. IT',
    isAccessible: true,
    elevatorNearby: true,
    description: 'Dedicated room for Information Technology lectures and software seminars.',
    currentStatus: 'Available'
  },
  {
    id: 'loc-it-lab-1',
    name: 'IT Laboratory 1 (Advanced Computing)',
    type: 'lab',
    buildingId: 'bldg-it',
    buildingName: 'IT & Self-Finance Wing',
    floor: 3,
    floorLabel: '3rd Floor',
    roomNumber: 'Lab 301',
    x: 74,
    y: 38,
    z: 3,
    capacity: 45,
    department: 'B.Sc. IT & Computer Science',
    isAccessible: true,
    elevatorNearby: true,
    description: 'High-performance workstations configured with Ubuntu, Docker, and IoT kits.',
    currentStatus: 'In Use'
  },
  {
    id: 'loc-chem-lab',
    name: 'Chemistry Research Laboratory',
    type: 'lab',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 1,
    floorLabel: '1st Floor',
    roomNumber: 'Lab 105',
    x: 35,
    y: 45,
    z: 1,
    capacity: 40,
    department: 'Chemistry',
    isAccessible: true,
    elevatorNearby: true,
    description: 'Fume hoods, analytical spectrophotometers, and dedicated safety shower.',
    currentStatus: 'Available'
  },
  {
    id: 'loc-phys-lab',
    name: 'General & Optics Physics Lab',
    type: 'lab',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 1,
    floorLabel: '1st Floor',
    roomNumber: 'Lab 102',
    x: 30,
    y: 40,
    z: 1,
    capacity: 35,
    department: 'Physics',
    isAccessible: true,
    elevatorNearby: true,
    description: 'Darkroom optics equipment, spectrometers, and electronic workbench setups.',
    currentStatus: 'Available'
  },
  {
    id: 'loc-central-lib',
    name: 'Central Library & Reading Hall',
    type: 'library',
    buildingId: 'bldg-lib',
    buildingName: 'Sathaye Knowledge Resource Center',
    floor: 1,
    floorLabel: '1st Floor',
    roomNumber: 'Lib 100',
    x: 25,
    y: 65,
    z: 1,
    capacity: 220,
    isAccessible: true,
    elevatorNearby: true,
    description: 'Over 85,000 catalogued titles, digital JSTOR workstations, and silent study cubicles.',
    currentStatus: 'Open'
  },
  {
    id: 'loc-canteen',
    name: 'Sathaye College Student Canteen',
    type: 'canteen',
    buildingId: 'bldg-canteen',
    buildingName: 'Cafeteria & Dining Pavilion',
    floor: 0,
    floorLabel: 'Ground Floor',
    x: 60,
    y: 75,
    z: 0,
    capacity: 180,
    isAccessible: true,
    elevatorNearby: false,
    description: 'Hygienic subsidized multi-cuisine meals, fresh juices, and express tea counters.',
    currentStatus: 'Open'
  },
  {
    id: 'loc-auditorium',
    name: 'Kashinath Dhuru Auditorium',
    type: 'auditorium',
    buildingId: 'bldg-audi',
    buildingName: 'Auditorium Complex',
    floor: 0,
    floorLabel: 'Ground Floor',
    x: 50,
    y: 20,
    z: 0,
    capacity: 650,
    isAccessible: true,
    elevatorNearby: false,
    description: 'Acoustically engineered grand hall for annual fests, convocations, and symposiums.',
    currentStatus: 'Available'
  },
  {
    id: 'loc-sports-turf',
    name: 'Multi-Sport Synthetic Turf & Basketball Court',
    type: 'sports',
    buildingId: 'bldg-sports',
    buildingName: 'Sports Complex & Gymkhana',
    floor: 0,
    floorLabel: 'Ground Level',
    x: 82,
    y: 68,
    z: 0,
    capacity: 250,
    isAccessible: true,
    elevatorNearby: false,
    description: 'FIFA standard multi-sport turf court with floodlights and badminton enclosures.',
    currentStatus: 'Open'
  },
  {
    id: 'loc-medical',
    name: 'Campus Health & Medical Center',
    type: 'medical',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 0,
    floorLabel: 'Ground Floor',
    roomNumber: 'Room G-04',
    x: 32,
    y: 55,
    z: 0,
    capacity: 10,
    isAccessible: true,
    elevatorNearby: true,
    description: 'First aid post, resident medical officer, oxygen support, and emergency stretcher.',
    currentStatus: 'Open'
  },
  {
    id: 'loc-admin-office',
    name: 'Principal Office & Central Administration',
    type: 'admin',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 0,
    floorLabel: 'Ground Floor',
    roomNumber: 'Admin Wing G-01',
    x: 40,
    y: 50,
    z: 0,
    capacity: 30,
    isAccessible: true,
    elevatorNearby: true,
    description: 'Inquiry desk, fee counters, scholarship desk, and exam verification counters.',
    currentStatus: 'Open'
  },
  {
    id: 'loc-accessible-washroom',
    name: 'Accessible Washrooms (All Genders & Wheelchair)',
    type: 'washroom',
    buildingId: 'bldg-main',
    buildingName: 'Main Academic Building',
    floor: 0,
    floorLabel: 'Ground Floor',
    roomNumber: 'G-W01',
    x: 36,
    y: 48,
    z: 0,
    capacity: 6,
    isAccessible: true,
    elevatorNearby: true,
    description: 'Grab bars, sensor taps, emergency alarm button, and step-free wide entryway.',
    currentStatus: 'Open'
  }
];

// Timetable / Lectures
export interface LectureClass {
  id: string;
  subject: string;
  code: string;
  room: string;
  locationId: string;
  building: string;
  floor: string;
  facultyName: string;
  facultyId: string;
  startTime: string; // 24hr or "11:30 AM"
  endTime: string;
  dayOfWeek: string;
  batch: string;
  department: string;
  credits: number;
}

export const STUDENT_TIMETABLE: LectureClass[] = [
  {
    id: 'lec-1',
    subject: 'Software Engineering & Architecture',
    code: 'USIT404',
    room: 'Room 204',
    locationId: 'loc-room-204',
    building: 'Main Academic Building',
    floor: '2nd Floor',
    facultyName: 'Dr. Priya Sharma',
    facultyId: 'FAC-IT-01',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    dayOfWeek: 'Monday',
    batch: 'SY B.Sc. IT (Div A)',
    department: 'B.Sc. IT',
    credits: 2
  },
  {
    id: 'lec-2',
    subject: 'Core Java & OOP Implementation',
    code: 'USIT401',
    room: 'IT Lab 1',
    locationId: 'loc-it-lab-1',
    building: 'IT Wing',
    floor: '3rd Floor',
    facultyName: 'Dr. Priya Sharma',
    facultyId: 'FAC-IT-01',
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    dayOfWeek: 'Monday',
    batch: 'SY B.Sc. IT (Batch A1)',
    department: 'B.Sc. IT',
    credits: 2
  },
  {
    id: 'lec-3',
    subject: 'Applied Linear Algebra & Statistics',
    code: 'USIT403',
    room: 'Room 204',
    locationId: 'loc-room-204',
    building: 'Main Academic Building',
    floor: '2nd Floor',
    facultyName: 'Dr. Ramesh Tendulkar',
    facultyId: 'FAC-MATH-01',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    dayOfWeek: 'Monday',
    batch: 'SY B.Sc. IT',
    department: 'Mathematics',
    credits: 2
  },
  {
    id: 'lec-4',
    subject: 'Embedded Systems & IoT',
    code: 'USIT402',
    room: 'Room 402',
    locationId: 'loc-room-402',
    building: 'IT Wing',
    floor: '4th Floor',
    facultyName: 'Dr. Sunita Kulkarni',
    facultyId: 'FAC-PHYS-01',
    startTime: '03:15 PM',
    endTime: '04:15 PM',
    dayOfWeek: 'Monday',
    batch: 'SY B.Sc. IT',
    department: 'Physics',
    credits: 2
  }
];

// Student Assignments
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  facultyId: string;
  facultyName: string;
  department: string;
  deadline: string;
  totalMarks: number;
  description: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  submittedDate?: string;
  marksAwarded?: number;
  attachmentName?: string;
}

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-101',
    title: 'Design Patterns & UML Class Diagram for Smart Campus',
    subject: 'Software Engineering (USIT404)',
    facultyId: 'FAC-IT-01',
    facultyName: 'Dr. Priya Sharma',
    department: 'B.Sc. IT',
    deadline: '2026-09-15',
    totalMarks: 20,
    description: 'Create complete class and sequence diagrams demonstrating Factory and Observer patterns in a campus management platform.',
    status: 'Pending',
    attachmentName: 'SE_Assignment_Brief_2026.pdf'
  },
  {
    id: 'asg-102',
    title: 'Multithreaded Client-Server Socket Application',
    subject: 'Core Java (USIT401)',
    facultyId: 'FAC-IT-01',
    facultyName: 'Dr. Priya Sharma',
    department: 'B.Sc. IT',
    deadline: '2026-09-18',
    totalMarks: 25,
    description: 'Implement a Java server supporting concurrent client connections with thread-safe messaging queue.',
    status: 'Submitted',
    submittedDate: '2026-09-06',
    marksAwarded: 23,
    attachmentName: 'Aarav_Mehta_Java_Assignment.zip'
  },
  {
    id: 'asg-103',
    title: 'Eigenvalues and Diagonalization Case Studies',
    subject: 'Applied Mathematics (USIT403)',
    facultyId: 'FAC-MATH-01',
    facultyName: 'Dr. Ramesh Tendulkar',
    department: 'Mathematics',
    deadline: '2026-09-22',
    totalMarks: 15,
    description: 'Solve problem set 4 on singular value decomposition and matrix factorization.',
    status: 'Pending'
  }
];

// Attendance Record
export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  classId: string;
  facultyId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late';
}

// Faculty Notes & Uploaded Resources
export interface FacultyResource {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: string;
  facultyId: string;
  facultyName: string;
  fileType: 'PDF' | 'Slides' | 'Code' | 'Doc';
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
}

export const INITIAL_RESOURCES: FacultyResource[] = [
  {
    id: 'res-1',
    title: 'Unit 1 & 2 Complete Lecture Notes: Agile Methodologies',
    subject: 'Software Engineering (USIT404)',
    department: 'B.Sc. IT',
    semester: 'Semester IV',
    facultyId: 'FAC-IT-01',
    facultyName: 'Dr. Priya Sharma',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    uploadDate: '2026-09-02',
    downloadCount: 142
  },
  {
    id: 'res-2',
    title: 'Java Concurrency & Memory Model Handout',
    subject: 'Core Java (USIT401)',
    department: 'B.Sc. IT',
    semester: 'Semester IV',
    facultyId: 'FAC-IT-01',
    facultyName: 'Dr. Priya Sharma',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadDate: '2026-09-04',
    downloadCount: 98
  },
  {
    id: 'res-3',
    title: 'Vector Spaces and Linear Transformations Cheat Sheet',
    subject: 'Applied Mathematics (USIT403)',
    department: 'Mathematics',
    semester: 'Semester IV',
    facultyId: 'FAC-MATH-01',
    facultyName: 'Dr. Ramesh Tendulkar',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    uploadDate: '2026-08-30',
    downloadCount: 210
  }
];

// Smart Events
export interface SmartEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Cultural' | 'Workshop' | 'Seminar' | 'Sports' | 'Club';
  date: string;
  time: string;
  venue: string;
  locationId: string;
  description: string;
  image: string;
  registeredCount: number;
  capacity: number;
  isRegistered?: boolean;
  qrCode?: string;
  organizer: string;
  highlightHome?: boolean;
}

export const INITIAL_EVENTS: SmartEvent[] = [
  {
    id: 'evt-saptarang',
    title: 'Saptarang 2026: Annual Inter-Collegiate Cultural Extravaganza',
    category: 'Cultural',
    date: '2026-10-15',
    time: '10:00 AM - 08:00 PM',
    venue: 'Kashinath Dhuru Auditorium & Central Quadrangle',
    locationId: 'loc-auditorium',
    description: 'The flagship annual festival of Sathaye College showcasing street plays, classical and western dance, music battles, and celebrity guest talks.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    registeredCount: 420,
    capacity: 800,
    isRegistered: true,
    qrCode: 'SATHAYE-EVT-SAPTA-STU-042',
    organizer: 'Sathaye Cultural Council',
    highlightHome: true
  },
  {
    id: 'evt-hackathon',
    title: 'Sathaye TechSprint: 24-Hour Smart Cities Hackathon',
    category: 'Hackathon',
    date: '2026-09-26',
    time: '09:00 AM Onwards',
    venue: 'IT Laboratory 1 & Seminar Hall 3',
    locationId: 'loc-it-lab-1',
    description: 'Build open-source AI and IoT solutions tackling Mumbai urban mobility, waste segregation, and campus energy conservation. Cash prize pool ₹50,000.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    registeredCount: 110,
    capacity: 150,
    isRegistered: false,
    organizer: 'B.Sc. IT & Computer Science Club',
    highlightHome: true
  },
  {
    id: 'evt-ai-workshop',
    title: 'Hands-on Generative AI & Antigravity Agents Bootcamp',
    category: 'Workshop',
    date: '2026-09-18',
    time: '02:00 PM - 05:00 PM',
    venue: 'Seminar Hall 2 (Main Building)',
    locationId: 'loc-room-204',
    description: 'Learn modern Google Gemini SDK, LLM function calling, and full-stack web application rapid prototyping with industry mentors.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    registeredCount: 95,
    capacity: 100,
    isRegistered: true,
    qrCode: 'SATHAYE-EVT-GENAI-STU-042',
    organizer: 'Department of Information Technology',
    highlightHome: true
  },
  {
    id: 'evt-sports-meet',
    title: 'Annual Inter-Department Turf Cricket Championship',
    category: 'Sports',
    date: '2026-09-30',
    time: '08:00 AM - 06:00 PM',
    venue: 'Multi-Sport Synthetic Turf',
    locationId: 'loc-sports-turf',
    description: 'League-format box cricket tournament between Arts, Commerce, Science, and Self-Finance streams. Refreshments provided by Canteen.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    registeredCount: 180,
    capacity: 200,
    isRegistered: false,
    organizer: 'Sathaye Gymkhana Committee',
    highlightHome: true
  }
];

// Campus Support: Issue Reporting Tickets
export interface CampusTicket {
  id: string;
  ticketNumber: string;
  category: 'Electrical' | 'Plumbing' | 'Wi-Fi' | 'AC' | 'Furniture' | 'Cleanliness' | 'Security' | 'Equipment' | 'Infrastructure';
  locationName: string;
  locationId: string;
  description: string;
  reportedBy: string;
  reporterRole: 'student' | 'faculty' | 'admin';
  reportedAt: string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  assignedTechnician?: string;
  photoUrl?: string;
  resolutionNote?: string;
}

export const INITIAL_TICKETS: CampusTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'SAT-SUP-1092',
    category: 'AC',
    locationName: 'IT Laboratory 1',
    locationId: 'loc-it-lab-1',
    description: 'Split Air Conditioner unit 2 making clicking noise and not cooling efficiently.',
    reportedBy: 'Dr. Priya Sharma',
    reporterRole: 'faculty',
    reportedAt: '2026-09-06 09:15 AM',
    status: 'In Progress',
    priority: 'High',
    assignedTechnician: 'Ramesh (HVAC Specialist)'
  },
  {
    id: 'tkt-002',
    ticketNumber: 'SAT-SUP-1093',
    category: 'Wi-Fi',
    locationName: 'Central Library Reading Hall',
    locationId: 'loc-central-lib',
    description: 'SSID "Sathaye-Student-5G" showing authentication timeout near aisle 4.',
    reportedBy: 'Aarav Mehta',
    reporterRole: 'student',
    reportedAt: '2026-09-06 11:30 AM',
    status: 'Assigned',
    priority: 'Medium',
    assignedTechnician: 'Deepak (Network Ops)'
  },
  {
    id: 'tkt-003',
    ticketNumber: 'SAT-SUP-1088',
    category: 'Electrical',
    locationName: 'Lecture Room 204',
    locationId: 'loc-room-204',
    description: 'Projector HDMI port connector loose causing flickering display.',
    reportedBy: 'Dr. Ramesh Tendulkar',
    reporterRole: 'faculty',
    reportedAt: '2026-09-05 02:10 PM',
    status: 'Resolved',
    priority: 'High',
    assignedTechnician: 'Satish (AV Electrician)',
    resolutionNote: 'Replaced HDMI wall plate and tested with faculty laptop.'
  }
];

// Lost and Found Model with AI Matching
export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: 'Electronics' | 'Bags & Wallets' | 'ID Cards & Keys' | 'Books & Stationery' | 'Clothing & Bottles' | 'Other';
  locationFoundOrLost: string;
  date: string;
  time: string;
  description: string;
  reportedBy: string;
  contactEmail: string;
  photoUrl: string;
  status: 'Open' | 'Claim Requested' | 'Claim Verified' | 'Returned';
  similarityMatchId?: string;
  similarityScore?: number;
}

export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-found-1',
    type: 'found',
    title: 'Black Wildcraft Laptop Backpack',
    category: 'Bags & Wallets',
    locationFoundOrLost: 'Central Library Reading Hall (Table 14)',
    date: '2026-09-06',
    time: '01:45 PM',
    description: 'Black Wildcraft backpack containing spiral notebook and Blue Camel water bottle.',
    reportedBy: 'Library Security Desk',
    contactEmail: 'library@sathaye.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    status: 'Claim Requested',
    similarityMatchId: 'lf-lost-1',
    similarityScore: 91
  },
  {
    id: 'lf-lost-1',
    type: 'lost',
    title: 'Black Wildcraft Backpack with HP Charger',
    category: 'Bags & Wallets',
    locationFoundOrLost: 'Near Library or 2nd floor staircase',
    date: '2026-09-06',
    time: '12:30 PM',
    description: 'Left my black Wildcraft bag with IT lecture notes, water bottle, and HP laptop adapter.',
    reportedBy: 'Aarav Mehta (Student)',
    contactEmail: 'aarav.mehta@sathaye.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    status: 'Claim Requested',
    similarityMatchId: 'lf-found-1',
    similarityScore: 91
  },
  {
    id: 'lf-found-2',
    type: 'found',
    title: 'Silver Titan Wristwatch with Leather Strap',
    category: 'Other',
    locationFoundOrLost: 'Multi-Sport Synthetic Turf Bench',
    date: '2026-09-05',
    time: '05:15 PM',
    description: 'Titan analog watch found on the court spectator bench after cricket practice.',
    reportedBy: 'Gymkhana Peon',
    contactEmail: 'gymkhana@sathaye.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400',
    status: 'Open'
  }
];

// Smart Canteen Model
export interface CanteenItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Snacks' | 'Meals & Combos' | 'Beverages' | 'Healthy';
  price: number;
  preparationTimeMinutes: number;
  isAvailable: boolean;
  isVeg: boolean;
  image: string;
  description: string;
  calories?: number;
  rating: number;
}

export const INITIAL_CANTEEN_MENU: CanteenItem[] = [
  {
    id: 'food-1',
    name: 'Mumbai Special Misal Pav with Farsan',
    category: 'Breakfast',
    price: 50,
    preparationTimeMinutes: 5,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400',
    description: 'Spicy sprouted moth bean curry served with hot buttered pav and fresh lemon cut.',
    calories: 380,
    rating: 4.8
  },
  {
    id: 'food-2',
    name: 'Steamed Idli Sambar (3 Pcs)',
    category: 'Breakfast',
    price: 45,
    preparationTimeMinutes: 4,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400',
    description: 'Fluffy fermented rice cakes served with aromatic vegetable sambar and coconut chutney.',
    calories: 220,
    rating: 4.6
  },
  {
    id: 'food-3',
    name: 'Grilled Cheese & Vegetable Sandwich',
    category: 'Snacks',
    price: 60,
    preparationTimeMinutes: 8,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    description: 'Triple-layer toasted sandwich stuffed with spiced potatoes, cucumber, cheese, and mint chutney.',
    calories: 340,
    rating: 4.7
  },
  {
    id: 'food-4',
    name: 'Sathaye Special Thali (Chapati, Dal, Sabzi, Rice)',
    category: 'Meals & Combos',
    price: 90,
    preparationTimeMinutes: 10,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=400',
    description: 'Wholesome balanced student lunch thali with 3 whole wheat rotis, paneer sabzi, dal tadka, jeera rice, and salad.',
    calories: 580,
    rating: 4.9
  },
  {
    id: 'food-5',
    name: 'Fresh Cutting Filter Coffee / Masala Chai',
    category: 'Beverages',
    price: 15,
    preparationTimeMinutes: 2,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    description: 'Authentic brewed ginger cardamom tea or hot South Indian filter coffee.',
    calories: 60,
    rating: 4.9
  },
  {
    id: 'food-6',
    name: 'Chilled Mango Lassi / Cold Bournvita',
    category: 'Beverages',
    price: 35,
    preparationTimeMinutes: 3,
    isAvailable: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400',
    description: 'Rich thick curd mango lassi whipped with real Alphonso pulp.',
    calories: 210,
    rating: 4.7
  }
];

export type CanteenOrderStatus = 
  | 'CART'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CanteenOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CanteenOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userRole: string;
  items: CanteenOrderItem[];
  totalAmount: number;
  pickupSlot: string;
  status: CanteenOrderStatus;
  paymentMethod: 'Demo UPI / GPay' | 'Demo Campus SmartCard' | 'Demo Cash';
  paymentRef: string;
  createdAt: string;
  estimatedWaitMinutes: number;
  tokenNumber: number;
}

export const INITIAL_CANTEEN_ORDERS: CanteenOrder[] = [
  {
    id: 'ord-801',
    orderNumber: 'ORD-SAT-801',
    userId: 'STU-2026-001',
    userName: 'Aarav Mehta',
    userRole: 'student',
    items: [
      { itemId: 'food-1', name: 'Mumbai Special Misal Pav with Farsan', price: 50, quantity: 1 },
      { itemId: 'food-5', name: 'Masala Chai', price: 15, quantity: 1 }
    ],
    totalAmount: 65,
    pickupSlot: '11:15 AM - 11:30 AM',
    status: 'READY',
    paymentMethod: 'Demo UPI / GPay',
    paymentRef: 'UPI-DEMO-998822',
    createdAt: '2026-09-06 11:05 AM',
    estimatedWaitMinutes: 2,
    tokenNumber: 24
  },
  {
    id: 'ord-802',
    orderNumber: 'ORD-SAT-802',
    userId: 'FAC-IT-01',
    userName: 'Dr. Priya Sharma',
    userRole: 'faculty',
    items: [
      { itemId: 'food-3', name: 'Grilled Cheese & Vegetable Sandwich', price: 60, quantity: 1 },
      { itemId: 'food-5', name: 'Filter Coffee', price: 15, quantity: 1 }
    ],
    totalAmount: 75,
    pickupSlot: '01:30 PM - 01:45 PM',
    status: 'PREPARING',
    paymentMethod: 'Demo Campus SmartCard',
    paymentRef: 'CARD-DEMO-FAC-01',
    createdAt: '2026-09-06 01:10 PM',
    estimatedWaitMinutes: 6,
    tokenNumber: 25
  }
];

// Smart Library Model
export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  department: string;
  category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Literature' | 'Economics' | 'General';
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage: string;
  digitalPdfAvailable: boolean;
  publishedYear: number;
}

export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'bk-1',
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    department: 'B.Sc. IT & CS',
    category: 'Computer Science',
    totalCopies: 8,
    availableCopies: 3,
    shelfLocation: 'Stack B, Row 3, Shelf 2',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300',
    digitalPdfAvailable: true,
    publishedYear: 2018
  },
  {
    id: 'bk-2',
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    department: 'B.Sc. IT & CS',
    category: 'Computer Science',
    totalCopies: 6,
    availableCopies: 1,
    shelfLocation: 'Stack B, Row 3, Shelf 4',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=300',
    digitalPdfAvailable: true,
    publishedYear: 2008
  },
  {
    id: 'bk-3',
    isbn: '978-0070669116',
    title: 'Higher Engineering Mathematics',
    author: 'Dr. B. S. Grewal',
    department: 'Mathematics',
    category: 'Mathematics',
    totalCopies: 15,
    availableCopies: 6,
    shelfLocation: 'Stack A, Row 1, Shelf 1',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=300',
    digitalPdfAvailable: false,
    publishedYear: 2020
  },
  {
    id: 'bk-4',
    isbn: '978-0471152378',
    title: 'Fundamentals of Physics',
    author: 'David Halliday, Robert Resnick, Jearl Walker',
    department: 'Physics',
    category: 'Physics',
    totalCopies: 10,
    availableCopies: 4,
    shelfLocation: 'Stack A, Row 2, Shelf 3',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300',
    digitalPdfAvailable: true,
    publishedYear: 2019
  },
  {
    id: 'bk-5',
    isbn: '978-8120348745',
    title: 'Software Engineering: A Practitioner\'s Approach',
    author: 'Roger S. Pressman',
    department: 'B.Sc. IT',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 5,
    shelfLocation: 'Stack B, Row 4, Shelf 1',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300',
    digitalPdfAvailable: true,
    publishedYear: 2015
  }
];

export interface LibraryBorrowRecord {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export const INITIAL_LIBRARY_BORROWINGS: LibraryBorrowRecord[] = [
  {
    id: 'bor-101',
    userId: 'STU-2026-001',
    userName: 'Aarav Mehta',
    bookId: 'bk-1',
    bookTitle: 'Effective Java (3rd Edition)',
    borrowedDate: '2026-08-25',
    dueDate: '2026-09-09',
    status: 'Issued',
    fineAmount: 0
  },
  {
    id: 'bor-102',
    userId: 'STU-2026-001',
    userName: 'Aarav Mehta',
    bookId: 'bk-5',
    bookTitle: 'Software Engineering: A Practitioner\'s Approach',
    borrowedDate: '2026-08-10',
    dueDate: '2026-08-25',
    returnDate: '2026-08-24',
    status: 'Returned',
    fineAmount: 0
  }
];

// Single Canonical Record for Library Complaints / Book Purchase Requests
// Both visible in Library Dashboard AND Admin Dashboard -> Library Issues
export interface LibraryRequestOrIssue {
  id: string;
  type: 'Book Purchase Request' | 'Missing Book Issue' | 'Damaged Book' | 'Facility Complaint';
  userId: string;
  userName: string;
  userRole: 'student' | 'faculty';
  title: string;
  description: string;
  createdAt: string;
  status: 'Under Review' | 'Approved / In Procure' | 'Resolved' | 'Rejected';
  librarianNotes?: string;
}

export const INITIAL_LIBRARY_ISSUES: LibraryRequestOrIssue[] = [
  {
    id: 'lib-req-201',
    type: 'Book Purchase Request',
    userId: 'STU-2026-001',
    userName: 'Aarav Mehta',
    userRole: 'student',
    title: 'Designing Data-Intensive Applications by Martin Kleppmann',
    description: 'Requesting 2 copies for final year cloud distributed systems reference.',
    createdAt: '2026-09-04 10:20 AM',
    status: 'Approved / In Procure',
    librarianNotes: 'Added to Semester II library procurement budget.'
  },
  {
    id: 'lib-req-202',
    type: 'Facility Complaint',
    userId: 'FAC-MATH-01',
    userName: 'Dr. Ramesh Tendulkar',
    userRole: 'faculty',
    title: 'Air conditioning noise in Faculty Reference Section',
    description: 'The damper on AC unit 3 near journal stacks vibrates noticeably.',
    createdAt: '2026-09-05 03:40 PM',
    status: 'Under Review',
    librarianNotes: 'Cross-reported to Admin maintenance team.'
  }
];

// Library Reading Hall Real-Time Seats
export interface LibrarySeat {
  id: string;
  seatNumber: string;
  floor: 1 | 2;
  section: 'Quiet Hall' | 'Discussion Pod' | 'Digital Terminal';
  hasPowerSocket: boolean;
  status: 'Available' | 'Occupied' | 'Reserved';
}

export const INITIAL_LIBRARY_SEATS: LibrarySeat[] = Array.from({ length: 36 }, (_, i) => {
  const floor: 1 | 2 = i < 18 ? 1 : 2;
  const num = i + 1;
  const status: 'Available' | 'Occupied' | 'Reserved' = 
    i % 5 === 0 ? 'Occupied' : i % 8 === 0 ? 'Reserved' : 'Available';
  return {
    id: `seat-${num}`,
    seatNumber: `S-${floor}0${num < 10 ? '0' + num : num}`,
    floor,
    section: i < 20 ? 'Quiet Hall' : i < 28 ? 'Digital Terminal' : 'Discussion Pod',
    hasPowerSocket: i % 2 === 0,
    status
  };
});

// Notifications Model
export interface SmartNotification {
  id: string;
  recipientRole?: 'student' | 'faculty' | 'admin' | 'all';
  recipientUserId?: string;
  category: 'academic' | 'canteen' | 'library' | 'safety' | 'event' | 'support';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority?: 'normal' | 'urgent';
}

export const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'student',
    recipientUserId: 'STU-2026-001',
    category: 'canteen',
    title: 'Canteen Order Ready for Pickup! 🍱',
    message: 'Token #24 (Misal Pav + Masala Chai) is ready at Counter 1.',
    timestamp: '5 mins ago',
    isRead: false,
    actionUrl: '/canteen',
    priority: 'urgent'
  },
  {
    id: 'notif-2',
    recipientRole: 'student',
    recipientUserId: 'STU-2026-001',
    category: 'academic',
    title: 'Next Class: Software Engineering (Room 204)',
    message: 'Starts in 15 minutes with Dr. Priya Sharma.',
    timestamp: '15 mins ago',
    isRead: false,
    actionUrl: '/map?target=loc-room-204'
  },
  {
    id: 'notif-3',
    recipientRole: 'student',
    recipientUserId: 'STU-2026-001',
    category: 'library',
    title: 'Book Due Date Reminder 📚',
    message: '"Effective Java (3rd Edition)" is due in 3 days on Sept 9.',
    timestamp: '2 hours ago',
    isRead: true,
    actionUrl: '/library'
  },
  {
    id: 'notif-4',
    recipientRole: 'all',
    category: 'event',
    title: 'Saptarang 2026 Registration Open 🎭',
    message: 'Check out the event schedule and register for competitions.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '/events'
  }
];

// Campus Safety / SOS Guidelines
export interface EmergencyContact {
  title: string;
  phone: string;
  location: string;
  available: string;
  iconType: 'security' | 'medical' | 'fire' | 'police' | 'women';
}

export const CAMPUS_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'Campus Central Security Control',
    phone: '+91 93213 47772 / Ext 101',
    location: 'Main Gate Booth & Admin G-03',
    available: '24x7 On-Duty',
    iconType: 'security'
  },
  {
    title: 'Health Post & Medical Center',
    phone: '+91 98200 88811 / Ext 108',
    location: 'Ground Floor, Room G-04',
    available: '08:00 AM - 08:00 PM',
    iconType: 'medical'
  },
  {
    title: 'Women\'s Safety Cell & Anti-Harassment',
    phone: '+91 98201 99922 / Ext 115',
    location: 'Staff Council Chamber 2',
    available: 'Immediate Hotline',
    iconType: 'women'
  },
  {
    title: 'Vile Parle Fire Brigade Station',
    phone: '101 / +91 22 2618 3333',
    location: 'Nehru Road, Vile Parle (East)',
    available: 'Municipal Emergency',
    iconType: 'fire'
  },
  {
    title: 'Vile Parle Police Station',
    phone: '100 / +91 22 2614 1234',
    location: 'Subhash Road, Vile Parle (East)',
    available: 'Emergency Police Response',
    iconType: 'police'
  }
];
