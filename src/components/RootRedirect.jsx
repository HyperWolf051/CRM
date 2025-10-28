import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getDefaultDashboard } from '@/utils/routePermissions';

const RootRedirect = () => {
  const { user, isAuthenticated, isLoading, forceLogout, restoreLastPage } = useAuth();
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleRootRedirect = async () => {
      try {
        // Wait for auth loading to complete
        if (isLoading) {
          return;
        }

        // Check if user is authenticated and has valid session
        if (isAuthenticated && user) {
          // User is authenticated, try to restore last page
          const restorablePage = restoreLastPage();
          
          if (restorablePage) {
            // Valid last page found, redirect there
            setRedirectTarget(restorablePage);
          } else {
            // No valid last page, redirect to appropriate dashboard
            const defaultDashboard = getDefaultDashboard(user.role);
            setRedirectTarget(defaultDashboard);
          }
        } else {
          // User is not authenticated
          // Check if this is an explicit logout (clear last page)
          const urlParams = new URLSearchParams(window.location.search);
          const isExplicitLogout = urlParams.get('logout') === 'true';
          
          if (isExplicitLogout) {
            // Force logout will clear authentication and last page data
            forceLogout();
          } else {
            // Regular root access - just clear auth but preserve last page for development
            forceLogout();
          }
          
          setRedirectTarget('/login');
        }
      } catch (error) {
        // Handle any errors gracefully
        if (process.env.NODE_ENV === 'development') {
          console.error('Error in RootRedirect:', error);
        }
        
        // Fallback to safe behavior
        forceLogout();
        setRedirectTarget('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleRootRedirect();
  }, [isAuthenticated, user, isLoading, forceLogout, restoreLastPage]);

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