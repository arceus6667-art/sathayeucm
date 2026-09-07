/**
 * Sathaye UCM: Authoritative Timetable Management & Spatial State Engine
 * Enforces strict Conflict Detection (Room, Faculty, Division, Duplicate),
 * Dynamic Room Occupancy Engine, Next Class Engine, Publishing Workflows,
 * and 24 Departments, 24 Programs, 48 Classrooms, 56 Campus Features,
 * 10 Faculty Accounts, and 3,000 Deterministic Student Records.
 */

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDept: string;
  building: string;
  floor: number;
}

export interface AcademicProgram {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  degreeType: 'UG' | 'PG' | 'DIPLOMA';
  totalSemesters: number;
}

export interface AcademicRoom {
  id: string;
  roomNumber: string;
  name: string;
  building: string;
  floor: number; // 0=Ground, 1=1st, 2=2nd, 3=3rd
  roomType: 'CLASSROOM' | 'LABORATORY' | 'AUDITORIUM' | 'SEMINAR_HALL' | 'LIBRARY' | 'CANTEEN' | 'ADMIN_OFFICE';
  capacity: number;
  department?: string;
  equipment: {
    projector: boolean;
    ac: boolean;
    whiteboard: boolean;
    wifi: boolean;
    labInstruments?: boolean;
    interactivePanel?: boolean;
  };
  isAccessible: boolean;
  isMaintenance: boolean;
  maintenanceReason?: string;
  isInactive: boolean;
  xCoord: number;
  yCoord: number;
}

export interface TimetableEntry {
  id: string;
  academic_year: string;
  semester: number;
  department: string;
  program: string;
  year: 'FY' | 'SY' | 'TY' | 'MSc-I' | 'MSc-II' | 'MCom-I' | 'MCom-II';
  division: string;
  batch?: string; // B1, B2, or empty for entire division
  subject: string;
  subjectCode: string;
  faculty: string;
  facultyEmail: string;
  room: string;
  floor: number;
  day_of_week: number; // 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  start_time: string; // '08:00'
  end_time: string; // '09:00'
  effective_from: string;
  effective_until: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TimetableConflict {
  type: 'ROOM_CONFLICT' | 'FACULTY_CONFLICT' | 'DIVISION_CONFLICT' | 'DUPLICATE_ENTRY';
  message: string;
  conflictingEntry: TimetableEntry;
}

export interface TimetableAuditRecord {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ROOM_CHANGE' | 'DUPLICATE';
  entryId: string;
  previousValue?: Partial<TimetableEntry>;
  newValue?: Partial<TimetableEntry>;
  description: string;
}

export interface RoomOccupancyState {
  roomId: string;
  roomNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';
  currentClass: {
    subject: string;
    faculty: string;
    division: string;
    startTime: string;
    endTime: string;
    remainingMinutes: number;
  } | null;
  nextClass: {
    subject: string;
    faculty: string;
    division: string;
    startTime: string;
    endTime: string;
    startsInMinutes: number;
  } | null;
  todaySchedule: TimetableEntry[];
}

export interface StudentNextClassResult {
  hasUpcoming: boolean;
  subject: string;
  faculty: string;
  room: string;
  floor: number;
  floorLabel: string;
  startTime: string;
  endTime: string;
  startsInMinutes: number;
  isOngoing: boolean;
}

// ==========================================
// 1. 24 DEPARTMENTS
// ==========================================
export const DEPARTMENTS_24: Department[] = [
  { id: 'dept-01', code: 'BSC-IT', name: 'Information Technology', headOfDept: 'Prof. Rohan Desai', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-02', code: 'BSC-CS', name: 'Computer Science', headOfDept: 'Dr. Sunita Patil', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-03', code: 'PHY', name: 'Physics & Electronics', headOfDept: 'Dr. A. V. Kulkarni', building: 'Science Complex', floor: 2 },
  { id: 'dept-04', code: 'CHEM', name: 'Chemistry & Biochemistry', headOfDept: 'Dr. R. M. Date', building: 'Science Complex', floor: 0 },
  { id: 'dept-05', code: 'MATH', name: 'Mathematics & Statistics', headOfDept: 'Prof. S. R. Joshi', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-06', code: 'BOT', name: 'Botany & Plant Sciences', headOfDept: 'Dr. Sandhya Khedekar', building: 'Science Complex', floor: 1 },
  { id: 'dept-07', code: 'ZOO', name: 'Zoology & Animal Biology', headOfDept: 'Dr. Nitin Shinde', building: 'Science Complex', floor: 1 },
  { id: 'dept-08', code: 'MICRO', name: 'Microbiology & Biotechnology', headOfDept: 'Dr. Neeta Deshmukh', building: 'Science Complex', floor: 1 },
  { id: 'dept-09', code: 'COMM', name: 'Commerce & Business Management', headOfDept: 'Prof. K. G. Shah', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-10', code: 'ACCT', name: 'Accountancy & Auditing', headOfDept: 'Prof. R. T. Mehta', building: 'Main Academic Block', floor: 1 },
  { id: 'dept-11', code: 'BMS', name: 'Management Studies (BMS)', headOfDept: 'Dr. Rajesh B. Mehta', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-12', code: 'BBI', name: 'Banking & Insurance', headOfDept: 'Prof. Anjali Ranade', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-13', code: 'BAF', name: 'Accounting & Finance', headOfDept: 'Prof. Hemant Kulkarni', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-14', code: 'BFM', name: 'Financial Markets', headOfDept: 'Dr. Pradeep Sawant', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-15', code: 'BAMMC', name: 'Multimedia & Mass Communication', headOfDept: 'Prof. Kavita Rao', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-16', code: 'ENG', name: 'English Literature & Linguistics', headOfDept: 'Prof. Sunita Patil', building: 'Main Academic Block', floor: 1 },
  { id: 'dept-17', code: 'MAR', name: 'Marathi Literature & Heritage', headOfDept: 'Dr. Milind Kulkarni', building: 'Main Academic Block', floor: 0 },
  { id: 'dept-18', code: 'HIN', name: 'Hindi Bhasha & Sahitya', headOfDept: 'Dr. Rameshwar Pandey', building: 'Main Academic Block', floor: 1 },
  { id: 'dept-19', code: 'SKT', name: 'Sanskrit & Indian Knowledge Systems', headOfDept: 'Dr. Shrinivas Ranade', building: 'Main Academic Block', floor: 1 },
  { id: 'dept-20', code: 'HIST', name: 'History & Ancient Culture', headOfDept: 'Prof. Supriya Nair', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-21', code: 'GEOG', name: 'Geography & Remote Sensing', headOfDept: 'Dr. Vilas Jadhav', building: 'Main Academic Block', floor: 0 },
  { id: 'dept-22', code: 'ECO', name: 'Economics & Econometrics', headOfDept: 'Dr. V. N. Bapat', building: 'Main Academic Block', floor: 0 },
  { id: 'dept-23', code: 'PSYCH', name: 'Psychology & Behavioural Sciences', headOfDept: 'Dr. Medha Dixit', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-24', code: 'POLSOC', name: 'Political Science & Sociology', headOfDept: 'Dr. Charusheela Gore', building: 'Main Academic Block', floor: 2 }
];

// ==========================================
// 2. 24 PROGRAMS
// ==========================================
export const PROGRAMS_24: AcademicProgram[] = [
  { id: 'prog-01', code: 'BSC-IT', name: 'B.Sc. Information Technology', departmentId: 'dept-01', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-02', code: 'BSC-CS', name: 'B.Sc. Computer Science', departmentId: 'dept-02', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-03', code: 'BSC-PHY', name: 'B.Sc. Physics (Honours)', departmentId: 'dept-03', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-04', code: 'BSC-CHEM', name: 'B.Sc. Chemistry (Analytical & Organic)', departmentId: 'dept-04', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-05', code: 'BSC-MATH', name: 'B.Sc. Mathematics & Statistics', departmentId: 'dept-05', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-06', code: 'BSC-BOT', name: 'B.Sc. Botany & Plant Biotechnology', departmentId: 'dept-06', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-07', code: 'BSC-ZOO', name: 'B.Sc. Zoology & Applied Marine Studies', departmentId: 'dept-07', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-08', code: 'BSC-MICRO', name: 'B.Sc. Microbiology & Immunology', departmentId: 'dept-08', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-09', code: 'BCOM-GEN', name: 'B.Com. General Commercial Studies', departmentId: 'dept-09', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-10', code: 'BCOM-ADV', name: 'B.Com. Advanced Accountancy & Auditing', departmentId: 'dept-10', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-11', code: 'BMS', name: 'Bachelor of Management Studies (BMS)', departmentId: 'dept-11', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-12', code: 'BBI', name: 'B.Com. Banking & Insurance', departmentId: 'dept-12', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-13', code: 'BAF', name: 'B.Com. Accounting & Finance', departmentId: 'dept-13', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-14', code: 'BFM', name: 'B.Com. Financial Markets', departmentId: 'dept-14', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-15', code: 'BAMMC', name: 'B.A. Multimedia and Mass Communication', departmentId: 'dept-15', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-16', code: 'BA-ENG', name: 'B.A. English Literature', departmentId: 'dept-16', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-17', code: 'BA-MAR', name: 'B.A. Marathi Bhasha & Sahitya', departmentId: 'dept-17', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-18', code: 'BA-HIN', name: 'B.A. Hindi Literature', departmentId: 'dept-18', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-19', code: 'BA-SKT', name: 'B.A. Sanskrit & Classical Indology', departmentId: 'dept-19', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-20', code: 'BA-HIST', name: 'B.A. History & Archaeology', departmentId: 'dept-20', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-21', code: 'BA-GEOG', name: 'B.A. Geography & Geo-informatics', departmentId: 'dept-21', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-22', code: 'BA-ECO', name: 'B.A. Economics', departmentId: 'dept-22', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-23', code: 'BA-PSYCH', name: 'B.A. Psychology & Applied Counselling', departmentId: 'dept-23', degreeType: 'UG', totalSemesters: 6 },
  { id: 'prog-24', code: 'MSC-IT', name: 'M.Sc. Information Technology & AI', departmentId: 'dept-01', degreeType: 'PG', totalSemesters: 4 }
];

// ==========================================
// 3. 48 ROOMS ACROSS 4 REAL SIGNBOARD FLOORS
// ==========================================
export const ROOMS_48: AcademicRoom[] = [
  // --- GROUND FLOOR (12 Rooms) ---
  { id: 'rm-016', roomNumber: '016', name: 'Lecture Hall 016', building: 'Main Block', floor: 0, roomType: 'CLASSROOM', capacity: 70, department: 'Arts & Commerce', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 28, yCoord: 22 },
  { id: 'rm-017', roomNumber: '017', name: 'Lecture Hall 017', building: 'Main Block', floor: 0, roomType: 'CLASSROOM', capacity: 70, department: 'Science & Arts', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 31, yCoord: 22 },
  { id: 'rm-g-chem-1', roomNumber: 'CHEM-LAB-1', name: 'Chemistry Laboratory 1', building: 'Science Wing', floor: 0, roomType: 'LABORATORY', capacity: 45, department: 'Chemistry', equipment: { projector: true, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 35, yCoord: 22 },
  { id: 'rm-g-phys-chem', roomNumber: 'PHYS-CHEM-LAB', name: 'Physical Chemistry Laboratory', building: 'Science Wing', floor: 0, roomType: 'LABORATORY', capacity: 40, department: 'Chemistry', equipment: { projector: false, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 31, yCoord: 18 },
  { id: 'rm-g-chem-prep', roomNumber: 'CHEM-PREP', name: 'Chemistry Preparation Room', building: 'Science Wing', floor: 0, roomType: 'LABORATORY', capacity: 20, department: 'Chemistry', equipment: { projector: false, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 36, yCoord: 18 },
  { id: 'rm-g-chem-phys', roomNumber: 'CHEM-PHYS-LAB', name: 'Chemistry Physical Instrument Lab', building: 'Science Wing', floor: 0, roomType: 'LABORATORY', capacity: 35, department: 'Chemistry', equipment: { projector: false, ac: true, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 39, yCoord: 18 },
  { id: 'rm-g-msc-lab', roomNumber: 'MSC-CHEM-LAB', name: 'M.Sc. Analytical Chemistry Lab', building: 'Science Wing', floor: 0, roomType: 'LABORATORY', capacity: 30, department: 'Chemistry', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 37, yCoord: 25 },
  { id: 'rm-g-canteen', roomNumber: 'CANTEEN-001', name: 'Central Campus Canteen Pavilion', building: 'Hospitality Block', floor: 0, roomType: 'CANTEEN', capacity: 220, department: 'Campus Amenities', equipment: { projector: false, ac: false, whiteboard: false, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 6, yCoord: 32 },
  { id: 'rm-g-gym', roomNumber: 'GYM-001', name: 'Gymkhana & Indoor Sports Arena', building: 'Sports Pavilion', floor: 0, roomType: 'SEMINAR_HALL', capacity: 150, department: 'Physical Education', equipment: { projector: false, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 10, yCoord: 23 },
  { id: 'rm-g-audi', roomNumber: 'AUDI-G', name: 'New Building Ground Auditorium', building: 'New Building', floor: 0, roomType: 'AUDITORIUM', capacity: 420, department: 'Central College', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 41, yCoord: 41 },
  { id: 'rm-g-math-lab', roomNumber: 'MATH-STAT-LAB', name: 'Mathematics & Statistics Lab', building: 'Main Block', floor: 0, roomType: 'LABORATORY', capacity: 40, department: 'Mathematics & Statistics', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 14, yCoord: 11 },
  { id: 'rm-g-aic-lab', roomNumber: 'AIC-LAB', name: 'Ancient Indian Culture (A.I.C.) Lab', building: 'Heritage Wing', floor: 0, roomType: 'LABORATORY', capacity: 35, department: 'History & AIC', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 23, yCoord: 8 },

  // --- FIRST FLOOR (12 Rooms) ---
  { id: 'rm-101-lib', roomNumber: 'LIB-101', name: 'Central Library & Reading Hall', building: 'Knowledge Center', floor: 1, roomType: 'LIBRARY', capacity: 280, department: 'Library Science', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 67, yCoord: 6 },
  { id: 'rm-102-ugc', roomNumber: 'UGC-NRC', name: 'UGC-NRC Network Resource Centre', building: 'Knowledge Center', floor: 1, roomType: 'LABORATORY', capacity: 40, department: 'Digital Learning', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 64, yCoord: 10 },
  { id: 'rm-108', roomNumber: '108', name: 'Lecture Hall 108', building: 'East Wing', floor: 1, roomType: 'CLASSROOM', capacity: 65, department: 'Commerce', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 72, yCoord: 18 },
  { id: 'rm-109', roomNumber: '109', name: 'Lecture Hall 109', building: 'East Wing', floor: 1, roomType: 'CLASSROOM', capacity: 65, department: 'Commerce', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 75, yCoord: 18 },
  { id: 'rm-110', roomNumber: '110', name: 'Lecture Hall 110', building: 'East Wing', floor: 1, roomType: 'CLASSROOM', capacity: 65, department: 'Biological Sciences', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 77, yCoord: 18 },
  { id: 'rm-113', roomNumber: '113', name: 'Microbiology Research Room 113', building: 'Science Wing', floor: 1, roomType: 'LABORATORY', capacity: 35, department: 'Microbiology', equipment: { projector: false, ac: true, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 87, yCoord: 18 },
  { id: 'rm-114', roomNumber: '114', name: 'Botany Laboratory 114', building: 'Science Wing', floor: 1, roomType: 'LABORATORY', capacity: 45, department: 'Botany', equipment: { projector: true, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 88, yCoord: 23 },
  { id: 'rm-115', roomNumber: '115', name: 'Zoology Laboratory 115', building: 'Science Wing', floor: 1, roomType: 'LABORATORY', capacity: 45, department: 'Zoology', equipment: { projector: true, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 88, yCoord: 26 },
  { id: 'rm-116', roomNumber: '116', name: 'Lecture Hall 116', building: 'Science Wing', floor: 1, roomType: 'CLASSROOM', capacity: 60, department: 'Science', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 88, yCoord: 29 },
  { id: 'rm-117', roomNumber: '117', name: 'Lecture Hall 117', building: 'Science Wing', floor: 1, roomType: 'CLASSROOM', capacity: 60, department: 'Science', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 89, yCoord: 36 },
  { id: 'rm-118', roomNumber: '118', name: 'Lecture Hall 118', building: 'Science Wing', floor: 1, roomType: 'CLASSROOM', capacity: 60, department: 'Arts & Languages', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 89, yCoord: 40 },
  { id: 'rm-bio-1', roomNumber: 'BIO-LAB-1', name: 'Biology Composite Laboratory 1', building: 'Science Wing', floor: 1, roomType: 'LABORATORY', capacity: 50, department: 'Biological Sciences', equipment: { projector: true, ac: false, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 82, yCoord: 18 },

  // --- SECOND FLOOR (12 Rooms) ---
  { id: 'rm-201', roomNumber: '201', name: 'Classroom 201 (Humanities & Social Sciences)', building: 'West Wing', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Arts & Humanities', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 28, yCoord: 83 },
  { id: 'rm-202', roomNumber: '202', name: 'Classroom 202', building: 'West Wing', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Arts & Economics', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 28, yCoord: 78 },
  { id: 'rm-203', roomNumber: '203', name: 'Classroom 203', building: 'West Wing', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Economics', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 29, yCoord: 74 },
  { id: 'rm-204', roomNumber: '204', name: 'Smart Classroom 204 (B.Sc. IT & CS Core)', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 80, department: 'Information Technology', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, interactivePanel: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 66, yCoord: 71 },
  { id: 'rm-205', roomNumber: '205', name: 'Smart Classroom 205 (Computer Science)', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 80, department: 'Computer Science', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, interactivePanel: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 93, yCoord: 71 },
  { id: 'rm-206', roomNumber: '206', name: 'Lecture Hall 206', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Science Complex', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 114, yCoord: 71 },
  { id: 'rm-207', roomNumber: '207', name: 'Lecture Hall 207', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Mathematics', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 137, yCoord: 71 },
  { id: 'rm-208', roomNumber: '208', name: 'Lecture Hall 208', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Physics', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 160, yCoord: 71 },
  { id: 'rm-209', roomNumber: '209', name: 'Lecture Hall 209', building: 'West Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 75, department: 'Psychology', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 182, yCoord: 71 },
  { id: 'rm-218', roomNumber: '218', name: 'Lecture Hall 218', building: 'East Corridor', floor: 2, roomType: 'CLASSROOM', capacity: 70, department: 'Information Technology', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 275, yCoord: 71 },
  { id: 'rm-it-lab', roomNumber: 'IT-LAB', name: 'Information Technology High-Performance Lab', building: 'Tech Wing', floor: 2, roomType: 'LABORATORY', capacity: 60, department: 'Information Technology', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, interactivePanel: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 345, yCoord: 65 },
  { id: 'rm-phy-lab-1', roomNumber: 'PHY-LAB-1', name: 'Physics & Electronics Research Lab 1', building: 'Science Wing', floor: 2, roomType: 'LABORATORY', capacity: 50, department: 'Physics', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, labInstruments: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 367, yCoord: 77 },

  // --- THIRD FLOOR (12 Rooms) ---
  { id: 'rm-304', roomNumber: '304', name: 'Commerce Classroom 304', building: 'Commerce Wing', floor: 3, roomType: 'CLASSROOM', capacity: 80, department: 'Commerce & BCom', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 546, yCoord: 671 },
  { id: 'rm-305', roomNumber: '305', name: 'Commerce Classroom 305', building: 'Commerce Wing', floor: 3, roomType: 'CLASSROOM', capacity: 80, department: 'Commerce & BAF', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 569, yCoord: 671 },
  { id: 'rm-306', roomNumber: '306', name: 'Commerce Classroom 306', building: 'Commerce Wing', floor: 3, roomType: 'CLASSROOM', capacity: 80, department: 'Banking & Insurance', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 596, yCoord: 671 },
  { id: 'rm-307', roomNumber: '307', name: 'Financial Markets Room 307', building: 'Commerce Wing', floor: 3, roomType: 'CLASSROOM', capacity: 80, department: 'Financial Markets', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 624, yCoord: 671 },
  { id: 'rm-308', roomNumber: '308', name: 'Commerce Room 308', building: 'Commerce Wing', floor: 3, roomType: 'CLASSROOM', capacity: 80, department: 'Commerce & Management', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 647, yCoord: 671 },
  { id: 'rm-309-bms', roomNumber: '309', name: 'Management Studies (BMS) Hall 309', building: 'BMS Annex', floor: 3, roomType: 'CLASSROOM', capacity: 70, department: 'Management Studies (BMS)', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 639, yCoord: 531 },
  { id: 'rm-310-bms', roomNumber: '310', name: 'BMS Smart Interactive Room 310', building: 'BMS Annex', floor: 3, roomType: 'CLASSROOM', capacity: 70, department: 'Management Studies (BMS)', equipment: { projector: true, ac: true, whiteboard: true, wifi: true, interactivePanel: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 654, yCoord: 517 },
  { id: 'rm-311-bms', roomNumber: '311', name: 'BMS Case Study Seminar Hall 311', building: 'BMS Annex', floor: 3, roomType: 'SEMINAR_HALL', capacity: 70, department: 'Management Studies (BMS)', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 669, yCoord: 504 },
  { id: 'rm-312-bms', roomNumber: '312', name: 'Executive Business Room 312', building: 'BMS Annex', floor: 3, roomType: 'CLASSROOM', capacity: 60, department: 'Management Studies (BMS)', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 686, yCoord: 490 },
  { id: 'rm-315', roomNumber: '315', name: 'Academic Hall 315', building: 'East Wing 3F', floor: 3, roomType: 'CLASSROOM', capacity: 65, department: 'General Arts', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 742, yCoord: 665 },
  { id: 'rm-320', roomNumber: '320', name: 'Lecture Hall 320', building: 'South East Annex', floor: 3, roomType: 'CLASSROOM', capacity: 60, department: 'Humanities', equipment: { projector: true, ac: false, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 922, yCoord: 720 },
  { id: 'rm-bmm-lab', roomNumber: 'BMM-LAB', name: 'Mass Media & Audio-Visual Studio Lab', building: 'Media Center', floor: 3, roomType: 'LABORATORY', capacity: 50, department: 'Multimedia & Mass Communication', equipment: { projector: true, ac: true, whiteboard: true, wifi: true }, isAccessible: true, isMaintenance: false, isInactive: false, xCoord: 925, yCoord: 928 }
];

// ==========================================
// 4. 56 CAMPUS FEATURES
// ==========================================
export const CAMPUS_FEATURES_56 = [
  'Knowledge Resource Center (Central Library)', 'Reading Hall & Periodicals Section', 'UGC-NRC Digital Network Center',
  'Central Cafeteria & Dining Pavilion', 'Canteen Kitchen & Food Safety Inspection', 'Gymkhana & Sports Pavilion',
  'Indoor Table Tennis & Chess Hall', 'Main Ground Multi-Sports Field', 'K. R. C. Main Auditorium (Ground Floor)',
  'Third Floor Cultural Auditorium', 'Terrace Open-Air Amphitheater', 'Physical Chemistry Research Lab',
  'Organic Chemistry Synthesis Lab', 'M.Sc. Analytical Chemistry Instrument Center', 'Physics Optics & Laser Lab',
  'Electronics & Microcontroller Lab', 'Information Technology High-Performance Lab', 'Advanced Computer Center A (Linux & Cloud)',
  'Microbiology Sterile Inoculation Unit', 'Botany Herbarium & Plant Culture Lab', 'Zoology Museum & Specimen Lab',
  'Ancient Indian Culture (A.I.C.) Heritage Lab', 'Mathematics & Statistical Computing Lab', 'Mass Media Digital Studio & AV Editing Lab',
  'IGNOU Regional Study Resource Centre', 'Principal’s Executive Chamber', 'Vice Principal (Science) Cabin',
  'Vice Principal (Commerce & Arts) Cabin', 'Central Administration & Registrar Office', 'Examination & Confidential Secrecy Department',
  'Result & Marks Verification Section', 'Faculty Common Room (Ground Floor)', 'Science Staff Room (First Floor)',
  'Commerce & Arts Staff Common Room (Third Floor)', 'Internal Quality Assurance Cell (IQAC)', 'Student Council & Cultural Activities Desk',
  'National Cadet Corps (NCC) Boys Unit', 'NCC Girls Battalion Headquarters', 'National Service Scheme (NSS) Outreach Room',
  'Medical Inspection & First Aid Centre', 'Student Counselling & Mental Wellness Cell', 'West Wing Wheelchair-Accessible Elevator',
  'Central Main Elevator', 'East Wing Science Elevator', 'Main Heritage Entrance Gate (Dixit Road)',
  'North Gate (Suburban Station Walkway)', 'Two-Wheeler & Bicycle Green Parking Bay', 'Faculty & Staff Reserved Vehicle Parking',
  'Girls Common Restroom & Wellness Room', 'Boys Common Lounge', 'Ground Floor Accessible Restrooms',
  'First Floor Accessible Restrooms', 'Second Floor Restrooms', 'Third Floor Restrooms',
  'Vermiculture & Organic Compost Station', 'Campus Solid Waste Management & Recycling Facility'
];

// ==========================================
// 5. 10 FACULTY MEMBERS
// ==========================================
export const FACULTY_10 = [
  { id: 'fac-01', username: 'math.faculty01', email: 'joshi.math@sathaye.edu.in', name: 'Prof. S. R. Joshi', department: 'Mathematics & Statistics', designation: 'Head of Department & Professor' },
  { id: 'fac-02', username: 'physics.faculty01', email: 'kulkarni.phys@sathaye.edu.in', name: 'Dr. A. V. Kulkarni', department: 'Physics & Electronics', designation: 'Associate Professor & Research Lead' },
  { id: 'fac-03', username: 'chem.faculty01', email: 'date.chem@sathaye.edu.in', name: 'Dr. R. M. Date', department: 'Chemistry & Biochemistry', designation: 'Professor & Lab Director' },
  { id: 'fac-04', username: 'micro.faculty01', email: 'deshmukh.micro@sathaye.edu.in', name: 'Dr. Neeta Deshmukh', department: 'Microbiology & Biotechnology', designation: 'Associate Professor' },
  { id: 'fac-05', username: 'english.faculty01', email: 'patil.eng@sathaye.edu.in', name: 'Prof. Sunita Patil', department: 'English Literature & Linguistics', designation: 'Assistant Professor' },
  { id: 'fac-06', username: 'eco.faculty01', email: 'bapat.eco@sathaye.edu.in', name: 'Dr. V. N. Bapat', department: 'Economics & Econometrics', designation: 'Head of Department' },
  { id: 'fac-07', username: 'psych.faculty01', email: 'dixit.psych@sathaye.edu.in', name: 'Dr. Medha Dixit', department: 'Psychology & Behavioural Sciences', designation: 'Associate Professor & Counsellor' },
  { id: 'fac-08', username: 'commerce.faculty01', email: 'shah.comm@sathaye.edu.in', name: 'Prof. K. G. Shah', department: 'Commerce & Business Management', designation: 'Vice Principal & Professor' },
  { id: 'fac-09', username: 'accounts.faculty01', email: 'mehta.acct@sathaye.edu.in', name: 'Prof. R. T. Mehta', department: 'Accountancy & Auditing', designation: 'Head of Department' },
  { id: 'fac-10', username: 'it.faculty01', email: 'rohan.it@sathaye.edu.in', name: 'Prof. Rohan Desai', department: 'Information Technology', designation: 'Programme Coordinator & Assistant Professor' }
];

// ==========================================
// 6. 3,000 DETERMINISTIC STUDENTS GENERATOR
// ==========================================
const FIRST_NAMES = ['Aarav', 'Ananya', 'Rohan', 'Sneha', 'Aditya', 'Pooja', 'Tanvi', 'Vikram', 'Neha', 'Pranav', 'Riddhi', 'Kunal', 'Siddhi', 'Omkar', 'Gauri', 'Rahul', 'Isha', 'Amit', 'Sayali', 'Siddharth', 'Bhavna', 'Chetan', 'Deepika', 'Eknath', 'Farhan', 'Gayatri', 'Harsh', 'Indira', 'Jayesh', 'Komal'];
const LAST_NAMES = ['Mehta', 'Patil', 'Joshi', 'Kulkarni', 'Deshmukh', 'Sharma', 'Shah', 'Nair', 'Bapat', 'Chavan', 'Sawant', 'Gore', 'Shinde', 'Rao', 'Bhide', 'Date', 'Pandey', 'Khedekar', 'Dixit', 'Deshpande'];

export interface StudentRecord {
  id: string;
  prn: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  program: string;
  year: 'FY' | 'SY' | 'TY';
  division: string;
  semester: number;
  attendancePercent: number;
  cgpa: number;
}

export function getDeterministicStudent(index: number): StudentRecord {
  const i = Math.abs(index) % 3000;
  const prnNumber = (1000 + i).toString().padStart(4, '0');
  const prn = `PRN-2026-${prnNumber}`;
  
  const progIdx = i % PROGRAMS_24.length;
  const program = PROGRAMS_24[progIdx];
  const dept = DEPARTMENTS_24.find(d => d.id === program.departmentId) || DEPARTMENTS_24[0];
  
  const yearIdx = Math.floor(i / 1000) % 3;
  const years: Array<'FY' | 'SY' | 'TY'> = ['FY', 'SY', 'TY'];
  const year = years[yearIdx];
  const semester = yearIdx * 2 + ((i % 2) + 1);
  const divLetters = ['Div A', 'Div B', 'Div C'];
  const division = divLetters[i % 3];
  
  const fn = FIRST_NAMES[i % FIRST_NAMES.length];
  const ln = LAST_NAMES[(i * 7) % LAST_NAMES.length];
  const name = `${fn} ${ln}`;
  const rollNumber = `${year}-${program.code}-${division.slice(-1)}${(i % 60 + 1).toString().padStart(2, '0')}`;
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i % 50 === 0 ? '' : (i % 99)}@sathaye.edu.in`;

  // Deterministic academic scores
  const attendancePercent = 65 + (i * 13) % 35; // 65% - 100%
  const cgpa = Number((6.0 + ((i * 17) % 40) / 10).toFixed(2)); // 6.00 - 9.90

  return {
    id: `stu-${i + 1}`,
    prn,
    rollNumber,
    name,
    email,
    department: dept.name,
    program: program.name,
    year,
    division: `${year} ${program.code} ${division}`,
    semester,
    attendancePercent,
    cgpa
  };
}

// ==========================================
// 7. CANONICAL SEED TIMETABLE SLOTS
// ==========================================
export const CANONICAL_SEED_TIMETABLE: TimetableEntry[] = [
  // MONDAY
  {
    id: 'tt-entry-001',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Information Technology',
    program: 'B.Sc. Information Technology',
    year: 'SY',
    division: 'SY B.Sc. IT Div A',
    subject: 'Python Programming & Data Structures',
    subjectCode: 'IT401',
    faculty: 'Prof. Rohan Desai',
    facultyEmail: 'rohan.it@sathaye.edu.in',
    room: '204',
    floor: 2,
    day_of_week: 1,
    start_time: '07:30',
    end_time: '08:20',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-002',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Information Technology',
    program: 'B.Sc. Information Technology',
    year: 'SY',
    division: 'SY B.Sc. IT Div A',
    subject: 'Relational Database Management Systems',
    subjectCode: 'IT402',
    faculty: 'Prof. Sunita Patil',
    facultyEmail: 'patil.eng@sathaye.edu.in',
    room: '204',
    floor: 2,
    day_of_week: 1,
    start_time: '08:20',
    end_time: '09:10',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-003',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Information Technology',
    program: 'B.Sc. Information Technology',
    year: 'SY',
    division: 'SY B.Sc. IT Div A',
    batch: 'B1',
    subject: 'Python & Data Structures Laboratory (Batch B1)',
    subjectCode: 'IT401-PR',
    faculty: 'Prof. Rohan Desai',
    facultyEmail: 'rohan.it@sathaye.edu.in',
    room: 'IT-LAB',
    floor: 2,
    day_of_week: 1,
    start_time: '09:30',
    end_time: '11:10',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-004',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Mathematics & Statistics',
    program: 'B.Sc. Information Technology',
    year: 'SY',
    division: 'SY B.Sc. IT Div A',
    subject: 'Discrete Mathematics & Combinatorics',
    subjectCode: 'MAT401',
    faculty: 'Prof. S. R. Joshi',
    facultyEmail: 'joshi.math@sathaye.edu.in',
    room: '204',
    floor: 2,
    day_of_week: 1,
    start_time: '11:15',
    end_time: '12:05',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  // TUESDAY
  {
    id: 'tt-entry-005',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Physics & Electronics',
    program: 'B.Sc. Physics (Honours)',
    year: 'SY',
    division: 'SY B.Sc. Physics Div A',
    subject: 'Quantum Mechanics & Modern Optics',
    subjectCode: 'PHY401',
    faculty: 'Dr. A. V. Kulkarni',
    facultyEmail: 'kulkarni.phys@sathaye.edu.in',
    room: '208',
    floor: 2,
    day_of_week: 2,
    start_time: '08:00',
    end_time: '09:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-006',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Physics & Electronics',
    program: 'B.Sc. Physics (Honours)',
    year: 'SY',
    division: 'SY B.Sc. Physics Div A',
    subject: 'Advanced Optics & Laser Practical Lab',
    subjectCode: 'PHY401-PR',
    faculty: 'Dr. A. V. Kulkarni',
    facultyEmail: 'kulkarni.phys@sathaye.edu.in',
    room: 'PHY-LAB-1',
    floor: 2,
    day_of_week: 2,
    start_time: '09:15',
    end_time: '11:15',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  // WEDNESDAY
  {
    id: 'tt-entry-007',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Chemistry & Biochemistry',
    program: 'B.Sc. Chemistry (Analytical & Organic)',
    year: 'SY',
    division: 'SY B.Sc. Chemistry Div A',
    subject: 'Spectroscopic Techniques & Inorganic Analysis',
    subjectCode: 'CHEM401',
    faculty: 'Dr. R. M. Date',
    facultyEmail: 'date.chem@sathaye.edu.in',
    room: '016',
    floor: 0,
    day_of_week: 3,
    start_time: '08:00',
    end_time: '09:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-008',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Chemistry & Biochemistry',
    program: 'B.Sc. Chemistry (Analytical & Organic)',
    year: 'SY',
    division: 'SY B.Sc. Chemistry Div A',
    subject: 'Qualitative & Quantitative Chemical Analysis',
    subjectCode: 'CHEM401-PR',
    faculty: 'Dr. R. M. Date',
    facultyEmail: 'date.chem@sathaye.edu.in',
    room: 'CHEM-LAB-1',
    floor: 0,
    day_of_week: 3,
    start_time: '09:15',
    end_time: '11:15',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  // THURSDAY
  {
    id: 'tt-entry-009',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Commerce & Business Management',
    program: 'B.Com. General Commercial Studies',
    year: 'SY',
    division: 'SY B.Com Div A',
    subject: 'Corporate Strategic Management',
    subjectCode: 'COM401',
    faculty: 'Prof. K. G. Shah',
    facultyEmail: 'shah.comm@sathaye.edu.in',
    room: '304',
    floor: 3,
    day_of_week: 4,
    start_time: '08:00',
    end_time: '09:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-010',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Accountancy & Auditing',
    program: 'B.Com. Advanced Accountancy & Auditing',
    year: 'SY',
    division: 'SY B.Com Div A',
    subject: 'Direct & Indirect Taxation Standards',
    subjectCode: 'ACC401',
    faculty: 'Prof. R. T. Mehta',
    facultyEmail: 'mehta.acct@sathaye.edu.in',
    room: '305',
    floor: 3,
    day_of_week: 4,
    start_time: '09:00',
    end_time: '10:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  // FRIDAY
  {
    id: 'tt-entry-011',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Economics & Econometrics',
    program: 'B.A. Economics',
    year: 'SY',
    division: 'SY B.A. Economics Div A',
    subject: 'Macroeconomic Theories & Public Finance',
    subjectCode: 'ECO401',
    faculty: 'Dr. V. N. Bapat',
    facultyEmail: 'bapat.eco@sathaye.edu.in',
    room: '202',
    floor: 2,
    day_of_week: 5,
    start_time: '08:30',
    end_time: '09:30',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-012',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Psychology & Behavioural Sciences',
    program: 'B.A. Psychology & Applied Counselling',
    year: 'SY',
    division: 'SY B.A. Psychology Div A',
    subject: 'Cognitive Behavioural Neuropsychology',
    subjectCode: 'PSY401',
    faculty: 'Dr. Medha Dixit',
    facultyEmail: 'dixit.psych@sathaye.edu.in',
    room: '209',
    floor: 2,
    day_of_week: 5,
    start_time: '09:45',
    end_time: '10:45',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  // SATURDAY
  {
    id: 'tt-entry-013',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Microbiology & Biotechnology',
    program: 'B.Sc. Microbiology & Immunology',
    year: 'SY',
    division: 'SY B.Sc. Micro Div A',
    subject: 'Applied Virology & Industrial Fermentation',
    subjectCode: 'MIC401',
    faculty: 'Dr. Neeta Deshmukh',
    facultyEmail: 'deshmukh.micro@sathaye.edu.in',
    room: '113',
    floor: 1,
    day_of_week: 6,
    start_time: '08:00',
    end_time: '09:30',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  },
  {
    id: 'tt-entry-014',
    academic_year: '2025-2026',
    semester: 4,
    department: 'Management Studies (BMS)',
    program: 'Bachelor of Management Studies (BMS)',
    year: 'SY',
    division: 'SY BMS Div A',
    subject: 'Human Resource Management & Leadership',
    subjectCode: 'BMS401',
    faculty: 'Prof. K. G. Shah',
    facultyEmail: 'shah.comm@sathaye.edu.in',
    room: '309',
    floor: 3,
    day_of_week: 6,
    start_time: '10:00',
    end_time: '11:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED',
    created_by: 'demo.admin@sathaye.edu.in',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z'
  }
];

// ==========================================
// 8. TIMETABLE MANAGER STORE CLASS
// ==========================================
class TimetableStore {
  private static instance: TimetableStore;
  private entries: TimetableEntry[] = [...CANONICAL_SEED_TIMETABLE];
  private rooms: AcademicRoom[] = [...ROOMS_48];
  private auditLogs: TimetableAuditRecord[] = [
    {
      id: 'audit-init-01',
      timestamp: '2026-01-02T10:00:00Z',
      adminEmail: 'admin@sathaye.edu.in',
      action: 'PUBLISH',
      entryId: 'all-initial',
      description: 'System initialization of Sathaye Autonomous Semester IV master timetables.'
    }
  ];
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): TimetableStore {
    if (!TimetableStore.instance) {
      TimetableStore.instance = new TimetableStore();
    }
    return TimetableStore.instance;
  }

  private loadFromStorage() {
    try {
      const storedEntries = localStorage.getItem('sathaye_ucm_timetable_entries');
      if (storedEntries) {
        this.entries = JSON.parse(storedEntries);
      }
      const storedRooms = localStorage.getItem('sathaye_ucm_rooms');
      if (storedRooms) {
        this.rooms = JSON.parse(storedRooms);
      }
      const storedAudit = localStorage.getItem('sathaye_ucm_timetable_audit');
      if (storedAudit) {
        this.auditLogs = JSON.parse(storedAudit);
      }
    } catch {
      // fallback to initial
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('sathaye_ucm_timetable_entries', JSON.stringify(this.entries));
      localStorage.setItem('sathaye_ucm_rooms', JSON.stringify(this.rooms));
      localStorage.setItem('sathaye_ucm_timetable_audit', JSON.stringify(this.auditLogs));
    } catch {
      // storage unavailable
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sathaye_timetable_updated'));
    }
  }

  // --- QUERY METHODS ---
  public getEntries(): TimetableEntry[] {
    return [...this.entries];
  }

  public getPublishedEntries(): TimetableEntry[] {
    return this.entries.filter(e => e.status === 'PUBLISHED');
  }

  public getRooms(): AcademicRoom[] {
    return [...this.rooms];
  }

  public getAuditHistory(): TimetableAuditRecord[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- CONFLICT DETECTION ENGINE ---
  /**
   * Evaluates time overlaps: StartA < EndB AND EndA > StartB
   */
  public detectConflicts(candidate: {
    id?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    room: string;
    faculty: string;
    division: string;
    batch?: string;
    subject?: string;
  }): TimetableConflict[] {
    const conflicts: TimetableConflict[] = [];

    // Order check
    if (candidate.start_time >= candidate.end_time) {
      conflicts.push({
        type: 'DUPLICATE_ENTRY',
        message: 'Class start time must precede end time.',
        conflictingEntry: candidate as any
      });
      return conflicts;
    }

    for (const existing of this.entries) {
      if (candidate.id && existing.id === candidate.id) continue;
      if (existing.day_of_week !== Number(candidate.day_of_week)) continue;
      if (existing.status === 'ARCHIVED') continue;

      const isOverlapping = candidate.start_time < existing.end_time && candidate.end_time > existing.start_time;
      if (!isOverlapping) continue;

      // 1. ROOM CONFLICT
      if (candidate.room && existing.room.toLowerCase() === candidate.room.toLowerCase()) {
        conflicts.push({
          type: 'ROOM_CONFLICT',
          message: `Room ${candidate.room} is already booked for ${existing.subject} (${existing.division}) from ${existing.start_time} to ${existing.end_time}.`,
          conflictingEntry: existing
        });
      }

      // 2. FACULTY CONFLICT
      if (candidate.faculty && existing.faculty.toLowerCase() === candidate.faculty.toLowerCase()) {
        conflicts.push({
          type: 'FACULTY_CONFLICT',
          message: `${candidate.faculty} is already assigned to teach ${existing.subject} in Room ${existing.room} from ${existing.start_time} to ${existing.end_time}.`,
          conflictingEntry: existing
        });
      }

      // 3. DIVISION / BATCH CONFLICT
      if (candidate.division && existing.division.toLowerCase() === candidate.division.toLowerCase()) {
        const sameBatch = (!candidate.batch || !existing.batch || candidate.batch === existing.batch);
        if (sameBatch) {
          conflicts.push({
            type: 'DIVISION_CONFLICT',
            message: `Division ${candidate.division} ${candidate.batch ? `(${candidate.batch})` : ''} already has ${existing.subject} scheduled from ${existing.start_time} to ${existing.end_time}.`,
            conflictingEntry: existing
          });
        }
      }

      // 4. DUPLICATE ENTRY CONFLICT
      if (
        candidate.room === existing.room &&
        candidate.faculty === existing.faculty &&
        candidate.subject === existing.subject &&
        candidate.division === existing.division
      ) {
        conflicts.push({
          type: 'DUPLICATE_ENTRY',
          message: `Identical class timetable entry already exists in the system.`,
          conflictingEntry: existing
        });
      }
    }

    return conflicts;
  }

  // --- CRUD OPERATIONS ---
  public createEntry(
    input: Omit<TimetableEntry, 'id' | 'created_at' | 'updated_at'>,
    adminEmail = 'admin@sathaye.edu.in'
  ): { success: boolean; entry?: TimetableEntry; conflicts?: TimetableConflict[]; error?: string } {
    const conflicts = this.detectConflicts(input);
    if (conflicts.length > 0) {
      return { success: false, conflicts, error: conflicts[0].message };
    }

    const roomObj = this.rooms.find(r => r.roomNumber.toLowerCase() === input.room.toLowerCase());
    const floor = roomObj ? roomObj.floor : input.floor || 0;

    const newEntry: TimetableEntry = {
      ...input,
      floor,
      id: `tt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.entries.push(newEntry);
    this.recordAudit(adminEmail, 'CREATE', newEntry.id, undefined, newEntry, `Created slot for ${newEntry.subject} in Room ${newEntry.room}`);
    this.saveToStorage();

    return { success: true, entry: newEntry };
  }

  public updateEntry(
    id: string,
    updates: Partial<TimetableEntry>,
    adminEmail = 'admin@sathaye.edu.in'
  ): { success: boolean; entry?: TimetableEntry; conflicts?: TimetableConflict[]; error?: string } {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Timetable entry not found.' };
    }

    const current = this.entries[index];
    const candidate = { ...current, ...updates, id };
    const conflicts = this.detectConflicts(candidate);
    if (conflicts.length > 0) {
      return { success: false, conflicts, error: conflicts[0].message };
    }

    const updatedEntry: TimetableEntry = {
      ...candidate,
      updated_at: new Date().toISOString()
    };

    this.entries[index] = updatedEntry;
    this.recordAudit(adminEmail, 'UPDATE', id, current, updatedEntry, `Updated class ${updatedEntry.subject}`);
    this.saveToStorage();

    return { success: true, entry: updatedEntry };
  }

  public deleteEntry(id: string, adminEmail = 'admin@sathaye.edu.in'): boolean {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return false;
    const removed = this.entries[index];
    this.entries.splice(index, 1);
    this.recordAudit(adminEmail, 'DELETE', id, removed, undefined, `Deleted timetable slot for ${removed.subject}`);
    this.saveToStorage();
    return true;
  }

  public duplicateEntry(
    id: string,
    targetDayOfWeek?: number,
    adminEmail = 'admin@sathaye.edu.in'
  ): { success: boolean; entry?: TimetableEntry; conflicts?: TimetableConflict[]; error?: string } {
    const source = this.entries.find(e => e.id === id);
    if (!source) return { success: false, error: 'Source timetable slot not found.' };

    const candidate = {
      ...source,
      day_of_week: targetDayOfWeek ?? (source.day_of_week % 6 + 1),
      status: 'DRAFT' as const
    };

    const conflicts = this.detectConflicts(candidate);
    if (conflicts.length > 0) {
      return { success: false, conflicts, error: conflicts[0].message };
    }

    const duplicatedEntry: TimetableEntry = {
      ...candidate,
      id: `tt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.entries.push(duplicatedEntry);
    this.recordAudit(adminEmail, 'DUPLICATE', duplicatedEntry.id, source, duplicatedEntry, `Duplicated slot ${source.subject} to Day ${duplicatedEntry.day_of_week}`);
    this.saveToStorage();

    return { success: true, entry: duplicatedEntry };
  }

  // --- PUBLISHING WORKFLOWS ---
  public publishTimetable(division?: string, adminEmail = 'admin@sathaye.edu.in'): { publishedCount: number } {
    let count = 0;
    this.entries = this.entries.map(entry => {
      if (!division || entry.division.toLowerCase().includes(division.toLowerCase())) {
        if (entry.status !== 'PUBLISHED') {
          count++;
          return { ...entry, status: 'PUBLISHED', updated_at: new Date().toISOString() };
        }
      }
      return entry;
    });

    if (count > 0) {
      this.recordAudit(adminEmail, 'PUBLISH', 'multiple', undefined, undefined, `Published ${count} timetable slots for ${division || 'all divisions'}`);
      this.saveToStorage();
    }
    return { publishedCount: count };
  }

  public unpublishTimetable(division?: string, adminEmail = 'admin@sathaye.edu.in'): { unpublishedCount: number } {
    let count = 0;
    this.entries = this.entries.map(entry => {
      if (!division || entry.division.toLowerCase().includes(division.toLowerCase())) {
        if (entry.status === 'PUBLISHED') {
          count++;
          return { ...entry, status: 'DRAFT', updated_at: new Date().toISOString() };
        }
      }
      return entry;
    });

    if (count > 0) {
      this.recordAudit(adminEmail, 'UNPUBLISH', 'multiple', undefined, undefined, `Unpublished ${count} timetable slots`);
      this.saveToStorage();
    }
    return { unpublishedCount: count };
  }

  // --- ROOM CHANGE WORKFLOW ---
  public changeRoom(
    entryId: string,
    newRoomNumber: string,
    reason: string,
    adminEmail = 'admin@sathaye.edu.in'
  ): { success: boolean; error?: string; notificationMessage?: string } {
    const entry = this.entries.find(e => e.id === entryId);
    if (!entry) return { success: false, error: 'Timetable entry not found.' };

    const targetRoom = this.rooms.find(r => r.roomNumber.toLowerCase() === newRoomNumber.toLowerCase());
    if (!targetRoom) return { success: false, error: `Target room ${newRoomNumber} does not exist.` };

    // Check if target room has conflict at that time
    const candidate = { ...entry, room: targetRoom.roomNumber, floor: targetRoom.floor };
    const conflicts = this.detectConflicts(candidate);
    const roomConflict = conflicts.find(c => c.type === 'ROOM_CONFLICT');
    if (roomConflict) {
      return { success: false, error: roomConflict.message };
    }

    const previousRoom = entry.room;
    entry.room = targetRoom.roomNumber;
    entry.floor = targetRoom.floor;
    entry.updated_at = new Date().toISOString();

    const notifMsg = `Room Change Notice: ${entry.subject} (${entry.division}) scheduled for ${entry.start_time}-${entry.end_time} has been relocated from Room ${previousRoom} to Room ${targetRoom.roomNumber} (${targetRoom.floor === 0 ? 'Ground' : targetRoom.floor + (targetRoom.floor === 1 ? 'st' : targetRoom.floor === 2 ? 'nd' : 'rd')} Floor). Reason: ${reason}`;

    this.recordAudit(adminEmail, 'ROOM_CHANGE', entryId, { room: previousRoom }, { room: targetRoom.roomNumber }, notifMsg);
    this.saveToStorage();

    // Dispatch custom event for notifications
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sathaye_room_changed', {
        detail: { entry, previousRoom, newRoom: targetRoom.roomNumber, reason, notifMsg }
      }));
    }

    return { success: true, notificationMessage: notifMsg };
  }

  // --- AUDIT LOGGING ---
  private recordAudit(
    adminEmail: string,
    action: TimetableAuditRecord['action'],
    entryId: string,
    previousValue?: Partial<TimetableEntry>,
    newValue?: Partial<TimetableEntry>,
    description = ''
  ) {
    const log: TimetableAuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      adminEmail,
      action,
      entryId,
      previousValue,
      newValue,
      description
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  // --- ROOM OCCUPANCY & DYNAMIC ENGINE ---
  /**
   * Calculates real-time room occupancy based on published timetable entries.
   * Statuses:
   * - GREEN (AVAILABLE)
   * - RED (OCCUPIED)
   * - YELLOW (MAINTENANCE)
   * - GRAY (INACTIVE)
   */
  public getRoomState(roomNumber: string, simulatedDate?: Date): RoomOccupancyState {
    const room = this.rooms.find(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase()) || {
      id: `rm-${roomNumber}`,
      roomNumber,
      name: `Room ${roomNumber}`,
      building: 'Main Block',
      floor: 1,
      roomType: 'CLASSROOM' as const,
      capacity: 60,
      equipment: { projector: true, ac: false, whiteboard: true, wifi: true },
      isAccessible: true,
      isMaintenance: false,
      isInactive: false,
      xCoord: 50,
      yCoord: 50
    };

    if (room.isInactive) {
      return {
        roomId: room.id,
        roomNumber,
        status: 'INACTIVE',
        currentClass: null,
        nextClass: null,
        todaySchedule: []
      };
    }

    if (room.isMaintenance) {
      return {
        roomId: room.id,
        roomNumber,
        status: 'MAINTENANCE',
        currentClass: null,
        nextClass: null,
        todaySchedule: []
      };
    }

    const now = simulatedDate || new Date();
    // JS: 0=Sun, 1=Mon, 2=Tue... 6=Sat
    let dayOfWeek = now.getDay();
    if (dayOfWeek === 0) dayOfWeek = 1; // Default Sunday mock to Monday for testing

    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMins = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    // Get today's published entries for this room
    const todayEntries = this.entries
      .filter(e => e.status === 'PUBLISHED' && e.room.toLowerCase() === roomNumber.toLowerCase() && e.day_of_week === dayOfWeek)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    let activeClass = null;
    let nextClass = null;

    for (const e of todayEntries) {
      if (currentTimeStr >= e.start_time && currentTimeStr < e.end_time) {
        // Active class ongoing
        const [endH, endM] = e.end_time.split(':').map(Number);
        const remMins = (endH * 60 + endM) - (now.getHours() * 60 + now.getMinutes());
        activeClass = {
          subject: e.subject,
          faculty: e.faculty,
          division: e.division,
          startTime: e.start_time,
          endTime: e.end_time,
          remainingMinutes: Math.max(1, remMins)
        };
      } else if (currentTimeStr < e.start_time && !nextClass) {
        // First upcoming class today
        const [startH, startM] = e.start_time.split(':').map(Number);
        const diffMins = (startH * 60 + startM) - (now.getHours() * 60 + now.getMinutes());
        nextClass = {
          subject: e.subject,
          faculty: e.faculty,
          division: e.division,
          startTime: e.start_time,
          endTime: e.end_time,
          startsInMinutes: Math.max(1, diffMins)
        };
      }
    }

    return {
      roomId: room.id,
      roomNumber,
      status: activeClass ? 'OCCUPIED' : 'AVAILABLE',
      currentClass: activeClass,
      nextClass,
      todaySchedule: todayEntries
    };
  }

  // --- NEXT CLASS ENGINE (FOR STUDENT & FACULTY) ---
  public getStudentNextClass(division: string, simulatedDate?: Date): StudentNextClassResult {
    const now = simulatedDate || new Date();
    let dayOfWeek = now.getDay();
    if (dayOfWeek === 0) dayOfWeek = 1;

    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMins = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    const studentClasses = this.entries
      .filter(e => e.status === 'PUBLISHED' && e.day_of_week === dayOfWeek && e.division.toLowerCase().includes(division.toLowerCase()))
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    // Check ongoing
    const ongoing = studentClasses.find(e => currentTimeStr >= e.start_time && currentTimeStr < e.end_time);
    if (ongoing) {
      const [endH, endM] = ongoing.end_time.split(':').map(Number);
      const rem = (endH * 60 + endM) - (now.getHours() * 60 + now.getMinutes());
      return {
        hasUpcoming: true,
        subject: ongoing.subject,
        faculty: ongoing.faculty,
        room: ongoing.room,
        floor: ongoing.floor,
        floorLabel: ongoing.floor === 0 ? 'Ground Floor' : `${ongoing.floor}${ongoing.floor === 1 ? 'st' : ongoing.floor === 2 ? 'nd' : 'rd'} Floor`,
        startTime: ongoing.start_time,
        endTime: ongoing.end_time,
        startsInMinutes: 0,
        isOngoing: true
      };
    }

    // Check upcoming
    const upcoming = studentClasses.find(e => currentTimeStr < e.start_time);
    if (upcoming) {
      const [stH, stM] = upcoming.start_time.split(':').map(Number);
      const diff = (stH * 60 + stM) - (now.getHours() * 60 + now.getMinutes());
      return {
        hasUpcoming: true,
        subject: upcoming.subject,
        faculty: upcoming.faculty,
        room: upcoming.room,
        floor: upcoming.floor,
        floorLabel: upcoming.floor === 0 ? 'Ground Floor' : `${upcoming.floor}${upcoming.floor === 1 ? 'st' : upcoming.floor === 2 ? 'nd' : 'rd'} Floor`,
        startTime: upcoming.start_time,
        endTime: upcoming.end_time,
        startsInMinutes: Math.max(1, diff),
        isOngoing: false
      };
    }

    // Fallback to first class tomorrow or Monday
    if (studentClasses.length > 0) {
      const first = studentClasses[0];
      return {
        hasUpcoming: true,
        subject: first.subject,
        faculty: first.faculty,
        room: first.room,
        floor: first.floor,
        floorLabel: first.floor === 0 ? 'Ground Floor' : `${first.floor}${first.floor === 1 ? 'st' : first.floor === 2 ? 'nd' : 'rd'} Floor`,
        startTime: first.start_time,
        endTime: first.end_time,
        startsInMinutes: 720,
        isOngoing: false
      };
    }

    return {
      hasUpcoming: false,
      subject: 'No Scheduled Class',
      faculty: 'N/A',
      room: 'N/A',
      floor: 0,
      floorLabel: 'Campus Quadrangle',
      startTime: '--:--',
      endTime: '--:--',
      startsInMinutes: 0,
      isOngoing: false
    };
  }

  // --- ADMIN ROOM METADATA EDIT ---
  public updateRoomAdmin(
    roomNumber: string,
    updates: Partial<AcademicRoom>,
    adminEmail = 'admin@sathaye.edu.in'
  ): { success: boolean; room?: AcademicRoom } {
    const index = this.rooms.findIndex(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase());
    if (index === -1) return { success: false };

    const updated = { ...this.rooms[index], ...updates };
    this.rooms[index] = updated;

    this.recordAudit(adminEmail, 'UPDATE', updated.id, undefined, undefined, `Updated room parameters for ${roomNumber}`);
    this.saveToStorage();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sathaye_room_updated', { detail: { room: updated } }));
    }

    return { success: true, room: updated };
  }
}

export const timetableService = TimetableStore.getInstance();
