/**
 * Centralized error handling utility
 * Provides consistent error handling across the application
 */

// Error types
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Parse error from different sources
 */
export const parseError = (error) => {
  // Network errors
  if (!error.response && error.request) {
    return {
      type: ErrorTypes.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: 'Network error. Please check your internet connection.',
      originalError: error
    };
  }

  // HTTP errors
  if (error.response) {
    const { status, data } = error.response;

    // Authentication errors
    if (status === 401) {
      return {
        type: ErrorTypes.AUTH,
        severity: ErrorSeverity.CRITICAL,
        message: data?.message || 'Authentication failed. Please log in again.',
        originalError: error
      };
    }

    // Permission errors
    if (status === 403) {
      return {
        type: ErrorTypes.PERMISSION,
        severity: ErrorSeverity.HIGH,
        message: data?.message || 'You do not have permission to perform this action.',
        originalError: error
      };
    }

    // Not found errors
    if (status === 404) {
      return {
        type: ErrorTypes.NOT_FOUND,
        severity: ErrorSeverity.MEDIUM,
        message: data?.message || 'The requested resource was not found.',
        originalError: error
      };
    }

    // Validation errors
    if (status === 400 || status === 422) {
      return {
        type: ErrorTypes.VALIDATION,
        severity: ErrorSeverity.MEDIUM,
        message: data?.message || 'Invalid data provided.',
        validationErrors: data?.errors || {},
        originalError: error
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        type: ErrorTypes.SERVER,
        severity: ErrorSeverity.CRITICAL,
        message: data?.message || 'Server error. Please try again later.',
        originalError: error
      };
    }

    // Timeout errors
    if (status === 408 || error.code === 'ECONNABORTED') {
      return {
        type: ErrorTypes.TIMEOUT,
        severity: ErrorSeverity.HIGH,
        message: 'Request timeout. Please try again.',
        originalError: error
      };
    }
  }

  // Unknown errors
  return {
    type: ErrorTypes.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: error.message || 'An unexpected error occurred.',
    originalError: error
  };
};

/**
 * Log error to console (and potentially to external service)
 */
export const logError = (error, context = {}) => {
  const parsedError = parseError(error);
  
  console.error('[Error Handler]', {
    ...parsedError,
    context,
    timestamp: new Date().toISOString()
  });

  // In production, send to error tracking service (e.g., Sentry)
  if (import.meta.env.PROD && parsedError.severity === ErrorSeverity.CRITICAL) {
    // TODO: Integrate with error tracking service
    // Sentry.captureException(error, { extra: context });
  }

  return parsedError;
};

/**
 * Get user-friendly error message
 */
export const getUserMessage = (error) => {
  const parsedError = parseError(error);
  return parsedError.message;
};

/**
 * Handle API error with retry logic
 */
export const handleApiError = async (error, retryFn, maxRetries = 2) => {
  const parsedError = parseError(error);
  
  // Don't retry auth or validation errors
  if (
    parsedError.type === ErrorTypes.AUTH ||
    parsedError.type === ErrorTypes.VALIDATION ||
    parsedError.type === ErrorTypes.PERMISSION
  ) {
    throw parsedError;
  }

  // Retry network and timeout errors
  if (
    (parsedError.type === ErrorTypes.NETWORK || parsedError.type === ErrorTypes.TIMEOUT) &&
    maxRetries > 0
  ) {
    console.log(`Retrying request... (${maxRetries} attempts remaining)`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return retryFn(maxRetries - 1);
  }

  throw parsedError;
};

/**
 * Create error boundary fallback
 */
export const createErrorFallback = (componentName) => {
  return {
    message: `Error in ${componentName}`,
    action: 'Please refresh the page or contact support if the problem persists.'
  };
};

/**
 * Validate form data and return errors
 */
export const validateFormData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.message || `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Email validation
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = rule.message || 'Invalid email address';
      return;
    }

    // Phone validation
    if (rule.phone && !/^\+?[\d\s-()]+$/.test(value)) {
      errors[field] = rule.message || 'Invalid phone number';
      return;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
      return;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.message || `Maximum ${rule.maxLength} characters allowed`;
      return;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || 'Invalid format';
      return;
    }

    // Custom validation
    if (rule.validate && !rule.validate(value, data)) {
      errors[field] = rule.message || 'Validation failed';
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Safe async operation wrapper
 */
export const safeAsync = async (fn, fallbackValue = null) => {
  try {
    return await fn();
  } catch (error) {
    logError(error, { function: fn.name });
    return fallbackValue;
  }
};

/**
 * Retry async operation with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000
) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const parsedError = parseError(error);
      
      // Don't retry certain error types
      if (
        parsedError.type === ErrorTypes.AUTH ||
        parsedError.type === ErrorTypes.VALIDATION ||
        parsedError.type === ErrorTypes.PERMISSION
      ) {
        throw parsedError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, i), maxDelay);
      
      if (i < maxRetries - 1) {
        console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw parseError(lastError);
};

export default {
  ErrorTypes,
  ErrorSeverity,
  parseError,
  logError,
  getUserMessage,
  handleApiError,
  createErrorFallback,
  validateFormData,
  safeAsync,
  retryWithBackoff
};
