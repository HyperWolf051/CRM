/**
 * Route permission configuration for last page memory system
 */

export const ROUTE_PERMISSIONS = [
  // Dashboard routes
  { path: '/app/dashboard', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  
  // CRM routes (admin and user)
  { path: '/app/contacts', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/contacts/*', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/contacts' },
  { path: '/app/companies', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/companies/*', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/companies' },
  { path: '/app/deals', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/tasks', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/calendar', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/analytics', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/automation', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/email-automation', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/reminders', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/email', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/calls', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/documents', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/goals', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/projects', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  
  // Admin-only routes
  { path: '/app/team', allowedRoles: ['admin'], defaultRedirect: '/app/dashboard' },
  { path: '/app/team/*', allowedRoles: ['admin'], defaultRedirect: '/app/team' },
  { path: '/app/settings', allowedRoles: ['admin'], defaultRedirect: '/app/dashboard' },
  { path: '/app/add-member', allowedRoles: ['admin'], defaultRedirect: '/app/team' },
  
  // Recruiter routes
  { path: '/app/recruiter', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/dashboard', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/candidates', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/candidates/*', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/candidates' },
  { path: '/app/recruiter/jobs', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/interviews', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/offers', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/calendar', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/analytics', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/reports', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/csv-import', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/candidates' },
  { path: '/app/recruiter/csv-export', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/candidates' },
  
  // Shared routes (all roles)
  { path: '/app/profile', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/candidates', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/candidates/*', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
  { path: '/app/jobs', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/jobs/*', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/jobs' },
  { path: '/app/add-candidate', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
  { path: '/app/add-job', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/jobs' },
  { path: '/app/add-client', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/companies' },
  { path: '/app/csv-import', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
  { path: '/app/csv-export', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
  { path: '/app/csv-demo', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
];

/**
 * Get default dashboard route for a user role
 */
export const getDefaultDashboard = (userRole) => {
  switch (userRole) {
    case 'recruiter':
      return '/app/recruiter/dashboard';
    case 'admin':
    case 'user':
    default:
      return '/app/dashboard';
  }
};

/**
 * Check if a user role has permission to access a route
 */
export const hasRoutePermission = (path, userRole) => {
  // Find matching route permission
  const routePermission = ROUTE_PERMISSIONS.find(route => {
    if (route.path.endsWith('/*')) {
      const basePath = route.path.slice(0, -2);
      return path.startsWith(basePath);
    }
    return route.path === path;
  });

  if (!routePermission) {
    // If no specific permission found, default to allowing access
    return true;
  }

  return routePermission.allowedRoles.includes(userRole);
};

/**
 * Get appropriate redirect route for a user role when they can't access a route
 */
export const getRedirectRoute = (path, userRole) => {
  // Find matching route permission
  const routePermission = ROUTE_PERMISSIONS.find(route => {
    if (route.path.endsWith('/*')) {
      const basePath = route.path.slice(0, -2);
      return path.startsWith(basePath);
    }
    return route.path === path;
  });

  if (routePermission) {
    return routePermission.defaultRedirect;
  }

  // Default fallback
  return getDefaultDashboard(userRole);
};

/**
 * Validate if a user can access a specific route with detailed checking
 */
export const validateRouteAccess = (path, userRole, userId = null) => {
  // Validate input parameters
  if (!path || typeof path !== 'string') {
    return {
      allowed: false,
      reason: 'invalid_path',
      redirectTo: getDefaultDashboard(userRole || 'user')
    };
  }

  if (!userRole || typeof userRole !== 'string') {
    return {
      allowed: false,
      reason: 'invalid_role',
      redirectTo: '/app/dashboard'
    };
  }

  // Sanitize and validate path format
  const sanitizedPath = sanitizePath(path);
  if (!sanitizedPath) {
    return {
      allowed: false,
      reason: 'malformed_path',
      redirectTo: getDefaultDashboard(userRole)
    };
  }

  // Check for invalid route parameters (e.g., /app/contacts/undefined)
  if (hasInvalidParameters(sanitizedPath)) {
    const basePath = getBasePath(sanitizedPath);
    return {
      allowed: false,
      reason: 'invalid_parameters',
      redirectTo: basePath || getDefaultDashboard(userRole)
    };
  }

  // Check if route exists in our application
  if (!isKnownRoute(sanitizedPath)) {
    return {
      allowed: false,
      reason: 'route_not_found',
      redirectTo: getDefaultDashboard(userRole)
    };
  }

  // Basic permission check
  if (!hasRoutePermission(sanitizedPath, userRole)) {
    return {
      allowed: false,
      reason: 'insufficient_permissions',
      redirectTo: getRedirectRoute(sanitizedPath, userRole)
    };
  }

  // Check for role-specific route restrictions
  if (sanitizedPath.startsWith('/app/recruiter/') && userRole !== 'recruiter') {
    return {
      allowed: false,
      reason: 'role_mismatch',
      redirectTo: getDefaultDashboard(userRole)
    };
  }

  // Check for admin-only routes
  const adminOnlyRoutes = ['/app/team', '/app/settings', '/app/add-member'];
  if (adminOnlyRoutes.some(route => sanitizedPath.startsWith(route)) && userRole !== 'admin') {
    return {
      allowed: false,
      reason: 'admin_required',
      redirectTo: getDefaultDashboard(userRole)
    };
  }

  return {
    allowed: true,
    reason: 'authorized',
    redirectTo: null
  };
};

/**
 * Get fallback route for a user role based on their permissions
 */
export const getFallbackRoute = (userRole, preferredSection = null) => {
  // If a preferred section is specified, try to find an accessible route in that section
  if (preferredSection) {
    const sectionRoutes = ROUTE_PERMISSIONS.filter(route => 
      route.path.includes(preferredSection) && 
      route.allowedRoles.includes(userRole)
    );

    if (sectionRoutes.length > 0) {
      // Return the first accessible route in the preferred section
      return sectionRoutes[0].path.replace('/*', '');
    }
  }

  // Return default dashboard for the user role
  return getDefaultDashboard(userRole);
};

/**
 * Check if a route change is valid for the current user
 */
export const isValidRouteChange = (fromPath, toPath, userRole) => {
  // Always allow navigation to accessible routes
  if (hasRoutePermission(toPath, userRole)) {
    return true;
  }

  // Don't allow navigation to restricted routes
  return false;
};

/**
 * Get all accessible routes for a user role
 */
export const getAccessibleRoutes = (userRole) => {
  return ROUTE_PERMISSIONS
    .filter(route => route.allowedRoles.includes(userRole))
    .map(route => ({
      path: route.path,
      defaultRedirect: route.defaultRedirect
    }));
};

/**
 * Sanitize path to prevent XSS and ensure valid format
 */
export const sanitizePath = (path) => {
  if (!path || typeof path !== 'string') {
    return null;
  }

  // Remove dangerous characters
  const sanitized = path
    .replace(/[<>'"&]/g, '') // Remove XSS-prone characters
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/$/, '') // Remove trailing slash (except for root)
    .trim();

  // Ensure path starts with /
  if (!sanitized.startsWith('/')) {
    return null;
  }

  // Validate path length (prevent extremely long URLs)
  if (sanitized.length > 500) {
    return null;
  }

  return sanitized || '/';
};

/**
 * Check if path has invalid parameters like undefined, null, etc.
 */
export const hasInvalidParameters = (path) => {
  const invalidParams = ['undefined', 'null', 'NaN', '[object Object]'];
  return invalidParams.some(param => path.includes(param));
};

/**
 * Get base path from a path with parameters
 * e.g., /app/contacts/123 -> /app/contacts
 */
export const getBasePath = (path) => {
  if (!path || !path.startsWith('/app/')) {
    return null;
  }

  const segments = path.split('/').filter(Boolean);
  
  if (segments.length <= 2) {
    return path; // Already a base path
  }

  // For paths like /app/contacts/123, return /app/contacts
  // For paths like /app/recruiter/candidates/456, return /app/recruiter/candidates
  if (segments[1] === 'recruiter' && segments.length > 3) {
    return `/${segments.slice(0, 4).join('/')}`;
  } else if (segments.length > 2) {
    return `/${segments.slice(0, 3).join('/')}`;
  }

  return path;
};

/**
 * Check if a route is known/defined in our application
 */
export const isKnownRoute = (path) => {
  if (!path || !path.startsWith('/app/')) {
    return false;
  }

  // Check exact matches first
  const exactMatch = ROUTE_PERMISSIONS.some(route => 
    route.path === path || (route.path.endsWith('/*') && path.startsWith(route.path.slice(0, -2)))
  );

  if (exactMatch) {
    return true;
  }

  // Check known base routes
  const knownBaseRoutes = [
    '/app/dashboard',
    '/app/contacts',
    '/app/companies', 
    '/app/candidates',
    '/app/jobs',
    '/app/calendar',
    '/app/tasks',
    '/app/analytics',
    '/app/team',
    '/app/settings',
    '/app/profile',
    '/app/automation',
    '/app/email-automation',
    '/app/reminders',
    '/app/csv-import',
    '/app/csv-export',
    '/app/recruiter/dashboard',
    '/app/recruiter/candidates',
    '/app/recruiter/jobs',
    '/app/recruiter/interviews',
    '/app/recruiter/offers',
    '/app/recruiter/calendar',
    '/app/recruiter/analytics',
    '/app/recruiter/reports',
    '/app/recruiter/csv-import',
    '/app/recruiter/csv-export'
  ];

  // Check if path starts with any known base route
  return knownBaseRoutes.some(baseRoute => {
    return path === baseRoute || path.startsWith(baseRoute + '/');
  });
};

/**
 * Handle route errors and provide appropriate fallbacks
 */
export const handleRouteError = (error, path, userRole) => {
  const errorInfo = {
    timestamp: Date.now(),
    path,
    userRole,
    error: error.message || 'Unknown error',
    stack: error.stack,
    name: error.name
  };

  // Log error for debugging with more context
  if (process.env.NODE_ENV === 'development') {
    console.error('[RouteError]', errorInfo);
    console.group('Route Error Details');
    console.log('Path:', path);
    console.log('User Role:', userRole);
    console.log('Error Type:', error.name);
    console.log('Error Message:', error.message);
    if (error.stack) {
      console.log('Stack Trace:', error.stack);
    }
    console.groupEnd();
  }

  // Handle specific error types with appropriate fallbacks
  
  // Chunk loading errors (lazy loading failures)
  if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
    return {
      type: 'chunk_load_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Failed to load page resources. Please refresh the page.',
      shouldRefresh: true,
      errorCode: 'CHUNK_LOAD_FAILED'
    };
  }

  // Network errors
  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return {
      type: 'network_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Network connection issue. Please check your connection and try again.',
      shouldRetry: true,
      errorCode: 'NETWORK_ERROR'
    };
  }

  // Invalid route parameters
  if (path && hasInvalidParameters(path)) {
    const basePath = getBasePath(path);
    return {
      type: 'invalid_parameters',
      redirectTo: basePath || getDefaultDashboard(userRole),
      message: 'Invalid page parameters detected. Redirecting to safe location.',
      errorCode: 'INVALID_PARAMETERS'
    };
  }

  // Non-existent resources (404-like errors)
  if (error.name === 'NotFoundError' || error.message?.includes('not found') || error.message?.includes('404')) {
    const basePath = getBasePath(path);
    return {
      type: 'resource_not_found',
      redirectTo: basePath || getDefaultDashboard(userRole),
      message: 'The requested resource was not found. Redirecting to available content.',
      errorCode: 'RESOURCE_NOT_FOUND'
    };
  }

  // Permission errors
  if (error.name === 'PermissionError' || error.message?.includes('permission') || error.message?.includes('unauthorized')) {
    return {
      type: 'permission_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'You do not have permission to access this resource.',
      errorCode: 'PERMISSION_DENIED'
    };
  }

  // Storage errors
  if (error.name === 'QuotaExceededError' || error.message?.includes('storage') || error.message?.includes('quota')) {
    return {
      type: 'storage_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Storage issue detected. Some features may be limited.',
      shouldClearStorage: true,
      errorCode: 'STORAGE_ERROR'
    };
  }

  // Timeout errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return {
      type: 'timeout_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Request timed out. Please try again.',
      shouldRetry: true,
      errorCode: 'TIMEOUT_ERROR'
    };
  }

  // Syntax or parsing errors (corrupted data)
  if (error.name === 'SyntaxError' || error.message?.includes('JSON') || error.message?.includes('parse')) {
    return {
      type: 'data_corruption',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Data corruption detected. Clearing cache and redirecting.',
      shouldClearStorage: true,
      errorCode: 'DATA_CORRUPTION'
    };
  }

  // React component errors
  if (error.name === 'Error' && error.message?.includes('React')) {
    return {
      type: 'component_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Component error occurred. Redirecting to safe location.',
      errorCode: 'COMPONENT_ERROR'
    };
  }

  // Default error handling for unknown errors
  return {
    type: 'general_error',
    redirectTo: getDefaultDashboard(userRole),
    message: 'An unexpected error occurred. Redirecting to dashboard.',
    errorCode: 'UNKNOWN_ERROR'
  };
};

/**
 * Enhanced error logging for debugging edge cases
 */
export const logRouteError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context: {
      path: context.path,
      userRole: context.userRole,
      userId: context.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      ...context
    },
    performance: {
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      } : null
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Route Error Log');
    console.error('Error:', error);
    console.table(errorLog.context);
    if (errorLog.performance.memory) {
      console.log('Memory Usage:', errorLog.performance.memory);
    }
    console.groupEnd();
  }

  // In production, you might want to send this to an error tracking service
  // Example: sendToErrorTrackingService(errorLog);

  return errorLog;
};

/**
 * Handle storage errors with graceful fallbacks
 */
export const handleStorageError = (error, operation, key = null) => {
  const errorInfo = {
    timestamp: Date.now(),
    operation, // 'get', 'set', 'remove'
    key,
    error: error.message || 'Unknown storage error',
    storageType: getStorageType()
  };

  // Log storage error
  if (process.env.NODE_ENV === 'development') {
    console.warn('[StorageError]', errorInfo);
  }

  // Handle specific storage error types
  if (error.name === 'QuotaExceededError') {
    // Storage quota exceeded - attempt cleanup
    try {
      clearOldStorageEntries();
      return {
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: 'Storage quota exceeded. Old entries cleared.',
        shouldRetry: true
      };
    } catch (cleanupError) {
      return {
        success: false,
        error: 'QUOTA_EXCEEDED_CLEANUP_FAILED',
        message: 'Storage quota exceeded and cleanup failed.',
        shouldRetry: false
      };
    }
  }

  if (error.name === 'SecurityError' || error.message?.includes('security')) {
    return {
      success: false,
      error: 'SECURITY_ERROR',
      message: 'Storage access denied due to security restrictions.',
      shouldRetry: false
    };
  }

  // Generic storage error
  return {
    success: false,
    error: 'STORAGE_ERROR',
    message: 'Storage operation failed.',
    shouldRetry: operation === 'get' // Only retry read operations
  };
};

/**
 * Get current storage type being used
 */
const getStorageType = () => {
  try {
    localStorage.setItem('__test__', 'test');
    localStorage.removeItem('__test__');
    return 'localStorage';
  } catch (e) {
    try {
      sessionStorage.setItem('__test__', 'test');
      sessionStorage.removeItem('__test__');
      return 'sessionStorage';
    } catch (e) {
      return 'none';
    }
  }
};

/**
 * Clear old storage entries to free up space
 */
const clearOldStorageEntries = () => {
  const storage = window.localStorage || window.sessionStorage;
  if (!storage) return;

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const keysToRemove = [];

  // Find old last page memory entries
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.includes('lastVisitedPage')) {
      try {
        const value = storage.getItem(key);
        const parsedValue = JSON.parse(value);
        if (parsedValue.timestamp && parsedValue.timestamp < thirtyDaysAgo) {
          keysToRemove.push(key);
        }
      } catch (e) {
        // If we can't parse it, it's probably corrupted, so remove it
        keysToRemove.push(key);
      }
    }
  }

  // Remove old entries
  keysToRemove.forEach(key => {
    try {
      storage.removeItem(key);
    } catch (e) {
      // Ignore individual removal errors
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`Cleared ${keysToRemove.length} old storage entries`);
  }
};

/**
 * Validate and sanitize route parameters to prevent errors
 */
export const validateAndSanitizeRoute = (path, userRole) => {
  try {
    // Basic validation
    if (!path || typeof path !== 'string') {
      return {
        isValid: false,
        sanitizedPath: null,
        error: 'Invalid path format',
        fallbackPath: getDefaultDashboard(userRole)
      };
    }

    // Sanitize the path
    const sanitizedPath = sanitizePath(path);
    if (!sanitizedPath) {
      return {
        isValid: false,
        sanitizedPath: null,
        error: 'Path sanitization failed',
        fallbackPath: getDefaultDashboard(userRole)
      };
    }

    // Check for invalid parameters
    if (hasInvalidParameters(sanitizedPath)) {
      const basePath = getBasePath(sanitizedPath);
      return {
        isValid: false,
        sanitizedPath: basePath,
        error: 'Invalid route parameters detected',
        fallbackPath: basePath || getDefaultDashboard(userRole)
      };
    }

    // Check if route exists
    if (!isKnownRoute(sanitizedPath)) {
      return {
        isValid: false,
        sanitizedPath: null,
        error: 'Route not found',
        fallbackPath: getDefaultDashboard(userRole)
      };
    }

    // Check permissions
    const validation = validateRouteAccess(sanitizedPath, userRole);
    if (!validation.allowed) {
      return {
        isValid: false,
        sanitizedPath: null,
        error: `Access denied: ${validation.reason}`,
        fallbackPath: validation.redirectTo
      };
    }

    return {
      isValid: true,
      sanitizedPath,
      error: null,
      fallbackPath: null
    };

  } catch (error) {
    // Handle any errors in validation process
    if (process.env.NODE_ENV === 'development') {
      console.error('Route validation error:', error);
    }

    return {
      isValid: false,
      sanitizedPath: null,
      error: 'Validation process failed',
      fallbackPath: getDefaultDashboard(userRole)
    };
  }
};