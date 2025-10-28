/**
 * useLastPageMemory hook for tracking and restoring user's last visited page
 */

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import storageManager from '@/utils/storageManager';
import { hasRoutePermission, getRedirectRoute, getDefaultDashboard, validateRouteAccess, validateAndSanitizeRoute } from '@/utils/routePermissions';
import lastPageMemoryMonitor from '@/utils/lastPageMemoryMonitor';

const STORAGE_KEY_PREFIX = 'lastVisitedPage';

/**
 * Generate user-specific storage key
 */
const generateStorageKey = (userId) => {
  return `${STORAGE_KEY_PREFIX}_${userId}`;
};

/**
 * Custom hook for last page memory functionality
 */
export const useLastPageMemory = () => {
  const { user } = useAuth();

  /**
   * Store current page in storage with comprehensive validation and error handling
   */
  const setLastPage = useCallback((path) => {
    const context = {
      path,
      userId: user?.id,
      userRole: user?.role,
      operation: 'setLastPage'
    };

    try {
      // Validate user context
      if (!user || !user.id || !user.role) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Cannot store page - invalid user context:', { user: !!user, userId: user?.id, userRole: user?.role });
        }
        return false;
      }

      // Validate path parameter
      if (!path || typeof path !== 'string') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Cannot store page - invalid path:', path);
        }
        return false;
      }

      // Validate and sanitize the path
      const routeValidation = validateAndSanitizeRoute(path, user.role);
      if (!routeValidation.isValid) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Cannot store invalid route:', routeValidation.error);
        }
        return false;
      }

      const sanitizedPath = routeValidation.sanitizedPath;

      // Don't store login page or other auth-related pages
      if (sanitizedPath.includes('/login') || sanitizedPath.includes('/register') || sanitizedPath === '/') {
        return false;
      }

      // Don't store if path is not a valid app route
      if (!sanitizedPath.startsWith('/app/')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Cannot store non-app route:', sanitizedPath);
        }
        return false;
      }

      // Don't store error or utility pages
      const excludedPaths = ['/app/404', '/app/error', '/app/loading', '/app/not-found'];
      if (excludedPaths.some(excluded => sanitizedPath.startsWith(excluded))) {
        return false;
      }

      // Check if user has permission to access this route
      if (!hasRoutePermission(sanitizedPath, user.role)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Cannot store route user lacks permission for:', sanitizedPath);
        }
        return false;
      }

      // Create page state object
      const lastPageState = {
        path: sanitizedPath,
        timestamp: Date.now(),
        userRole: user.role,
        userId: user.id
      };

      // Validate the page state structure before storing
      if (!isValidPageState(lastPageState)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Invalid page state structure:', lastPageState);
        }
        return false;
      }

      const storageKey = generateStorageKey(user.id);
      let success;
      
      try {
        success = storageManager.set(storageKey, lastPageState);
      } catch (storageError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Storage error while setting last page:', storageError);
        }
        return false;
      }

      if (!success) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Failed to store last page:', sanitizedPath);
        }
        return false;
      }

      // Log successful tracking
      lastPageMemoryMonitor.logSuccess('pageTracked', {
        path: sanitizedPath,
        userRole: user.role,
        userId: user.id
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[useLastPageMemory] Successfully stored last page:', sanitizedPath);
      }

      return true;
    } catch (error) {
      // Log error to monitor
      lastPageMemoryMonitor.logError(error, {
        ...context,
        operation: 'setLastPage'
      });

      // Log comprehensive error information
      if (process.env.NODE_ENV === 'development') {
        console.group('[useLastPageMemory] Critical error in setLastPage');
        console.error('Error:', error);
        console.log('Context:', context);
        console.log('Stack:', error.stack);
        console.groupEnd();
      }
      
      return false;
    }
  }, [user]);

  /**
   * Get stored page from storage
   */
  const getLastPage = useCallback(() => {
    if (!user) {
      return null;
    }

    const storageKey = generateStorageKey(user.id);
    const lastPageState = storageManager.get(storageKey);

    if (!lastPageState) {
      return null;
    }

    // Verify the stored page is for the current user
    if (lastPageState.userId !== user.id) {
      // Clear invalid data
      storageManager.remove(storageKey);
      return null;
    }

    return lastPageState.path;
  }, [user]);

  /**
   * Clear stored page from storage
   */
  const clearLastPage = useCallback(() => {
    if (!user) {
      return;
    }

    const storageKey = generateStorageKey(user.id);
    storageManager.remove(storageKey);
  }, [user]);

  /**
   * Get restorable page with comprehensive validation and error handling
   */
  const getRestorablePage = useCallback((userRole = null) => {
    const context = {
      userRole: userRole || user?.role,
      userId: user?.id,
      operation: 'getRestorablePage'
    };

    try {
      const currentUserRole = userRole || user?.role;
      
      if (!currentUserRole) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] No user role available for page restoration');
        }
        return null;
      }

      if (!user?.id) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] No user ID available for page restoration');
        }
        return getDefaultDashboard(currentUserRole);
      }

      let lastPage;
      try {
        lastPage = getLastPage();
      } catch (getPageError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Error getting last page:', getPageError);
        }
        // Clear potentially corrupted data and return default
        try {
          clearLastPage();
        } catch (clearError) {
          // Ignore clear errors
        }
        return getDefaultDashboard(currentUserRole);
      }
      
      if (!lastPage) {
        return null;
      }

      let storedPageState;
      try {
        storedPageState = storageManager.get(generateStorageKey(user.id));
      } catch (storageError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Storage error getting page state:', storageError);
        }
        // Clear corrupted storage and return default
        try {
          clearLastPage();
        } catch (clearError) {
          // Ignore clear errors
        }
        return getDefaultDashboard(currentUserRole);
      }
      
      // Validate stored page state structure
      if (storedPageState && !isValidPageState(storedPageState)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useLastPageMemory] Invalid stored page state structure, clearing');
        }
        clearLastPage();
        return getDefaultDashboard(currentUserRole);
      }

      // Check if the stored page is too old (older than 7 days)
      if (storedPageState) {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (storedPageState.timestamp < sevenDaysAgo) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useLastPageMemory] Stored page expired, clearing');
          }
          clearLastPage();
          return getDefaultDashboard(currentUserRole);
        }

        // Check for future timestamps (potential tampering or clock issues)
        if (storedPageState.timestamp > Date.now() + (5 * 60 * 1000)) { // 5 minutes tolerance
          if (process.env.NODE_ENV === 'development') {
            console.warn('[useLastPageMemory] Future timestamp detected, clearing stored page');
          }
          clearLastPage();
          return getDefaultDashboard(currentUserRole);
        }
      }

      // Validate and sanitize the route
      let validation;
      try {
        validation = validateRouteAccess(lastPage, currentUserRole, user.id);
      } catch (validationError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Route validation error:', validationError);
        }
        clearLastPage();
        return getDefaultDashboard(currentUserRole);
      }
      
      if (!validation.allowed) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useLastPageMemory] Route access denied: ${validation.reason}, redirecting to: ${validation.redirectTo}`);
        }
        
        // Clear invalid page
        clearLastPage();
        
        // Return appropriate redirect based on validation reason
        switch (validation.reason) {
          case 'role_mismatch':
          case 'admin_required':
          case 'insufficient_permissions':
          case 'invalid_parameters':
          case 'route_not_found':
          case 'malformed_path':
          case 'invalid_path':
          case 'invalid_role':
            return validation.redirectTo;
          default:
            return getDefaultDashboard(currentUserRole);
        }
      }

      // Handle role changes - if user's role has changed since storing the page
      if (storedPageState && storedPageState.userRole !== currentUserRole) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useLastPageMemory] User role changed from ${storedPageState.userRole} to ${currentUserRole}, re-validating`);
        }

        // Re-validate with new role
        let newRoleValidation;
        try {
          newRoleValidation = validateRouteAccess(lastPage, currentUserRole, user.id);
        } catch (revalidationError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useLastPageMemory] Re-validation error:', revalidationError);
          }
          clearLastPage();
          return getDefaultDashboard(currentUserRole);
        }
        
        if (!newRoleValidation.allowed) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[useLastPageMemory] Page no longer accessible with new role, clearing`);
          }
          clearLastPage();
          return getDefaultDashboard(currentUserRole);
        }
        
        // Update stored page state with new role
        try {
          const updatedPageState = {
            ...storedPageState,
            userRole: currentUserRole,
            timestamp: Date.now() // Update timestamp to reflect role change
          };
          
          const storageKey = generateStorageKey(user.id);
          const updateSuccess = storageManager.set(storageKey, updatedPageState);
          
          if (!updateSuccess && process.env.NODE_ENV === 'development') {
            console.warn('[useLastPageMemory] Failed to update stored page state with new role');
          }
        } catch (updateError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useLastPageMemory] Error updating page state with new role:', updateError);
          }
          // Continue anyway, the page is still valid
        }
      }

      // Log successful restoration
      lastPageMemoryMonitor.logSuccess('pageRestored', {
        path: lastPage,
        userRole: currentUserRole,
        userId: user.id
      });

      return lastPage;
    } catch (error) {
      // Log error to monitor
      lastPageMemoryMonitor.logError(error, {
        ...context,
        operation: 'getRestorablePage'
      });

      // Log comprehensive error information
      if (process.env.NODE_ENV === 'development') {
        console.group('[useLastPageMemory] Critical error in getRestorablePage');
        console.error('Error:', error);
        console.log('Context:', context);
        console.log('Stack:', error.stack);
        console.groupEnd();
      }
      
      // Clear potentially corrupted data
      try {
        clearLastPage();
      } catch (clearError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLastPageMemory] Failed to clear corrupted data:', clearError);
        }
      }
      
      // Return safe default
      return getDefaultDashboard(userRole || user?.role || 'user');
    }
  }, [user, getLastPage, clearLastPage]);

  /**
   * Validate page state structure
   */
  const isValidPageState = (pageState) => {
    return (
      pageState &&
      typeof pageState === 'object' &&
      typeof pageState.path === 'string' &&
      typeof pageState.timestamp === 'number' &&
      typeof pageState.userRole === 'string' &&
      typeof pageState.userId === 'string' &&
      pageState.path.length > 0 &&
      pageState.timestamp > 0 &&
      pageState.userRole.length > 0 &&
      pageState.userId.length > 0
    );
  };

  /**
   * Check if storage is available
   */
  const isStorageAvailable = useCallback(() => {
    return storageManager.isAvailable();
  }, []);

  /**
   * Handle role changes by validating and potentially clearing stored pages
   */
  const handleRoleChange = useCallback((newRole, oldRole) => {
    if (!user || newRole === oldRole) {
      return;
    }

    const lastPage = getLastPage();
    
    if (lastPage) {
      const validation = validateRouteAccess(lastPage, newRole, user.id);
      
      if (!validation.allowed) {
        // Clear incompatible stored page
        clearLastPage();
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Cleared incompatible stored page "${lastPage}" due to role change from "${oldRole}" to "${newRole}"`);
        }
      } else {
        // Update stored page state with new role
        const storageKey = generateStorageKey(user.id);
        const storedPageState = storageManager.get(storageKey);
        
        if (storedPageState) {
          const updatedPageState = {
            ...storedPageState,
            userRole: newRole,
            timestamp: Date.now()
          };
          
          storageManager.set(storageKey, updatedPageState);
        }
      }
    }
  }, [user, getLastPage, clearLastPage]);

  /**
   * Get storage information for debugging
   */
  const getStorageInfo = useCallback(() => {
    return storageManager.getStorageInfo();
  }, []);

  /**
   * Run comprehensive diagnostics
   */
  const runDiagnostics = useCallback(async () => {
    if (!user) {
      return { error: 'No user context available' };
    }

    try {
      return await lastPageMemoryMonitor.runDiagnostics(user.id, user.role);
    } catch (error) {
      lastPageMemoryMonitor.logError(error, {
        operation: 'runDiagnostics',
        userId: user.id,
        userRole: user.role
      });
      return { error: error.message };
    }
  }, [user]);

  /**
   * Get system health status
   */
  const getHealthStatus = useCallback(() => {
    return lastPageMemoryMonitor.getHealthStatus();
  }, []);

  return {
    setLastPage,
    getLastPage,
    clearLastPage,
    getRestorablePage,
    handleRoleChange,
    isStorageAvailable,
    getStorageInfo,
    runDiagnostics,
    getHealthStatus
  };
};