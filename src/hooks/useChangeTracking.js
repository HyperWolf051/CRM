/**
 * useChangeTracking Hook
 * Automatically tracks changes to candidate data and logs them to audit trail
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { auditService } from '../services/auditService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for automatic change tracking
 * @param {Object} data - Current data object to track
 * @param {string} candidateId - ID of the candidate
 * @param {Object} options - Configuration options
 * @returns {Object} Tracking utilities
 */
export const useChangeTracking = (data, candidateId, options = {}) => {
  const { user } = useAuth();
  const previousDataRef = useRef(data);
  const isInitialMount = useRef(true);
  
  const {
    enabled = true,
    autoTrack = true,
    changeType = 'updated',
    onChangeTracked = null
  } = options;

  /**
   * Manually track a change
   */
  const trackChange = useCallback(async (newData, customChangeType, reason = '') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      const entry = await auditService.trackChange(
        candidateId,
        previousDataRef.current,
        newData,
        user,
        customChangeType || changeType,
        reason
      );

      if (entry && onChangeTracked) {
        onChangeTracked(entry);
      }

      previousDataRef.current = newData;
      return entry;
    } catch (error) {
      console.error('Error tracking change:', error);
      return null;
    }
  }, [enabled, user, candidateId, changeType, onChangeTracked]);

  /**
   * Track a specific field change
   */
  const trackFieldChange = useCallback(async (fieldName, oldValue, newValue, reason = '') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      const oldData = { ...previousDataRef.current, [fieldName]: oldValue };
      const newData = { ...previousDataRef.current, [fieldName]: newValue };

      const entry = await auditService.trackChange(
        candidateId,
        oldData,
        newData,
        user,
        'updated',
        reason
      );

      if (entry && onChangeTracked) {
        onChangeTracked(entry);
      }

      previousDataRef.current = newData;
      return entry;
    } catch (error) {
      console.error('Error tracking field change:', error);
      return null;
    }
  }, [enabled, user, candidateId, onChangeTracked]);

  /**
   * Track a status change
   */
  const trackStatusChange = useCallback(async (oldStatus, newStatus, reason = '') => {
    return trackFieldChange('overallStatus', oldStatus, newStatus, reason);
  }, [trackFieldChange]);

  /**
   * Track a stage change
   */
  const trackStageChange = useCallback(async (oldStage, newStage, reason = '') => {
    return trackFieldChange('currentStage', oldStage, newStage, reason);
  }, [trackFieldChange]);

  /**
   * Track a note addition
   */
  const trackNoteAdded = useCallback(async (noteContent, reason = '') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      const entry = await auditService.trackChange(
        candidateId,
        previousDataRef.current,
        previousDataRef.current,
        user,
        'note_added',
        reason || `Note added: ${noteContent.substring(0, 50)}...`
      );

      if (entry && onChangeTracked) {
        onChangeTracked(entry);
      }

      return entry;
    } catch (error) {
      console.error('Error tracking note addition:', error);
      return null;
    }
  }, [enabled, user, candidateId, onChangeTracked]);

  /**
   * Track a document upload
   */
  const trackDocumentUpload = useCallback(async (documentName, documentType, reason = '') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      const entry = await auditService.trackChange(
        candidateId,
        previousDataRef.current,
        previousDataRef.current,
        user,
        'document_uploaded',
        reason || `Document uploaded: ${documentName} (${documentType})`
      );

      if (entry && onChangeTracked) {
        onChangeTracked(entry);
      }

      return entry;
    } catch (error) {
      console.error('Error tracking document upload:', error);
      return null;
    }
  }, [enabled, user, candidateId, onChangeTracked]);

  /**
   * Track an interview scheduling
   */
  const trackInterviewScheduled = useCallback(async (interviewDetails, reason = '') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      const entry = await auditService.trackChange(
        candidateId,
        previousDataRef.current,
        previousDataRef.current,
        user,
        'interview_scheduled',
        reason || `Interview scheduled: ${interviewDetails.type} on ${interviewDetails.date}`
      );

      if (entry && onChangeTracked) {
        onChangeTracked(entry);
      }

      return entry;
    } catch (error) {
      console.error('Error tracking interview scheduling:', error);
      return null;
    }
  }, [enabled, user, candidateId, onChangeTracked]);

  /**
   * Log data access for compliance
   */
  const logDataAccess = useCallback(async (accessType = 'view') => {
    if (!enabled || !user || !candidateId) {
      return null;
    }

    try {
      await auditService.logDataAccess(
        candidateId,
        user.id,
        user.name,
        accessType
      );
    } catch (error) {
      console.error('Error logging data access:', error);
    }
  }, [enabled, user, candidateId]);

  // Auto-track changes when data changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if auto-tracking is disabled
    if (!autoTrack || !enabled) {
      return;
    }

    // Check if data has actually changed
    if (JSON.stringify(previousDataRef.current) === JSON.stringify(data)) {
      return;
    }

    // Track the change
    trackChange(data);
  }, [data, autoTrack, enabled, trackChange]);

  // Log data access on mount (for compliance)
  useEffect(() => {
    if (enabled && user && candidateId) {
      logDataAccess('view');
    }
  }, [enabled, user, candidateId, logDataAccess]);

  return {
    trackChange,
    trackFieldChange,
    trackStatusChange,
    trackStageChange,
    trackNoteAdded,
    trackDocumentUpload,
    trackInterviewScheduled,
    logDataAccess
  };
};

/**
 * Hook for retrieving change history
 */
export const useChangeHistory = (candidateId, filters = {}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!candidateId) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await auditService.getChangeHistory(candidateId, filters);
        setHistory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching change history:', err);
        setError(err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [candidateId, JSON.stringify(filters)]);

  const refresh = useCallback(async () => {
    if (!candidateId) return;

    try {
      setLoading(true);
      const data = await auditService.getChangeHistory(candidateId, filters);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing change history:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [candidateId, filters]);

  return {
    history,
    loading,
    error,
    refresh
  };
};

export default useChangeTracking;
