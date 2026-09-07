/**
 * Sathaye UCM: 2D Campus Map & Spatial Routing Engine
 * Coordinates are normalized (0 - 100%) against the master campus image: Screenshot 2026-09-07 114708.png
 */

export interface CampusMapFloor {
  id: number;
  name: string;
  code: string;
  quadrant: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    viewBox: string;
  };
  description: string;
}

export interface CampusMapMarker {
  id: string;
  floor: number; // 0=Ground, 1=1st, 2=2nd, 3=3rd
  name: string;
  roomNumber?: string;
  department?: string;
  category: 'ACADEMIC' | 'LAB' | 'LIBRARY' | 'CANTEEN' | 'ADMIN' | 'FACILITY' | 'EMERGENCY';
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  widthPercent?: number;
  heightPercent?: number;
  isAccessible: boolean;
  isVerified: boolean;
  capacity?: number;
  hasProjector?: boolean;
  hasAc?: boolean;
  hasWifi?: boolean;
  hasWhiteboard?: boolean;
  isMaintenance?: boolean;
  isInactive?: boolean;
  notes?: string;
}

export interface MapGraphNode {
  id: string;
  floor: number;
  name: string;
  xPercent: number;
  yPercent: number;
  nodeType: 'ROOM' | 'CORRIDOR' | 'STAIRS' | 'ELEVATOR' | 'ENTRANCE';
  isAccessible: boolean;
}

export interface MapGraphEdge {
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  isAccessible: boolean;
  isVertical: boolean; // elevator or stairs connecting floors
}

export const CAMPUS_FLOORS: CampusMapFloor[] = [
  {
    id: -1,
    name: 'All Floors (Overview)',
    code: 'ALL',
    quadrant: { minX: 0, maxX: 100, minY: 0, maxY: 100, viewBox: '0 0 1128 796' },
    description: 'Master 4-Floor Architectural Layout: Ground, First, Second, and Third Floors'
  },
  {
    id: 0,
    name: 'Ground Floor',
    code: 'GF',
    quadrant: { minX: 0, maxX: 52, minY: 0, maxY: 50, viewBox: '0 0 580 400' },
    description: 'Central Quadrangle, Administrative Wing, Principal Office, Auditorium, Canteen & Sports Ground'
  },
  {
    id: 1,
    name: 'First Floor',
    code: '1F',
    quadrant: { minX: 48, maxX: 100, minY: 0, maxY: 50, viewBox: '540 0 588 400' },
    description: 'Central Library (Knowledge Resource Center), Staff Common Room, Commerce & Arts Classrooms'
  },
  {
    id: 2,
    name: 'Second Floor',
    code: '2F',
    quadrant: { minX: 0, maxX: 52, minY: 48, maxY: 100, viewBox: '0 380 580 416' },
    description: 'B.Sc. IT Smart Classrooms, Advanced Computer Labs, Physics & Chemistry Research Labs'
  },
  {
    id: 3,
    name: 'Third Floor',
    code: '3F',
    quadrant: { minX: 48, maxX: 100, minY: 48, maxY: 100, viewBox: '540 380 588 416' },
    description: 'Mathematics & Data Analytics Lab, Conference Hall, Electronics & Robotics Lab'
  }
];

export const INITIAL_MAP_MARKERS: CampusMapMarker[] = [
  // Ground Floor
  { id: 'm-gate', floor: 0, name: 'Campus Main Entrance Gate', roomNumber: 'GATE-1', category: 'EMERGENCY', xPercent: 12, yPercent: 42, widthPercent: 8, heightPercent: 7, isAccessible: true, isVerified: true, hasWifi: true, notes: 'Main college entry from Dixit Road' },
  { id: 'm-princ', floor: 0, name: "Principal's Executive Office", roomNumber: '001', department: 'Administration', category: 'ADMIN', xPercent: 20, yPercent: 18, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 15, hasAc: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-admin', floor: 0, name: 'Central Administration & Registrar', roomNumber: '002', department: 'Accounts & Exam', category: 'ADMIN', xPercent: 28, yPercent: 18, widthPercent: 8, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 30, hasAc: true, hasWifi: true },
  { id: 'm-med', floor: 0, name: 'Campus Health & First Aid Post', roomNumber: '007', department: 'Health Services', category: 'EMERGENCY', xPercent: 36, yPercent: 18, widthPercent: 6, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 8, hasAc: true, hasWifi: true, notes: 'Resident nurse and emergency medical kit' },
  { id: 'm-audi', floor: 0, name: 'K. R. C. Main Auditorium', roomNumber: '008', department: 'Cultural & Academic', category: 'FACILITY', xPercent: 42, yPercent: 22, widthPercent: 10, heightPercent: 10, isAccessible: true, isVerified: true, capacity: 450, hasProjector: true, hasAc: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-016', floor: 0, name: 'Lecture Hall 016', roomNumber: '016', department: 'Arts', category: 'ACADEMIC', xPercent: 26, yPercent: 34, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 80, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-canteen', floor: 0, name: 'Central Canteen & Cafeteria', roomNumber: '005', department: 'Hospitality', category: 'CANTEEN', xPercent: 44, yPercent: 42, widthPercent: 9, heightPercent: 8, isAccessible: true, isVerified: true, capacity: 180, hasWifi: true, notes: 'Breakfast, snacks, fresh meals' },
  { id: 'm-g-elev', floor: 0, name: 'Ground Floor West Elevator', roomNumber: 'LIFT-G', category: 'FACILITY', xPercent: 18, yPercent: 32, widthPercent: 5, heightPercent: 5, isAccessible: true, isVerified: true, notes: 'Wheelchair accessible elevator to Floors 1, 2, 3' },
  { id: 'm-g-stairs', floor: 0, name: 'Central Main Staircase (Ground)', roomNumber: 'STR-G', category: 'FACILITY', xPercent: 32, yPercent: 32, widthPercent: 5, heightPercent: 5, isAccessible: false, isVerified: true },

  // Floor 1
  { id: 'm-lib', floor: 1, name: 'Knowledge Resource Center (Central Library)', roomNumber: '101', department: 'Library Science', category: 'LIBRARY', xPercent: 62, yPercent: 18, widthPercent: 10, heightPercent: 9, isAccessible: true, isVerified: true, capacity: 250, hasAc: true, hasWifi: true, notes: 'Reading Hall & Digital OPAC Terminal' },
  { id: 'm-102', floor: 1, name: 'Lecture Hall 102 (Commerce)', roomNumber: '102', department: 'Commerce', category: 'ACADEMIC', xPercent: 74, yPercent: 18, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 120, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-103', floor: 1, name: 'Lecture Hall 103 (Accountancy)', roomNumber: '103', department: 'Commerce', category: 'ACADEMIC', xPercent: 82, yPercent: 18, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 110, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-104', floor: 1, name: 'Lecture Hall 104 (Arts & Media)', roomNumber: '104', department: 'Arts', category: 'ACADEMIC', xPercent: 90, yPercent: 18, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 100, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-105', floor: 1, name: 'Language & Phonetics Lab', roomNumber: '105', department: 'English & Languages', category: 'LAB', xPercent: 84, yPercent: 36, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 40, hasAc: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-108', floor: 1, name: 'Digital Media & AV Studio', roomNumber: '108', department: 'Mass Media', category: 'LAB', xPercent: 92, yPercent: 36, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 40, hasAc: true, hasWifi: true, hasProjector: true },
  { id: 'm-1-elev', floor: 1, name: 'Floor 1 West Elevator', roomNumber: 'LIFT-1', category: 'FACILITY', xPercent: 58, yPercent: 32, widthPercent: 5, heightPercent: 5, isAccessible: true, isVerified: true },
  { id: 'm-1-stairs', floor: 1, name: 'Floor 1 Central Staircase', roomNumber: 'STR-1', category: 'FACILITY', xPercent: 72, yPercent: 32, widthPercent: 5, heightPercent: 5, isAccessible: false, isVerified: true },

  // Floor 2
  { id: 'm-201', floor: 2, name: 'Advanced Computer Lab A (IT & CS)', roomNumber: '201', department: 'Information Technology', category: 'LAB', xPercent: 16, yPercent: 68, widthPercent: 8, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 50, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-202', floor: 2, name: 'Software Development Lab B', roomNumber: '202', department: 'Computer Science', category: 'LAB', xPercent: 24, yPercent: 68, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 50, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-204', floor: 2, name: 'Smart Classroom 204 (B.Sc. IT)', roomNumber: '204', department: 'Information Technology', category: 'ACADEMIC', xPercent: 32, yPercent: 68, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 80, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true, notes: 'Equipped with interactive touchscreen panel' },
  { id: 'm-205', floor: 2, name: 'Classroom 205 (Science Wing)', roomNumber: '205', department: 'Physics', category: 'ACADEMIC', xPercent: 38, yPercent: 68, widthPercent: 6, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 70, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-206', floor: 2, name: 'Physics & Optics Research Lab', roomNumber: '206', department: 'Physics', category: 'LAB', xPercent: 44, yPercent: 68, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 45, hasAc: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-208', floor: 2, name: 'Chemistry & Biochemistry Lab', roomNumber: '208', department: 'Chemistry', category: 'LAB', xPercent: 44, yPercent: 88, widthPercent: 7, heightPercent: 7, isAccessible: false, isVerified: true, capacity: 45, hasWifi: true, hasWhiteboard: true, notes: 'Fume hoods & analytical instruments' },
  { id: 'm-2-elev', floor: 2, name: 'Floor 2 West Elevator', roomNumber: 'LIFT-2', category: 'FACILITY', xPercent: 18, yPercent: 82, widthPercent: 5, heightPercent: 5, isAccessible: true, isVerified: true },
  { id: 'm-2-stairs', floor: 2, name: 'Floor 2 Central Staircase', roomNumber: 'STR-2', category: 'FACILITY', xPercent: 32, yPercent: 82, widthPercent: 5, heightPercent: 5, isAccessible: false, isVerified: true },

  // Floor 3
  { id: 'm-301', floor: 3, name: 'Mathematics & Data Analytics Lab', roomNumber: '301', department: 'Mathematics', category: 'LAB', xPercent: 64, yPercent: 68, widthPercent: 8, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 40, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-302', floor: 3, name: 'Statistics & Research Lab', roomNumber: '302', department: 'Statistics', category: 'LAB', xPercent: 72, yPercent: 68, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 40, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-304', floor: 3, name: 'Senate & Conference Seminar Hall', roomNumber: '304', department: 'Academic Council', category: 'FACILITY', xPercent: 80, yPercent: 68, widthPercent: 9, heightPercent: 8, isAccessible: true, isVerified: true, capacity: 90, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-306', floor: 3, name: 'Lecture Hall 306 (Postgraduate)', roomNumber: '306', department: 'Information Technology', category: 'ACADEMIC', xPercent: 88, yPercent: 68, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 60, hasAc: true, hasProjector: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-308', floor: 3, name: 'Embedded Systems & IoT Lab', roomNumber: '308', department: 'Information Technology', category: 'LAB', xPercent: 92, yPercent: 78, widthPercent: 7, heightPercent: 7, isAccessible: true, isVerified: true, capacity: 35, hasAc: true, hasWifi: true, hasWhiteboard: true },
  { id: 'm-3-elev', floor: 3, name: 'Floor 3 West Elevator', roomNumber: 'LIFT-3', category: 'FACILITY', xPercent: 58, yPercent: 82, widthPercent: 5, heightPercent: 5, isAccessible: true, isVerified: true },
  { id: 'm-3-stairs', floor: 3, name: 'Floor 3 Central Staircase', roomNumber: 'STR-3', category: 'FACILITY', xPercent: 72, yPercent: 82, widthPercent: 5, heightPercent: 5, isAccessible: false, isVerified: true }
];

export const MAP_NODES: MapGraphNode[] = [
  // Ground
  { id: 'n-gate', floor: 0, name: 'Main Gate', xPercent: 12, yPercent: 42, nodeType: 'ENTRANCE', isAccessible: true },
  { id: 'n-g-hall', floor: 0, name: 'Ground Hallway', xPercent: 25, yPercent: 32, nodeType: 'CORRIDOR', isAccessible: true },
  { id: 'n-g-lift', floor: 0, name: 'Ground Elevator', xPercent: 18, yPercent: 32, nodeType: 'ELEVATOR', isAccessible: true },
  { id: 'n-g-stairs', floor: 0, name: 'Ground Stairs', xPercent: 32, yPercent: 32, nodeType: 'STAIRS', isAccessible: false },
  { id: 'n-g-audi', floor: 0, name: 'Auditorium Entry', xPercent: 42, yPercent: 25, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-g-canteen', floor: 0, name: 'Canteen Entry', xPercent: 44, yPercent: 40, nodeType: 'ROOM', isAccessible: true },

  // Floor 1
  { id: 'n-1-lift', floor: 1, name: 'Floor 1 Elevator', xPercent: 58, yPercent: 32, nodeType: 'ELEVATOR', isAccessible: true },
  { id: 'n-1-stairs', floor: 1, name: 'Floor 1 Stairs', xPercent: 72, yPercent: 32, nodeType: 'STAIRS', isAccessible: false },
  { id: 'n-1-hall', floor: 1, name: 'Floor 1 Central Corridor', xPercent: 70, yPercent: 24, nodeType: 'CORRIDOR', isAccessible: true },
  { id: 'n-1-lib', floor: 1, name: 'Library Door', xPercent: 62, yPercent: 20, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-1-102', floor: 1, name: 'Room 102 Door', xPercent: 78, yPercent: 20, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-1-104', floor: 1, name: 'Room 104 Door', xPercent: 88, yPercent: 20, nodeType: 'ROOM', isAccessible: true },

  // Floor 2
  { id: 'n-2-lift', floor: 2, name: 'Floor 2 Elevator', xPercent: 18, yPercent: 82, nodeType: 'ELEVATOR', isAccessible: true },
  { id: 'n-2-stairs', floor: 2, name: 'Floor 2 Stairs', xPercent: 32, yPercent: 82, nodeType: 'STAIRS', isAccessible: false },
  { id: 'n-2-hall', floor: 2, name: 'Floor 2 Main Hallway', xPercent: 28, yPercent: 74, nodeType: 'CORRIDOR', isAccessible: true },
  { id: 'n-2-201', floor: 2, name: 'Lab 201 Door', xPercent: 16, yPercent: 70, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-2-204', floor: 2, name: 'Room 204 Door', xPercent: 30, yPercent: 70, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-2-206', floor: 2, name: 'Lab 206 Door', xPercent: 42, yPercent: 70, nodeType: 'ROOM', isAccessible: true },

  // Floor 3
  { id: 'n-3-lift', floor: 3, name: 'Floor 3 Elevator', xPercent: 58, yPercent: 82, nodeType: 'ELEVATOR', isAccessible: true },
  { id: 'n-3-stairs', floor: 3, name: 'Floor 3 Stairs', xPercent: 72, yPercent: 82, nodeType: 'STAIRS', isAccessible: false },
  { id: 'n-3-hall', floor: 3, name: 'Floor 3 Hallway', xPercent: 70, yPercent: 74, nodeType: 'CORRIDOR', isAccessible: true },
  { id: 'n-3-301', floor: 3, name: 'Lab 301 Door', xPercent: 64, yPercent: 70, nodeType: 'ROOM', isAccessible: true },
  { id: 'n-3-304', floor: 3, name: 'Hall 304 Door', xPercent: 80, yPercent: 70, nodeType: 'ROOM', isAccessible: true }
];

export const MAP_EDGES: MapGraphEdge[] = [
  // Ground
  { fromNodeId: 'n-gate', toNodeId: 'n-g-hall', distanceMeters: 20, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-g-hall', toNodeId: 'n-g-lift', distanceMeters: 10, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-g-hall', toNodeId: 'n-g-stairs', distanceMeters: 12, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-g-hall', toNodeId: 'n-g-audi', distanceMeters: 25, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-g-hall', toNodeId: 'n-g-canteen', distanceMeters: 30, isAccessible: true, isVertical: false },

  // Vertical transitions (Elevator - Accessible)
  { fromNodeId: 'n-g-lift', toNodeId: 'n-1-lift', distanceMeters: 15, isAccessible: true, isVertical: true },
  { fromNodeId: 'n-1-lift', toNodeId: 'n-2-lift', distanceMeters: 15, isAccessible: true, isVertical: true },
  { fromNodeId: 'n-2-lift', toNodeId: 'n-3-lift', distanceMeters: 15, isAccessible: true, isVertical: true },

  // Vertical transitions (Stairs - Not Wheelchair Accessible)
  { fromNodeId: 'n-g-stairs', toNodeId: 'n-1-stairs', distanceMeters: 15, isAccessible: false, isVertical: true },
  { fromNodeId: 'n-1-stairs', toNodeId: 'n-2-stairs', distanceMeters: 15, isAccessible: false, isVertical: true },
  { fromNodeId: 'n-2-stairs', toNodeId: 'n-3-stairs', distanceMeters: 15, isAccessible: false, isVertical: true },

  // Floor 1
  { fromNodeId: 'n-1-lift', toNodeId: 'n-1-hall', distanceMeters: 12, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-1-stairs', toNodeId: 'n-1-hall', distanceMeters: 10, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-1-hall', toNodeId: 'n-1-lib', distanceMeters: 15, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-1-hall', toNodeId: 'n-1-102', distanceMeters: 15, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-1-hall', toNodeId: 'n-1-104', distanceMeters: 25, isAccessible: true, isVertical: false },

  // Floor 2
  { fromNodeId: 'n-2-lift', toNodeId: 'n-2-hall', distanceMeters: 12, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-2-stairs', toNodeId: 'n-2-hall', distanceMeters: 10, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-2-hall', toNodeId: 'n-2-201', distanceMeters: 15, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-2-hall', toNodeId: 'n-2-204', distanceMeters: 12, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-2-hall', toNodeId: 'n-2-206', distanceMeters: 20, isAccessible: true, isVertical: false },

  // Floor 3
  { fromNodeId: 'n-3-lift', toNodeId: 'n-3-hall', distanceMeters: 12, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-3-stairs', toNodeId: 'n-3-hall', distanceMeters: 10, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-3-hall', toNodeId: 'n-3-301', distanceMeters: 14, isAccessible: true, isVertical: false },
  { fromNodeId: 'n-3-hall', toNodeId: 'n-3-304', distanceMeters: 20, isAccessible: true, isVertical: false }
];

export class CampusMapService {
  private static instance: CampusMapService;
  private markers: CampusMapMarker[] = [...INITIAL_MAP_MARKERS];
  private listeners: Array<() => void> = [];

  private constructor() {
    const saved = localStorage.getItem('sathaye_map_markers');
    if (saved) {
      try {
        this.markers = JSON.parse(saved);
      } catch (e) {
        console.warn('Map markers parse fallback');
      }
    }
  }

  public static getInstance(): CampusMapService {
    if (!CampusMapService.instance) {
      CampusMapService.instance = new CampusMapService();
    }
    return CampusMapService.instance;
  }

  public getMarkers(floor?: number): CampusMapMarker[] {
    if (floor !== undefined && floor !== -1) {
      return this.markers.filter(m => m.floor === floor);
    }
    return this.markers;
  }

  public addOrUpdateMarker(marker: CampusMapMarker): void {
    const idx = this.markers.findIndex(m => m.id === marker.id);
    if (idx >= 0) {
      this.markers[idx] = marker;
    } else {
      this.markers.push(marker);
    }
    this.save();
  }

  public deleteMarker(id: string): void {
    this.markers = this.markers.filter(m => m.id !== id);
    this.save();
  }

  private save(): void {
    localStorage.setItem('sathaye_map_markers', JSON.stringify(this.markers));
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  // Shortest path Dijkstra algorithm for campus wayfinding
  public calculateRoute(startNodeId: string, endNodeId: string, wheelchairOnly: boolean = false) {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    MAP_NODES.forEach(n => {
      distances[n.id] = Infinity;
      previous[n.id] = null;
      unvisited.add(n.id);
    });

    if (!distances[startNodeId] && distances[startNodeId] !== 0) {
      return { path: [], totalDistance: 0, steps: [] };
    }

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      let currentId: string | null = null;
      let minDistance = Infinity;

      unvisited.forEach(id => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          currentId = id;
        }
      });

      if (!currentId || minDistance === Infinity || currentId === endNodeId) break;

      unvisited.delete(currentId);

      // Find neighbors
      const outgoingEdges = MAP_EDGES.filter(e => 
        (e.fromNodeId === currentId || e.toNodeId === currentId) &&
        (!wheelchairOnly || e.isAccessible)
      );

      for (const edge of outgoingEdges) {
        const neighborId = edge.fromNodeId === currentId ? edge.toNodeId : edge.fromNodeId;
        if (!unvisited.has(neighborId)) continue;

        const alt = distances[currentId] + edge.distanceMeters;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = currentId;
        }
      }
    }

    // Build path
    const path: MapGraphNode[] = [];
    let curr: string | null = endNodeId;

    while (curr) {
      const node = MAP_NODES.find(n => n.id === curr);
      if (node) path.unshift(node);
      curr = previous[curr];
    }

    if (path.length <= 1 && startNodeId !== endNodeId) {
      return { path: [], totalDistance: 0, steps: [] };
    }

    // Generate human steps
    const steps: Array<{ floor: number; instruction: string; distanceMeters: number }> = [];
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (i === 0) {
        steps.push({ floor: n.floor, instruction: `Start at ${n.name}`, distanceMeters: 0 });
      } else {
        const prev = path[i - 1];
        if (n.floor !== prev.floor) {
          const mode = n.nodeType === 'ELEVATOR' || prev.nodeType === 'ELEVATOR' ? 'West Elevator' : 'Central Staircase';
          steps.push({
            floor: n.floor,
            instruction: `Transition to Floor ${n.floor} using the ${mode}`,
            distanceMeters: 15
          });
        } else {
          steps.push({
            floor: n.floor,
            instruction: `Proceed along corridor towards ${n.name}`,
            distanceMeters: 15
          });
        }
      }
    }

    return {
      path,
      totalDistance: distances[endNodeId] !== Infinity ? distances[endNodeId] : 0,
      steps
    };
  }
}

export const campusMapService = CampusMapService.getInstance();
