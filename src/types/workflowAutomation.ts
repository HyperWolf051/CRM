// Workflow Automation Types

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
}

export interface WorkflowTrigger {
  id: string;
  type: 'candidate-added' | 'status-changed' | 'score-threshold' | 'time-based' | 'manual';
  conditions: Record<string, any>;
  schedule?: CronExpression;
  description: string;
}

export interface WorkflowCondition {
  id: string;
  type: 'field-equals' | 'field-contains' | 'score-greater-than' | 'score-less-than' | 'date-range' | 'custom';
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  id: string;
  type: 'send-email' | 'update-status' | 'assign-recruiter' | 'create-task' | 'send-sms' | 'webhook' | 'calculate-score' | 'assign-territory';
  parameters: Record<string, any>;
  delay?: number; // Minutes to wait before executing
  description: string;
}

export interface CronExpression {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  expression: string;
}

// Lead Scoring Types
export interface LeadScore {
  candidateId: string;
  totalScore: number;
  breakdown: ScoreBreakdown[];
  lastCalculated: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  previousScore?: number;
  aiPredictions?: AIPrediction[];
}

export interface ScoreBreakdown {
  category: 'skills' | 'experience' | 'education' | 'location' | 'availability' | 'market-demand' | 'referral' | 'custom';
  score: number;
  maxScore: number;
  reasoning: string;
  weight: number;
}

export interface ScoringRule {
  id: string;
  name: string;
  category: string;
  condition: string; // JSON logic expression
  points: number;
  weight: number;
  isActive: boolean;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface AIPrediction {
  type: 'placement-success' | 'time-to-hire' | 'salary-negotiation' | 'candidate-acceptance';
  probability: number; // 0-100
  confidence: number; // 0-100
  factors: string[];
  reasoning: string;
}

// Territory Management Types
export interface Territory {
  id: string;
  name: string;
  type: 'geographic' | 'skill-based' | 'industry' | 'experience-level' | 'custom';
  criteria: TerritoryCriteria;
  assignedRecruiters: string[];
  isActive: boolean;
  performance: TerritoryPerformance;
  createdBy: string;
  createdAt: Date;
}

export interface TerritoryCriteria {
  locations?: string[];
  skills?: string[];
  industries?: string[];
  experienceLevels?: string[];
  salaryRanges?: SalaryRange[];
  customRules?: string; // JSON logic expression
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface TerritoryPerformance {
  totalCandidates: number;
  placedCandidates: number;
  averageTimeToHire: number;
  conversionRate: number;
  revenue: number;
  lastUpdated: Date;
}

export interface AssignmentRule {
  id: string;
  name: string;
  priority: number;
  conditions: WorkflowCondition[];
  territoryId: string;
  isActive: boolean;
  description: string;
}

// Workflow Execution Types
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  candidateId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  executedActions: ExecutedAction[];
  error?: string;
  context: Record<string, any>;
}

export interface ExecutedAction {
  actionId: string;
  actionType: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  executedAt?: Date;
  result?: any;
  error?: string;
  duration?: number; // milliseconds
}

export interface WorkflowAnalytics {
  workflowId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  executionsByDay: { date: string; count: number }[];
  actionPerformance: ActionPerformance[];
  lastUpdated: Date;
}

export interface ActionPerformance {
  actionType: string;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  errorRate: number;
}

// Workflow Builder Types
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  position: { x: number; y: number };
  data: WorkflowTrigger | WorkflowCondition | WorkflowAction;
  connections: string[]; // IDs of connected nodes
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: 'success' | 'failure' | 'conditional';
  label?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'nurturing' | 'placement' | 'follow-up' | 'scoring' | 'assignment';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
}

// Workflow Status Types
export interface WorkflowStatus {
  workflowId: string;
  candidateId: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  currentStep: number;
  totalSteps: number;
  lastExecuted: Date;
  nextExecution?: Date;
  progress: number; // 0-100
}

// Communication Preferences
export interface CommunicationPreference {
  candidateId: string;
  channel: 'email' | 'sms' | 'phone' | 'linkedin' | 'whatsapp';
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  optedOut: boolean;
  preferences: {
    jobAlerts: boolean;
    interviewReminders: boolean;
    statusUpdates: boolean;
    marketingEmails: boolean;
  };
  lastUpdated: Date;
}

// Email Sequence Types
export interface EmailSequence {
  id: string;
  name: string;
  trigger: 'candidate-added' | 'interview-scheduled' | 'offer-sent' | 'manual';
  emails: SequenceEmail[];
  isActive: boolean;
  stats: SequenceStats;
  createdBy: string;
  createdAt: Date;
}

export interface SequenceEmail {
  id: string;
  subject: string;
  template: string;
  delayDays: number;
  conditions?: string; // JSON logic for conditional sending
  attachments?: string[];
}

export interface SequenceStats {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  unsubscribed: number;
  bounced: number;
}

// Task Management Types
export interface AutomatedTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  relatedTo: {
    type: 'candidate' | 'job' | 'client' | 'workflow';
    id: string;
  };
  workflowExecutionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Notification Types
export interface WorkflowNotification {
  id: string;
  type: 'workflow-completed' | 'workflow-failed' | 'action-required' | 'score-threshold' | 'territory-assigned';
  title: string;
  message: string;
  recipientId: string;
  workflowId?: string;
  candidateId?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Integration Types
export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  payload?: string; // JSON template
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'api-key';
    credentials: Record<string, string>;
  };
  isActive: boolean;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
  };
}

// Workflow Builder UI Types
export interface DragItem {
  type: 'trigger' | 'condition' | 'action';
  subType: string;
  label: string;
  icon: string;
  description: string;
}

export interface CanvasState {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNodeId?: string;
  selectedConnectionId?: string;
  zoom: number;
  pan: { x: number; y: number };
}

export interface NodeTemplate {
  type: 'trigger' | 'condition' | 'action';
  subType: string;
  label: string;
  icon: string;
  description: string;
  defaultData: any;
  configSchema: any; // JSON schema for configuration
}