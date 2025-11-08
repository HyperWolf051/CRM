/**
 * Candidate Service with Automatic Change Tracking
 * Wraps CandidateAPI to automatically track all changes for audit trail
 */

import { CandidateAPI } from './api';
import { auditService } from './auditService';
import { generateMockCandidate } from '../utils/mockChangeHistory';

/**
 * Enhanced Candidate Service with automatic change tracking
 */
export const CandidateServiceWithTracking = {
  /**
   * Get all candidates
   */
  getAll: async () => {
    return await CandidateAPI.getAll();
  },

  /**
   * Get candidate by ID with change history
   */
  getById: async (id, user = null) => {
    try {
      const result = await CandidateAPI.getById(id);
      
      if (result.success && result.data) {
        // Load change history from audit service
        const changeHistory = await auditService.getChangeHistory(id);
        result.data.changeHistory = changeHistory;
        
        // Log data access for compliance
        if (user) {
          await auditService.logDataAccess(id, user.id, user.name, 'view');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting candidate with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new candidate with automatic tracking
   */
  create: async (data, user) => {
    try {
      // Add creator information
      const candidateData = {
        ...data,
        createdBy: user?.id || 'unknown',
        createdByName: user?.name || 'Unknown User',
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await CandidateAPI.create(candidateData);
      
      if (result.success && result.data) {
        // Track creation
        await auditService.trackChange(
          result.data.id,
          {},
          result.data,
          user,
          'created',
          'Candidate profile created'
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error creating candidate with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Update candidate with automatic change tracking
   */
  update: async (id, updates, user, reason = '') => {
    try {
      // Get current candidate data
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;
      
      // Add modifier information
      const updatedData = {
        ...updates,
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        updatedAt: new Date().toISOString()
      };

      // Update candidate
      const result = await CandidateAPI.update(id, updatedData);
      
      if (result.success) {
        // Track the change
        await auditService.trackChange(
          id,
          oldData,
          { ...oldData, ...updatedData },
          user,
          'updated',
          reason
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error updating candidate with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Update candidate status with tracking
   */
  updateStatus: async (id, newStatus, user, reason = '') => {
    try {
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;
      const updates = {
        overallStatus: newStatus,
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        updatedAt: new Date().toISOString()
      };

      const result = await CandidateAPI.update(id, updates);
      
      if (result.success) {
        await auditService.trackChange(
          id,
          oldData,
          { ...oldData, ...updates },
          user,
          'status_changed',
          reason || `Status changed to ${newStatus}`
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error updating status with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Update candidate stage with tracking
   */
  updateStage: async (id, newStage, user, reason = '') => {
    try {
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;
      const updates = {
        currentStage: newStage,
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        updatedAt: new Date().toISOString()
      };

      const result = await CandidateAPI.update(id, updates);
      
      if (result.success) {
        await auditService.trackChange(
          id,
          oldData,
          { ...oldData, ...updates },
          user,
          'stage_changed',
          reason || `Stage changed to ${newStage}`
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error updating stage with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Add note to candidate with tracking
   */
  addNote: async (id, noteContent, user, isPrivate = false) => {
    try {
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;
      const newNote = {
        id: `note_${Date.now()}`,
        content: noteContent,
        createdBy: user?.id || 'unknown',
        createdByName: user?.name || 'Unknown User',
        createdAt: new Date().toISOString(),
        isPrivate
      };

      const updates = {
        notes: [...(oldData.notes || []), newNote],
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        updatedAt: new Date().toISOString()
      };

      const result = await CandidateAPI.update(id, updates);
      
      if (result.success) {
        await auditService.trackChange(
          id,
          oldData,
          { ...oldData, ...updates },
          user,
          'note_added',
          `Note added: ${noteContent.substring(0, 50)}${noteContent.length > 50 ? '...' : ''}`
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error adding note with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Upload document with tracking
   */
  uploadDocument: async (id, documentData, user) => {
    try {
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;
      const newDocument = {
        ...documentData,
        id: `doc_${Date.now()}`,
        uploadedBy: user?.id || 'unknown',
        uploadedByName: user?.name || 'Unknown User',
        uploadedAt: new Date().toISOString()
      };

      const updates = {
        documents: [...(oldData.documents || []), newDocument],
        lastModifiedBy: user?.id || 'unknown',
        lastModifiedByName: user?.name || 'Unknown User',
        updatedAt: new Date().toISOString()
      };

      const result = await CandidateAPI.update(id, updates);
      
      if (result.success) {
        await auditService.trackChange(
          id,
          oldData,
          { ...oldData, ...updates },
          user,
          'document_uploaded',
          `Document uploaded: ${documentData.name} (${documentData.type})`
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading document with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Schedule interview with tracking
   */
  scheduleInterview: async (id, interviewData, user) => {
    try {
      const currentResult = await CandidateAPI.getById(id);
      
      if (!currentResult.success) {
        return currentResult;
      }

      const oldData = currentResult.data;

      // Track the interview scheduling
      await auditService.trackChange(
        id,
        oldData,
        oldData,
        user,
        'interview_scheduled',
        `Interview scheduled: ${interviewData.type} on ${new Date(interviewData.scheduledDate).toLocaleDateString()}`
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error scheduling interview with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete candidate (with audit trail preservation)
   */
  delete: async (id, user, reason = '') => {
    try {
      // Get current data before deletion
      const currentResult = await CandidateAPI.getById(id);
      
      if (currentResult.success) {
        // Track deletion
        await auditService.trackChange(
          id,
          currentResult.data,
          {},
          user,
          'deleted',
          reason || 'Candidate deleted'
        );
      }

      return await CandidateAPI.delete(id);
    } catch (error) {
      console.error('Error deleting candidate with tracking:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Get change history for a candidate
   */
  getChangeHistory: async (id, filters = {}) => {
    return await auditService.getChangeHistory(id, filters);
  },

  /**
   * Export change history
   */
  exportChangeHistory: async (id, format = 'json') => {
    return await auditService.exportChangeHistory(id, format);
  },

  /**
   * Generate audit report
   */
  generateAuditReport: async (id, startDate, endDate) => {
    return await auditService.generateAuditReport(id, startDate, endDate);
  },

  /**
   * Get mock candidate with change history (for demo/testing)
   */
  getMockCandidate: (id = 'candidate-1') => {
    return {
      success: true,
      data: generateMockCandidate(id)
    };
  }
};

export default CandidateServiceWithTracking;
