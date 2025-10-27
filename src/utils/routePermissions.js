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
  // Basic permission check
  if (!hasRoutePermission(path, userRole)) {
    return {
      allowed: false,
      reason: 'insufficient_permissions',
      redirectTo: getRedirectRoute(path, userRole)
    };
  }

  // Check for role-specific route restrictions
  if (path.startsWith('/app/recruiter/') && userRole !== 'recruiter') {
    return {
      allowed: false,
      reason: 'role_mismatch',
      redirectTo: getDefaultDashboard(userRole)
    };
  }

  // Check for admin-only routes
  const adminOnlyRoutes = ['/app/team', '/app/settings', '/app/add-member'];
  if (adminOnlyRoutes.some(route => path.startsWith(route)) && userRole !== 'admin') {
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