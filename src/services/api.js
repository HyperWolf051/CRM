import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7244/api/v1';

// Utility function to extract data from different response formats
const extractResponseData = (response) => {
  if (!response || !response.data) return [];

  const data = response.data;

  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }

  // Common API response patterns
  if (data.data !== undefined) return data.data;
  if (data.result !== undefined) return data.result;
  if (data.items !== undefined) return data.items;
  if (data.records !== undefined) return data.records;
  if (data.content !== undefined) return data.content;

  // If it's an object with success/status, try to extract the actual data
  if (data.success && data.payload) return data.payload;
  if (data.status === 'success' && data.data) return data.data;

  // Return the data as-is if no known pattern matches
  return data;
};

// Utility function to handle API errors consistently
const handleApiError = (error, fallbackData = []) => {
  console.error('API Error:', error);

  // Extract error message from different error response formats
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
    message: errorMessage,
    data: fallbackData
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and data extraction
api.interceptors.response.use(
  (response) => {
    // Extract data from common response structures
    // Handle different response formats: { data: [...] }, { result: [...] }, or direct array
    if (response.data) {
      // If response has nested data structure, extract it
      if (response.data.data !== undefined) {
        response.data = response.data.data;
      } else if (response.data.result !== undefined) {
        response.data = response.data.result;
      } else if (response.data.items !== undefined) {
        response.data = response.data.items;
      }
      // If it's already an array or object, keep as is
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Employers API (Clients/Companies)
export const EmployerAPI = {
  // Get all employers
  getAll: async () => {
    try {
      const response = await api.get('/employers');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get employer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/employers/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new employer
  create: async (data) => {
    try {
      const payload = {
        name: data.name, // required
        industry: data.industry || '',
        websiteUrl: data.websiteUrl || '',
        contactPerson: data.contactPerson || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        gstNumber: data.gstNumber || '',
        panNumber: data.panNumber || '',
        tanNumber: data.tanNumber || '',
        billingAddress: data.billingAddress || '',
        bankAccountNumber: data.bankAccountNumber || '',
        ifscCode: data.ifscCode || '',
        paymentTerms: data.paymentTerms || ''
      };
      const response = await api.post('/employers', payload);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update employer
  update: async (id, data) => {
    try {
      const payload = {
        name: data.name, // required
        industry: data.industry || '',
        websiteUrl: data.websiteUrl || '',
        contactPerson: data.contactPerson || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        gstNumber: data.gstNumber || '',
        panNumber: data.panNumber || '',
        tanNumber: data.tanNumber || '',
        billingAddress: data.billingAddress || '',
        bankAccountNumber: data.bankAccountNumber || '',
        ifscCode: data.ifscCode || '',
        paymentTerms: data.paymentTerms || ''
      };
      const response = await api.put(`/employers/${id}`, payload);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete employer
  delete: async (id) => {
    try {
      const response = await api.delete(`/employers/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Job Postings API (Jobs/Deals)
export const JobAPI = {
  // Get all job postings
  getAll: async () => {
    try {
      const response = await api.get('/jobpostings');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get job posting by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/jobpostings/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new job posting
  create: async (data) => {
    try {
      const payload = {
        employerId: data.employerId, // required
        title: data.title, // required
        description: data.description || '',
        location: data.location || '',
        employmentType: data.employmentType || '',
        minExperienceYears: data.minExperienceYears || null,
        maxExperienceYears: data.maxExperienceYears || null,
        minSalary: data.minSalary || null,
        maxSalary: data.maxSalary || null,
        qualification: data.qualification || '',
        closingDate: data.closingDate || null
      };
      const response = await api.post('/jobpostings', payload);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update job posting
  update: async (id, data) => {
    try {
      const payload = {
        employerId: data.employerId, // required
        title: data.title, // required
        description: data.description || '',
        location: data.location || '',
        employmentType: data.employmentType || '',
        minExperienceYears: data.minExperienceYears || null,
        maxExperienceYears: data.maxExperienceYears || null,
        minSalary: data.minSalary || null,
        maxSalary: data.maxSalary || null,
        qualification: data.qualification || '',
        closingDate: data.closingDate || null
      };
      const response = await api.put(`/jobpostings/${id}`, payload);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete job posting
  delete: async (id) => {
    try {
      const response = await api.delete(`/jobpostings/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Candidates API
export const CandidateAPI = {
  // Get all candidates
  getAll: async () => {
    try {
      const response = await api.get('/candidates');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get candidate by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new candidate
  create: async (data) => {
    try {
      // Note: Backend doesn't specify required fields for candidates, 
      // so we'll send all provided data
      const response = await api.post('/candidates', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update candidate
  update: async (id, data) => {
    try {
      const response = await api.put(`/candidates/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete candidate
  delete: async (id) => {
    try {
      const response = await api.delete(`/candidates/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Check for duplicate candidates
  checkDuplicates: async (candidateData) => {
    try {
      const response = await api.post('/candidates/check-duplicates', candidateData);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Merge candidates
  merge: async (primaryId, duplicateId, mergeDecisions) => {
    try {
      const response = await api.post('/candidates/merge', {
        primaryCandidateId: primaryId,
        duplicateCandidateId: duplicateId,
        mergeDecisions: mergeDecisions
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get duplicate groups for bulk management
  getDuplicateGroups: async (filters = {}) => {
    try {
      const response = await api.get('/candidates/duplicate-groups', { params: filters });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Resolve duplicate group
  resolveDuplicateGroup: async (groupId, resolution) => {
    try {
      const response = await api.post(`/candidates/duplicate-groups/${groupId}/resolve`, resolution);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get duplicate audit trail
  getDuplicateAudit: async (candidateId) => {
    try {
      const response = await api.get(`/candidates/${candidateId}/duplicate-audit`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Interview API
export const InterviewAPI = {
  // Get all interviews
  getAll: async () => {
    try {
      const response = await api.get('/interviews');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get interview by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/interviews/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new interview
  create: async (data) => {
    try {
      const response = await api.post('/interviews', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update interview
  update: async (id, data) => {
    try {
      const response = await api.put(`/interviews/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete interview
  delete: async (id) => {
    try {
      const response = await api.delete(`/interviews/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get interviews by candidate ID
  getByCandidateId: async (candidateId) => {
    try {
      const response = await api.get(`/interviews/candidate/${candidateId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Client Management API
export const ClientAPI = {
  // Get all clients
  getAll: async () => {
    try {
      const response = await api.get('/clients');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get client by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new client
  create: async (data) => {
    try {
      const response = await api.post('/clients', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update client
  update: async (id, data) => {
    try {
      const response = await api.put(`/clients/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete client
  delete: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get client communications
  getCommunications: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/communications`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add client communication
  addCommunication: async (clientId, data) => {
    try {
      const response = await api.post(`/clients/${clientId}/communications`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get client feedback
  getFeedback: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/feedback`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add client feedback
  addFeedback: async (clientId, data) => {
    try {
      const response = await api.post(`/clients/${clientId}/feedback`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get client requirements
  getRequirements: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/requirements`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add client requirement
  addRequirement: async (clientId, data) => {
    try {
      const response = await api.post(`/clients/${clientId}/requirements`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Offers API
export const OfferAPI = {
  // Get all offers
  getAll: async () => {
    try {
      const response = await api.get('/offers');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/offers/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new offer
  create: async (data) => {
    try {
      // Send all provided data as the backend will handle validation
      const response = await api.post('/offers', data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update offer
  update: async (id, data) => {
    try {
      const response = await api.put(`/offers/${id}`, data);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete offer
  delete: async (id) => {
    try {
      const response = await api.delete(`/offers/${id}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offers by candidate ID
  getByCandidateId: async (candidateId) => {
    try {
      const response = await api.get(`/offers/candidate/${candidateId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offers by job posting ID
  getByJobId: async (jobId) => {
    try {
      const response = await api.get(`/offers/job/${jobId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offers by employer ID
  getByEmployerId: async (employerId) => {
    try {
      const response = await api.get(`/offers/employer/${employerId}`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update offer status (accept, reject, pending, etc.)
  updateStatus: async (id, status, notes = '') => {
    try {
      const response = await api.patch(`/offers/${id}/status`, {
        status,
        notes
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send offer to candidate
  sendOffer: async (id, deliveryMethod = 'email') => {
    try {
      const response = await api.post(`/offers/${id}/send`, {
        deliveryMethod
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offer statistics
  getStatistics: async (filters = {}) => {
    try {
      const response = await api.get('/offers/statistics', { params: filters });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get offer history/audit trail
  getHistory: async (id) => {
    try {
      const response = await api.get(`/offers/${id}/history`);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Authentication API
export const AuthAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register new user (if available)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current user profile
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Refresh token (if available)
  refresh: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return {
        success: true,
        data: extractResponseData(response)
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api;