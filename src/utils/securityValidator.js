/**
 * Security validation utilities
 * Provides security checks and validation for the recruitment dashboard
 */

// Security constants
export const SecurityRules = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < SecurityRules.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SecurityRules.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (SecurityRules.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SecurityRules.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SecurityRules.PASSWORD_REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SecurityRules.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength score (0-100)
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length score
  score += Math.min(password.length * 4, 40);
  
  // Character variety score
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Complexity bonus
  const uniqueChars = new Set(password).size;
  score += Math.min(uniqueChars * 2, 20);
  
  return Math.min(score, 100);
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
  } = options;
  
  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check for SQL injection patterns
 */
export const hasSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\*|;|'|"|\||&)/,
    /(\bOR\b|\bAND\b).*=.*=/i,
    /(\bUNION\b.*\bSELECT\b)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check for XSS patterns
 */
export const hasXSS = (input) => {
  if (typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (token, storedToken) => {
  return token && storedToken && token === storedToken;
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (lastActivity) => {
  if (!lastActivity) return true;
  const now = Date.now();
  return (now - lastActivity) > SecurityRules.SESSION_TIMEOUT;
};

/**
 * Validate JWT token format (basic check)
 */
export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Check if token needs refresh
 */
export const needsTokenRefresh = (tokenIssuedAt) => {
  if (!tokenIssuedAt) return true;
  const now = Date.now();
  return (now - tokenIssuedAt) > SecurityRules.TOKEN_REFRESH_INTERVAL;
};

/**
 * Validate user permissions
 */
export const hasPermission = (user, requiredPermission) => {
  if (!user || !user.role) return false;
  
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
    recruiter: ['read', 'write', 'manage_candidates', 'manage_interviews'],
    user: ['read', 'write']
  };
  
  const userPermissions = rolePermissions[user.role] || [];
  return userPermissions.includes(requiredPermission);
};

/**
 * Validate data access permissions
 */
export const canAccessData = (user, data, action = 'read') => {
  if (!user || !data) return false;
  
  // Admin can access everything
  if (user.role === 'admin') return true;
  
  // Recruiters can access all candidate data (as per requirements)
  if (user.role === 'recruiter' && action === 'read') return true;
  
  // Users can only access their own data for write operations
  if (action === 'write' || action === 'delete') {
    return data.createdBy === user.id || data.assignedTo === user.id;
  }
  
  return false;
};

/**
 * Rate limiting check
 */
export const checkRateLimit = (userId, action, limit = 100, window = 60000) => {
  const key = `ratelimit:${userId}:${action}`;
  const now = Date.now();
  
  // Get stored rate limit data
  const stored = sessionStorage.getItem(key);
  let data = stored ? JSON.parse(stored) : { count: 0, resetAt: now + window };
  
  // Reset if window expired
  if (now > data.resetAt) {
    data = { count: 0, resetAt: now + window };
  }
  
  // Increment count
  data.count++;
  
  // Store updated data
  sessionStorage.setItem(key, JSON.stringify(data));
  
  return {
    allowed: data.count <= limit,
    remaining: Math.max(0, limit - data.count),
    resetAt: data.resetAt
  };
};

/**
 * Validate API request
 */
export const validateAPIRequest = (request, user) => {
  const errors = [];
  
  // Check authentication
  if (!user || !user.id) {
    errors.push('User not authenticated');
  }
  
  // Check CSRF token for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers['X-CSRF-Token'];
    const storedToken = sessionStorage.getItem('csrf-token');
    
    if (!validateCSRFToken(csrfToken, storedToken)) {
      errors.push('Invalid CSRF token');
    }
  }
  
  // Check rate limiting
  const rateLimit = checkRateLimit(user?.id, request.url);
  if (!rateLimit.allowed) {
    errors.push('Rate limit exceeded');
  }
  
  // Validate request body for injections
  if (request.body) {
    const bodyStr = JSON.stringify(request.body);
    if (hasSQLInjection(bodyStr)) {
      errors.push('Potential SQL injection detected');
    }
    if (hasXSS(bodyStr)) {
      errors.push('Potential XSS attack detected');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Audit log entry
 */
export const createAuditLog = (user, action, resource, details = {}) => {
  return {
    userId: user?.id,
    userName: user?.name,
    action,
    resource,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: details.ipAddress || 'unknown',
    userAgent: navigator.userAgent
  };
};

/**
 * Encrypt sensitive data (basic implementation)
 */
export const encryptData = (data, key) => {
  // In production, use a proper encryption library like crypto-js
  // This is a placeholder implementation
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

/**
 * Decrypt sensitive data (basic implementation)
 */
export const decryptData = (encryptedData, key) => {
  // In production, use a proper encryption library like crypto-js
  // This is a placeholder implementation
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Mask sensitive information
 */
export const maskSensitiveData = (data, type) => {
  if (!data) return '';
  
  switch (type) {
    case 'email':
      const [username, domain] = data.split('@');
      return `${username.substring(0, 2)}***@${domain}`;
    
    case 'phone':
      return data.replace(/\d(?=\d{4})/g, '*');
    
    case 'ssn':
      return `***-**-${data.slice(-4)}`;
    
    case 'credit-card':
      return `****-****-****-${data.slice(-4)}`;
    
    default:
      return data.substring(0, 3) + '***';
  }
};

/**
 * Security headers check
 */
export const validateSecurityHeaders = (headers) => {
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security'
  ];
  
  const missing = requiredHeaders.filter(header => !headers[header]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

export default {
  SecurityRules,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateFileUpload,
  hasSQLInjection,
  hasXSS,
  validateCSRFToken,
  generateCSRFToken,
  isSessionExpired,
  isValidJWT,
  needsTokenRefresh,
  hasPermission,
  canAccessData,
  checkRateLimit,
  validateAPIRequest,
  createAuditLog,
  encryptData,
  decryptData,
  maskSensitiveData,
  validateSecurityHeaders
};
