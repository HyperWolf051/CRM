import axios from 'axios';
import { handleDemoApiCall } from './demoApi';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  // Check if user is offline
  if (!navigator.onLine) {
    return 'You appear to be offline. Please check your internet connection.';
  }

  // Network error (no response received)
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return 'Network error. Please check your connection and try again.';
  }

  // Timeout error
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Server responded with error status
  if (error.response) {
    const { status, data } = error.response;
    
    // Use server-provided error message if available
    if (data?.message) {
      return data.message;
    }
    
    // Default messages for common HTTP status codes
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 422:
        return 'The provided data is invalid.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  }

  // Fallback for unknown errors
  return 'An unexpected error occurred. Please try again.';
};

// Request interceptor: Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add demo mode flag to requests
    if (isDemoMode) {
      config.headers['X-Demo-Mode'] = 'true';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle demo mode and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
    
    // Handle demo mode - intercept failed requests and use demo API
    if (isDemoMode && error.config && !error.config.__isRetryRequest) {
      try {
        const method = error.config.method.toUpperCase();
        let url = error.config.url;
        
        // Clean up the URL
        if (url.includes(error.config.baseURL)) {
          url = url.replace(error.config.baseURL, '');
        }
        if (url.startsWith('/api')) {
          url = url.replace('/api', '');
        }
        if (!url.startsWith('/')) {
          url = '/' + url;
        }
        
        console.log('Demo API handling:', method, url);
        
        const demoResponse = await handleDemoApiCall(method, url, error.config.data);
        
        return {
          data: demoResponse.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        };
      } catch (demoError) {
        console.error('Demo API error:', demoError);
        // Continue with original error handling
      }
    }

    // Handle 401 Unauthorized - redirect to login (but not in demo mode)
    if (error.response?.status === 401 && !isDemoMode) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isDemoMode');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Enhance error object with user-friendly message
    const enhancedError = {
      ...error,
      userMessage: getErrorMessage(error),
      isNetworkError: !error.response,
      isOffline: !navigator.onLine,
      canRetry: error.response?.status >= 500 || !error.response
    };

    return Promise.reject(enhancedError);
  }
);

// Helper function to create a retry wrapper for API calls
export const withRetry = async (apiCall, maxRetries = 2, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry for client errors (4xx) except 408 (timeout) and 429 (rate limit)
      if (error.response?.status >= 400 && error.response?.status < 500 && 
          error.response?.status !== 408 && error.response?.status !== 429) {
        break;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

// Helper function to check if user is online
export const isOnline = () => navigator.onLine;

// Helper function to wait for online status
export const waitForOnline = () => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
    } else {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };
      window.addEventListener('online', handleOnline);
    }
  });
};

export default api;
