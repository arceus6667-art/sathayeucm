// Placement Portal & Career Recommendation Store
// Sathaye Autonomous College UCM

import { campusStore } from './campusStore';

export interface PlacementJob {
  id: string;
  company: string;
  role: string;
  packageCtc: string; // e.g. "9.0 - 12.5 LPA"
  location: string;
  minCgpa: number;
  eligibleBranches: string[];
  requiredSkills: string[];
  description: string;
  deadline: string;
  rounds: string[];
  status: 'ACTIVE' | 'CLOSED';
  postedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  branch: string;
  cgpa: number;
  skills: string[];
  resumeUrl?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentBranch: string;
  studentCgpa: number;
  matchScore: number;
  appliedAt: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
}

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  jobId: string;
  company: string;
  role: string;
  studentId: string;
  studentName: string;
  date: string;
  timeSlot: string;
  mode: 'IN_PERSON' | 'VIRTUAL';
  venueOrLink: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'usr-student-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@sathaye.edu.in',
    rollNo: 'IT-2026-01',
    branch: 'B.Sc. IT',
    cgpa: 8.92,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Git'],
    resumeUrl: '/resumes/aarav_mehta.pdf'
  },
  {
    id: 'usr-student-2',
    name: 'Sneha Patil',
    email: 'sneha.patil@sathaye.edu.in',
    rollNo: 'CS-2026-14',
    branch: 'B.Sc. CS',
    cgpa: 7.45,
    skills: ['Java', 'Spring Boot', 'MySQL', 'JavaScript', 'HTML/CSS'],
    resumeUrl: '/resumes/sneha_patil.pdf'
  },
  {
    id: 'usr-student-3',
    name: 'Rahul Verma',
    email: 'rahul.verma@sathaye.edu.in',
    rollNo: 'IT-2026-42',
    branch: 'B.Sc. IT',
    cgpa: 9.35,
    skills: ['Python', 'PyTorch', 'Machine Learning', 'TensorFlow', 'C++', 'SQL', 'FastAPI'],
    resumeUrl: '/resumes/rahul_verma.pdf'
  },
  {
    id: 'usr-student-4',
    name: 'Pooja Kulkarni',
    email: 'pooja.k@sathaye.edu.in',
    rollNo: 'DS-2026-09',
    branch: 'M.Sc. Data Science',
    cgpa: 8.65,
    skills: ['Python', 'Pandas', 'Tableau', 'R', 'NLP', 'AWS', 'BigQuery'],
    resumeUrl: '/resumes/pooja_kulkarni.pdf'
  }
];

export const INITIAL_JOBS: PlacementJob[] = [
  {
    id: 'job-tcs-dig',
    company: 'Tata Consultancy Services',
    role: 'Digital Software Engineer (Full Stack)',
    packageCtc: '7.5 - 9.0 LPA',
    location: 'Mumbai / Pune',
    minCgpa: 7.0,
    eligibleBranches: ['B.Sc. IT', 'B.Sc. CS', 'M.Sc. Data Science'],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'Git'],
    description: 'Developing high-throughput cloud services and enterprise web platforms. Autonomous curriculum graduates prioritized.',
    deadline: '2026-09-25',
    rounds: ['Online Aptitude & Coding', 'Technical Interview', 'Managerial & HR'],
    status: 'ACTIVE',
    postedAt: '2026-09-01'
  },
  {
    id: 'job-morgan-ml',
    company: 'Morgan Stanley',
    role: 'Quantitative & AI Associate',
    packageCtc: '16.0 - 22.0 LPA',
    location: 'Mumbai (Nirlon Knowledge Park)',
    minCgpa: 8.5,
    eligibleBranches: ['B.Sc. IT', 'B.Sc. CS', 'M.Sc. Data Science'],
    requiredSkills: ['Python', 'Machine Learning', 'C++', 'SQL', 'FastAPI'],
    description: 'High-frequency analytical pricing and algorithmic data modeling. Focus on statistical mathematics and reinforcement models.',
    deadline: '2026-09-30',
    rounds: ['Quant Hackathon', 'System Architecture Round', 'Director Interview'],
    status: 'ACTIVE',
    postedAt: '2026-09-03'
  },
  {
    id: 'job-deloitte-analyst',
    company: 'Deloitte India',
    role: 'Cloud & Cyber Risk Analyst',
    packageCtc: '8.2 - 10.5 LPA',
    location: 'Mumbai / Hyderabad',
    minCgpa: 7.5,
    eligibleBranches: ['B.Sc. IT', 'B.Sc. CS'],
    requiredSkills: ['Cloud Security', 'Networking', 'Python', 'Docker', 'Linux'],
    description: 'Enterprise posture evaluation, zero-trust cloud configuration and vulnerability threat assessment.',
    deadline: '2026-09-20',
    rounds: ['Case Study Assessment', 'Cyber Lab Practical', 'Partner Round'],
    status: 'ACTIVE',
    postedAt: '2026-09-02'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-tcs-dig',
    studentId: 'usr-student-1',
    studentName: 'Aarav Mehta',
    studentBranch: 'B.Sc. IT',
    studentCgpa: 8.92,
    matchScore: 94,
    appliedAt: '2026-09-04',
    status: 'SHORTLISTED'
  },
  {
    id: 'app-2',
    jobId: 'job-morgan-ml',
    studentId: 'usr-student-3',
    studentName: 'Rahul Verma',
    studentBranch: 'B.Sc. IT',
    studentCgpa: 9.35,
    matchScore: 98,
    appliedAt: '2026-09-04',
    status: 'INTERVIEW_SCHEDULED'
  }
];

export const INITIAL_INTERVIEWS: InterviewSchedule[] = [
  {
    id: 'int-1',
    applicationId: 'app-2',
    jobId: 'job-morgan-ml',
    company: 'Morgan Stanley',
    role: 'Quantitative & AI Associate',
    studentId: 'usr-student-3',
    studentName: 'Rahul Verma',
    date: '2026-09-12',
    timeSlot: '10:30 AM - 11:30 AM',
    mode: 'IN_PERSON',
    venueOrLink: 'Placement Board Room 2 (Ground Floor, Admin Wing)',
    status: 'SCHEDULED'
  }
];

class PlacementStore {
  private jobs: PlacementJob[] = [...INITIAL_JOBS];
  private students: StudentProfile[] = [...INITIAL_STUDENTS];
  private applications: JobApplication[] = [...INITIAL_APPLICATIONS];
  private interviews: InterviewSchedule[] = [...INITIAL_INTERVIEWS];
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getJobs(): PlacementJob[] {
    return [...this.jobs];
  }

  getJobById(id: string): PlacementJob | undefined {
    return this.jobs.find(j => j.id === id);
  }

  getStudents(): StudentProfile[] {
    return [...this.students];
  }

  getApplications(): JobApplication[] {
    return [...this.applications];
  }

  getApplicationsForJob(jobId: string): JobApplication[] {
    return this.applications.filter(a => a.jobId === jobId);
  }

  getApplicationsForStudent(studentId: string): JobApplication[] {
    return this.applications.filter(a => a.studentId === studentId);
  }

  getInterviews(): InterviewSchedule[] {
    return [...this.interviews];
  }

  getInterviewsForStudent(studentId: string): InterviewSchedule[] {
    return this.interviews.filter(i => i.studentId === studentId);
  }

  // Recruiter Action: Post New JD
  postJob(job: Omit<PlacementJob, 'id' | 'postedAt' | 'status'>): PlacementJob {
    const newJob: PlacementJob = {
      ...job,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    this.jobs.unshift(newJob);

    // Mass notification to students
    campusStore.addNotification({
      title: `New Campus Drive: ${newJob.company}`,
      message: `${newJob.company} has opened applications for ${newJob.role} (${newJob.packageCtc}). Min CGPA: ${newJob.minCgpa}.`,
      type: 'academic',
      targetRole: 'STUDENT'
    });

    this.notify();
    return newJob;
  }

  // Check student eligibility for a specific job
  checkEligibility(student: StudentProfile, job: PlacementJob): {
    isEligible: boolean;
    reason?: string;
    missingSkills: string[];
    matchingSkills: string[];
    matchScore: number;
    recommendedElectives: string[];
  } {
    const isBranchOk = job.eligibleBranches.some(b => student.branch.includes(b) || b.includes(student.branch));
    const isCgpaOk = student.cgpa >= job.minCgpa;

    const lowerStudentSkills = student.skills.map(s => s.toLowerCase());
    const matchingSkills = job.requiredSkills.filter(s => lowerStudentSkills.some(st => st.includes(s.toLowerCase()) || s.toLowerCase().includes(st)));
    const missingSkills = job.requiredSkills.filter(s => !matchingSkills.includes(s));

    // Match Score: 50% CGPA weight, 50% Skill overlap weight
    const skillRatio = job.requiredSkills.length > 0 ? (matchingSkills.length / job.requiredSkills.length) : 1;
    const cgpaRatio = Math.min(1, student.cgpa / 10);
    const matchScore = Math.round((skillRatio * 60) + (cgpaRatio * 40));

    // Recommend college electives to bridge the gap
    const recommendedElectives: string[] = [];
    if (missingSkills.some(s => s.toLowerCase().includes('cloud') || s.toLowerCase().includes('docker'))) {
      recommendedElectives.push('USIT405: Cloud Infrastructure & Containerization Lab');
    }
    if (missingSkills.some(s => s.toLowerCase().includes('security') || s.toLowerCase().includes('cyber'))) {
      recommendedElectives.push('USCS408: Applied Cryptography & Enterprise Cyberdefense');
    }
    if (missingSkills.some(s => s.toLowerCase().includes('learning') || s.toLowerCase().includes('ai') || s.toLowerCase().includes('torch'))) {
      recommendedElectives.push('USDS501: Applied Neural Networks & Deep Learning Systems');
    }
    if (missingSkills.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('node') || s.toLowerCase().includes('typescript'))) {
      recommendedElectives.push('USIT403: Advanced Full Stack & Microservices Development');
    }

    let reason = '';
    if (!isCgpaOk) {
      reason = `CGPA is ${student.cgpa} (Cutoff: ${job.minCgpa})`;
    } else if (!isBranchOk) {
      reason = `Restricted to: ${job.eligibleBranches.join(', ')}`;
    }

    return {
      isEligible: isBranchOk && isCgpaOk,
      reason,
      missingSkills,
      matchingSkills,
      matchScore,
      recommendedElectives
    };
  }

  // Student Action: 1-Click Apply
  applyForJob(studentId: string, jobId: string): { success: boolean; message: string } {
    const student = this.students.find(s => s.id === studentId);
    const job = this.jobs.find(j => j.id === jobId);
    if (!student || !job) return { success: false, message: 'Student or job not found' };

    const existing = this.applications.find(a => a.studentId === studentId && a.jobId === jobId);
    if (existing) return { success: false, message: 'Already applied for this drive' };

    const elig = this.checkEligibility(student, job);
    if (!elig.isEligible) {
      return { success: false, message: elig.reason || 'You do not meet the drive eligibility criteria' };
    }

    const application: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      studentId,
      studentName: student.name,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      matchScore: elig.matchScore,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'APPLIED'
    };

    this.applications.unshift(application);
    this.notify();
    return { success: true, message: `Application submitted successfully for ${job.company}!` };
  }

  // Recruiter Action: Auto-Shortlist candidates
  autoShortlistCandidates(jobId: string, minMatchScore: number = 70): number {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return 0;

    let count = 0;
    this.applications = this.applications.map(app => {
      if (app.jobId === jobId && app.status === 'APPLIED' && app.matchScore >= minMatchScore) {
        count++;
        // notify student
        campusStore.addNotification({
          title: `Shortlisted by ${job.company}!`,
          message: `Congratulations! Your profile has been shortlisted for ${job.role}. Prepare for upcoming technical rounds.`,
          type: 'academic',
          targetRole: 'STUDENT'
        });
        return { ...app, status: 'SHORTLISTED' as const };
      }
      return app;
    });

    this.notify();
    return count;
  }

  // Recruiter Action: Schedule Interview
  scheduleInterview(
    applicationId: string,
    date: string,
    timeSlot: string,
    mode: 'IN_PERSON' | 'VIRTUAL',
    venueOrLink: string
  ): InterviewSchedule | null {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return null;
    const job = this.jobs.find(j => j.id === app.jobId);
    if (!job) return null;

    app.status = 'INTERVIEW_SCHEDULED';

    const interview: InterviewSchedule = {
      id: `int-${Date.now()}`,
      applicationId,
      jobId: job.id,
      company: job.company,
      role: job.role,
      studentId: app.studentId,
      studentName: app.studentName,
      date,
      timeSlot,
      mode,
      venueOrLink,
      status: 'SCHEDULED'
    };

    this.interviews.unshift(interview);

    // Trigger urgent student notification
    campusStore.addNotification({
      title: `Interview Scheduled: ${job.company}`,
      message: `Interview for ${job.role} is set on ${date} at ${timeSlot}. Venue/Link: ${venueOrLink}`,
      type: 'academic',
      targetRole: 'STUDENT'
    });

    this.notify();
    return interview;
  }
}

export const placementStore = new PlacementStore();
