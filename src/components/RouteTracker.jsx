/**
 * RouteTracker component for monitoring navigation changes
 * and storing current page in last page memory system with comprehensive error handling
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLastPageMemory } from '@/hooks/useLastPageMemory';
import { useAuth } from '@/context/AuthContext';
import { logRouteError, validateAndSanitizeRoute } from '@/utils/routePermissions';

const RouteTracker = () => {
  const location = useLocation();
  const { setLastPage } = useLastPageMemory();
  const { user, isAuthenticated } = useAuth();
  const previousPathRef = useRef(null);
  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef(0);

  // Error recovery mechanism
  const handleTrackingError = useCallback((error, path) => {
    const now = Date.now();
    const timeSinceLastError = now - lastErrorTimeRef.current;
    
    // Reset error count if it's been more than 5 minutes since last error
    if (timeSinceLastError > 5 * 60 * 1000) {
      errorCountRef.current = 0;
    }
    
    errorCountRef.current++;
    lastErrorTimeRef.current = now;

    // Log error with context
    const errorContext = {
      path,
      userRole: user?.role,
      userId: user?.id,
      errorCount: errorCountRef.current,
      component: 'RouteTracker'
    };

    logRouteError(error, errorContext);

    // If we're getting too many errors, stop tracking temporarily
    if (errorCountRef.current > 10) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[RouteTracker] Too many tracking errors, temporarily disabling route tracking');
      }
      return false;
    }

    return true;
  }, [user]);

  useEffect(() => {
    // Only track routes when user is authenticated
    if (!isAuthenticated || !user) {
      if (process.env.NODE_ENV === 'development' && location.pathname.startsWith('/app/')) {
        console.log('[RouteTracker] Skipping tracking - user not authenticated');
      }
      return;
    }

    // Validate user object
    if (!user.id || !user.role) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RouteTracker] Invalid user object, cannot track routes:', user);
      }
      return;
    }

    const currentPath = location.pathname;

    // Avoid duplicate tracking for the same path
    if (previousPathRef.current === currentPath) {
      return;
    }

    // Skip tracking if we've had too many recent errors
    if (errorCountRef.current > 10) {
      const timeSinceLastError = Date.now() - lastErrorTimeRef.current;
      if (timeSinceLastError < 5 * 60 * 1000) { // 5 minutes
        return;
      } else {
        // Reset error count after cooldown period
        errorCountRef.current = 0;
      }
    }

    // Validate and sanitize the route before tracking
    let routeValidation;
    try {
      routeValidation = validateAndSanitizeRoute(currentPath, user.role);
    } catch (validationError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[RouteTracker] Route validation error:', validationError);
      }
      handleTrackingError(validationError, currentPath);
      return;
    }

    // Only track valid application routes
    if (isValidApplicationRoute(currentPath, routeValidation)) {
      try {
        const trackingResult = setLastPage(currentPath);
        
        if (trackingResult) {
          previousPathRef.current = currentPath;
          
          // Reset error count on successful tracking
          if (errorCountRef.current > 0) {
            errorCountRef.current = 0;
          }
          
          // Development mode logging
          if (process.env.NODE_ENV === 'development') {
            console.log(`[RouteTracker] Successfully tracked page: ${currentPath}`);
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[RouteTracker] Failed to track page (returned false): ${currentPath}`);
          }
        }
      } catch (error) {
        // Handle any errors in page tracking gracefully
        const shouldContinue = handleTrackingError(error, currentPath);
        
        if (!shouldContinue) {
          return;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RouteTracker] Failed to track page:', currentPath, error);
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development' && currentPath.startsWith('/app/')) {
        console.log(`[RouteTracker] Skipping invalid route: ${currentPath}`);
      }
    }
  }, [location.pathname, isAuthenticated, user, setLastPage, handleTrackingError]);

  // Handle component unmount - ensure we don't leave stale references
  useEffect(() => {
    return () => {
      previousPathRef.current = null;
      errorCountRef.current = 0;
      lastErrorTimeRef.current = 0;
    };
  }, []);

  // This component doesn't render anything
  return null;
};

/**
 * Check if a route should be tracked for last page memory with enhanced validation
 */
const isValidApplicationRoute = (path, routeValidation = null) => {
  try {
    // Use pre-computed validation if available
    if (routeValidation) {
      return routeValidation.isValid;
    }

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
      '/app/not-found',
      '/app/unauthorized',
      '/app/maintenance'
    ];

    if (excludedRoutes.some(excluded => path.startsWith(excluded))) {
      return false;
    }

    // Don't track routes with suspicious patterns that might indicate errors
    if (path.includes('undefined') || path.includes('null') || path.includes('//')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RouteTracker] Suspicious route pattern detected:', path);
      }
      return false;
    }

    // Validate that the path doesn't contain invalid characters
    const invalidChars = ['<', '>', '"', '\'', '&', '%3C', '%3E'];
    if (invalidChars.some(char => path.includes(char))) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RouteTracker] Invalid characters in route:', path);
      }
      return false;
    }

    // Check path length (prevent extremely long URLs)
    if (path.length > 500) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RouteTracker] Route too long:', path.length, 'characters');
      }
      return false;
    }

    // Additional validation for route segments
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 10) { // Reasonable limit for route depth
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RouteTracker] Route too deep:', segments.length, 'segments');
      }
      return false;
    }

    // Check for malformed segments
    for (const segment of segments) {
      if (segment.length === 0 || segment === '.' || segment === '..') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RouteTracker] Malformed route segment:', segment);
        }
        return false;
      }
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[RouteTracker] Error validating route:', error);
    }
    return false;
  }
};

export default RouteTracker;