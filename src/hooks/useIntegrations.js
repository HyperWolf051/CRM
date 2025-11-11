import { useState, useEffect, useCallback } from 'react';
import {
  integrationMarketplace,
  webhookService,
  customFieldsService,
  hrToolsIntegration,
  jobBoardIntegration,
  importExportService,
  restApiService
} from '../services/integrationService';

/**
 * Hook for managing integrations
 */
export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load integrations
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = useCallback(() => {
    try {
      const allIntegrations = integrationMarketplace.getAll();
      setIntegrations(allIntegrations);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const connectIntegration = useCallback(async (integrationId, credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedIntegrations(prev => new Set([...prev, integrationId]));
      return { success: true, message: 'Integration connected successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectIntegration = useCallback((integrationId) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.delete(integrationId);
      return newSet;
    });
  }, []);

  const getIntegrationsByCategory = useCallback((category) => {
    return integrationMarketplace.getByCategory(category);
  }, []);

  return {
    integrations,
    connectedIntegrations,
    loading,
    error,
    connectIntegration,
    disconnectIntegration,
    getIntegrationsByCategory,
    refreshIntegrations: loadIntegrations
  };
};

/**
 * Hook for managing webhooks
 */
export const useWebhooks = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = useCallback(() => {
    try {
      const allWebhooks = webhookService.list();
      setWebhooks(allWebhooks);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const createWebhook = useCallback((event, url, secret) => {
    setLoading(true);
    setError(null);
    
    try {
      const id = webhookService.register(event, url, secret);
      loadWebhooks();
      return { success: true, id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadWebhooks]);

  const deleteWebhook = useCallback((id) => {
    try {
      webhookService.delete(id);
      loadWebhooks();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [loadWebhooks]);

  const triggerWebhook = useCallback(async (event, payload) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await webhookService.trigger(event, payload);
      return { success: true, results };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    webhooks,
    loading,
    error,
    createWebhook,
    deleteWebhook,
    triggerWebhook,
    refreshWebhooks: loadWebhooks
  };
};

/**
 * Hook for managing custom fields
 */
export const useCustomFields = (entityType = null) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFields();
  }, [entityType]);

  const loadFields = useCallback(() => {
    try {
      const allFields = customFieldsService.getAll(entityType);
      setFields(allFields);
    } catch (err) {
      setError(err.message);
    }
  }, [entityType]);

  const createField = useCallback((fieldConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      const field = customFieldsService.create(fieldConfig);
      loadFields();
      return { success: true, field };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadFields]);

  const updateField = useCallback((id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const field = customFieldsService.update(id, updates);
      loadFields();
      return { success: true, field };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadFields]);

  const deleteField = useCallback((id) => {
    try {
      customFieldsService.delete(id);
      loadFields();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [loadFields]);

  return {
    fields,
    loading,
    error,
    createField,
    updateField,
    deleteField,
    refreshFields: loadFields
  };
};

/**
 * Hook for import/export operations
 */
export const useImportExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const exportData = useCallback(async (entityType, format = 'csv', filters = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await importExportService.export(entityType, format, filters);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Trigger download
      const blob = new Blob([result.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const importData = useCallback(async (entityType, data, format = 'csv') => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await importExportService.import(entityType, data, format);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  return {
    loading,
    error,
    progress,
    exportData,
    importData
  };
};

/**
 * Hook for HR tools integration
 */
export const useHRToolsIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWorkday = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await hrToolsIntegration.workday.connect(credentials);
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const connectBambooHR = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await hrToolsIntegration.bamboohr.connect(credentials);
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const syncCandidates = useCallback(async (tool) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (tool === 'workday') {
        result = await hrToolsIntegration.workday.syncCandidates();
      } else if (tool === 'bamboohr') {
        result = await hrToolsIntegration.bamboohr.syncEmployees();
      }
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connectWorkday,
    connectBambooHR,
    syncCandidates
  };
};

/**
 * Hook for job board integration
 */
export const useJobBoardIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postJob = useCallback(async (board, jobData) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (board === 'indeed') {
        result = await jobBoardIntegration.indeed.postJob(jobData);
      } else if (board === 'linkedin') {
        result = await jobBoardIntegration.linkedin.postJob(jobData);
      } else if (board === 'glassdoor') {
        result = await jobBoardIntegration.glassdoor.postJob(jobData);
      }
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const importCandidates = useCallback(async (board, jobId) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (board === 'indeed') {
        result = await jobBoardIntegration.indeed.importCandidates(jobId);
      }
      return { success: true, result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    postJob,
    importCandidates
  };
};

export default {
  useIntegrations,
  useWebhooks,
  useCustomFields,
  useImportExport,
  useHRToolsIntegration,
  useJobBoardIntegration
};
