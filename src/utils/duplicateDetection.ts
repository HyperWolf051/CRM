// Duplicate Detection Utilities

import { 
  DuplicateMatch, 
  MatchReason, 
  DuplicateDetectionConfig, 
  DuplicateDetectionResult,
  MergePreview,
  MergeConflict,
  PreservedData,
  DEFAULT_DUPLICATE_CONFIG,
  CONFIDENCE_THRESHOLDS,
  MATCH_REASON_TEMPLATES,
  FIELD_WEIGHTS
} from '../types/duplicateDetection';
import { Candidate } from '../types/recruitment';

// String similarity algorithms
class StringSimilarity {
  // Levenshtein distance algorithm
  static levenshtein(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    if (str1 === str2) return 100;
    
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    const maxLength = Math.max(str1.length, str2.length);
    const distance = matrix[str2.length][str1.length];
    return Math.round(((maxLength - distance) / maxLength) * 100);
  }

  // Jaro-Winkler similarity algorithm (better for names)
  static jaroWinkler(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    if (str1 === str2) return 100;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0 || len2 === 0) return 0;
    
    const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
    if (matchWindow < 0) return 0;
    
    const str1Matches = new Array(len1).fill(false);
    const str2Matches = new Array(len2).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // Identify matches
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchWindow);
      const end = Math.min(i + matchWindow + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (str2Matches[j] || str1[i] !== str2[j]) continue;
        str1Matches[i] = true;
        str2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0;
    
    // Count transpositions
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    
    const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
    
    // Calculate common prefix length (up to 4 characters)
    let prefix = 0;
    for (let i = 0; i < Math.min(len1, len2, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }
    
    return Math.round((jaro + 0.1 * prefix * (1 - jaro)) * 100);
  }

  // Soundex algorithm for phonetic matching
  static soundex(str: string): string {
    if (!str) return '';
    
    str = str.toUpperCase().replace(/[^A-Z]/g, '');
    if (str.length === 0) return '';
    
    const firstLetter = str[0];
    str = str.substring(1);
    
    // Replace consonants with digits
    str = str.replace(/[BFPV]/g, '1');
    str = str.replace(/[CGJKQSXZ]/g, '2');
    str = str.replace(/[DT]/g, '3');
    str = str.replace(/[L]/g, '4');
    str = str.replace(/[MN]/g, '5');
    str = str.replace(/[R]/g, '6');
    
    // Remove vowels and other letters
    str = str.replace(/[AEIOUYHW]/g, '');
    
    // Remove consecutive duplicates
    str = str.replace(/(.)\1+/g, '$1');
    
    // Pad with zeros and truncate to 4 characters
    str = (firstLetter + str + '000').substring(0, 4);
    
    return str;
  }

  // Phone number normalization
  static normalizePhone(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle Indian phone numbers
    if (digits.length === 10) {
      return digits;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return digits.substring(2);
    } else if (digits.length === 13 && digits.startsWith('091')) {
      return digits.substring(3);
    }
    
    return digits;
  }

  // Email normalization
  static normalizeEmail(email: string): string {
    if (!email) return '';
    
    return email.toLowerCase().trim();
  }
}

// Main duplicate detection utility class
export class DuplicateDetectionUtils {
  private config: DuplicateDetectionConfig;

  constructor(config: DuplicateDetectionConfig = DEFAULT_DUPLICATE_CONFIG) {
    this.config = config;
  }

  // Check for duplicates against a list of existing candidates
  async detectDuplicates(
    newCandidate: Partial<Candidate>, 
    existingCandidates: Candidate[]
  ): Promise<DuplicateDetectionResult> {
    const startTime = Date.now();
    const matches: DuplicateMatch[] = [];

    for (const existing of existingCandidates) {
      const match = this.compareCandidate(newCandidate, existing);
      if (match && match.matchScore >= this.config.overallThreshold) {
        matches.push(match);
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    const result: DuplicateDetectionResult = {
      hasMatches: matches.length > 0,
      matches,
      totalMatches: matches.length,
      highConfidenceMatches: matches.filter(m => m.confidence === 'high').length,
      mediumConfidenceMatches: matches.filter(m => m.confidence === 'medium').length,
      lowConfidenceMatches: matches.filter(m => m.confidence === 'low').length,
      processingTime: Date.now() - startTime
    };

    return result;
  }

  // Compare two candidates and return match details
  private compareCandidate(candidate1: Partial<Candidate>, candidate2: Candidate): DuplicateMatch | null {
    const matchReasons: MatchReason[] = [];
    let totalScore = 0;
    let weightSum = 0;

    // Email comparison
    if (this.config.enabledFields.includes('email') && candidate1.email && candidate2.email) {
      const emailMatch = this.compareEmails(candidate1.email, candidate2.email);
      if (emailMatch.similarity >= this.config.emailThreshold) {
        matchReasons.push(emailMatch);
        totalScore += emailMatch.similarity * FIELD_WEIGHTS.email;
        weightSum += FIELD_WEIGHTS.email;
      }
    }

    // Phone comparison
    if (this.config.enabledFields.includes('phone') && candidate1.phone && candidate2.phone) {
      const phoneMatch = this.comparePhones(candidate1.phone, candidate2.phone);
      if (phoneMatch.similarity >= this.config.phoneThreshold) {
        matchReasons.push(phoneMatch);
        totalScore += phoneMatch.similarity * FIELD_WEIGHTS.phone;
        weightSum += FIELD_WEIGHTS.phone;
      }
    }

    // Name comparison
    if (this.config.enabledFields.includes('name') && candidate1.name && candidate2.name) {
      const nameMatch = this.compareNames(candidate1.name, candidate2.name);
      if (nameMatch.similarity >= this.config.nameThreshold) {
        matchReasons.push(nameMatch);
        totalScore += nameMatch.similarity * FIELD_WEIGHTS.name;
        weightSum += FIELD_WEIGHTS.name;
      }
    }

    // If no matches found, return null
    if (matchReasons.length === 0) {
      return null;
    }

    // Calculate overall score
    const overallScore = weightSum > 0 ? Math.round(totalScore / weightSum) : 0;

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low';
    if (overallScore >= CONFIDENCE_THRESHOLDS.HIGH) {
      confidence = 'high';
    } else if (overallScore >= CONFIDENCE_THRESHOLDS.MEDIUM) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    return {
      candidateId: candidate2.id,
      candidate: candidate2,
      matchScore: overallScore,
      matchReasons,
      confidence,
      createdBy: candidate2.createdBy,
      createdByName: candidate2.createdByName,
      createdAt: candidate2.createdAt
    };
  }

  // Compare email addresses
  private compareEmails(email1: string, email2: string): MatchReason {
    const normalized1 = StringSimilarity.normalizeEmail(email1);
    const normalized2 = StringSimilarity.normalizeEmail(email2);

    let similarity: number;
    let algorithm: 'exact' | 'fuzzy';

    if (normalized1 === normalized2) {
      similarity = 100;
      algorithm = 'exact';
    } else {
      similarity = StringSimilarity.levenshtein(normalized1, normalized2);
      algorithm = 'fuzzy';
    }

    return {
      field: 'email',
      similarity,
      algorithm,
      details: this.formatMatchReason('email', algorithm, email1, email2, similarity),
      originalValue: email1,
      matchedValue: email2
    };
  }

  // Compare phone numbers
  private comparePhones(phone1: string, phone2: string): MatchReason {
    const normalized1 = StringSimilarity.normalizePhone(phone1);
    const normalized2 = StringSimilarity.normalizePhone(phone2);

    let similarity: number;
    let algorithm: 'exact' | 'normalized' | 'fuzzy';

    if (phone1 === phone2) {
      similarity = 100;
      algorithm = 'exact';
    } else if (normalized1 === normalized2 && normalized1.length >= 10) {
      similarity = 95;
      algorithm = 'normalized';
    } else {
      similarity = StringSimilarity.levenshtein(normalized1, normalized2);
      algorithm = 'fuzzy';
    }

    return {
      field: 'phone',
      similarity,
      algorithm,
      details: this.formatMatchReason('phone', algorithm, phone1, phone2, similarity),
      originalValue: phone1,
      matchedValue: phone2
    };
  }

  // Compare names
  private compareNames(name1: string, name2: string): MatchReason {
    let similarity: number;
    let algorithm: 'exact' | 'fuzzy' | 'phonetic' | 'jaro_winkler';

    const normalized1 = name1.toLowerCase().trim();
    const normalized2 = name2.toLowerCase().trim();

    if (normalized1 === normalized2) {
      similarity = 100;
      algorithm = 'exact';
    } else {
      // Use Jaro-Winkler for name comparison (better for names)
      similarity = StringSimilarity.jaroWinkler(name1, name2);
      algorithm = 'jaro_winkler';

      // Also check phonetic similarity
      const soundex1 = StringSimilarity.soundex(name1);
      const soundex2 = StringSimilarity.soundex(name2);
      
      if (soundex1 === soundex2 && soundex1.length > 0) {
        // If phonetic match is better, use it
        if (similarity < 80) {
          similarity = Math.max(similarity, 75);
          algorithm = 'phonetic';
        }
      }
    }

    return {
      field: 'name',
      similarity,
      algorithm,
      details: this.formatMatchReason('name', algorithm, name1, name2, similarity),
      originalValue: name1,
      matchedValue: name2
    };
  }

  // Format match reason for display
  private formatMatchReason(
    field: keyof typeof MATCH_REASON_TEMPLATES,
    algorithm: string,
    original: string,
    matched: string,
    similarity: number
  ): string {
    const template = MATCH_REASON_TEMPLATES[field]?.[algorithm as keyof typeof MATCH_REASON_TEMPLATES[typeof field]];
    
    if (!template) {
      return `${field} match: ${original} ≈ ${matched} (${similarity}% similarity)`;
    }

    return template
      .replace('{original}', original)
      .replace('{matched}', matched)
      .replace('{similarity}', similarity.toString());
  }

  // Generate merge preview
  generateMergePreview(primaryCandidate: Candidate, duplicateCandidate: Candidate): MergePreview {
    const conflicts: MergeConflict[] = [];
    const preservedData: PreservedData[] = [];
    
    // Create merged candidate starting with primary
    const mergedCandidate = { ...primaryCandidate };

    // Define fields to check for conflicts
    const fieldsToCheck = [
      { key: 'name', display: 'Name' },
      { key: 'email', display: 'Email' },
      { key: 'phone', display: 'Phone' },
      { key: 'location', display: 'Location' },
      { key: 'currentCompany', display: 'Current Company' },
      { key: 'designation', display: 'Designation' },
      { key: 'totalExperience', display: 'Total Experience' },
      { key: 'lastSalary', display: 'Last Salary' },
      { key: 'salaryExpectation', display: 'Salary Expectation' },
      { key: 'qualification', display: 'Qualification' }
    ];

    // Check for conflicts
    fieldsToCheck.forEach(({ key, display }) => {
      const primaryValue = (primaryCandidate as any)[key];
      const duplicateValue = (duplicateCandidate as any)[key];

      if (primaryValue && duplicateValue && primaryValue !== duplicateValue) {
        conflicts.push({
          field: key,
          fieldDisplayName: display,
          primaryValue,
          duplicateValue,
          suggestedValue: primaryValue, // Default to primary
          requiresDecision: true,
          conflictType: 'different-values'
        });
      } else if (!primaryValue && duplicateValue) {
        // Primary is missing data, suggest using duplicate's value
        conflicts.push({
          field: key,
          fieldDisplayName: display,
          primaryValue: null,
          duplicateValue,
          suggestedValue: duplicateValue,
          requiresDecision: false,
          conflictType: 'missing-data'
        });
        
        // Auto-merge missing data
        (mergedCandidate as any)[key] = duplicateValue;
      }
    });

    // Preserve data from duplicate candidate
    if (duplicateCandidate.notes && duplicateCandidate.notes.length > 0) {
      preservedData.push({
        type: 'note',
        data: duplicateCandidate.notes,
        originalCandidateId: duplicateCandidate.id,
        preserveInMerged: true,
        description: `${duplicateCandidate.notes.length} notes from duplicate candidate`
      });
    }

    if (duplicateCandidate.changeHistory && duplicateCandidate.changeHistory.length > 0) {
      preservedData.push({
        type: 'change-history',
        data: duplicateCandidate.changeHistory,
        originalCandidateId: duplicateCandidate.id,
        preserveInMerged: true,
        description: `Change history from duplicate candidate (${duplicateCandidate.changeHistory.length} entries)`
      });
    }

    return {
      primaryCandidate,
      duplicateCandidate,
      mergedCandidate,
      conflicts,
      preservedData
    };
  }

  // Apply merge decisions to create final merged candidate
  applyMergeDecisions(
    mergePreview: MergePreview,
    decisions: { field: string; selectedValue: any; source: 'primary' | 'duplicate' | 'custom' }[]
  ): Candidate {
    const mergedCandidate = { ...mergePreview.mergedCandidate };

    // Apply user decisions
    decisions.forEach(decision => {
      (mergedCandidate as any)[decision.field] = decision.selectedValue;
    });

    // Merge preserved data
    mergePreview.preservedData.forEach(preserved => {
      if (preserved.preserveInMerged) {
        switch (preserved.type) {
          case 'note':
            mergedCandidate.notes = [
              ...(mergedCandidate.notes || []),
              ...(preserved.data as any[])
            ];
            break;
          case 'change-history':
            mergedCandidate.changeHistory = [
              ...(mergedCandidate.changeHistory || []),
              ...(preserved.data as any[])
            ];
            break;
        }
      }
    });

    // Update metadata
    mergedCandidate.updatedAt = new Date();

    return mergedCandidate;
  }

  // Update configuration
  updateConfig(newConfig: Partial<DuplicateDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): DuplicateDetectionConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const duplicateDetectionUtils = new DuplicateDetectionUtils();

// Utility functions for UI components
export const duplicateUIUtils = {
  // Get confidence color for UI
  getConfidenceColor: (confidence: 'high' | 'medium' | 'low'): string => {
    switch (confidence) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  },

  // Get confidence icon
  getConfidenceIcon: (confidence: 'high' | 'medium' | 'low'): string => {
    switch (confidence) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  },

  // Format match score for display
  formatMatchScore: (score: number): string => {
    return `${score}%`;
  },

  // Get match type display text
  getMatchTypeDisplay: (reasons: MatchReason[]): string => {
    const fields = reasons.map(r => r.field);
    if (fields.length === 1) {
      return fields[0].charAt(0).toUpperCase() + fields[0].slice(1);
    }
    return `Multiple (${fields.join(', ')})`;
  },

  // Format time ago
  formatTimeAgo: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
};