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
  { path: '/app/deals', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/tasks', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/calendar', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/analytics', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/automation', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  { path: '/app/reminders', allowedRoles: ['admin', 'user'], defaultRedirect: '/app/dashboard' },
  
  // Admin-only routes
  { path: '/app/team', allowedRoles: ['admin'], defaultRedirect: '/app/dashboard' },
  { path: '/app/settings', allowedRoles: ['admin'], defaultRedirect: '/app/dashboard' },
  { path: '/app/add-member', allowedRoles: ['admin'], defaultRedirect: '/app/dashboard' },
  
  // Recruiter routes
  { path: '/app/recruiter', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  { path: '/app/recruiter/*', allowedRoles: ['recruiter'], defaultRedirect: '/app/recruiter/dashboard' },
  
  // Shared routes (all roles)
  { path: '/app/profile', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/candidates', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/jobs', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/dashboard' },
  { path: '/app/add-candidate', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/candidates' },
  { path: '/app/add-job', allowedRoles: ['admin', 'user', 'recruiter'], defaultRedirect: '/app/jobs' },
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