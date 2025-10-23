import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7244/api/v1';

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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
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
  getAll: () => api.get('/employers'),
  
  // Get employer by ID
  getById: (id) => api.get(`/employers/${id}`),
  
  // Create new employer
  create: (data) => {
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
    return api.post('/employers', payload);
  },
  
  // Update employer
  update: (id, data) => {
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
    return api.put(`/employers/${id}`, payload);
  },
  
  // Delete employer
  delete: (id) => api.delete(`/employers/${id}`)
};

// Job Postings API (Jobs/Deals)
export const JobAPI = {
  // Get all job postings
  getAll: () => api.get('/jobpostings'),
  
  // Get job posting by ID
  getById: (id) => api.get(`/jobpostings/${id}`),
  
  // Create new job posting
  create: (data) => {
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
    return api.post('/jobpostings', payload);
  },
  
  // Update job posting
  update: (id, data) => {
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
    return api.put(`/jobpostings/${id}`, payload);
  },
  
  // Delete job posting
  delete: (id) => api.delete(`/jobpostings/${id}`)
};

// Candidates API
export const CandidateAPI = {
  // Get all candidates
  getAll: () => api.get('/candidates'),
  
  // Get candidate by ID
  getById: (id) => api.get(`/candidates/${id}`),
  
  // Create new candidate
  create: (data) => {
    // Note: Backend doesn't specify required fields for candidates, 
    // so we'll send all provided data
    return api.post('/candidates', data);
  },
  
  // Update candidate
  update: (id, data) => {
    return api.put(`/candidates/${id}`, data);
  },
  
  // Delete candidate
  delete: (id) => api.delete(`/candidates/${id}`)
};

export default api;