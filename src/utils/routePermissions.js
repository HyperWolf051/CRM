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
    error: error.message || 'Unknown error'
  };

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('[RouteError]', errorInfo);
  }

  // Determine appropriate fallback based on error type
  if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
    // Handle lazy loading errors - suggest page refresh
    return {
      type: 'chunk_load_error',
      redirectTo: getDefaultDashboard(userRole),
      message: 'Failed to load page resources. Please refresh the page.',
      shouldRefresh: true
    };
  }

  if (path && hasInvalidParameters(path)) {
    // Handle invalid parameters
    const basePath = getBasePath(path);
    return {
      type: 'invalid_parameters',
      redirectTo: basePath || getDefaultDashboard(userRole),
      message: 'Invalid page parameters detected.'
    };
  }

  // Default error handling
  return {
    type: 'general_error',
    redirectTo: getDefaultDashboard(userRole),
    message: 'An error occurred while navigating. Redirecting to dashboard.'
  };
};