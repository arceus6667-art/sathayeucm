/**
 * Sathaye UCM: Synthetic Data Seed Script
 * Generates initial synthetic data for local development and Supabase database seeding.
 * Run with: npx tsx scripts/seed.ts
 */

export interface SeedDepartment {
  id: string;
  code: string;
  name: string;
  headOfDept: string;
  building: string;
  floor: number;
}

export interface SeedRoom {
  id: string;
  roomNumber: string;
  name: string;
  building: string;
  floor: number;
  roomType: 'CLASSROOM' | 'LABORATORY' | 'AUDITORIUM' | 'SEMINAR_HALL' | 'LIBRARY' | 'CANTEEN' | 'ADMIN_OFFICE';
  capacity: number;
  hasProjector: boolean;
  hasAc: boolean;
  isAccessible: boolean;
  xCoord: number;
  yCoord: number;
}

export interface SeedTimetableEntry {
  id: string;
  dayOfWeek: number; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  startTime: string; // '08:00'
  endTime: string;   // '09:00'
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  facultyEmail: string;
  roomNumber: string;
  divisionName: string;
  batchName?: string;
  sessionType: 'LECTURE' | 'PRACTICAL' | 'TUTORIAL' | 'BREAK';
}

export const SEED_DEPARTMENTS: SeedDepartment[] = [
  { id: 'dept-it', code: 'BSC-IT', name: 'Information Technology', headOfDept: 'Prof. Rohan Desai', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-cs', code: 'BSC-CS', name: 'Computer Science', headOfDept: 'Dr. Sunita Patil', building: 'Main Academic Block', floor: 2 },
  { id: 'dept-phy', code: 'PHY', name: 'Physics & Electronics', headOfDept: 'Dr. A. V. Kulkarni', building: 'Science Complex', floor: 2 },
  { id: 'dept-chem', code: 'CHEM', name: 'Chemistry & Biochemistry', headOfDept: 'Dr. R. M. Date', building: 'Science Complex', floor: 2 },
  { id: 'dept-math', code: 'MATH', name: 'Mathematics & Statistics', headOfDept: 'Prof. S. R. Joshi', building: 'Main Academic Block', floor: 3 },
  { id: 'dept-comm', code: 'COMM', name: 'Commerce & Accountancy', headOfDept: 'Prof. K. G. Shah', building: 'Main Academic Block', floor: 1 },
  { id: 'dept-arts', code: 'ARTS', name: 'Arts & Mass Media', headOfDept: 'Dr. Medha Dixit', building: 'Main Academic Block', floor: 1 },
];

export const SEED_ROOMS: SeedRoom[] = [
  // Ground Floor
  { id: 'room-001', roomNumber: '001', name: "Principal's Executive Chamber", building: 'Main Academic Block', floor: 0, roomType: 'ADMIN_OFFICE', capacity: 15, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 22, yCoord: 35 },
  { id: 'room-002', roomNumber: '002', name: 'Central Administration & Accounts', building: 'Main Academic Block', floor: 0, roomType: 'ADMIN_OFFICE', capacity: 30, hasProjector: false, hasAc: true, isAccessible: true, xCoord: 32, yCoord: 35 },
  { id: 'room-003', roomNumber: '003', name: 'Faculty Common Room (Ground)', building: 'Main Academic Block', floor: 0, roomType: 'ADMIN_OFFICE', capacity: 40, hasProjector: false, hasAc: true, isAccessible: true, xCoord: 45, yCoord: 35 },
  { id: 'room-005', roomNumber: '005', name: 'Campus Cafeteria & Canteen Counter', building: 'Cafeteria Pavilion', floor: 0, roomType: 'CANTEEN', capacity: 180, hasProjector: false, hasAc: false, isAccessible: true, xCoord: 78, yCoord: 70 },
  { id: 'room-008', roomNumber: '008', name: 'K. R. C. Main Auditorium', building: 'Main Academic Block', floor: 0, roomType: 'AUDITORIUM', capacity: 450, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 70, yCoord: 30 },
  
  // Floor 1
  { id: 'room-101', roomNumber: '101', name: 'Knowledge Resource Center (Central Library)', building: 'Main Academic Block', floor: 1, roomType: 'LIBRARY', capacity: 250, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 25, yCoord: 40 },
  { id: 'room-102', roomNumber: '102', name: 'Lecture Hall 102 (Commerce & Arts)', building: 'Main Academic Block', floor: 1, roomType: 'CLASSROOM', capacity: 120, hasProjector: true, hasAc: false, isAccessible: true, xCoord: 50, yCoord: 40 },
  { id: 'room-104', roomNumber: '104', name: 'Lecture Hall 104 (Interactive Classroom)', building: 'Main Academic Block', floor: 1, roomType: 'CLASSROOM', capacity: 100, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 65, yCoord: 40 },
  { id: 'room-108', roomNumber: '108', name: 'Digital Media & Studio Lab', building: 'Main Academic Block', floor: 1, roomType: 'LABORATORY', capacity: 45, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 80, yCoord: 40 },

  // Floor 2
  { id: 'room-201', roomNumber: '201', name: 'Advanced Computer Lab A (IT & CS)', building: 'Main Academic Block', floor: 2, roomType: 'LABORATORY', capacity: 50, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 25, yCoord: 45 },
  { id: 'room-204', roomNumber: '204', name: 'Smart Classroom 204 (B.Sc. IT Core)', building: 'Main Academic Block', floor: 2, roomType: 'CLASSROOM', capacity: 80, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 48, yCoord: 45 },
  { id: 'room-206', roomNumber: '206', name: 'Physics & Optics Research Laboratory', building: 'Science Complex', floor: 2, roomType: 'LABORATORY', capacity: 45, hasProjector: true, hasAc: false, isAccessible: false, xCoord: 68, yCoord: 45 },
  { id: 'room-208', roomNumber: '208', name: 'Chemistry & Chromatography Laboratory', building: 'Science Complex', floor: 2, roomType: 'LABORATORY', capacity: 45, hasProjector: false, hasAc: false, isAccessible: false, xCoord: 82, yCoord: 45 },

  // Floor 3
  { id: 'room-301', roomNumber: '301', name: 'Mathematics & Data Analytics Lab', building: 'Main Academic Block', floor: 3, roomType: 'LABORATORY', capacity: 40, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 25, yCoord: 50 },
  { id: 'room-304', roomNumber: '304', name: 'Dean & Senate Conference Hall', building: 'Main Academic Block', floor: 3, roomType: 'SEMINAR_HALL', capacity: 90, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 52, yCoord: 50 },
  { id: 'room-308', roomNumber: '308', name: 'Embedded Systems & IoT Laboratory', building: 'Main Academic Block', floor: 3, roomType: 'LABORATORY', capacity: 35, hasProjector: true, hasAc: true, isAccessible: true, xCoord: 78, yCoord: 50 }
];

export const SEED_TIMETABLE: SeedTimetableEntry[] = [
  // Monday
  { id: 'tt-m1', dayOfWeek: 1, startTime: '07:30', endTime: '08:20', subjectCode: 'IT201', subjectName: 'Python Programming & Data Structures', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-m2', dayOfWeek: 1, startTime: '08:20', endTime: '09:10', subjectCode: 'IT202', subjectName: 'Database Management Systems', facultyName: 'Dr. Sunita Patil', facultyEmail: 'english.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-m3', dayOfWeek: 1, startTime: '09:10', endTime: '09:30', subjectCode: 'RECESS', subjectName: 'Morning Refreshment Break', facultyName: 'N/A', facultyEmail: '', roomNumber: '005', divisionName: 'SYBSc-IT Div A', sessionType: 'BREAK' },
  { id: 'tt-m4', dayOfWeek: 1, startTime: '09:30', endTime: '11:10', subjectCode: 'IT201-PR', subjectName: 'Python Practical Lab (Batch B1)', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '201', divisionName: 'SYBSc-IT Div A', batchName: 'B1', sessionType: 'PRACTICAL' },
  { id: 'tt-m5', dayOfWeek: 1, startTime: '11:15', endTime: '12:05', subjectCode: 'MAT201', subjectName: 'Applied Discrete Mathematics', facultyName: 'Prof. S. R. Joshi', facultyEmail: 'math.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },

  // Tuesday
  { id: 'tt-t1', dayOfWeek: 2, startTime: '07:30', endTime: '08:20', subjectCode: 'IT203', subjectName: 'Computer Networks & Security', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-t2', dayOfWeek: 2, startTime: '08:20', endTime: '09:10', subjectCode: 'IT204', subjectName: 'Software Engineering Principles', facultyName: 'Dr. Sunita Patil', facultyEmail: 'english.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-t3', dayOfWeek: 2, startTime: '09:10', endTime: '09:30', subjectCode: 'RECESS', subjectName: 'Morning Refreshment Break', facultyName: 'N/A', facultyEmail: '', roomNumber: '005', divisionName: 'SYBSc-IT Div A', sessionType: 'BREAK' },
  { id: 'tt-t4', dayOfWeek: 2, startTime: '09:30', endTime: '11:10', subjectCode: 'IT202-PR', subjectName: 'DBMS SQL Practical Lab (Batch B2)', facultyName: 'Dr. Sunita Patil', facultyEmail: 'english.faculty01@sathaye.edu', roomNumber: '201', divisionName: 'SYBSc-IT Div A', batchName: 'B2', sessionType: 'PRACTICAL' },
  { id: 'tt-t5', dayOfWeek: 2, startTime: '11:15', endTime: '12:05', subjectCode: 'IT205', subjectName: 'Modern Web Development with React', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },

  // Wednesday
  { id: 'tt-w1', dayOfWeek: 3, startTime: '07:30', endTime: '08:20', subjectCode: 'MAT201', subjectName: 'Applied Discrete Mathematics', facultyName: 'Prof. S. R. Joshi', facultyEmail: 'math.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-w2', dayOfWeek: 3, startTime: '08:20', endTime: '09:10', subjectCode: 'IT201', subjectName: 'Python Programming & Data Structures', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-w3', dayOfWeek: 3, startTime: '09:10', endTime: '09:30', subjectCode: 'RECESS', subjectName: 'Morning Refreshment Break', facultyName: 'N/A', facultyEmail: '', roomNumber: '005', divisionName: 'SYBSc-IT Div A', sessionType: 'BREAK' },
  { id: 'tt-w4', dayOfWeek: 3, startTime: '09:30', endTime: '11:10', subjectCode: 'IT203-PR', subjectName: 'Network Packet Sniffing Lab (Batch B3)', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '201', divisionName: 'SYBSc-IT Div A', batchName: 'B3', sessionType: 'PRACTICAL' },
  { id: 'tt-w5', dayOfWeek: 3, startTime: '11:15', endTime: '12:05', subjectCode: 'IT204', subjectName: 'Software Engineering Principles', facultyName: 'Dr. Sunita Patil', facultyEmail: 'english.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },

  // Thursday
  { id: 'tt-th1', dayOfWeek: 4, startTime: '07:30', endTime: '08:20', subjectCode: 'IT202', subjectName: 'Database Management Systems', facultyName: 'Dr. Sunita Patil', facultyEmail: 'english.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-th2', dayOfWeek: 4, startTime: '08:20', endTime: '09:10', subjectCode: 'IT205', subjectName: 'Modern Web Development with React', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-th3', dayOfWeek: 4, startTime: '09:10', endTime: '09:30', subjectCode: 'RECESS', subjectName: 'Morning Refreshment Break', facultyName: 'N/A', facultyEmail: '', roomNumber: '005', divisionName: 'SYBSc-IT Div A', sessionType: 'BREAK' },
  { id: 'tt-th4', dayOfWeek: 4, startTime: '09:30', endTime: '11:10', subjectCode: 'IT205-PR', subjectName: 'Full-Stack Web Lab (All Batches)', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '201', divisionName: 'SYBSc-IT Div A', sessionType: 'PRACTICAL' },

  // Friday
  { id: 'tt-f1', dayOfWeek: 5, startTime: '07:30', endTime: '08:20', subjectCode: 'IT203', subjectName: 'Computer Networks & Security', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-f2', dayOfWeek: 5, startTime: '08:20', endTime: '09:10', subjectCode: 'MAT201', subjectName: 'Applied Discrete Mathematics', facultyName: 'Prof. S. R. Joshi', facultyEmail: 'math.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' },
  { id: 'tt-f3', dayOfWeek: 5, startTime: '09:10', endTime: '09:30', subjectCode: 'RECESS', subjectName: 'Morning Refreshment Break', facultyName: 'N/A', facultyEmail: '', roomNumber: '005', divisionName: 'SYBSc-IT Div A', sessionType: 'BREAK' },
  { id: 'tt-f4', dayOfWeek: 5, startTime: '09:30', endTime: '11:00', subjectCode: 'IT-TUT', subjectName: 'Technical Seminar & Doubt Clearing', facultyName: 'Prof. Rohan Desai', facultyEmail: 'it.faculty01@sathaye.edu', roomNumber: '204', divisionName: 'SYBSc-IT Div A', sessionType: 'TUTORIAL' },

  // Saturday
  { id: 'tt-s1', dayOfWeek: 6, startTime: '08:00', endTime: '10:00', subjectCode: 'IND-EXPO', subjectName: 'Guest Lecture & Industry Expert Interaction', facultyName: 'Guest Speaker', facultyEmail: '', roomNumber: '008', divisionName: 'SYBSc-IT Div A', sessionType: 'LECTURE' }
];

console.log('Seed dataset loaded. Departments:', SEED_DEPARTMENTS.length, 'Rooms:', SEED_ROOMS.length, 'Timetable slots:', SEED_TIMETABLE.length);
