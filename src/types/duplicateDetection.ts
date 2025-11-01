// Duplicate Detection Types for Recruitment System

export interface DuplicateMatch {
  candidateId: string;
  candidate: any; // Will be typed as Candidate when imported
  matchScore: number; // 0-100 similarity score
  matchReasons: MatchReason[];
  confidence: 'high' | 'medium' | 'low';
  createdBy: string; // Original recruiter who added this candidate
  createdByName: string; // Display name of original recruiter
  createdAt: Date;
}

export interface MatchReason {
  field: 'email' | 'phone' | 'name' | 'linkedin' | 'resume';
  similarity: number; // 0-100
  algorithm: 'exact' | 'fuzzy' | 'phonetic' | 'semantic' | 'normalized' | 'jaro_winkler';
  details: string;
  originalValue: string;
  matchedValue: string;
}

export interface DuplicateGroup {
  id: string;
  candidates: any[]; // Will be typed as Candidate[] when imported
  primaryCandidateId?: string;
  status: 'pending' | 'resolved' | 'ignored';
  detectedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: DuplicateResolution;
}

export interface DuplicateResolution {
  type: 'merge' | 'keep-separate' | 'link-related' | 'ignore';
  primaryCandidateId?: string;
  mergedCandidateIds?: string[];
  reason?: string;
  resolvedBy: string;
  resolvedByName: string;
  resolvedAt: Date;
}

export interface MergePreview {
  primaryCandidate: any; // Will be typed as Candidate when imported
  duplicateCandidate: any; // Will be typed as Candidate when imported
  mergedCandidate: any; // Will be typed as Candidate when imported
  conflicts: MergeConflict[];
  preservedData: PreservedData[];
}

export interface MergeConflict {
  field: string;
  fieldDisplayName: string;
  primaryValue: any;
  duplicateValue: any;
  suggestedValue: any;
  requiresDecision: boolean;
  conflictType: 'different-values' | 'missing-data' | 'format-mismatch';
}

export interface MergeDecision {
  field: string;
  selectedValue: any;
  source: 'primary' | 'duplicate' | 'custom';
  reason?: string;
}

export interface PreservedData {
  type: 'note' | 'interview' | 'document' | 'interaction' | 'change-history';
  data: any;
  originalCandidateId: string;
  preserveInMerged: boolean;
  description: string;
}

export interface DuplicateDetectionConfig {
  emailThreshold: number; // Minimum similarity for email matching (0-100)
  phoneThreshold: number; // Minimum similarity for phone matching (0-100)
  nameThreshold: number; // Minimum similarity for name matching (0-100)
  overallThreshold: number; // Minimum overall score to flag as duplicate (0-100)
  autoMergeThreshold: number; // Score above which to suggest auto-merge (0-100)
  algorithms: {
    name: 'levenshtein' | 'jaro-winkler' | 'soundex';
    phone: 'exact' | 'normalized' | 'fuzzy';
    email: 'exact' | 'domain-aware';
  };
  enabledFields: ('email' | 'phone' | 'name' | 'linkedin')[];
  realTimeChecking: boolean;
  bulkDetectionEnabled: boolean;
}

export interface DuplicateFilters {
  status: 'all' | 'pending' | 'resolved' | 'ignored';
  confidence: 'all' | 'high' | 'medium' | 'low';
  dateRange: {
    start: Date;
    end: Date;
  };
  recruiter: string[];
  matchType: 'all' | 'email' | 'phone' | 'name' | 'multiple';
  minScore: number;
  maxScore: number;
}

export interface DuplicateDetectionResult {
  hasMatches: boolean;
  matches: DuplicateMatch[];
  totalMatches: number;
  highConfidenceMatches: number;
  mediumConfidenceMatches: number;
  lowConfidenceMatches: number;
  processingTime: number; // milliseconds
}

export interface BulkDuplicateResult {
  totalCandidates: number;
  duplicateGroups: DuplicateGroup[];
  totalDuplicates: number;
  autoResolvable: number;
  requiresManualReview: number;
  processingTime: number;
}

export interface DuplicateAuditEntry {
  id: string;
  action: 'detected' | 'merged' | 'ignored' | 'separated' | 'linked';
  candidateIds: string[];
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  details: {
    matchScore?: number;
    mergeDecisions?: MergeDecision[];
    reason?: string;
    affectedFields?: string[];
  };
  ipAddress?: string;
  userAgent?: string;
}

// Default configuration for duplicate detection
export const DEFAULT_DUPLICATE_CONFIG: DuplicateDetectionConfig = {
  emailThreshold: 95, // Very high threshold for email (almost exact match)
  phoneThreshold: 85, // High threshold for phone numbers
  nameThreshold: 80, // Moderate threshold for names (allows for variations)
  overallThreshold: 75, // Overall threshold to flag as potential duplicate
  autoMergeThreshold: 95, // Very high threshold for auto-merge suggestions
  algorithms: {
    name: 'jaro-winkler', // Good for name variations
    phone: 'normalized', // Normalize phone numbers before comparison
    email: 'exact' // Email should be exact match
  },
  enabledFields: ['email', 'phone', 'name'],
  realTimeChecking: true,
  bulkDetectionEnabled: true
};

// Confidence level thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 90,
  MEDIUM: 75,
  LOW: 60
};

// Match reason templates for user-friendly descriptions
export const MATCH_REASON_TEMPLATES = {
  email: {
    exact: 'Exact email match: {original} = {matched}',
    fuzzy: 'Similar email: {original} ≈ {matched} ({similarity}% match)'
  },
  phone: {
    exact: 'Exact phone match: {original} = {matched}',
    normalized: 'Phone numbers match when normalized: {original} ≈ {matched}',
    fuzzy: 'Similar phone numbers: {original} ≈ {matched} ({similarity}% match)'
  },
  name: {
    exact: 'Exact name match: {original} = {matched}',
    fuzzy: 'Similar names: {original} ≈ {matched} ({similarity}% match)',
    phonetic: 'Names sound similar: {original} ≈ {matched} (phonetic match)',
    jaro_winkler: 'Names are very similar: {original} ≈ {matched} ({similarity}% match)'
  },
  linkedin: {
    exact: 'Same LinkedIn profile: {original} = {matched}',
    fuzzy: 'Similar LinkedIn profiles: {original} ≈ {matched}'
  }
};

// Field importance weights for overall score calculation
export const FIELD_WEIGHTS = {
  email: 0.4, // 40% weight - most important
  phone: 0.3, // 30% weight - very important
  name: 0.2, // 20% weight - important but can vary
  linkedin: 0.1 // 10% weight - nice to have
};