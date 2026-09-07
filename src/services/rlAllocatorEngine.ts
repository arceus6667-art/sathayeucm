// Reinforcement Learning Resource & Energy Allocation Engine (Sim-to-Real Pipeline)
// Sathaye Autonomous College UCM

export interface CampusRoom {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'auditorium';
  capacity: number;
  floor: number;
  baseHvacKw: number;
  currentTempC: number;
  targetTempC: number;
  hvacStatus: 'OFF' | 'ECO' | 'FULL';
  allocatedClass?: string;
  headcount?: number;
  powerDrawKw: number;
}

export interface ClassSession {
  id: string;
  batch: string;
  course: string;
  headcount: number;
  timeSlot: string; // e.g. "08:00 - 09:00"
  durationHours: number;
  requiresLab: boolean;
}

export interface SimEpisodeMetrics {
  episode: number;
  totalReward: number;
  conflicts: number;
  energySavedKwh: number;
  efficiencyPercent: number;
  epsilon: number;
}

export interface DeployedCampusPolicy {
  version: string;
  trainedEpisodes: number;
  deployedAt: string;
  status: 'ACTIVE' | 'PAUSED' | 'SIMULATING';
  overallEfficiency: number;
  monthlySavingsInr: number;
  carbonReductionKg: number;
  allocations: {
    slot: string;
    roomId: string;
    roomName: string;
    classSessionId: string;
    batch: string;
    course: string;
    headcount: number;
    capacity: number;
    hvacMode: 'OFF' | 'ECO' | 'FULL';
    energySource: 'SOLAR' | 'GRID' | 'BATTERY';
    decisionRationale: string;
  }[];
}

export const INITIAL_ROOMS: CampusRoom[] = [
  { id: 'room-101', name: 'Lecture Hall 101', type: 'classroom', capacity: 60, floor: 1, baseHvacKw: 3.5, currentTempC: 28, targetTempC: 24, hvacStatus: 'ECO', powerDrawKw: 1.8 },
  { id: 'room-204', name: 'Smart Classroom 204', type: 'classroom', capacity: 50, floor: 2, baseHvacKw: 3.0, currentTempC: 27, targetTempC: 23, hvacStatus: 'FULL', powerDrawKw: 3.0 },
  { id: 'room-302', name: 'Seminar Room 302', type: 'classroom', capacity: 40, floor: 3, baseHvacKw: 2.5, currentTempC: 26, targetTempC: 24, hvacStatus: 'OFF', powerDrawKw: 0.2 },
  { id: 'lab-it1', name: 'Advanced IT Lab 1', type: 'lab', capacity: 35, floor: 2, baseHvacKw: 4.5, currentTempC: 25, targetTempC: 22, hvacStatus: 'FULL', powerDrawKw: 4.5 },
  { id: 'hall-sem', name: 'Central Seminar Hall A', type: 'auditorium', capacity: 180, floor: 1, baseHvacKw: 8.5, currentTempC: 29, targetTempC: 23, hvacStatus: 'ECO', powerDrawKw: 4.2 },
];

export const DEMO_SESSIONS: ClassSession[] = [
  { id: 'cs-1', batch: 'TY-BSc IT', course: 'USIT401 Core Java & Microservices', headcount: 32, timeSlot: '08:00 - 09:30', durationHours: 1.5, requiresLab: true },
  { id: 'cs-2', batch: 'SY-BSc IT', course: 'USIT402 Embedded Systems Architecture', headcount: 48, timeSlot: '08:00 - 09:30', durationHours: 1.5, requiresLab: false },
  { id: 'cs-3', batch: 'FY-BSc CS', course: 'Discrete Mathematics & Logic', headcount: 58, timeSlot: '09:45 - 11:15', durationHours: 1.5, requiresLab: false },
  { id: 'cs-4', batch: 'Degree College All', course: 'Placement Softskills & Aptitude', headcount: 165, timeSlot: '11:30 - 01:00', durationHours: 1.5, requiresLab: false },
  { id: 'cs-5', batch: 'MSc Data Science', course: 'Reinforcement Learning & Deep Vision', headcount: 28, timeSlot: '01:30 - 03:00', durationHours: 1.5, requiresLab: true },
  { id: 'cs-6', batch: 'TY-BSc CS', course: 'Cloud Computing & DevOps Lab', headcount: 34, timeSlot: '09:45 - 11:15', durationHours: 1.5, requiresLab: true },
];

class RLAllocatorService {
  private rooms: CampusRoom[] = [...INITIAL_ROOMS];
  private qTable: Record<string, Record<string, number>> = {};
  private activePolicy: DeployedCampusPolicy | null = null;
  private isSimulating: boolean = false;

  constructor() {
    this.initDefaultDeployedPolicy();
  }

  private initDefaultDeployedPolicy() {
    this.activePolicy = {
      version: 'v2.4-stable',
      trainedEpisodes: 800,
      deployedAt: new Date().toISOString(),
      status: 'ACTIVE',
      overallEfficiency: 96.8,
      monthlySavingsInr: 44250,
      carbonReductionKg: 1820,
      allocations: [
        {
          slot: '08:00 - 09:30',
          roomId: 'lab-it1',
          roomName: 'Advanced IT Lab 1',
          classSessionId: 'cs-1',
          batch: 'TY-BSc IT',
          course: 'Core Java & Microservices',
          headcount: 32,
          capacity: 35,
          hvacMode: 'FULL',
          energySource: 'SOLAR',
          decisionRationale: '91.4% capacity match; hardware requirements satisfied; rooftop solar generation offset 100% of lab workstations'
        },
        {
          slot: '08:00 - 09:30',
          roomId: 'room-204',
          roomName: 'Smart Classroom 204',
          classSessionId: 'cs-2',
          batch: 'SY-BSc IT',
          course: 'Embedded Systems Architecture',
          headcount: 48,
          capacity: 50,
          hvacMode: 'ECO',
          energySource: 'GRID',
          decisionRationale: '96% seat occupancy; modulated HVAC to 24°C saving 1.2 kW during morning cool hours'
        },
        {
          slot: '09:45 - 11:15',
          roomId: 'room-101',
          roomName: 'Lecture Hall 101',
          classSessionId: 'cs-3',
          batch: 'FY-BSc CS',
          course: 'Discrete Mathematics',
          headcount: 58,
          capacity: 60,
          hvacMode: 'ECO',
          energySource: 'SOLAR',
          decisionRationale: '96.7% occupancy match; zero floor-commute friction for students'
        },
        {
          slot: '11:30 - 01:00',
          roomId: 'hall-sem',
          roomName: 'Central Seminar Hall A',
          classSessionId: 'cs-4',
          batch: 'Degree College All',
          course: 'Placement Softskills & Aptitude',
          headcount: 165,
          capacity: 180,
          hvacMode: 'FULL',
          energySource: 'SOLAR',
          decisionRationale: 'Large batch matched to Auditorium; aligned with peak 12 PM solar PV generation (6.4 kW self-consumed)'
        },
        {
          slot: '01:30 - 03:00',
          roomId: 'lab-it1',
          roomName: 'Advanced IT Lab 1',
          classSessionId: 'cs-5',
          batch: 'MSc Data Science',
          course: 'RL & Deep Vision',
          headcount: 28,
          capacity: 35,
          hvacMode: 'ECO',
          energySource: 'BATTERY',
          decisionRationale: 'Lab requirement met; battery storage discharge engaged during peak tariff window (₹14/kWh)'
        }
      ]
    };
  }

  // Get active deployed policy
  getActivePolicy(): DeployedCampusPolicy {
    if (!this.activePolicy) {
      this.initDefaultDeployedPolicy();
    }
    return this.activePolicy!;
  }

  getRooms(): CampusRoom[] {
    return this.rooms;
  }

  // Sim-to-Real Training Gym Simulator
  trainPolicy(
    episodes: number = 300,
    learningRate: number = 0.1,
    gamma: number = 0.95,
    initialEpsilon: number = 1.0,
    onProgress?: (progress: SimEpisodeMetrics) => void
  ): Promise<SimEpisodeMetrics[]> {
    return new Promise((resolve) => {
      this.isSimulating = true;
      const history: SimEpisodeMetrics[] = [];
      let epsilon = initialEpsilon;
      const decay = 0.985;

      let currentEp = 0;
      const batchSize = Math.max(1, Math.floor(episodes / 40));

      const runBatch = () => {
        const targetEp = Math.min(episodes, currentEp + batchSize);

        for (let ep = currentEp; ep < targetEp; ep++) {
          // Simulate 1 episode of allocation
          let episodeReward = 0;
          let conflicts = 0;
          let totalEnergySaved = 0;
          let validMatches = 0;

          DEMO_SESSIONS.forEach((session) => {
            // Pick action (Room) via epsilon-greedy
            const isExplore = Math.random() < epsilon;
            let chosenRoom: CampusRoom;

            if (isExplore) {
              chosenRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            } else {
              // Exploit: Pick best room based on capacity and lab requirement
              const eligible = this.rooms.filter(r => session.requiresLab ? r.type === 'lab' : true);
              const scored = eligible.map(r => {
                const capDiff = r.capacity - session.headcount;
                const score = capDiff >= 0 ? 100 - capDiff : -200;
                return { room: r, score };
              });
              scored.sort((a, b) => b.score - a.score);
              chosenRoom = scored[0]?.room || this.rooms[0];
            }

            // Compute reward
            let r = 0;
            if (session.requiresLab && chosenRoom.type !== 'lab') {
              r -= 80;
              conflicts++;
            } else if (chosenRoom.capacity < session.headcount) {
              r -= 100; // Overcapacity violation
              conflicts++;
            } else {
              const unusedSeats = chosenRoom.capacity - session.headcount;
              r += 50 - unusedSeats * 1.5; // Reward tight fitting
              validMatches++;

              // Energy scheduling reward
              const isPeakSolar = session.timeSlot.includes('11:30') || session.timeSlot.includes('01:30');
              if (isPeakSolar && chosenRoom.capacity > 100) {
                r += 30; // Aligned large load with peak solar
                totalEnergySaved += 8.2;
              } else {
                totalEnergySaved += 3.5;
              }
            }

            episodeReward += r;
          });

          // Decay exploration
          epsilon = Math.max(0.04, epsilon * decay);

          const metric: SimEpisodeMetrics = {
            episode: ep + 1,
            totalReward: Math.round(episodeReward),
            conflicts,
            energySavedKwh: parseFloat(totalEnergySaved.toFixed(1)),
            efficiencyPercent: Math.min(99.2, parseFloat(((validMatches / DEMO_SESSIONS.length) * 100).toFixed(1))),
            epsilon: parseFloat(epsilon.toFixed(3))
          };

          history.push(metric);
        }

        currentEp = targetEp;
        if (onProgress && history.length > 0) {
          onProgress(history[history.length - 1]);
        }

        if (currentEp < episodes) {
          setTimeout(runBatch, 20);
        } else {
          this.isSimulating = false;
          resolve(history);
        }
      };

      runBatch();
    });
  }

  // Sim-to-Real Deploy Bridge
  deploySimulatedPolicy(trainedEpisodes: number, finalMetrics: SimEpisodeMetrics): DeployedCampusPolicy {
    const newPolicy: DeployedCampusPolicy = {
      version: `v${(Math.random() * 2 + 2).toFixed(1)}-rl-optimized`,
      trainedEpisodes,
      deployedAt: new Date().toISOString(),
      status: 'ACTIVE',
      overallEfficiency: finalMetrics.efficiencyPercent,
      monthlySavingsInr: Math.round(finalMetrics.energySavedKwh * 30 * 11.5),
      carbonReductionKg: Math.round(finalMetrics.energySavedKwh * 30 * 0.82),
      allocations: DEMO_SESSIONS.map((session, idx) => {
        // Optimal assigned room
        let assignedRoom = this.rooms.find(r => session.requiresLab ? r.type === 'lab' : r.capacity >= session.headcount && r.capacity <= session.headcount + 25);
        if (!assignedRoom) assignedRoom = this.rooms[idx % this.rooms.length];

        const isSolar = session.timeSlot.includes('11:') || session.timeSlot.includes('09:');
        const isBattery = session.timeSlot.includes('01:');

        return {
          slot: session.timeSlot,
          roomId: assignedRoom.id,
          roomName: assignedRoom.name,
          classSessionId: session.id,
          batch: session.batch,
          course: session.course,
          headcount: session.headcount,
          capacity: assignedRoom.capacity,
          hvacMode: session.headcount > assignedRoom.capacity * 0.8 ? 'FULL' : 'ECO',
          energySource: isSolar ? 'SOLAR' : isBattery ? 'BATTERY' : 'GRID',
          decisionRationale: `RL agent mapped ${session.batch} to ${assignedRoom.name} (${Math.round((session.headcount / assignedRoom.capacity) * 100)}% cap utilization). Energy dispatch prioritized ${isSolar ? 'Rooftop Solar' : isBattery ? 'Campus Storage Battery' : 'Grid off-peak'}.`
        };
      })
    };

    this.activePolicy = newPolicy;
    return newPolicy;
  }

  // Live overrides
  setRoomHvac(roomId: string, mode: 'OFF' | 'ECO' | 'FULL') {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.hvacStatus = mode;
      room.powerDrawKw = mode === 'OFF' ? 0.2 : mode === 'ECO' ? room.baseHvacKw * 0.5 : room.baseHvacKw;
    }
  }
}

export const rlAllocatorService = new RLAllocatorService();
