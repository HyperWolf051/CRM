/**
 * Recruitment-specific API endpoints
 * Extends the base API with recruitment dashboard functionality
 */
import api from './api';

// Utility function to extract data from different response formats
const extractResponseData = (response) => {
  if (!response || !response.data) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data.data !== undefined) return data.data;
  if (data.result !== undefined) return data.result;
  if (data.items !== undefined) return data.items;
  return data;
};

// Utility function to handle API errors consistently
const handleApiError = (error, fallbackData = []) => {
  console.error('Recruitment API Error:', error);
  
  let errorMessage = 'An error occurred';
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.message) {
    errorMessage = error.message;
  }

  return {
    error: true,
    success: false,
    message: errorMessage,
    data: fallbackData
  };
};

// Dashboard Metrics API
export const DashboardMetricsAPI = {
  // Get dashboard overview metrics
  getOverview: async () => {
    try {
      const response = await api.get('/recruitment/dashboard/metrics');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error, {
        totalCandidates: 0,
        activeJobs: 0,
        interviewsScheduled: 0,
        offersExtended: 0
      });
    }
  },

  // Get pipeline data
  getPipeline: async (timeRange = '30d') => {
    try {
      const response = await api.get('/recruitment/dashboard/pipeline', {
        params: { timeRange }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error, []);
    }
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get('/recruitment/dashboard/activity', {
        params: { limit }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error, []);
    }
  }
};

// Workflow Automation API
export const WorkflowAPI = {
  // Get all workflows
  getAll: async () => {
    try {
      const response = await api.get('/recruitment/workflows');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get workflow by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/recruitment/workflows/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create workflow
  create: async (data) => {
    try {
      const response = await api.post('/recruitment/workflows', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update workflow
  update: async (id, data) => {
    try {
      const response = await api.put(`/recruitment/workflows/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete workflow
  delete: async (id) => {
    try {
      const response = await api.delete(`/recruitment/workflows/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Execute workflow
  execute: async (id, candidateId) => {
    try {
      const response = await api.post(`/recruitment/workflows/${id}/execute`, {
        candidateId
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get workflow execution history
  getExecutionHistory: async (id) => {
    try {
      const response = await api.get(`/recruitment/workflows/${id}/history`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Lead Scoring API
export const LeadScoringAPI = {
  // Calculate lead score for candidate
  calculateScore: async (candidateId) => {
    try {
      const response = await api.post(`/recruitment/lead-scoring/calculate`, {
        candidateId
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get scoring rules
  getRules: async () => {
    try {
      const response = await api.get('/recruitment/lead-scoring/rules');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update scoring rules
  updateRules: async (rules) => {
    try {
      const response = await api.put('/recruitment/lead-scoring/rules', rules);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get top scored candidates
  getTopScored: async (limit = 10) => {
    try {
      const response = await api.get('/recruitment/lead-scoring/top', {
        params: { limit }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Territory Management API
export const TerritoryAPI = {
  // Get all territories
  getAll: async () => {
    try {
      const response = await api.get('/recruitment/territories');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create territory
  create: async (data) => {
    try {
      const response = await api.post('/recruitment/territories', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update territory
  update: async (id, data) => {
    try {
      const response = await api.put(`/recruitment/territories/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete territory
  delete: async (id) => {
    try {
      const response = await api.delete(`/recruitment/territories/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Assign candidate to territory
  assignCandidate: async (territoryId, candidateId) => {
    try {
      const response = await api.post(`/recruitment/territories/${territoryId}/assign`, {
        candidateId
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Analytics API
export const AnalyticsAPI = {
  // Get predictive analytics
  getPredictions: async (filters = {}) => {
    try {
      const response = await api.get('/recruitment/analytics/predictions', {
        params: filters
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get KPIs
  getKPIs: async (timeRange = '30d') => {
    try {
      const response = await api.get('/recruitment/analytics/kpis', {
        params: { timeRange }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get forecasts
  getForecasts: async (period = 'next-month') => {
    try {
      const response = await api.get('/recruitment/analytics/forecasts', {
        params: { period }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get benchmarks
  getBenchmarks: async () => {
    try {
      const response = await api.get('/recruitment/analytics/benchmarks');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get ROI metrics
  getROI: async (timeRange = '30d') => {
    try {
      const response = await api.get('/recruitment/analytics/roi', {
        params: { timeRange }
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Communication API
export const CommunicationAPI = {
  // Get email sequences
  getEmailSequences: async () => {
    try {
      const response = await api.get('/recruitment/communication/email-sequences');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create email sequence
  createEmailSequence: async (data) => {
    try {
      const response = await api.post('/recruitment/communication/email-sequences', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send email to candidate
  sendEmail: async (candidateId, emailData) => {
    try {
      const response = await api.post(`/recruitment/communication/send-email`, {
        candidateId,
        ...emailData
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get communication history
  getHistory: async (candidateId) => {
    try {
      const response = await api.get(`/recruitment/communication/history/${candidateId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Compliance & Security API
export const ComplianceAPI = {
  // Get audit trail
  getAuditTrail: async (filters = {}) => {
    try {
      const response = await api.get('/recruitment/compliance/audit-trail', {
        params: filters
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get consent records
  getConsentRecords: async (candidateId) => {
    try {
      const response = await api.get(`/recruitment/compliance/consent/${candidateId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update consent
  updateConsent: async (candidateId, consentData) => {
    try {
      const response = await api.post(`/recruitment/compliance/consent/${candidateId}`, consentData);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Process data request (GDPR/CCPA)
  processDataRequest: async (requestId, action) => {
    try {
      const response = await api.post(`/recruitment/compliance/data-requests/${requestId}`, {
        action
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default {
  DashboardMetricsAPI,
  WorkflowAPI,
  LeadScoringAPI,
  TerritoryAPI,
  AnalyticsAPI,
  CommunicationAPI,
  ComplianceAPI
};
