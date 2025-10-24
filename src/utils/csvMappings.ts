import { CSVImportConfig, ValidationRule, CSVFieldMapping } from '../types/recruitment';

// CSV field mappings for different recruitment data files
export const CSV_FIELD_MAPPINGS = {
  // Registration data CSV mapping
  registration: {
    'DATE': 'registration.date',
    'RESOURCE': 'registration.resource',
    'CV No': 'cvNo',
    'NAME': 'name',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'LOC.(City,State)': 'location',
    'INTERSTED FOR': 'interestedFor',
    'DECLARATION': 'declaration',
    'CURRENT COMPANY': 'currentCompany',
    'INDUSTRY': 'industry',
    'DESIGNATION': 'designation',
    'TOTAL EXP IN YEARS': 'totalExperience',
    'LAST SALARY': 'lastSalary',
    'SALARY EXP.': 'salaryExpectation',
    'QUALIFICATION': 'qualification',
    'REGISTRATION': 'registration.registrationStatus',
    'REG.AMT': 'registration.registrationAmount',
    'ALLOCATION': 'allocation'
  },

  // Resume share CSV mapping
  resumeShare: {
    'DATE': 'resumeSharing.date',
    'SHORTLISTS FOR CLIENT': 'resumeSharing.shortlistsForClient',
    'CV No': 'cvNo',
    'NAME': 'name',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'RESUME SHARE': 'resumeSharing.resumeShareStatus',
    'Remark': 'resumeSharing.remark'
  },

  // Shortlist CSV mapping
  shortlist: {
    'Shortlist Date': 'shortlisting.shortlistDate',
    'SHORTLISTS FOR CLIENT': 'shortlisting.shortlistsForClient',
    'RESOURCE': 'shortlisting.resource',
    'CV No': 'cvNo',
    'NAME': 'name',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'SHORTLISTS': 'shortlisting.shortlistStatus'
  },

  // Lineup feedback CSV mapping
  lineupFeedback: {
    'SHORTLIST DATE': 'lineupFeedback.shortlistDate',
    'SHORTLISTS FOR CLIENT': 'lineupFeedback.shortlistsForClient',
    'FEEDBACK-1': 'lineupFeedback.feedbacks[0].feedback',
    'SCH.DATE-2': 'lineupFeedback.feedbacks[0].scheduledDate',
    'CLIENT NAME': 'lineupFeedback.feedbacks[0].clientName',
    'FEEDBACK-2': 'lineupFeedback.feedbacks[1].feedback',
    'SCH.DATE-3': 'lineupFeedback.feedbacks[1].scheduledDate',
    'FEEDBCAK-3': 'lineupFeedback.feedbacks[2].feedback',
    'CV No': 'cvNo',
    'NAME': 'name',
    'LINEUP/FEEDBACK': 'lineupFeedback.lineupStatus'
  },

  // Selection CSV mapping
  selection: {
    'CLIENT': 'selection.client',
    'SELECTION DATE': 'selection.selectionDate',
    'NAME': 'name',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'LINEUP/FEEDBACK': 'selection.selectionStatus'
  },

  // Closure CSV mapping
  closure: {
    'JOINING DATE': 'closure.joiningDate',
    'ALLOCATION': 'allocation',
    'NAME': 'name',
    'PHONE': 'phone',
    'EMAIL': 'email',
    'LAST SALARY': 'lastSalary',
    'PLACED IN': 'closure.placedIn',
    'OFFERED SALARY': 'closure.offeredSalary',
    'CHARGES': 'closure.charges',
    'JOINING STATUS': 'closure.joiningStatus'
  }
};

// Validation rules for different field types
export const VALIDATION_RULES: Record<string, ValidationRule> = {
  email: {
    required: true,
    type: 'email',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (value: string) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return true;
    }
  },
  
  phone: {
    required: true,
    type: 'phone',
    minLength: 10,
    transform: (value: string) => value?.replace(/\D/g, ''), // Remove non-digits
    validate: (value: string) => {
      if (!value) return 'Phone number is required';
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 10) return 'Phone number must be at least 10 digits';
      return true;
    }
  },
  
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    transform: (value: string) => value?.trim(),
    validate: (value: string) => {
      if (!value?.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return true;
    }
  },
  
  cvNo: {
    required: true,
    type: 'string',
    transform: (value: any) => String(value).trim(),
    validate: (value: string) => {
      if (!value?.trim()) return 'CV number is required';
      return true;
    }
  },
  
  date: {
    type: 'date',
    transform: (value: string) => {
      if (!value) return null;
      // Handle various date formats from CSV
      const dateStr = value.trim();
      if (!dateStr) return null;
      
      // Try parsing different formats
      const formats = [
        /^\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}:\d{2}$/, // 4-08-2025 14:37:25
        /^\d{1,2}-\d{1,2}-\d{4}$/, // 4-08-2025
        /^\d{4}-\d{2}-\d{2}$/, // 2025-08-04
      ];
      
      try {
        // Convert DD-MM-YYYY format to MM/DD/YYYY for proper parsing
        if (formats[0].test(dateStr) || formats[1].test(dateStr)) {
          const parts = dateStr.split(' ')[0].split('-');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            return new Date(isoDate);
          }
        }
        return new Date(dateStr);
      } catch {
        return null;
      }
    }
  },
  
  salary: {
    type: 'string',
    transform: (value: string) => value?.trim().toUpperCase(),
    validate: (value: string) => {
      if (!value) return true; // Optional field
      // Accept formats like "5K", "45k", "10000", etc.
      if (!/^\d+[Kk]?$/.test(value.replace(/[,\s]/g, ''))) {
        return 'Invalid salary format (use formats like 5K, 45k, or 10000)';
      }
      return true;
    }
  },
  
  status: {
    type: 'string',
    transform: (value: string) => value?.trim(),
    validate: (value: string) => {
      if (!value) return true; // Optional field
      const validStatuses = ['Yes', 'No', 'Done', 'Pending', 'Selected', 'Rejected', 'Hold', 'Joined'];
      if (!validStatuses.includes(value)) {
        return `Status must be one of: ${validStatuses.join(', ')}`;
      }
      return true;
    }
  }
};

// Import configurations for different CSV types
export const CSV_IMPORT_CONFIGS: Record<string, CSVImportConfig> = {
  registration: {
    requiredFields: ['cvNo', 'name', 'phone', 'email', 'interestedFor'],
    optionalFields: ['location', 'declaration', 'currentCompany', 'industry', 'designation', 'totalExperience', 'lastSalary', 'salaryExpectation', 'qualification', 'allocation'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.registration).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['CV No', 'NAME', 'PHONE', 'EMAIL', 'INTERSTED FOR'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['DATE'],
    numericFields: ['REG.AMT']
  },
  
  resumeShare: {
    requiredFields: ['cvNo', 'name'],
    optionalFields: ['resumeSharing.shortlistsForClient', 'resumeSharing.resumeShareStatus', 'resumeSharing.remark'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.resumeShare).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['CV No', 'NAME'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['DATE'],
    numericFields: []
  },
  
  shortlist: {
    requiredFields: ['cvNo', 'name'],
    optionalFields: ['shortlisting.shortlistDate', 'shortlisting.shortlistsForClient', 'shortlisting.resource', 'shortlisting.shortlistStatus'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.shortlist).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['CV No', 'NAME'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['Shortlist Date'],
    numericFields: []
  },
  
  lineupFeedback: {
    requiredFields: ['cvNo', 'name'],
    optionalFields: ['lineupFeedback.shortlistDate', 'lineupFeedback.shortlistsForClient', 'lineupFeedback.feedbacks', 'lineupFeedback.lineupStatus'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.lineupFeedback).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['CV No', 'NAME'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['SHORTLIST DATE', 'SCH.DATE-2', 'SCH.DATE-3'],
    numericFields: []
  },
  
  selection: {
    requiredFields: ['name'],
    optionalFields: ['selection.client', 'selection.selectionDate', 'selection.selectionStatus'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.selection).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['NAME'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['SELECTION DATE'],
    numericFields: []
  },
  
  closure: {
    requiredFields: ['name'],
    optionalFields: ['closure.joiningDate', 'closure.placedIn', 'closure.offeredSalary', 'closure.charges', 'closure.joiningStatus'],
    fieldMappings: Object.entries(CSV_FIELD_MAPPINGS.closure).reduce((acc, [csvField, targetField]) => {
      acc[csvField] = {
        csvField,
        targetField,
        required: ['NAME'].includes(csvField)
      };
      return acc;
    }, {} as Record<string, CSVFieldMapping>),
    dateFields: ['JOINING DATE'],
    numericFields: ['OFFERED SALARY', 'CHARGES']
  }
};

// Utility functions for CSV processing
export const csvUtils = {
  // Normalize CSV headers (remove extra spaces, handle encoding issues)
  normalizeHeader: (header: string): string => {
    return header.trim().replace(/[""]/g, '"').replace(/\s+/g, ' ');
  },
  
  // Detect CSV type based on headers
  detectCSVType: (headers: string[]): string | null => {
    const normalizedHeaders = headers.map(h => csvUtils.normalizeHeader(h));
    
    // Check for registration data
    if (normalizedHeaders.includes('CV No') && normalizedHeaders.includes('REGISTRATION')) {
      return 'registration';
    }
    
    // Check for resume share data
    if (normalizedHeaders.includes('RESUME SHARE')) {
      return 'resumeShare';
    }
    
    // Check for shortlist data
    if (normalizedHeaders.includes('SHORTLISTS') && normalizedHeaders.includes('Shortlist Date')) {
      return 'shortlist';
    }
    
    // Check for lineup feedback data
    if (normalizedHeaders.includes('FEEDBACK-1') || normalizedHeaders.includes('LINEUP/FEEDBACK')) {
      return 'lineupFeedback';
    }
    
    // Check for selection data
    if (normalizedHeaders.includes('SELECTION DATE')) {
      return 'selection';
    }
    
    // Check for closure data
    if (normalizedHeaders.includes('PLACED IN') || normalizedHeaders.includes('JOINING STATUS')) {
      return 'closure';
    }
    
    return null;
  },
  
  // Generate suggested field mappings
  generateSuggestedMappings: (headers: string[], csvType: string): Record<string, string> => {
    const mappings = CSV_FIELD_MAPPINGS[csvType as keyof typeof CSV_FIELD_MAPPINGS];
    if (!mappings) return {};
    
    const suggestions: Record<string, string> = {};
    const normalizedHeaders = headers.map(h => csvUtils.normalizeHeader(h));
    
    Object.entries(mappings).forEach(([csvField, targetField]) => {
      const matchingHeader = normalizedHeaders.find(h => 
        h === csvField || 
        h.toLowerCase() === csvField.toLowerCase() ||
        h.replace(/[^\w]/g, '').toLowerCase() === csvField.replace(/[^\w]/g, '').toLowerCase()
      );
      
      if (matchingHeader) {
        suggestions[matchingHeader] = targetField;
      }
    });
    
    return suggestions;
  }
};