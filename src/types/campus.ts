export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN' | 'CANTEEN' | 'LIBRARY';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  facultyId?: string;
  email: string;
  avatar?: string;
  division?: string;
  semester?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  prn?: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  floors: number[];
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  description: string;
  hasElevator: boolean;
  hasRamp: boolean;
}

export type LocationType = 
  | 'classroom' 
  | 'lab' 
  | 'library' 
  | 'canteen' 
  | 'office' 
  | 'sports' 
  | 'medical' 
  | 'washroom' 
  | 'auditorium' 
  | 'admin'
  | 'parking';

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  buildingId: string;
  buildingName: string;
  floorNumber: number;
  floorLabel: string;
  x: number;
  y: number;
  capacity?: number;
  department?: string;
  isAccessible: boolean;
  description: string;
  status: 'available' | 'occupied' | 'maintenance';
  openingHours?: string;
}

export interface NavigationRoute {
  fromLocation: CampusLocation;
  toLocation: CampusLocation;
  distanceMeters: number;
  durationMinutes: number;
  isWheelchairAccessible: boolean;
  steps: string[];
  pathPoints: { x: number; y: number }[];
}

export interface ClassScheduleItem {
  id: string;
  subject: string;
  subjectCode: string;
  room: string;
  roomId: string;
  building: string;
  floor: string;
  facultyName: string;
  facultyId: string;
  department: string;
  day: string;
  startTime: string;
  endTime: string;
  batch: string;
  isNext?: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  classId: string;
  facultyId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  facultyId: string;
  facultyName: string;
  deadline: string;
  attachmentUrl?: string;
  submissionsCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  notes?: string;
  marks?: number;
  status: 'Submitted' | 'Graded';
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'notes';
  url: string;
  subject: string;
  department: string;
  semester: string;
  facultyId: string;
  facultyName: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetCourse: string;
  targetDepartment: string;
  targetBatch: string;
  facultyId: string;
  facultyName: string;
  scheduledAt: string;
  attachmentUrl?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'cultural' | 'academic' | 'sports' | 'workshop' | 'hackathon' | 'club';
  date: string;
  time: string;
  location: string;
  locationId?: string;
  description: string;
  organizer: string;
  registrationOpen: boolean;
  registeredCount: number;
  image: string;
  isFeatured?: boolean;
  status?: 'APPROVED' | 'PENDING' | 'CANCELLED';
  capacity?: number;
  venue?: string;
}

export interface CampusIssue {
  id: string;
  title: string;
  category: 'Electrical' | 'Plumbing' | 'Wi-Fi' | 'AC' | 'Furniture' | 'Cleanliness' | 'Security' | 'Equipment' | 'Infrastructure';
  description: string;
  locationId: string;
  locationName: string;
  reportedByUserId: string;
  reportedByName: string;
  reportedByRole: UserRole;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  imageUrl?: string;
  createdAt: string;
  assignedTo?: string;
  resolvedAt?: string;
}

export interface LostFoundItem {
  id: string;
  type: 'LOST' | 'FOUND';
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  reportedBy: string;
  contact: string;
  status: 'OPEN' | 'CLAIMED' | 'RESOLVED';
  matchedItemId?: string;
  similarityScore?: number;
}

export type CanteenOrderStatus = 
  | 'CART'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CanteenItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Snacks' | 'Meals' | 'Beverages' | 'Healthy';
  price: number;
  isAvailable: boolean;
  prepTimeMinutes: number;
  calories?: number;
  image?: string;
  rating: number;
  isVeg: boolean;
  description?: string;
}

export interface CanteenOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CanteenOrder {
  id: string;
  studentId: string;
  studentName: string;
  items: CanteenOrderItem[];
  totalAmount: number;
  status: CanteenOrderStatus;
  tokenNumber: number;
  estimatedTime: string;
  createdAt: string;
  pickupSlot?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  department: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage?: string;
  tags: string[];
}

export interface LibraryBorrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  studentId: string;
  studentName: string;
  issuedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'REQUESTED' | 'APPROVED' | 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

export interface LibrarySeatZone {
  name: string;
  total: number;
  occupied: number;
  isAccessible: boolean;
}

export interface LibraryIssue {
  id: string;
  studentId: string;
  studentName: string;
  bookId?: string;
  title: string;
  description: string;
  status: 'Reported' | 'In Review' | 'Resolved';
  createdAt: string;
  visibleInAdmin: boolean;
}

export interface CampusNotification {
  id: string;
  userId?: string;
  targetRole?: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'class' | 'assignment' | 'exam' | 'event' | 'alert' | 'emergency' | 'attendance' | 'lost_found' | 'canteen' | 'library' | 'maintenance';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
  linkAction?: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  dept: string;
  phone: string;
  location: string;
  description: string;
  is24x7: boolean;
}

export interface CampusAsset {
  id: string;
  name: string;
  category: 'Projector' | 'Computer' | 'AC' | 'Printer' | 'Laboratory equipment' | 'Furniture' | 'Network' | 'Electrical';
  locationId: string;
  locationName: string;
  purchaseDate: string;
  status: 'Operational' | 'Under Maintenance' | 'Needs Service' | 'Decommissioned';
  lastMaintenanceDate: string;
  nextScheduledMaintenance: string;
  assignedTeam: string;
  serialNumber?: string;
  healthScore: number;
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  assetId?: string;
  assetName?: string;
  locationId: string;
  locationName: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  technician: string;
  status: 'Ticket' | 'Assigned' | 'Scheduled' | 'In Progress' | 'Completed' | 'Verified';
  estimatedCompletion: string;
  actualCompletion?: string;
  notes?: string;
  reportedBy: string;
  createdAt: string;
  sparePartsUsed?: string[];
}

export interface CampusTechnician {
  id: string;
  name: string;
  trade: 'Electrical' | 'HVAC / AC' | 'IT & Hardware' | 'Plumbing' | 'Carpentry' | 'General Facilities';
  phone: string;
  activeTickets: number;
  status: 'Available' | 'On Job' | 'Off Duty';
}

export interface AdminAuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface DigitalCampusID {
  id: string;
  studentOrStaffId: string;
  name: string;
  role: UserRole;
  department: string;
  year?: string;
  division?: string;
  avatar?: string;
  qrToken: string;
  validUntil: string;
  status: 'Active' | 'Suspended' | 'Expired';
  permissions: {
    library: 'VALID' | 'RESTRICTED';
    event: 'REGISTERED' | 'NOT_REGISTERED';
    lab: 'AUTHORIZED' | 'REVOKED';
    facility: 'AUTHORIZED' | 'RESTRICTED';
  };
}
