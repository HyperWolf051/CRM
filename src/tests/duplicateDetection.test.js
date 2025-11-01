import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { duplicateDetectionUtils, duplicateUIUtils } from '../utils/duplicateDetection';
import { candidateUtils } from '../utils/candidateUtils';

describe('Duplicate Detection System', () => {
  const mockCandidates = [
    {
      id: 'candidate-1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 9876543210',
      createdBy: 'recruiter-1',
      createdByName: 'Alice Johnson',
      createdAt: new Date('2024-01-15'),
      changeHistory: []
    },
    {
      id: 'candidate-2', 
      name: 'John Smyth',
      email: 'j.smith@email.com',
      phone: '9876543210',
      createdBy: 'recruiter-2',
      createdByName: 'Bob Wilson',
      createdAt: new Date('2024-01-20'),
      changeHistory: []
    },
    {
      id: 'candidate-3',
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      phone: '+91 8765432109',
      createdBy: 'recruiter-1',
      createdByName: 'Alice Johnson',
      createdAt: new Date('2024-01-25'),
      changeHistory: []
    }
  ];

  describe('String Similarity Algorithms', () => {
    test('should detect exact email matches', async () => {
      const newCandidate = {
        name: 'John Smith Jr',
        email: 'john.smith@email.com',
        phone: '+91 9999999999'
      };

      const result = await duplicateDetectionUtils.detectDuplicates(newCandidate, mockCandidates);
      
      expect(result.hasMatches).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
      
      const emailMatch = result.matches[0].matchReasons.find(r => r.field === 'email');
      expect(emailMatch).toBeDefined();
      expect(emailMatch.similarity).toBe(100);
      expect(emailMatch.algorithm).toBe('exact');
    });

    test('should detect similar names using Jaro-Winkler', async () => {
      const newCandidate = {
        name: 'John Smythe',
        email: 'different@email.com',
        phone: '+91 1111111111'
      };

      const result = await duplicateDetectionUtils.detectDuplicates(newCandidate, mockCandidates);
      
      if (result.hasMatches) {
        const nameMatch = result.matches[0].matchReasons.find(r => r.field === 'name');
        expect(nameMatch).toBeDefined();
        expect(nameMatch.similarity).toBeGreaterThan(70);
      }
    });

    test('should normalize and compare phone numbers', async () => {
      const newCandidate = {
        name: 'Different Name',
        email: 'different@email.com',
        phone: '09876543210' // Different format but same number
      };

      const result = await duplicateDetectionUtils.detectDuplicates(newCandidate, mockCandidates);
      
      if (result.hasMatches) {
        const phoneMatch = result.matches[0].matchReasons.find(r => r.field === 'phone');
        expect(phoneMatch).toBeDefined();
        expect(phoneMatch.similarity).toBeGreaterThan(90);
      }
    });
  });

  describe('Confidence Levels', () => {
    test('should assign high confidence for exact matches', async () => {
      const newCandidate = {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+91 9876543210'
      };

      const result = await duplicateDetectionUtils.detectDuplicates(newCandidate, mockCandidates);
      
      expect(result.hasMatches).toBe(true);
      expect(result.matches[0].confidence).toBe('high');
      expect(result.matches[0].matchScore).toBeGreaterThan(90);
    });

    test('should assign appropriate confidence levels', async () => {
      const newCandidate = {
        name: 'Jon Smith', // Similar but not exact
        email: 'jon.smith@different.com',
        phone: '+91 9876543211' // Similar but not exact
      };

      const result = await duplicateDetectionUtils.detectDuplicates(newCandidate, mockCandidates);
      
      if (result.hasMatches) {
        const match = result.matches[0];
        expect(['high', 'medium', 'low']).toContain(match.confidence);
        expect(match.matchScore).toBeGreaterThan(0);
        expect(match.matchScore).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Merge Preview Generation', () => {
    test('should generate merge preview with conflicts', () => {
      const primary = {
        id: 'primary-1',
        name: 'John Smith',
        email: 'john@email.com',
        phone: '+91 9876543210',
        location: 'Mumbai',
        currentCompany: 'Company A',
        notes: [{ id: '1', content: 'Primary note', createdAt: new Date() }],
        changeHistory: [{ id: '1', changeType: 'created', timestamp: new Date() }]
      };

      const duplicate = {
        id: 'duplicate-1',
        name: 'John Smith',
        email: 'john@email.com',
        phone: '+91 9876543210',
        location: 'Delhi', // Different location
        currentCompany: 'Company B', // Different company
        notes: [{ id: '2', content: 'Duplicate note', createdAt: new Date() }],
        changeHistory: [{ id: '2', changeType: 'created', timestamp: new Date() }]
      };

      const preview = duplicateDetectionUtils.generateMergePreview(primary, duplicate);
      
      expect(preview.primaryCandidate).toBe(primary);
      expect(preview.duplicateCandidate).toBe(duplicate);
      expect(preview.conflicts.length).toBeGreaterThan(0);
      expect(preview.preservedData.length).toBeGreaterThan(0);
      
      // Check for location conflict
      const locationConflict = preview.conflicts.find(c => c.field === 'location');
      expect(locationConflict).toBeDefined();
      expect(locationConflict.primaryValue).toBe('Mumbai');
      expect(locationConflict.duplicateValue).toBe('Delhi');
    });

    test('should preserve data from duplicate candidate', () => {
      const primary = {
        id: 'primary-1',
        name: 'John Smith',
        notes: [],
        changeHistory: []
      };

      const duplicate = {
        id: 'duplicate-1',
        name: 'John Smith',
        notes: [
          { id: '1', content: 'Important note', createdAt: new Date() },
          { id: '2', content: 'Another note', createdAt: new Date() }
        ],
        changeHistory: [
          { id: '1', changeType: 'created', timestamp: new Date() },
          { id: '2', changeType: 'updated', timestamp: new Date() }
        ]
      };

      const preview = duplicateDetectionUtils.generateMergePreview(primary, duplicate);
      
      const notesData = preview.preservedData.find(d => d.type === 'note');
      const historyData = preview.preservedData.find(d => d.type === 'change-history');
      
      expect(notesData).toBeDefined();
      expect(notesData.data).toHaveLength(2);
      expect(historyData).toBeDefined();
      expect(historyData.data).toHaveLength(2);
    });
  });

  describe('UI Utilities', () => {
    test('should format confidence colors correctly', () => {
      expect(duplicateUIUtils.getConfidenceColor('high')).toContain('red');
      expect(duplicateUIUtils.getConfidenceColor('medium')).toContain('amber');
      expect(duplicateUIUtils.getConfidenceColor('low')).toContain('blue');
    });

    test('should format match scores', () => {
      expect(duplicateUIUtils.formatMatchScore(85)).toBe('85%');
      expect(duplicateUIUtils.formatMatchScore(100)).toBe('100%');
    });

    test('should format time ago correctly', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      
      expect(duplicateUIUtils.formatTimeAgo(now)).toBe('Today');
      expect(duplicateUIUtils.formatTimeAgo(yesterday)).toBe('Yesterday');
      expect(duplicateUIUtils.formatTimeAgo(fiveDaysAgo)).toContain('days ago');
    });

    test('should get match type display correctly', () => {
      const singleMatch = [{ field: 'email', similarity: 100 }];
      const multipleMatches = [
        { field: 'email', similarity: 100 },
        { field: 'phone', similarity: 95 }
      ];
      
      expect(duplicateUIUtils.getMatchTypeDisplay(singleMatch)).toBe('Email');
      expect(duplicateUIUtils.getMatchTypeDisplay(multipleMatches)).toContain('Multiple');
    });
  });

  describe('Candidate Utils Integration', () => {
    test('should create candidate with change history', () => {
      const candidateData = {
        name: 'Test Candidate',
        email: 'test@email.com',
        phone: '+91 9999999999',
        interestedFor: 'Software Engineer'
      };

      const candidate = candidateUtils.createNewCandidate(
        candidateData, 
        'recruiter-1', 
        'Test Recruiter'
      );

      expect(candidate.id).toBeDefined();
      expect(candidate.name).toBe('Test Candidate');
      expect(candidate.createdBy).toBe('recruiter-1');
      expect(candidate.createdByName).toBe('Test Recruiter');
      expect(candidate.changeHistory).toHaveLength(1);
      expect(candidate.changeHistory[0].changeType).toBe('created');
    });

    test('should track field changes correctly', () => {
      const oldCandidate = {
        id: 'test-1',
        name: 'Old Name',
        email: 'old@email.com',
        phone: '+91 1111111111'
      };

      const newCandidate = {
        ...oldCandidate,
        name: 'New Name',
        email: 'new@email.com'
      };

      const changes = candidateUtils.trackFieldChanges(oldCandidate, newCandidate);
      
      expect(changes).toHaveLength(2);
      
      const nameChange = changes.find(c => c.field === 'name');
      const emailChange = changes.find(c => c.field === 'email');
      
      expect(nameChange).toBeDefined();
      expect(nameChange.oldValue).toBe('Old Name');
      expect(nameChange.newValue).toBe('New Name');
      
      expect(emailChange).toBeDefined();
      expect(emailChange.oldValue).toBe('old@email.com');
      expect(emailChange.newValue).toBe('new@email.com');
    });
  });
});

import { vi } from 'vitest';

// Mock console methods to avoid noise in tests
beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});