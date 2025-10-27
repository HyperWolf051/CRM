/**
 * RouteTracker component for monitoring navigation changes
 * and storing current page in last page memory system
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLastPageMemory } from '@/hooks/useLastPageMemory';
import { useAuth } from '@/context/AuthContext';

const RouteTracker = () => {
  const location = useLocation();
  const { setLastPage } = useLastPageMemory();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only track routes when user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const currentPath = location.pathname;

    // Only track valid application routes
    if (isValidApplicationRoute(currentPath)) {
      setLastPage(currentPath);
    }
  }, [location.pathname, isAuthenticated, user, setLastPage]);

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
    '/app/loading'
  ];

  if (excludedRoutes.some(excluded => path.startsWith(excluded))) {
    return false;
  }

  return true;
};

export default RouteTracker;