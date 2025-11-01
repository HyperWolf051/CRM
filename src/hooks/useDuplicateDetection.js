import { useState, useCallback, useEffect } from 'react';
import { CandidateAPI } from '../services/api';
import { duplicateDetectionUtils } from '../utils/duplicateDetection';
import { candidateUtils } from '../utils/candidateUtils';

export const useDuplicateDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState(null);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [error, setError] = useState(null);

  // Check for duplicates when creating a new candidate
  const checkDuplicates = useCallback(async (candidateData, existingCandidates = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If we have existing candidates, use local detection
      if (existingCandidates.length > 0) {
        const result = await duplicateDetectionUtils.detectDuplicates(candidateData, existingCandidates);
        setDuplicateResult(result);
        return result;
      }
      
      // Otherwise, use API endpoint (if available)
      try {
        const apiResult = await CandidateAPI.checkDuplicates(candidateData);
        if (apiResult.success) {
          setDuplicateResult(apiResult.data);
          return apiResult.data;
        }
      } catch (apiError) {
        console.warn('API duplicate check failed, falling back to local detection:', apiError);
      }
      
      // Fallback: get all candidates and check locally
      const candidatesResult = await CandidateAPI.getAll();
      if (candidatesResult.success) {
        const result = await duplicateDetectionUtils.detectDuplicates(candidateData, candidatesResult.data);
        setDuplicateResult(result);
        return result;
      }
      
      throw new Error('Failed to check for duplicates');
    } catch (err) {
      console.error('Error checking duplicates:', err);
      setError(err.message);
      return { hasMatches: false, matches: [], totalMatches: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Merge two candidates
  const mergeCandidates = useCallback(async (primaryCandidate, duplicateCandidate, mergeDecisions = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate merge preview
      const mergePreview = duplicateDetectionUtils.generateMergePreview(primaryCandidate, duplicateCandidate);
      
      // Apply merge decisions
      const mergedCandidate = duplicateDetectionUtils.applyMergeDecisions(mergePreview, mergeDecisions);
      
      // Add change history entry for the merge
      const mergeChangeEntry = candidateUtils.createChangeHistoryEntry(
        primaryCandidate.id,
        'system', // or current user ID
        'System',
        'merged',
        [{
          field: 'merged_from',
          fieldDisplayName: 'Merged From',
          oldValue: null,
          newValue: duplicateCandidate.id,
          changeDescription: `Merged with candidate ${duplicateCandidate.name} (${duplicateCandidate.email})`
        }],
        `Merged with duplicate candidate ${duplicateCandidate.name}`
      );
      
      mergedCandidate.changeHistory = [...mergedCandidate.changeHistory, mergeChangeEntry];
      
      // Try API merge first
      try {
        const apiResult = await CandidateAPI.merge(primaryCandidate.id, duplicateCandidate.id, mergeDecisions);
        if (apiResult.success) {
          return { success: true, data: apiResult.data };
        }
      } catch (apiError) {
        console.warn('API merge failed, handling locally:', apiError);
      }
      
      // Fallback: update primary candidate and delete duplicate
      const updateResult = await CandidateAPI.update(primaryCandidate.id, mergedCandidate);
      if (updateResult.success) {
        // Try to delete the duplicate candidate
        try {
          await CandidateAPI.delete(duplicateCandidate.id);
        } catch (deleteError) {
          console.warn('Failed to delete duplicate candidate:', deleteError);
        }
        
        return { success: true, data: mergedCandidate };
      }
      
      throw new Error('Failed to merge candidates');
    } catch (err) {
      console.error('Error merging candidates:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get duplicate groups for bulk management
  const getDuplicateGroups = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try API first
      try {
        const apiResult = await CandidateAPI.getDuplicateGroups(filters);
        if (apiResult.success) {
          setDuplicateGroups(apiResult.data);
          return apiResult.data;
        }
      } catch (apiError) {
        console.warn('API duplicate groups failed, generating locally:', apiError);
      }
      
      // Fallback: generate duplicate groups locally
      const candidatesResult = await CandidateAPI.getAll();
      if (candidatesResult.success) {
        const groups = await generateLocalDuplicateGroups(candidatesResult.data, filters);
        setDuplicateGroups(groups);
        return groups;
      }
      
      throw new Error('Failed to get duplicate groups');
    } catch (err) {
      console.error('Error getting duplicate groups:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate duplicate groups locally
  const generateLocalDuplicateGroups = async (candidates, filters) => {
    const groups = [];
    const processedCandidates = new Set();
    
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      
      if (processedCandidates.has(candidate.id)) continue;
      
      const duplicates = [];
      
      // Check against remaining candidates
      for (let j = i + 1; j < candidates.length; j++) {
        const otherCandidate = candidates[j];
        
        if (processedCandidates.has(otherCandidate.id)) continue;
        
        const result = await duplicateDetectionUtils.detectDuplicates(candidate, [otherCandidate]);
        
        if (result.hasMatches && result.matches.length > 0) {
          duplicates.push(otherCandidate);
          processedCandidates.add(otherCandidate.id);
        }
      }
      
      if (duplicates.length > 0) {
        const group = {
          id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          candidates: [candidate, ...duplicates],
          primaryCandidateId: candidate.id,
          status: 'pending',
          detectedAt: new Date(),
          resolvedAt: null,
          resolvedBy: null,
          resolution: null
        };
        
        groups.push(group);
        processedCandidates.add(candidate.id);
      }
    }
    
    return groups;
  };

  // Resolve a duplicate group
  const resolveDuplicateGroup = useCallback(async (groupId, resolution) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try API first
      try {
        const apiResult = await CandidateAPI.resolveDuplicateGroup(groupId, resolution);
        if (apiResult.success) {
          // Update local state
          setDuplicateGroups(prev => 
            prev.map(group => 
              group.id === groupId 
                ? { ...group, status: 'resolved', resolution, resolvedAt: new Date() }
                : group
            )
          );
          return { success: true };
        }
      } catch (apiError) {
        console.warn('API resolve group failed, handling locally:', apiError);
      }
      
      // Fallback: handle locally
      setDuplicateGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, status: 'resolved', resolution, resolvedAt: new Date() }
            : group
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error resolving duplicate group:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ignore a duplicate group
  const ignoreDuplicateGroup = useCallback(async (groupId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const resolution = {
        type: 'ignore',
        reason: 'Marked as not duplicates',
        resolvedBy: 'current-user', // Should be actual user ID
        resolvedByName: 'Current User', // Should be actual user name
        resolvedAt: new Date()
      };
      
      const result = await resolveDuplicateGroup(groupId, resolution);
      
      if (result.success) {
        setDuplicateGroups(prev => 
          prev.map(group => 
            group.id === groupId 
              ? { ...group, status: 'ignored', resolution, resolvedAt: new Date() }
              : group
          )
        );
      }
      
      return result;
    } catch (err) {
      console.error('Error ignoring duplicate group:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [resolveDuplicateGroup]);

  // Clear duplicate result
  const clearDuplicateResult = useCallback(() => {
    setDuplicateResult(null);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    duplicateResult,
    duplicateGroups,
    error,
    
    // Actions
    checkDuplicates,
    mergeCandidates,
    getDuplicateGroups,
    resolveDuplicateGroup,
    ignoreDuplicateGroup,
    clearDuplicateResult,
    clearError,
    
    // Utilities
    hasMatches: duplicateResult?.hasMatches || false,
    totalMatches: duplicateResult?.totalMatches || 0,
    highConfidenceMatches: duplicateResult?.highConfidenceMatches || 0,
    mediumConfidenceMatches: duplicateResult?.mediumConfidenceMatches || 0,
    lowConfidenceMatches: duplicateResult?.lowConfidenceMatches || 0
  };
};