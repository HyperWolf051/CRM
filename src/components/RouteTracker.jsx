/**
 * RouteTracker component for monitoring navigation changes
 * and storing current page in last page memory system
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLastPageMemory } from '@/hooks/useLastPageMemory';
import { useAuth } from '@/context/AuthContext';

const RouteTracker = () => {
  const location = useLocation();
  const { setLastPage } = useLastPageMemory();
  const { user, isAuthenticated } = useAuth();
  const previousPathRef = useRef(null);

  useEffect(() => {
    // Only track routes when user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const currentPath = location.pathname;

    // Avoid duplicate tracking for the same path
    if (previousPathRef.current === currentPath) {
      return;
    }

    // Only track valid application routes
    if (isValidApplicationRoute(currentPath)) {
      try {
        setLastPage(currentPath);
        previousPathRef.current = currentPath;
        
        // Development mode logging
        if (process.env.NODE_ENV === 'development') {
          console.log(`[RouteTracker] Tracked page: ${currentPath}`);
        }
      } catch (error) {
        // Handle any errors in page tracking gracefully
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RouteTracker] Failed to track page:', currentPath, error);
        }
      }
    }
  }, [location.pathname, isAuthenticated, user, setLastPage]);

  // Handle component unmount - ensure we don't leave stale references
  useEffect(() => {
    return () => {
      previousPathRef.current = null;
    };
  }, []);

  // This component doesn't render anything
  return null;
};

/**
 * Check if a route should be tracked for last page memory
 */
const isValidApplicationRoute = (path) => {
  // Don't track auth-related routes
  if (path.includes('/login') || path.includes('/register') || path === '/') {
    return false;
  }

  // Only track routes that start with /app/
  if (!path.startsWith('/app/')) {
    return false;
  }

  // Don't track certain utility routes
  const excludedRoutes = [
    '/app/404',
    '/app/error',
    '/app/loading',
    '/app/not-found'
  ];

  if (excludedRoutes.some(excluded => path.startsWith(excluded))) {
    return false;
  }

  // Don't track routes with suspicious patterns that might indicate errors
  if (path.includes('undefined') || path.includes('null') || path.includes('//')) {
    return false;
  }

  // Validate that the path doesn't contain invalid characters
  const invalidChars = ['<', '>', '"', '\'', '&'];
  if (invalidChars.some(char => path.includes(char))) {
    return false;
  }

  return true;
};

export default RouteTracker;