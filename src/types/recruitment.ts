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

// CSV Import mapping types
export interface CSVFieldMapping {
  csvField: string;
  targetField: string;
  transformation?: (value: any) => any;
  required?: boolean;
}

export interface CSVImportConfig {
  requiredFields: string[];
  optionalFields: string[];
  fieldMappings: Record<string, CSVFieldMapping>;
  dateFields: string[];
  numericFields: string[];
}

export interface ImportResult {
  successful: number;
  failed: number;
  errors: ImportError[];
  data: Candidate[];
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface ClientFeedback {
  feedbackNumber: number; // 1, 2, 3 (from FEEDBACK-1, FEEDBACK-2, FEEDBACK-3)
  clientName: string;
  feedback: 'Selected' | 'Rejected' | 'Hold' | 'Joined' | 'Pending' | 'Reject';
  scheduledDate?: Date; // SCH.DATE-1, SCH.DATE-2, SCH.DATE-3
  notes?: string;
  createdAt: Date;
}

// Additional supporting interfaces
export interface CandidateNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
}

// Change history tracking for candidates
export interface CandidateChangeHistory {
  id: string;
  candidateId: string;
  changedBy: string; // User ID who made the change
  changedByName: string; // User name for display
  changeType: 'created' | 'updated' | 'status_changed' | 'stage_changed' | 'note_added' | 'document_uploaded' | 'interview_scheduled' | 'merged' | 'imported';
  changes: FieldChange[];
  timestamp: Date;
  reason?: string; // Optional reason for the change
  ipAddress?: string; // For audit purposes
  userAgent?: string; // For audit purposes
}

export interface FieldChange {
  field: string; // Field name that was changed
  fieldDisplayName: string; // Human-readable field name
  oldValue: any; // Previous value
  newValue: any; // New value
  changeDescription: string; // Human-readable description of the change
}

// Main Candidate interface based on CSV structure
export interface Candidate {
  id: string;
  cvNo: string; // CV number from registration
  
  // Core Information (from registrationdata.csv)
  name: string;
  phone: string;
  email: string;
  location: string; // City, State format
  interestedFor: string; // Position interested in
  declaration?: string;
  currentCompany?: string;
  industry?: string;
  designation: string;
  totalExperience: string; // e.g., "1 Year", "4yrs"
  lastSalary: string; // e.g., "5K", "45k"
  salaryExpectation: string; // e.g., "10K", "60k"
  qualification: string; // e.g., "B.com", "b.ARCH"
  allocation: string; // Sheet assignment (e.g., "Sheet-6", "VAibhav")
  
  // Registration Details (registrationdata.csv)
  registration: {
    date: Date;
    resource: string; // e.g., "Naukari", "LinkedIn", "apna jobs"
    registrationStatus: 'Yes' | 'No';
    registrationAmount?: number;
  };
  
  // Resume Sharing (resumeshare.csv)
  resumeSharing: {
    date?: Date;
    shortlistsForClient?: string; // Client name who received resume
    resumeShareStatus: 'Done' | 'Pending';
    remark?: string;
  };
  
  // Shortlisting (shortlist.csv)
  shortlisting: {
    shortlistDate?: Date;
    shortlistsForClient?: string; // Client name
    resource?: string; // Source of shortlisting
    shortlistStatus: 'Done' | 'Pending';
  };
  
  // Lineup & Feedback (lineupfeedback.csv)
  lineupFeedback: {
    shortlistDate?: Date;
    shortlistsForClient?: string;
    feedbacks: ClientFeedback[]; // Up to 3 feedback entries
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
    offeredSalary?: string; // Salary offered (can be string format)
    charges?: string; // Agency fees/commission
    joiningStatus?: 'Yes' | 'No';
  };
  
  // Current Status (derived from workflow stage)
  currentStage: RecruitmentStage;
  overallStatus: CandidateStatus;
  
  // Additional tracking fields
  avatar?: string; // Profile picture URL
  rating?: number; // 1-5 star rating
  tags?: string[]; // Custom tags for categorization
  notes?: CandidateNote[]; // Internal notes
  
  // Visibility and ownership (ALL recruiters can see ALL candidates)
  createdBy: string; // User ID who originally added the candidate
  createdByName: string; // Display name of who added the candidate
  lastModifiedBy?: string; // User ID who last modified the candidate
  lastModifiedByName?: string; // Display name of who last modified
  
  // Change history tracking
  changeHistory: CandidateChangeHistory[]; // Complete audit trail of all changes
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Job interface for client requirements
export interface Job {
  id: string;
  title: string;
  client: string; // Client company name
  clientContact?: {
    name: string;
    email: string;
    phone: string;
    designation: string;
  };
  department?: string;
  location: {
    type: 'remote' | 'hybrid' | 'onsite';
    city?: string;
    state?: string;
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
    mustHave?: string[]; // Critical requirements
    niceToHave?: string[]; // Preferred requirements
  };
  compensation: {
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    benefits?: string[];
    negotiable?: boolean;
  };
  status: 'hot-requirement' | 'active' | 'paused' | 'closed' | 'filled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  applicants: {
    total: number;
    pipeline: PipelineBreakdown;
  };
  postedDate: Date;
  closingDate?: Date;
  expectedStartDate?: Date;
  createdBy: string;
  assignedRecruiters?: string[]; // Recruiters working on this job
  tags?: string[]; // Custom tags for categorization
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
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
  totalWorkingHours?: string;
  
  // Daily lineup (interviews scheduled)
  todaysLineup: LineupEntry[];
  
  // Next day planning
  nextDayLineup: LineupEntry[];
  
  // Hot requirements (active job openings)
  hotRequirements: HotRequirement[];
  
  // Daily tasks and completion status
  tasks: DailyTask[];
  
  // Shortlisted candidates
  shortlisted: ShortlistedEntry[];
  
  // Conversion metrics
  conversionReport: {
    callDuration: string; // e.g., "167calls // 2hrs 5min 25s"
    totalCalls: number;
    todaysLineups: number;
    nextDayLineups: number;
    registration: number;
    profilesMail: number;
    prospect: number;
    closure: number;
    googleReviews?: string;
    creativePosting?: boolean;
    socialMediaPosts?: number;
  };
  
  // Performance metrics
  performance: {
    targetsAchieved: number;
    totalTargets: number;
    efficiency: number; // percentage
    qualityScore: number; // 1-10
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  submittedBy: string;
  approvedBy?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

// Supporting interfaces for DailyReport
export interface HotRequirement {
  id: string;
  jobTitle: string;
  client: string;
  priority: 'urgent' | 'high' | 'medium';
  deadline?: Date;
  candidatesNeeded: number;
  candidatesSubmitted: number;
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
  priority?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// CSV Import validation and transformation utilities
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'date' | 'email' | 'phone';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  transform?: (value: any) => any;
  validate?: (value: any) => boolean | string;
}

export interface CSVImportPreview {
  headers: string[];
  sampleData: any[][];
  totalRows: number;
  detectedTypes: Record<string, string>;
  suggestedMappings: Record<string, string>;
}

// Recruitment workflow stage configurations
export const RECRUITMENT_STAGES: Record<RecruitmentStage, {
  name: string;
  description: string;
  color: string;
  order: number;
  requiredFields: string[];
}> = {
  'registration': {
    name: 'Registration',
    description: 'Initial candidate registration and data collection',
    color: '#3B82F6',
    order: 1,
    requiredFields: ['name', 'phone', 'email', 'interestedFor']
  },
  'resume-sharing': {
    name: 'Resume Sharing',
    description: 'Resume shared with potential clients',
    color: '#8B5CF6',
    order: 2,
    requiredFields: ['resumeSharing.shortlistsForClient']
  },
  'shortlisting': {
    name: 'Shortlisting',
    description: 'Candidate shortlisted by client',
    color: '#F59E0B',
    order: 3,
    requiredFields: ['shortlisting.shortlistDate']
  },
  'lineup-feedback': {
    name: 'Lineup & Feedback',
    description: 'Interview scheduled and feedback collected',
    color: '#06B6D4',
    order: 4,
    requiredFields: ['lineupFeedback.feedbacks']
  },
  'selection': {
    name: 'Selection',
    description: 'Candidate selected by client',
    color: '#10B981',
    order: 5,
    requiredFields: ['selection.selectionStatus']
  },
  'closure': {
    name: 'Closure',
    description: 'Candidate placement completed',
    color: '#059669',
    order: 6,
    requiredFields: ['closure.joiningStatus']
  },
  'completed': {
    name: 'Completed',
    description: 'Full recruitment cycle completed',
    color: '#047857',
    order: 7,
    requiredFields: []
  }
};

// Status configurations
export const CANDIDATE_STATUSES: Record<CandidateStatus, {
  name: string;
  color: string;
  description: string;
}> = {
  'new': { name: 'New', color: '#6B7280', description: 'Recently added candidate' },
  'in-process': { name: 'In Process', color: '#3B82F6', description: 'Actively being processed' },
  'shortlisted': { name: 'Shortlisted', color: '#F59E0B', description: 'Shortlisted by client' },
  'interviewed': { name: 'Interviewed', color: '#06B6D4', description: 'Interview completed' },
  'selected': { name: 'Selected', color: '#10B981', description: 'Selected by client' },
  'placed': { name: 'Placed', color: '#059669', description: 'Successfully placed' },
  'rejected': { name: 'Rejected', color: '#EF4444', description: 'Rejected by client' }
};