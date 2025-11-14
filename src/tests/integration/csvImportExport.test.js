/**
 * CSV Import/Export Integration Tests
 * Tests CSV functionality with real agency data scenarios
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { parseCSV, validateCSVData, mapCSVFields, exportToCSV } from '@/services/csvService';

// Sample CSV data based on real agency scenarios
const sampleRegistrationCSV = `CV No,Name,Phone,Email,Location,Interested For,Declaration,Current Company,Industry,Designation,Total Experience,Last Salary,Salary Expectation,Qualification,Allocation,Registration Date,Resource,Registration Status,Registration Amount
CV001,John Doe,+1234567890,john@example.com,New York,Senior Developer,Yes,Tech Corp,IT,Developer,5 years,90K,120K,Bachelor CS,Sheet-1,2024-01-15,LinkedIn,Yes,500
CV002,Jane Smith,+1987654321,jane@example.com,San Francisco,Product Manager,Yes,Startup Inc,Tech,Manager,7 years,110K,150K,MBA,Sheet-2,2024-01-16,Naukari,Yes,500`;

const sampleResumeShareCSV = `CV No,Name,Shortlists for Client,Resume Share Status,Remark
CV001,John Doe,TechCorp Inc,Done,Sent resume via email
CV002,Jane Smith,Startup LLC,Pending,Awaiting client response`;

const sampleShortlistCSV = `CV No,Name,Shortlist Date,Shortlists for Client,Resource,Shortlist Status
CV001,John Doe,2024-01-20,TechCorp Inc,LinkedIn,Done
CV002,Jane Smith,2024-01-21,Startup LLC,Naukari,Done`;

const sampleLineupFeedbackCSV = `CV No,Name,Shortlist Date,Client Name,Feedback 1,Scheduled Date 1,Feedback 2,Scheduled Date 2,Lineup Status
CV001,John Doe,2024-01-20,TechCorp Inc,Selected,2024-01-25,Joined,2024-02-01,Done
CV002,Jane Smith,2024-01-21,Startup LLC,Hold,2024-01-26,,, Pending`;

const sampleSelectionCSV = `CV No,Name,Client,Selection Date,Selection Status
CV001,John Doe,TechCorp Inc,2024-01-30,Selected
CV002,Jane Smith,Startup LLC,,Pending`;

const sampleClosureCSV = `CV No,Name,Joining Date,Placed In,Offered Salary,Charges,Joining Status
CV001,John Doe,2024-02-15,TechCorp Inc,125000,12500,Yes
CV002,Jane Smith,,,,,No`;

const sampleReportsCSV = `Date,Team Member,Login Time,Logout Time,Today's Lineup,Next Day Lineup,Hot Requirements,Tasks,Shortlisted,Conversion Report
2024-01-15,Deep,09:00,18:00,5,3,Senior Dev|Product Manager,Follow up calls,2,167calls // 2hrs 5min 25s`;

describe('CSV Import/Export Integration Tests', () => {
  describe('CSV Parsing', () => {
    it('should parse registration CSV correctly', () => {
      const result = parseCSV(sampleRegistrationCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('CV No');
      expect(result.data[0]).toHaveProperty('Name');
      expect(result.data[0]['Name']).toBe('John Doe');
    });

    it('should parse resume share CSV correctly', () => {
      const result = parseCSV(sampleResumeShareCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Resume Share Status']).toBe('Done');
    });

    it('should parse shortlist CSV correctly', () => {
      const result = parseCSV(sampleShortlistCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Shortlist Status']).toBe('Done');
    });

    it('should parse lineup feedback CSV correctly', () => {
      const result = parseCSV(sampleLineupFeedbackCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Feedback 1']).toBe('Selected');
      expect(result.data[0]['Feedback 2']).toBe('Joined');
    });

    it('should parse selection CSV correctly', () => {
      const result = parseCSV(sampleSelectionCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Selection Status']).toBe('Selected');
    });

    it('should parse closure CSV correctly', () => {
      const result = parseCSV(sampleClosureCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Joining Status']).toBe('Yes');
      expect(result.data[0]['Offered Salary']).toBe('125000');
    });

    it('should parse reports CSV correctly', () => {
      const result = parseCSV(sampleReportsCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]['Team Member']).toBe('Deep');
    });
  });

  describe('CSV Validation', () => {
    it('should validate registration data', () => {
      const parsed = parseCSV(sampleRegistrationCSV);
      const result = validateCSVData(parsed.data, 'registration');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidCSV = `Name,Email
John Doe,john@example.com`;
      
      const parsed = parseCSV(invalidCSV);
      const result = validateCSVData(parsed.data, 'registration');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate email format', () => {
      const invalidEmailCSV = `CV No,Name,Email
CV001,John Doe,invalid-email`;
      
      const parsed = parseCSV(invalidEmailCSV);
      const result = validateCSVData(parsed.data, 'registration');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('email'))).toBe(true);
    });

    it('should validate phone format', () => {
      const invalidPhoneCSV = `CV No,Name,Phone
CV001,John Doe,123`;
      
      const parsed = parseCSV(invalidPhoneCSV);
      const result = validateCSVData(parsed.data, 'registration');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('phone'))).toBe(true);
    });
  });

  describe('Field Mapping', () => {
    it('should map registration CSV fields to candidate model', () => {
      const parsed = parseCSV(sampleRegistrationCSV);
      const mapped = mapCSVFields(parsed.data[0], 'registration');
      
      expect(mapped).toHaveProperty('cvNo');
      expect(mapped).toHaveProperty('name');
      expect(mapped).toHaveProperty('email');
      expect(mapped).toHaveProperty('phone');
      expect(mapped.name).toBe('John Doe');
      expect(mapped.email).toBe('john@example.com');
    });

    it('should map resume share fields correctly', () => {
      const parsed = parseCSV(sampleResumeShareCSV);
      const mapped = mapCSVFields(parsed.data[0], 'resumeShare');
      
      expect(mapped).toHaveProperty('cvNo');
      expect(mapped).toHaveProperty('resumeSharing');
      expect(mapped.resumeSharing.status).toBe('Done');
    });

    it('should map closure fields with salary data', () => {
      const parsed = parseCSV(sampleClosureCSV);
      const mapped = mapCSVFields(parsed.data[0], 'closure');
      
      expect(mapped).toHaveProperty('closure');
      expect(mapped.closure.offeredSalary).toBe(125000);
      expect(mapped.closure.charges).toBe(12500);
      expect(mapped.closure.joiningStatus).toBe('Yes');
    });

    it('should handle multiple feedback entries', () => {
      const parsed = parseCSV(sampleLineupFeedbackCSV);
      const mapped = mapCSVFields(parsed.data[0], 'lineupFeedback');
      
      expect(mapped).toHaveProperty('lineupFeedback');
      expect(mapped.lineupFeedback.feedbacks).toHaveLength(2);
      expect(mapped.lineupFeedback.feedbacks[0].feedback).toBe('Selected');
      expect(mapped.lineupFeedback.feedbacks[1].feedback).toBe('Joined');
    });
  });

  describe('CSV Export', () => {
    it('should export candidates to CSV format', () => {
      const candidates = [
        {
          cvNo: 'CV001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          status: 'hired'
        },
        {
          cvNo: 'CV002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1987654321',
          status: 'interviewed'
        }
      ];
      
      const csv = exportToCSV(candidates, 'candidates');
      
      expect(csv).toContain('CV No,Name,Email,Phone,Status');
      expect(csv).toContain('CV001,John Doe');
      expect(csv).toContain('CV002,Jane Smith');
    });

    it('should export with custom field selection', () => {
      const candidates = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          internalNotes: 'Confidential'
        }
      ];
      
      const fields = ['name', 'email', 'phone'];
      const csv = exportToCSV(candidates, 'candidates', fields);
      
      expect(csv).toContain('Name,Email,Phone');
      expect(csv).not.toContain('internalNotes');
      expect(csv).not.toContain('Confidential');
    });

    it('should handle special characters in export', () => {
      const candidates = [
        {
          name: 'John "Johnny" Doe',
          notes: 'Has experience with C++, C#, and Java'
        }
      ];
      
      const csv = exportToCSV(candidates, 'candidates');
      
      expect(csv).toContain('"John ""Johnny"" Doe"');
    });
  });

  describe('Complete CSV Workflow', () => {
    it('should import registration data and create candidates', async () => {
      const parsed = parseCSV(sampleRegistrationCSV);
      const validation = validateCSVData(parsed.data, 'registration');
      
      expect(validation.isValid).toBe(true);
      
      const candidates = parsed.data.map(row => mapCSVFields(row, 'registration'));
      
      expect(candidates).toHaveLength(2);
      expect(candidates[0].name).toBe('John Doe');
      expect(candidates[1].name).toBe('Jane Smith');
    });

    it('should update candidates with resume share data', () => {
      const parsed = parseCSV(sampleResumeShareCSV);
      const updates = parsed.data.map(row => mapCSVFields(row, 'resumeShare'));
      
      expect(updates).toHaveLength(2);
      expect(updates[0].resumeSharing.status).toBe('Done');
      expect(updates[1].resumeSharing.status).toBe('Pending');
    });

    it('should track complete candidate progression through all stages', () => {
      // Registration
      const registration = parseCSV(sampleRegistrationCSV);
      const candidate = mapCSVFields(registration.data[0], 'registration');
      
      // Resume Share
      const resumeShare = parseCSV(sampleResumeShareCSV);
      const resumeUpdate = mapCSVFields(resumeShare.data[0], 'resumeShare');
      Object.assign(candidate, resumeUpdate);
      
      // Shortlist
      const shortlist = parseCSV(sampleShortlistCSV);
      const shortlistUpdate = mapCSVFields(shortlist.data[0], 'shortlist');
      Object.assign(candidate, shortlistUpdate);
      
      // Lineup Feedback
      const lineup = parseCSV(sampleLineupFeedbackCSV);
      const lineupUpdate = mapCSVFields(lineup.data[0], 'lineupFeedback');
      Object.assign(candidate, lineupUpdate);
      
      // Selection
      const selection = parseCSV(sampleSelectionCSV);
      const selectionUpdate = mapCSVFields(selection.data[0], 'selection');
      Object.assign(candidate, selectionUpdate);
      
      // Closure
      const closure = parseCSV(sampleClosureCSV);
      const closureUpdate = mapCSVFields(closure.data[0], 'closure');
      Object.assign(candidate, closureUpdate);
      
      // Verify complete candidate data
      expect(candidate.name).toBe('John Doe');
      expect(candidate.resumeSharing).toBeDefined();
      expect(candidate.shortlisting).toBeDefined();
      expect(candidate.lineupFeedback).toBeDefined();
      expect(candidate.selection).toBeDefined();
      expect(candidate.closure).toBeDefined();
      expect(candidate.closure.joiningStatus).toBe('Yes');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed CSV gracefully', () => {
      const malformedCSV = `Name,Email
John Doe,john@example.com
Jane Smith,jane@example.com,extra,columns`;
      
      const result = parseCSV(malformedCSV);
      
      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
    });

    it('should handle empty CSV', () => {
      const emptyCSV = '';
      
      const result = parseCSV(emptyCSV);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle CSV with only headers', () => {
      const headersOnlyCSV = 'Name,Email,Phone';
      
      const result = parseCSV(headersOnlyCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('should handle duplicate CV numbers', () => {
      const duplicateCSV = `CV No,Name,Email
CV001,John Doe,john@example.com
CV001,Jane Smith,jane@example.com`;
      
      const parsed = parseCSV(duplicateCSV);
      const validation = validateCSVData(parsed.data, 'registration');
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.includes('duplicate'))).toBe(true);
    });
  });

  describe('Large Dataset Handling', () => {
    it('should handle large CSV files efficiently', () => {
      // Generate large CSV
      const headers = 'CV No,Name,Email,Phone,Status';
      const rows = Array.from({ length: 1000 }, (_, i) => 
        `CV${String(i + 1).padStart(3, '0')},Candidate ${i + 1},candidate${i + 1}@example.com,+1${String(i).padStart(9, '0')},new`
      );
      const largeCSV = [headers, ...rows].join('\n');
      
      const startTime = Date.now();
      const result = parseCSV(largeCSV);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });

  describe('Special Characters and Encoding', () => {
    it('should handle UTF-8 characters', () => {
      const utf8CSV = `Name,Location
José García,São Paulo
李明,北京
Müller,München`;
      
      const result = parseCSV(utf8CSV);
      
      expect(result.success).toBe(true);
      expect(result.data[0].Name).toBe('José García');
      expect(result.data[1].Name).toBe('李明');
      expect(result.data[2].Name).toBe('Müller');
    });

    it('should handle commas in quoted fields', () => {
      const quotedCSV = `Name,Company
"Doe, John","Tech Corp, Inc."
"Smith, Jane","Startup, LLC"`;
      
      const result = parseCSV(quotedCSV);
      
      expect(result.success).toBe(true);
      expect(result.data[0].Name).toBe('Doe, John');
      expect(result.data[0].Company).toBe('Tech Corp, Inc.');
    });

    it('should handle line breaks in quoted fields', () => {
      const multilineCSV = `Name,Notes
John Doe,"First line
Second line
Third line"`;
      
      const result = parseCSV(multilineCSV);
      
      expect(result.success).toBe(true);
      expect(result.data[0].Notes).toContain('First line');
      expect(result.data[0].Notes).toContain('Second line');
    });
  });
});
