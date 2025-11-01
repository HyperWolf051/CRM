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

// Client Management Types
export interface Client {
  id: string;
  name: string;
  industry: string;
  website?: string;
  
  // Contact Information
  primaryContact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    directLine?: string;
  };
  
  // Additional Contacts
  contacts: ClientContact[];
  
  // Company Details
  companyDetails: {
    size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      pincode?: string;
    };
    establishedYear?: number;
    description?: string;
  };
  
  // Business Information
  businessInfo: {
    gstNumber?: string;
    panNumber?: string;
    registrationNumber?: string;
    paymentTerms: string; // e.g., "30 days", "45 days"
    preferredCurrency: string;
  };
  
  // Recruitment Preferences
  preferences: {
    preferredCommunication: 'email' | 'phone' | 'whatsapp' | 'teams';
    interviewTypes: ('phone' | 'video' | 'in-person')[];
    noticePeriod: string; // e.g., "2 weeks", "1 month"
    salaryNegotiation: boolean;
    backgroundChecks: boolean;
    documentRequirements: string[];
  };
  
  // Relationship Status
  status: 'active' | 'inactive' | 'prospect' | 'blacklisted';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  
  // Performance Metrics
  metrics: {
    totalJobsPosted: number;
    activeJobs: number;
    candidatesHired: number;
    averageTimeToHire: number; // in days
    offerAcceptanceRate: number; // percentage
    repeatBusinessRate: number; // percentage
  };
  
  // Financial Information
  financial: {
    totalRevenue: number;
    outstandingAmount: number;
    creditLimit: number;
    paymentHistory: PaymentRecord[];
  };
  
  // Tags and Categories
  tags: string[];
  categories: string[]; // e.g., "IT Services", "Manufacturing", "Healthcare"
  
  // Relationship Management
  assignedRecruiter: string; // User ID
  accountManager?: string; // User ID
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
}

export interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  department: string;
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}

// Client Feedback and Communication
export interface ClientCommunication {
  id: string;
  clientId: string;
  type: 'email' | 'phone' | 'meeting' | 'whatsapp' | 'video-call';
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  participants: string[]; // User IDs
  attachments?: string[]; // File URLs
  followUpRequired: boolean;
  followUpDate?: Date;
  status: 'completed' | 'pending' | 'scheduled';
  createdBy: string;
  createdAt: Date;
}

export interface ClientFeedbackEntry {
  id: string;
  clientId: string;
  candidateId: string;
  jobId: string;
  feedbackType: 'interview' | 'resume-review' | 'general' | 'placement';
  rating: number; // 1-5 scale
  feedback: string;
  strengths?: string[];
  concerns?: string[];
  recommendation: 'hire' | 'reject' | 'maybe' | 'hold';
  nextSteps?: string;
  interviewDate?: Date;
  interviewer: string; // Client contact name
  submittedBy: string; // Recruiter who collected feedback
  submittedAt: Date;
  
  // Additional context from lineupfeedback.csv
  scheduledDate?: Date;
  feedbackNumber: number; // 1, 2, 3 for multiple rounds
  status: 'Selected' | 'Rejected' | 'Hold' | 'Joined' | 'Pending';
}

// Client Requirements and Job Specifications
export interface ClientRequirement {
  id: string;
  clientId: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'filled' | 'on-hold' | 'cancelled';
  
  // Job Details
  jobDetails: {
    department: string;
    reportingTo: string;
    teamSize?: number;
    workMode: 'remote' | 'hybrid' | 'onsite';
    location: string;
    travelRequired: boolean;
    shiftTimings?: string;
  };
  
  // Candidate Requirements
  candidateProfile: {
    experience: {
      min: number;
      max: number;
      unit: 'months' | 'years';
    };
    skills: {
      mandatory: string[];
      preferred: string[];
      certifications?: string[];
    };
    education: {
      degree: string[];
      specialization?: string[];
      instituteTier?: 'tier1' | 'tier2' | 'tier3' | 'any';
    };
    location: string[];
    currentSalary?: {
      min: number;
      max: number;
    };
  };
  
  // Compensation Package
  compensation: {
    salary: {
      min: number;
      max: number;
      currency: string;
      negotiable: boolean;
    };
    benefits: string[];
    bonuses?: {
      joining: number;
      performance: number;
      annual: number;
    };
    equity?: boolean;
    otherPerks: string[];
  };
  
  // Timeline
  timeline: {
    expectedStartDate: Date;
    urgency: 'immediate' | 'within-week' | 'within-month' | 'flexible';
    interviewProcess: string; // Description of interview rounds
    decisionTimeline: string; // How long client takes to decide
  };
  
  // Submission Guidelines
  submissionGuidelines: {
    maxSubmissions: number;
    submissionFormat: string;
    requiredDocuments: string[];
    clientPreferences: string[];
  };
  
  // Tracking
  candidatesSubmitted: number;
  candidatesInterviewed: number;
  candidatesSelected: number;
  candidatesJoined: number;
  
  // Metadata
  createdBy: string;
  assignedRecruiter: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

// Job Offer Management Types
export interface JobOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAvatar?: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  
  offerDetails: {
    position: string;
    department: string;
    startDate: Date;
    salary: {
      base: number;
      currency: string;
      frequency: 'annual' | 'monthly';
    };
    benefits: {
      healthInsurance: boolean;
      dentalInsurance: boolean;
      retirement401k: boolean;
      paidTimeOff: number;
      flexibleSchedule: boolean;
      remoteWork: boolean;
      stockOptions?: {
        granted: boolean;
        vesting: string;
      };
    };
    bonuses?: {
      signing: number;
      performance: number;
      annual: number;
    };
  };
  
  status: 'draft' | 'sent' | 'under-review' | 'negotiating' | 'accepted' | 'declined' | 'expired' | 'withdrawn';
  
  timeline: {
    createdAt: Date;
    sentAt?: Date;
    expiryDate?: Date;
    respondedAt?: Date;
    acceptedAt?: Date;
    declinedAt?: Date;
  };
  
  negotiations: OfferNegotiation[];
  
  documents: {
    offerLetter?: string; // URL to PDF
    contract?: string;
    additionalDocs?: string[];
  };
  
  approvals: {
    hr: { approved: boolean; approvedBy?: string; approvedAt?: Date; };
    manager: { approved: boolean; approvedBy?: string; approvedAt?: Date; };
    finance?: { approved: boolean; approvedBy?: string; approvedAt?: Date; };
  };
  
  createdBy: string;
  createdByName: string;
  updatedAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface OfferNegotiation {
  id: string;
  initiatedBy: 'candidate' | 'company';
  type: 'salary' | 'benefits' | 'start-date' | 'other';
  originalValue: any;
  proposedValue: any;
  status: 'pending' | 'accepted' | 'rejected' | 'counter-proposed';
  notes?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export type OfferStatus = 'draft' | 'sent' | 'under-review' | 'negotiating' | 'accepted' | 'declined' | 'expired' | 'withdrawn';

export interface OfferFilters {
  status?: OfferStatus[];
  position?: string[];
  client?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: string[];
  createdBy?: string[];
}

export interface OfferFormData {
  candidateId: string;
  jobId: string;
  position: string;
  department: string;
  startDate: Date;
  salary: {
    base: number;
    currency: string;
    frequency: 'annual' | 'monthly';
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    retirement401k: boolean;
    paidTimeOff: number;
    flexibleSchedule: boolean;
    remoteWork: boolean;
    stockOptions?: {
      granted: boolean;
      vesting: string;
    };
  };
  bonuses?: {
    signing: number;
    performance: number;
    annual: number;
  };
  expiryDate?: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
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