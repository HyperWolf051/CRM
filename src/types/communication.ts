// Communication & Collaboration Types

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: EmailTrigger;
  emails: EmailTemplate[];
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  };
}

export interface EmailTrigger {
  type: 'candidate-added' | 'status-changed' | 'interview-scheduled' | 'offer-sent' | 'manual';
  conditions: Record<string, any>;
  delay?: number; // Hours to wait before sending
}

export interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  variables: EmailVariable[];
  delay: number; // Hours after previous email or trigger
  conditions?: Record<string, any>;
}

export interface EmailVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

export interface TeamComment {
  id: string;
  candidateId?: string;
  jobId?: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  mentions: string[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date;
  replies: TeamComment[];
}

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedBy: string;
  candidateId?: string;
  jobId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'proposal' | 'contract';
  subject: string;
  content: string;
  participants: string[];
  scheduledAt?: Date;
  completedAt?: Date;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  attachments: Attachment[];
  createdBy: string;
  createdAt: Date;
}

export interface ClientPreference {
  clientId: string;
  communicationMethod: 'email' | 'phone' | 'sms' | 'linkedin';
  preferredTime: {
    start: string;
    end: string;
    timezone: string;
  };
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  topics: string[];
  optOut: boolean;
  optOutDate?: Date;
  optOutReason?: string;
}

export interface SocialMediaIntegration {
  platform: 'linkedin' | 'twitter' | 'facebook';
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  permissions: string[];
}

export interface SocialMediaPost {
  id: string;
  platform: 'linkedin' | 'twitter' | 'facebook';
  content: string;
  jobId?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
}

export interface VideoConferenceIntegration {
  provider: 'zoom' | 'teams' | 'meet' | 'webex';
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  defaultSettings: {
    duration: number;
    waitingRoom: boolean;
    recording: boolean;
    password: boolean;
  };
}

export interface VideoConferenceMeeting {
  id: string;
  provider: 'zoom' | 'teams' | 'meet' | 'webex';
  meetingId: string;
  joinUrl: string;
  password?: string;
  title: string;
  description?: string;
  startTime: Date;
  duration: number;
  participants: MeetingParticipant[];
  candidateId?: string;
  interviewId?: string;
  status: 'scheduled' | 'started' | 'ended' | 'cancelled';
  recording?: {
    url: string;
    password?: string;
    expiresAt: Date;
  };
}

export interface MeetingParticipant {
  email: string;
  name: string;
  role: 'host' | 'co-host' | 'participant';
  joinedAt?: Date;
  leftAt?: Date;
}

export interface CommunicationPreference {
  candidateId: string;
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: string[];
  };
  sms: {
    enabled: boolean;
    number?: string;
    types: string[];
  };
  phone: {
    enabled: boolean;
    number?: string;
    preferredTime: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  optOut: {
    all: boolean;
    marketing: boolean;
    transactional: boolean;
    date?: Date;
    reason?: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface CommunicationStats {
  totalEmails: number;
  emailOpenRate: number;
  emailClickRate: number;
  totalCalls: number;
  averageCallDuration: number;
  totalMeetings: number;
  meetingAttendanceRate: number;
  responseRate: number;
  conversionRate: number;
}