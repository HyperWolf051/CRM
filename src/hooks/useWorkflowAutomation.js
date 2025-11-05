import { useState, useEffect, useCallback } from 'react';
import { workflowAutomationService } from '@/services/workflowAutomationService';

export const useWorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [leadScores, setLeadScores] = useState(new Map());
  const [territories, setTerritories] = useState([]);
  const [scoringRules, setScoringRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all workflows
  const loadWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workflowAutomationService.getAllWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create workflow
  const createWorkflow = useCallback(async (workflowData) => {
    try {
      setLoading(true);
      const workflow = await workflowAutomationService.createWorkflow(workflowData);
      setWorkflows(prev => [...prev, workflow]);
      return workflow;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update workflow
  const updateWorkflow = useCallback(async (workflowId, updates) => {
    try {
      setLoading(true);
      const workflow = await workflowAutomationService.updateWorkflow(workflowId, updates);
      setWorkflows(prev => prev.map(w => w.id === workflowId ? workflow : w));
      return workflow;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete workflow
  const deleteWorkflow = useCallback(async (workflowId) => {
    try {
      setLoading(true);
      await workflowAutomationService.deleteWorkflow(workflowId);
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Execute workflow
  const executeWorkflow = useCallback(async (workflowId, candidateId, context = {}) => {
    try {
      const execution = await workflowAutomationService.executeWorkflow(workflowId, candidateId, context);
      setExecutions(prev => [...prev, execution]);
      return execution;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Calculate lead score
  const calculateLeadScore = useCallback(async (candidateId, candidateData) => {
    try {
      const score = await workflowAutomationService.calculateLeadScore(candidateId, candidateData);
      setLeadScores(prev => new Map(prev.set(candidateId, score)));
      return score;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Load scoring rules
  const loadScoringRules = useCallback(async () => {
    try {
      const rules = await workflowAutomationService.getAllScoringRules();
      setScoringRules(rules);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Create scoring rule
  const createScoringRule = useCallback(async (ruleData) => {
    try {
      const rule = await workflowAutomationService.createScoringRule(ruleData);
      setScoringRules(prev => [...prev, rule]);
      return rule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update scoring rule
  const updateScoringRule = useCallback(async (ruleId, updates) => {
    try {
      const rule = await workflowAutomationService.updateScoringRule(ruleId, updates);
      setScoringRules(prev => prev.map(r => r.id === ruleId ? rule : r));
      return rule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete scoring rule
  const deleteScoringRule = useCallback(async (ruleId) => {
    try {
      await workflowAutomationService.deleteScoringRule(ruleId);
      setScoringRules(prev => prev.filter(r => r.id !== ruleId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create territory
  const createTerritory = useCallback(async (territoryData) => {
    try {
      const territory = await workflowAutomationService.createTerritory(territoryData);
      setTerritories(prev => [...prev, territory]);
      return territory;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Assign territory
  const assignTerritory = useCallback(async (candidateId, candidateData) => {
    try {
      const territoryId = await workflowAutomationService.assignTerritory(candidateId, candidateData);
      return territoryId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get workflow analytics
  const getWorkflowAnalytics = useCallback(async (workflowId) => {
    try {
      const analytics = await workflowAutomationService.getWorkflowAnalytics(workflowId);
      return analytics;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Auto-execute workflows for candidate
  const autoExecuteWorkflows = useCallback(async (candidateId, candidateData, triggerType = 'candidate-added') => {
    try {
      const activeWorkflows = workflows.filter(w => 
        w.isActive && w.trigger?.type === triggerType
      );

      const executions = [];
      for (const workflow of activeWorkflows) {
        try {
          const execution = await executeWorkflow(workflow.id, candidateId, candidateData);
          executions.push(execution);
        } catch (err) {
          console.error(`Failed to execute workflow ${workflow.id}:`, err);
        }
      }

      return executions;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [workflows, executeWorkflow]);

  // Bulk calculate scores
  const bulkCalculateScores = useCallback(async (candidates) => {
    try {
      const scores = new Map();
      for (const candidate of candidates) {
        try {
          const score = await calculateLeadScore(candidate.id, candidate);
          scores.set(candidate.id, score);
        } catch (err) {
          console.error(`Failed to calculate score for candidate ${candidate.id}:`, err);
        }
      }
      return scores;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [calculateLeadScore]);

  // Get candidate lead score
  const getCandidateScore = useCallback((candidateId) => {
    return leadScores.get(candidateId);
  }, [leadScores]);

  // Get active workflows
  const getActiveWorkflows = useCallback(() => {
    return workflows.filter(w => w.isActive);
  }, [workflows]);

  // Get workflows by trigger type
  const getWorkflowsByTrigger = useCallback((triggerType) => {
    return workflows.filter(w => w.trigger?.type === triggerType);
  }, [workflows]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    loadWorkflows();
    loadScoringRules();
  }, [loadWorkflows, loadScoringRules]);

  return {
    // State
    workflows,
    executions,
    leadScores,
    territories,
    scoringRules,
    loading,
    error,

    // Workflow operations
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    autoExecuteWorkflows,
    getActiveWorkflows,
    getWorkflowsByTrigger,

    // Lead scoring operations
    calculateLeadScore,
    bulkCalculateScores,
    getCandidateScore,
    loadScoringRules,
    createScoringRule,
    updateScoringRule,
    deleteScoringRule,

    // Territory operations
    createTerritory,
    assignTerritory,

    // Analytics
    getWorkflowAnalytics,

    // Utility
    clearError
  };
};

export default useWorkflowAutomation;