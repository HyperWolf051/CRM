import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getDefaultDashboard, validateAndSanitizeRoute } from '@/utils/routePermissions';
import { useLastPageMemory } from '@/hooks/useLastPageMemory';

const RootRedirect = () => {
  const { user, isAuthenticated, isLoading, forceLogout, restoreLastPage } = useAuth();
  const { getLastPage, clearLastPage } = useLastPageMemory();
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleRootRedirect = async () => {
      try {
        // Wait for auth loading to complete
        if (isLoading) {
          return;
        }

        // Check URL parameters for explicit logout
        const urlParams = new URLSearchParams(window.location.search);
        const isExplicitLogout = urlParams.get('logout') === 'true';

        // Check if user is authenticated and has valid session
        if (isAuthenticated && user) {
          // User is authenticated - check for stored last page before proceeding
          let targetPage = null;

          // First, try to get last page from AuthContext (handles user-specific storage)
          const contextLastPage = restoreLastPage();
          
          if (contextLastPage) {
            // Validate the page from context
            const validation = validateAndSanitizeRoute(contextLastPage, user.role);
            if (validation.isValid) {
              targetPage = validation.sanitizedPath;
            }
          }

          // If no valid page from context, check direct storage
          if (!targetPage) {
            const storedLastPage = getLastPage();
            if (storedLastPage) {
              const validation = validateAndSanitizeRoute(storedLastPage, user.role);
              if (validation.isValid) {
                targetPage = validation.sanitizedPath;
              } else {
                // Clear invalid stored page
                clearLastPage();
              }
            }
          }

          // Set redirect target
          if (targetPage) {
            setRedirectTarget(targetPage);
          } else {
            // No valid last page, redirect to appropriate dashboard
            const defaultDashboard = getDefaultDashboard(user.role);
            setRedirectTarget(defaultDashboard);
          }
        } else {
          // User is not authenticated
          if (isExplicitLogout) {
            // Explicit logout - clear all data including last page memory
            forceLogout();
            clearLastPage();
          } else {
            // Fresh visit or session expired - check for stored last page before forcing logout
            const storedLastPage = getLastPage();
            
            if (storedLastPage) {
              // There's a stored last page, but user is not authenticated
              // This could be a fresh browser session or expired session
              // Preserve the last page for when they log back in
              // Only force logout (clear auth) but don't clear last page memory
              forceLogout();
            } else {
              // No stored last page, regular logout behavior
              forceLogout();
            }
          }
          
          setRedirectTarget('/login');
        }
      } catch (error) {
        // Handle any errors gracefully
        if (process.env.NODE_ENV === 'development') {
          console.error('Error in RootRedirect:', error);
        }
        
        // Fallback to safe behavior - clear auth but preserve last page unless explicit logout
        const urlParams = new URLSearchParams(window.location.search);
        const isExplicitLogout = urlParams.get('logout') === 'true';
        
        forceLogout();
        if (isExplicitLogout) {
          clearLastPage();
        }
        
        setRedirectTarget('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleRootRedirect();
  }, [isAuthenticated, user, isLoading, forceLogout, restoreLastPage, getLastPage, clearLastPage]);

  // Show loading state while processing or auth is loading
  if (isProcessing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to determined target
  if (redirectTarget) {
    return <Navigate to={redirectTarget} replace />;
  }

  // Fallback redirect to login
  return <Navigate to="/login" replace />;
};

export default RootRedirect;