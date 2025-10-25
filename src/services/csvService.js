import { CandidateAPI } from './api';
import { csvUtils, VALIDATION_RULES } from '../utils/csvMappings';

// CSV Import/Export Service
export class CSVService {
  // Import candidates from CSV data
  static async importCandidates(processedData, fieldMapping, importType = 'registration') {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
      importedCandidates: []
    };

    for (let i = 0; i < processedData.length; i++) {
      const row = processedData[i];
      const rowIndex = row._rowIndex || i + 2;

      try {
        // Remove internal fields
        const { _rowIndex, _originalRow, _hasErrors, ...candidateData } = row;

        // Set default values and metadata
        const candidate = {
          ...candidateData,
          id: `candidate_${Date.now()}_${i}`, // Temporary ID
          currentStage: this.determineStageFromImportType(importType),
          overallStatus: this.determineStatusFromData(candidateData),
          createdBy: 'csv_import', // Will be replaced with actual user ID
          createdByName: 'CSV Import',
          createdAt: new Date(),
          updatedAt: new Date(),
          changeHistory: [{
            id: `change_${Date.now()}_${i}`,
            candidateId: `candidate_${Date.now()}_${i}`,
            changedBy: 'csv_import',
            changedByName: 'CSV Import',
            changeType: 'imported',
            changes: [{
              field: 'all',
              fieldDisplayName: 'All Fields',
              oldValue: null,
              newValue: candidateData,
              changeDescription: `Candidate imported from CSV (${importType})`
            }],
            timestamp: new Date(),
            reason: `CSV import - ${importType} data`
          }]
        };

        // Validate required fields
        const validationResult = this.validateCandidateData(candidate);
        if (!validationResult.isValid) {
          results.errors.push({
            row: rowIndex,
            message: validationResult.errors.join(', '),
            data: candidateData
          });
          results.failed++;
          continue;
        }

        // Create candidate via API
        const apiResult = await CandidateAPI.create(candidate);
        
        if (apiResult.success) {
          results.successful++;
          results.importedCandidates.push(apiResult.data);
        } else {
          results.errors.push({
            row: rowIndex,
            message: apiResult.message || 'Failed to create candidate',
            data: candidateData
          });
          results.failed++;
        }
      } catch (error) {
        console.error(`Error importing row ${rowIndex}:`, error);
        results.errors.push({
          row: rowIndex,
          message: error.message || 'Unknown error occurred',
          data: row
        });
        results.failed++;
      }
    }

    return results;
  }

  // Determine recruitment stage from import type
  static determineStageFromImportType(importType) {
    const stageMapping = {
      'registration': 'registration',
      'resumeShare': 'resume-sharing',
      'shortlist': 'shortlisting',
      'lineupFeedback': 'lineup-feedback',
      'selection': 'selection',
      'closure': 'closure'
    };
    return stageMapping[importType] || 'registration';
  }

  // Determine candidate status from data
  static determineStatusFromData(candidateData) {
    // Check closure data first (highest priority)
    if (candidateData.closure?.joiningStatus === 'Yes') {
      return 'placed';
    }
    
    // Check selection data
    if (candidateData.selection?.selectionStatus === 'Selected') {
      return 'selected';
    }
    
    if (candidateData.selection?.selectionStatus === 'Rejected') {
      return 'rejected';
    }
    
    // Check lineup feedback
    if (candidateData.lineupFeedback?.feedbacks?.length > 0) {
      const latestFeedback = candidateData.lineupFeedback.feedbacks[candidateData.lineupFeedback.feedbacks.length - 1];
      if (latestFeedback.feedback === 'Selected') return 'interviewed';
      if (latestFeedback.feedback === 'Rejected') return 'rejected';
    }
    
    // Check shortlisting
    if (candidateData.shortlisting?.shortlistStatus === 'Done') {
      return 'shortlisted';
    }
    
    // Check resume sharing
    if (candidateData.resumeSharing?.resumeShareStatus === 'Done') {
      return 'in-process';
    }
    
    // Default to new
    return 'new';
  }

  // Validate candidate data
  static validateCandidateData(candidate) {
    const errors = [];
    
    // Check required fields
    const requiredFields = ['name', 'email'];
    requiredFields.forEach(field => {
      if (!candidate[field] || candidate[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    // Validate email format
    if (candidate.email && !VALIDATION_RULES.email.pattern.test(candidate.email)) {
      errors.push('Invalid email format');
    }

    // Validate phone if provided
    if (candidate.phone) {
      const phoneValidation = VALIDATION_RULES.phone.validate(candidate.phone);
      if (phoneValidation !== true) {
        errors.push(phoneValidation);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Export candidates to CSV
  static async exportCandidates(candidates, exportConfig) {
    try {
      const { fields, filters, exportType } = exportConfig;
      
      // Filter candidates based on criteria
      let filteredCandidates = [...candidates];
      
      if (filters.dateRange.start || filters.dateRange.end) {
        filteredCandidates = filteredCandidates.filter(candidate => {
          const candidateDate = new Date(candidate.createdAt);
          const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
          const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
          
          if (startDate && candidateDate < startDate) return false;
          if (endDate && candidateDate > endDate) return false;
          return true;
        });
      }
      
      if (filters.statusFilter !== 'all') {
        filteredCandidates = filteredCandidates.filter(candidate => 
          candidate.overallStatus === filters.statusFilter
        );
      }

      // Convert to CSV format
      const csvData = this.convertCandidatesToCSV(filteredCandidates, fields, exportType);
      
      return {
        success: true,
        data: csvData,
        count: filteredCandidates.length
      };
    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Convert candidates to CSV format
  static convertCandidatesToCSV(candidates, selectedFields, exportType) {
    const headers = selectedFields;
    
    const rows = candidates.map(candidate => {
      return selectedFields.map(field => {
        let value = this.getNestedFieldValue(candidate, field);
        
        // Format specific field types
        if (value instanceof Date) {
          value = value.toISOString().split('T')[0]; // YYYY-MM-DD format
        } else if (Array.isArray(value)) {
          value = value.map(item => 
            typeof item === 'object' ? JSON.stringify(item) : item
          ).join('; ');
        } else if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        
        // Handle CSV escaping
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Get nested field value from object
  static getNestedFieldValue(obj, fieldPath) {
    const parts = fieldPath.split('.');
    let value = obj;
    
    for (const part of parts) {
      if (value === null || value === undefined) return '';
      value = value[part];
    }
    
    return value;
  }

  // Detect duplicate candidates during import
  static async detectDuplicates(newCandidates, existingCandidates = []) {
    const duplicates = [];
    
    // Get existing candidates if not provided
    if (existingCandidates.length === 0) {
      try {
        const result = await CandidateAPI.getAll();
        if (result.success) {
          existingCandidates = result.data;
        }
      } catch (error) {
        console.warn('Could not fetch existing candidates for duplicate detection:', error);
      }
    }

    newCandidates.forEach((newCandidate, index) => {
      const matches = existingCandidates.filter(existing => {
        // Email match (exact)
        if (newCandidate.email && existing.email && 
            newCandidate.email.toLowerCase() === existing.email.toLowerCase()) {
          return true;
        }
        
        // Phone match (normalized)
        if (newCandidate.phone && existing.phone) {
          const newPhone = newCandidate.phone.replace(/\D/g, '');
          const existingPhone = existing.phone.replace(/\D/g, '');
          if (newPhone === existingPhone && newPhone.length >= 10) {
            return true;
          }
        }
        
        // Name similarity (basic)
        if (newCandidate.name && existing.name) {
          const newName = newCandidate.name.toLowerCase().trim();
          const existingName = existing.name.toLowerCase().trim();
          if (newName === existingName) {
            return true;
          }
        }
        
        return false;
      });

      if (matches.length > 0) {
        duplicates.push({
          newCandidateIndex: index,
          newCandidate,
          matches: matches.map(match => ({
            id: match.id,
            name: match.name,
            email: match.email,
            phone: match.phone,
            matchReason: this.getDuplicateMatchReason(newCandidate, match)
          }))
        });
      }
    });

    return duplicates;
  }

  // Get reason for duplicate match
  static getDuplicateMatchReason(candidate1, candidate2) {
    const reasons = [];
    
    if (candidate1.email && candidate2.email && 
        candidate1.email.toLowerCase() === candidate2.email.toLowerCase()) {
      reasons.push('Email match');
    }
    
    if (candidate1.phone && candidate2.phone) {
      const phone1 = candidate1.phone.replace(/\D/g, '');
      const phone2 = candidate2.phone.replace(/\D/g, '');
      if (phone1 === phone2 && phone1.length >= 10) {
        reasons.push('Phone match');
      }
    }
    
    if (candidate1.name && candidate2.name && 
        candidate1.name.toLowerCase().trim() === candidate2.name.toLowerCase().trim()) {
      reasons.push('Name match');
    }
    
    return reasons.join(', ');
  }

  // Generate CSV template for specific import type
  static generateCSVTemplate(importType) {
    const fieldMappings = csvUtils.CSV_FIELD_MAPPINGS[importType];
    if (!fieldMappings) {
      throw new Error(`Unknown import type: ${importType}`);
    }

    const headers = Object.keys(fieldMappings);
    const sampleRow = headers.map(header => {
      // Provide sample data based on field type
      switch (header) {
        case 'DATE': return '4-08-2025';
        case 'CV No': return 'CV001';
        case 'NAME': return 'John Doe';
        case 'PHONE': return '+91 9876543210';
        case 'EMAIL': return 'john.doe@email.com';
        case 'LOC.(City,State)': return 'Mumbai, Maharashtra';
        case 'INTERSTED FOR': return 'Software Developer';
        case 'DESIGNATION': return 'Senior Developer';
        case 'TOTAL EXP IN YEARS': return '5 years';
        case 'LAST SALARY': return '8K';
        case 'SALARY EXP.': return '12K';
        case 'QUALIFICATION': return 'B.Tech';
        case 'REGISTRATION': return 'Yes';
        case 'REG.AMT': return '1000';
        case 'ALLOCATION': return 'Sheet-1';
        default: return 'Sample Data';
      }
    });

    return [headers.join(','), sampleRow.join(',')].join('\n');
  }
}

export default CSVService;