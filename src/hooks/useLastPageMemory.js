/**
 * useLastPageMemory hook for tracking and restoring user's last visited page
 */

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import storageManager from '@/utils/storageManager';
import { hasRoutePermission, getRedirectRoute, getDefaultDashboard } from '@/utils/routePermissions';

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
   * Store current page in storage
   */
  const setLastPage = useCallback((path) => {
    if (!user || !path) {
      return;
    }

    // Don't store login page or other auth-related pages
    if (path.includes('/login') || path.includes('/register') || path === '/') {
      return;
    }

    // Don't store if path is not a valid app route
    if (!path.startsWith('/app/')) {
      return;
    }

    const lastPageState = {
      path,
      timestamp: Date.now(),
      userRole: user.role,
      userId: user.id
    };

    const storageKey = generateStorageKey(user.id);
    const success = storageManager.set(storageKey, lastPageState);

    if (!success && process.env.NODE_ENV === 'development') {
      console.warn('Failed to store last page:', path);
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
   * Get restorable page with permission validation
   */
  const getRestorablePage = useCallback((userRole = null) => {
    const currentUserRole = userRole || user?.role;
    
    if (!currentUserRole) {
      return null;
    }

    const lastPage = getLastPage();
    
    if (!lastPage) {
      return null;
    }

    // Check if user has permission to access the stored page
    if (!hasRoutePermission(lastPage, currentUserRole)) {
      // Clear invalid page and return appropriate redirect
      clearLastPage();
      return getRedirectRoute(lastPage, currentUserRole);
    }

    // Validate that the route still makes sense for the user's role
    const storedPageState = storageManager.get(generateStorageKey(user?.id));
    
    if (storedPageState && storedPageState.userRole !== currentUserRole) {
      // User's role has changed, validate if the page is still accessible
      if (!hasRoutePermission(lastPage, currentUserRole)) {
        clearLastPage();
        return getDefaultDashboard(currentUserRole);
      }
    }

    // Check if the stored page is too old (older than 7 days)
    if (storedPageState) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (storedPageState.timestamp < sevenDaysAgo) {
        clearLastPage();
        return getDefaultDashboard(currentUserRole);
      }
    }

    return lastPage;
  }, [user, getLastPage, clearLastPage]);

  /**
   * Check if storage is available
   */
  const isStorageAvailable = useCallback(() => {
    return storageManager.isAvailable();
  }, []);

  /**
   * Get storage information for debugging
   */
  const getStorageInfo = useCallback(() => {
    return storageManager.getStorageInfo();
  }, []);

  return {
    setLastPage,
    getLastPage,
    clearLastPage,
    getRestorablePage,
    isStorageAvailable,
    getStorageInfo
  };
};