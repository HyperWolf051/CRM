// Core recruitment types based on CSV data analysis

export type RecruitmentStage = 
  | 'registration' 
  | 'resume-sharing' 
  | 'shortlisting' 
  | 'lineup-feedback' 
  | 'selection' 
  | 'closure' 
  | 'completed';

export type CandidateStatus = 
  | 'new' 
  | 'in-process' 
  | 'shortlisted' 
  | 'interviewed' 
  | 'selected' 
  | 'placed' 
  | 'rejected';

export interface ClientFeedback {
  feedbackNumber: number; // 1, 2, 3
  clientName: string;
  feedback: 'Selected' | 'Rejected' | 'Hold' | 'Joined' | 'Pending';
  scheduledDate?: Date;
}

// Main Candidate interface based on CSV structure
export interface Candidate {
  id: string;
  cvNo: string; // CV number from registration
  
  // Core Information (from registrationdata.csv)
  name: string;
  phone: string;
  email: string;
  location: string; // City, State
  interestedFor: string; // Position interested in
  declaration?: string;
  currentCompany?: string;
  industry?: string;
  designation: string;
  totalExperience: string;
  lastSalary: string; // e.g., "5K"
  salaryExpectation: string; // e.g., "10K"
  qualification: string;
  allocation: string; // Sheet assignment (e.g., "Sheet-6")
  
  // Registration Details
  registration: {
    date: Date;
    resource: string; // e.g., "Naukari", "LinkedIn"
    registrationStatus: 'Yes' | 'No';
    registrationAmount?: number;
  };
  
  // Resume Sharing (resumeshare.csv)
  resumeSharing: {
    shortlistsForClient?: string;
    resumeShareStatus: 'Done' | 'Pending';
    remark?: string;
  };
  
  // Shortlisting (shortlist.csv)
  shortlisting: {
    shortlistDate?: Date;
    shortlistsForClient?: string;
    resource?: string;
    shortlistStatus: 'Done' | 'Pending';
  };
  
  // Lineup & Feedback (lineupfeedback.csv)
  lineupFeedback: {
    shortlistDate?: Date;
    clientName?: string;
    feedbacks: ClientFeedback[];
    scheduledDates: Date[];
    lineupStatus: 'Done' | 'Pending';
  };
  
  // Selection (selection.csv)
  selection: {
    client?: string;
    selectionDate?: Date;
    selectionStatus?: 'Selected' | 'Rejected' | 'Pending';
  };
  
  // Closure (closernew.csv)
  closure: {
    joiningDate?: Date;
    placedIn?: string; // Company placed in
    offeredSalary?: number;
    charges?: number; // Agency fees/commission
    joiningStatus?: 'Yes' | 'No';
  };
  
  // Current Status
  currentStage: RecruitmentStage;
  overallStatus: CandidateStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Job interface for client requirements
export interface Job {
  id: string;
  title: string;
  client: string; // Client company name
  department?: string;
  location: {
    type: 'remote' | 'hybrid' | 'onsite';
    city?: string;
    country?: string;
  };
  employment: {
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  };
  description?: string;
  requirements: {
    skills?: string[];
    experience?: string;
    education?: string;
  };
  compensation: {
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    benefits?: string[];
  };
  status: 'hot-requirement' | 'active' | 'paused' | 'closed';
  applicants: {
    total: number;
    pipeline: PipelineBreakdown;
  };
  postedDate: Date;
  closingDate?: Date;
  createdBy: string;
}

// Pipeline visualization
export interface PipelineStage {
  name: string;
  count: number;
  color: string;
  conversionRate?: number;
}

export interface PipelineBreakdown {
  registration: number;
  resumeSharing: number;
  shortlisting: number;
  lineupFeedback: number;
  selection: number;
  closure: number;
}

// Interview management
export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'phone' | 'video' | 'in-person';
  scheduledDate: Date;
  duration: number;
  interviewer: {
    id: string;
    name: string;
    email: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
  location?: string;
  notes?: string;
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  rating: number; // 1-5
  notes: string;
  recommendation: 'hire' | 'reject' | 'maybe';
  strengths: string[];
  concerns: string[];
}

// Daily reporting (based on reports.csv)
export interface LineupEntry {
  serialNo: number;
  client: string;
  candidateName: string;
  position: string;
  salary: string;
  feedback?: string;
  mailSent?: boolean;
  interviewSheet?: boolean;
  remark?: string;
}

export interface DailyTask {
  task: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface ShortlistedEntry {
  serialNo: number;
  client: string;
  candidateName: string;
  position: string;
}

export interface DailyReport {
  id: string;
  date: Date;
  teamMember: string; // e.g., "Deep", "TEAM ALPHA"
  
  // Login/Logout tracking
  loginTime?: string;
  logoutTime?: string;
  
  // Daily lineup (interviews scheduled)
  todaysLineup: LineupEntry[];
  
  // Next day planning
  nextDayLineup: LineupEntry[];
  
  // Hot requirements (active job openings)
  hotRequirements: string[];
  
  // Daily tasks and completion status
  tasks: DailyTask[];
  
  // Shortlisted candidates
  shortlisted: ShortlistedEntry[];
  
  // Conversion metrics
  conversionReport: {
    callDuration: string; // e.g., "167calls // 2hrs 5min 25s"
    todaysLineups: number;
    nextDayLineups: number;
    registration: number;
    profilesMail: number;
    prospect: number;
    closure: number;
    googleReviews?: string;
    creativePosting?: boolean;
  };
}

// Metrics for dashboard
export interface RecruitmentMetrics {
  totalCandidates: number;
  activeJobs: number;
  interviewsScheduled: number;
  offersExtended: number;
  placementsMade: number;
  conversionRate: number;
  averageTimeToHire: number;
  trends: {
    candidates: { value: number; direction: 'up' | 'down'; period: string };
    jobs: { value: number; direction: 'up' | 'down'; period: string };
    interviews: { value: number; direction: 'up' | 'down'; period: string };
    offers: { value: number; direction: 'up' | 'down'; period: string };
  };
}

// Filter interfaces
export interface CandidateFilters {
  name?: string;
  email?: string;
  phone?: string;
  status?: CandidateStatus[];
  stage?: RecruitmentStage[];
  position?: string[];
  experienceLevel?: string[];
  location?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  allocation?: string[];
}

export interface JobFilters {
  title?: string;
  client?: string;
  status?: string[];
  location?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}