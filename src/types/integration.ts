/**
 * Integration & API Type Definitions
 */

// Rate Limiting Types
export interface RateLimit {
  requests: number;
  window: number; // milliseconds
}

export interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export type RateLimitTier = 'default' | 'premium' | 'enterprise';

// REST API Types
export interface APIResponse<T = any> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
  rateLimit?: RateLimitCheck;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Webhook Types
export interface Webhook {
  id: string;
  event: WebhookEvent;
  url: string;
  secret: string;
  active: boolean;
  createdAt: Date;
}

export type WebhookEvent = 
  | 'candidate.created'
  | 'candidate.updated'
  | 'candidate.deleted'
  | 'interview.scheduled'
  | 'interview.completed'
  | 'offer.sent'
  | 'offer.accepted'
  | 'offer.declined'
  | 'job.created'
  | 'job.updated'
  | 'client.created';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
}

// Integration Marketplace Types
export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: string;
  status: 'available' | 'coming-soon' | 'beta';
  features: string[];
  pricing?: {
    tier: 'free' | 'premium' | 'enterprise';
    price?: number;
  };
}

export type IntegrationCategory = 
  | 'hr-tools'
  | 'job-boards'
  | 'communication'
  | 'video-conferencing'
  | 'calendar'
  | 'analytics'
  | 'productivity';

export interface IntegrationConnection {
  integrationId: string;
  connected: boolean;
  connectedAt?: Date;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
}

// HR Tools Integration Types
export interface HRToolCredentials {
  apiKey?: string;
  apiSecret?: string;
  subdomain?: string;
  username?: string;
  password?: string;
}

export interface SyncResult {
  synced: number;
  failed: number;
  errors: SyncError[];
  message: string;
}

export interface SyncError {
  recordId: string;
  error: string;
  details?: any;
}

// Job Board Integration Types
export interface JobPostingData {
  title: string;
  description: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  benefits?: string[];
}

export interface JobPostingResult {
  success: boolean;
  jobId: string;
  url: string;
  expiresAt?: Date;
}

// Custom Fields Types
export interface CustomField {
  id: string;
  entityType: 'candidate' | 'job' | 'interview' | 'offer' | 'client';
  label: string;
  fieldName: string;
  fieldType: CustomFieldType;
  required: boolean;
  description?: string;
  options?: string[];
  validation?: CustomFieldValidation;
  createdAt: Date;
}

export type CustomFieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'url'
  | 'email'
  | 'phone';

export interface CustomFieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// Import/Export Types
export interface ImportConfig {
  entityType: string;
  format: 'csv' | 'json' | 'excel';
  fieldMapping: Record<string, string>;
  options?: {
    skipDuplicates?: boolean;
    updateExisting?: boolean;
    validateOnly?: boolean;
  };
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  failed: number;
  errors: ImportError[];
  warnings?: ImportWarning[];
}

export interface ImportError {
  row: number;
  field?: string;
  error: string;
  value?: any;
}

export interface ImportWarning {
  row: number;
  field?: string;
  warning: string;
  value?: any;
}

export interface ExportConfig {
  entityType: string;
  format: 'csv' | 'json' | 'excel' | 'pdf';
  filters?: Record<string, any>;
  fields?: string[];
  options?: {
    includeHeaders?: boolean;
    dateFormat?: string;
    encoding?: string;
  };
}

export interface ExportResult {
  format: string;
  data: string | Blob;
  filename: string;
  recordCount: number;
}

// API Documentation Types
export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  params: APIParameter[];
  requestBody?: APIRequestBody;
  responses: APIResponse[];
  examples: Record<string, string>;
}

export interface APIParameter {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  default?: any;
}

export interface APIRequestBody {
  contentType: string;
  schema: any;
  example?: any;
}

export interface APIResponseType {
  statusCode: number;
  description: string;
  schema?: any;
  example?: any;
}

// Integration Settings Types
export interface IntegrationSettings {
  apiKey: string;
  rateLimitTier: RateLimitTier;
  webhooksEnabled: boolean;
  allowedOrigins: string[];
  ipWhitelist?: string[];
  customFields: CustomField[];
  connectedIntegrations: IntegrationConnection[];
}

export default {
  // Export all types
};
