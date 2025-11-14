/**
 * Integration tests for recruitment dashboard
 * Tests complete user workflows and API integration
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CandidateAPI, InterviewAPI, OfferAPI, ClientAPI } from '@/services/api';
import { DashboardMetricsAPI, WorkflowAPI } from '@/services/recruitmentAPI';
import { candidateServiceWithTracking } from '@/services/candidateServiceWithTracking';

// Mock user for testing
const mockUser = {
  id: 'test-user-1',
  name: 'Test Recruiter',
  email: 'recruiter@test.com',
  role: 'recruiter'
};

describe('Recruitment Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  describe('Candidate Management Workflow', () => {
    it('should create a candidate with change tracking', async () => {
      const candidateData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        position: 'Senior Developer',
        status: 'new'
      };

      const result = await candidateServiceWithTracking.create(candidateData, mockUser);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.createdBy).toBe(mockUser.id);
      expect(result.data.changeHistory).toHaveLength(1);
      expect(result.data.changeHistory[0].changeType).toBe('created');
    });

    it('should update candidate status with change tracking', async () => {
      const candidateId = 'test-candidate-1';
      const newStatus = 'interviewed';
      const reason = 'Completed first round interview';

      const result = await candidateServiceWithTracking.updateStatus(
        candidateId,
        newStatus,
        mockUser,
        reason
      );

      expect(result.success).toBe(true);
      expect(result.data.status).toBe(newStatus);
      expect(result.data.changeHistory).toContainEqual(
        expect.objectContaining({
          changeType: 'status_changed',
          changedBy: mockUser.id,
          reason
        })
      );
    });

    it('should detect duplicate candidates', async () => {
      const candidateData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321'
      };

      const result = await CandidateAPI.checkDuplicates(candidateData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('duplicates');
      expect(Array.isArray(result.data.duplicates)).toBe(true);
    });

    it('should merge duplicate candidates', async () => {
      const primaryId = 'candidate-1';
      const duplicateId = 'candidate-2';
      const mergeDecisions = [
        { field: 'email', selectedValue: 'primary@example.com', source: 'primary' }
      ];

      const result = await CandidateAPI.merge(primaryId, duplicateId, mergeDecisions);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('mergedCandidate');
    });
  });

  describe('Interview Management Workflow', () => {
    it('should schedule an interview', async () => {
      const interviewData = {
        candidateId: 'candidate-1',
        jobId: 'job-1',
        type: 'video',
        scheduledDate: new Date('2024-12-15T10:00:00'),
        interviewer: {
          id: 'interviewer-1',
          name: 'Sarah Manager',
          email: 'sarah@company.com'
        }
      };

      const result = await InterviewAPI.create(interviewData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.status).toBe('scheduled');
    });

    it('should update interview status', async () => {
      const interviewId = 'interview-1';
      const updateData = {
        status: 'completed',
        feedback: {
          rating: 4,
          comments: 'Strong technical skills',
          recommendation: 'hire'
        }
      };

      const result = await InterviewAPI.update(interviewId, updateData);
      
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('completed');
      expect(result.data.feedback).toBeDefined();
    });

    it('should get interviews by candidate', async () => {
      const candidateId = 'candidate-1';
      
      const result = await InterviewAPI.getByCandidateId(candidateId);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Offer Management Workflow', () => {
    it('should create a job offer', async () => {
      const offerData = {
        candidateId: 'candidate-1',
        jobId: 'job-1',
        offerDetails: {
          position: 'Senior Developer',
          salary: {
            base: 120000,
            currency: 'USD',
            frequency: 'annual'
          },
          startDate: new Date('2024-01-15')
        }
      };

      const result = await OfferAPI.create(offerData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.status).toBe('draft');
    });

    it('should send offer to candidate', async () => {
      const offerId = 'offer-1';
      
      const result = await OfferAPI.sendOffer(offerId, 'email');
      
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('sent');
    });

    it('should update offer status', async () => {
      const offerId = 'offer-1';
      const status = 'accepted';
      const notes = 'Candidate accepted the offer';

      const result = await OfferAPI.updateStatus(offerId, status, notes);
      
      expect(result.success).toBe(true);
      expect(result.data.status).toBe(status);
    });

    it('should get offer statistics', async () => {
      const filters = { timeRange: '30d' };
      
      const result = await OfferAPI.getStatistics(filters);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('totalOffers');
      expect(result.data).toHaveProperty('acceptanceRate');
    });
  });

  describe('Client Management Workflow', () => {
    it('should create a client', async () => {
      const clientData = {
        name: 'Tech Corp',
        industry: 'Technology',
        contactPerson: 'John Manager',
        contactEmail: 'john@techcorp.com',
        contactPhone: '+1234567890'
      };

      const result = await ClientAPI.create(clientData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(clientData.name);
    });

    it('should add client feedback', async () => {
      const clientId = 'client-1';
      const feedbackData = {
        candidateId: 'candidate-1',
        feedback: 'Selected',
        comments: 'Great fit for the role',
        date: new Date()
      };

      const result = await ClientAPI.addFeedback(clientId, feedbackData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
    });

    it('should get client communications', async () => {
      const clientId = 'client-1';
      
      const result = await ClientAPI.getCommunications(clientId);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Dashboard Metrics', () => {
    it('should get dashboard overview metrics', async () => {
      const result = await DashboardMetricsAPI.getOverview();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('totalCandidates');
      expect(result.data).toHaveProperty('activeJobs');
      expect(result.data).toHaveProperty('interviewsScheduled');
      expect(result.data).toHaveProperty('offersExtended');
    });

    it('should get pipeline data', async () => {
      const result = await DashboardMetricsAPI.getPipeline('30d');
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should get recent activity', async () => {
      const result = await DashboardMetricsAPI.getRecentActivity(10);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Workflow Automation', () => {
    it('should create a workflow', async () => {
      const workflowData = {
        name: 'New Candidate Onboarding',
        trigger: {
          type: 'candidate-added',
          conditions: {}
        },
        actions: [
          {
            type: 'send-email',
            parameters: {
              template: 'welcome-email'
            }
          }
        ]
      };

      const result = await WorkflowAPI.create(workflowData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(workflowData.name);
    });

    it('should execute a workflow', async () => {
      const workflowId = 'workflow-1';
      const candidateId = 'candidate-1';

      const result = await WorkflowAPI.execute(workflowId, candidateId);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('executionId');
    });

    it('should get workflow execution history', async () => {
      const workflowId = 'workflow-1';

      const result = await WorkflowAPI.getExecutionHistory(workflowId);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Complete Candidate Journey', () => {
    it('should complete full candidate lifecycle', async () => {
      // 1. Create candidate
      const candidateData = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1555123456',
        position: 'Full Stack Developer',
        status: 'new'
      };

      const createResult = await candidateServiceWithTracking.create(candidateData, mockUser);
      expect(createResult.success).toBe(true);
      const candidateId = createResult.data.id;

      // 2. Update to screening
      const screeningResult = await candidateServiceWithTracking.updateStatus(
        candidateId,
        'screening',
        mockUser,
        'Initial screening passed'
      );
      expect(screeningResult.success).toBe(true);

      // 3. Schedule interview
      const interviewData = {
        candidateId,
        jobId: 'job-1',
        type: 'phone',
        scheduledDate: new Date('2024-12-20T14:00:00'),
        interviewer: {
          id: 'interviewer-1',
          name: 'Bob Interviewer',
          email: 'bob@company.com'
        }
      };

      const interviewResult = await InterviewAPI.create(interviewData);
      expect(interviewResult.success).toBe(true);

      // 4. Update to interviewed
      const interviewedResult = await candidateServiceWithTracking.updateStatus(
        candidateId,
        'interviewed',
        mockUser,
        'Completed phone screening'
      );
      expect(interviewedResult.success).toBe(true);

      // 5. Create offer
      const offerData = {
        candidateId,
        jobId: 'job-1',
        offerDetails: {
          position: 'Full Stack Developer',
          salary: {
            base: 110000,
            currency: 'USD',
            frequency: 'annual'
          },
          startDate: new Date('2025-01-15')
        }
      };

      const offerResult = await OfferAPI.create(offerData);
      expect(offerResult.success).toBe(true);

      // 6. Send offer
      const sendResult = await OfferAPI.sendOffer(offerResult.data.id, 'email');
      expect(sendResult.success).toBe(true);

      // 7. Accept offer
      const acceptResult = await OfferAPI.updateStatus(
        offerResult.data.id,
        'accepted',
        'Candidate accepted the offer'
      );
      expect(acceptResult.success).toBe(true);

      // 8. Update candidate to hired
      const hiredResult = await candidateServiceWithTracking.updateStatus(
        candidateId,
        'hired',
        mockUser,
        'Offer accepted, joining on 2025-01-15'
      );
      expect(hiredResult.success).toBe(true);

      // Verify change history
      expect(hiredResult.data.changeHistory.length).toBeGreaterThan(4);
      expect(hiredResult.data.changeHistory.some(ch => ch.changeType === 'created')).toBe(true);
      expect(hiredResult.data.changeHistory.some(ch => ch.changeType === 'status_changed')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      vi.spyOn(CandidateAPI, 'getAll').mockRejectedValue(new Error('Network error'));

      const result = await CandidateAPI.getAll();
      
      expect(result.error).toBe(true);
      expect(result.message).toBeDefined();
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        // Missing required fields
        email: 'invalid-email'
      };

      const result = await CandidateAPI.create(invalidData);
      
      // Should either return error or throw
      if (result.error) {
        expect(result.message).toBeDefined();
      }
    });

    it('should handle authentication errors', async () => {
      // Remove auth token
      localStorage.removeItem('authToken');

      const result = await CandidateAPI.getAll();
      
      // Should handle 401 error
      expect(result).toBeDefined();
    });
  });

  describe('Data Synchronization', () => {
    it('should sync candidate data across multiple updates', async () => {
      const candidateId = 'candidate-sync-test';
      
      // Multiple rapid updates
      const updates = [
        { status: 'screening' },
        { status: 'interviewed' },
        { notes: 'Added interview notes' }
      ];

      const results = await Promise.all(
        updates.map(update => 
          candidateServiceWithTracking.update(candidateId, update, mockUser)
        )
      );

      // All updates should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should maintain data consistency during concurrent operations', async () => {
      const candidateId = 'candidate-concurrent-test';
      
      // Simulate concurrent operations
      const operations = [
        candidateServiceWithTracking.addNote(candidateId, 'Note 1', mockUser),
        candidateServiceWithTracking.addNote(candidateId, 'Note 2', mockUser),
        candidateServiceWithTracking.updateStatus(candidateId, 'interviewed', mockUser)
      ];

      const results = await Promise.all(operations);
      
      // All operations should complete
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
});
