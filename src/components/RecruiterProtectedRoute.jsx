import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';

const RecruiterProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  // Check if user has access to recruiter dashboard
  const hasRecruiterAccess = user?.dashboardType === 'recruiter' || user?.email === 'sales@crm.com';

  // Use effect to show toast for restricted access
  useEffect(() => {
    if (!hasRecruiterAccess && isAuthenticated && !isLoading) {
      showToast({
        type: 'error',
        title: 'Access Restricted',
        message: 'You can only access the CRM Dashboard. Redirecting you now.',
        duration: 4000
      });
    }
  }, [hasRecruiterAccess, isAuthenticated, isLoading, showToast]);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have recruiter access, redirect to CRM dashboard
  if (!hasRecruiterAccess) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // If demo user, allow access
  return children;
};

export default RecruiterProtectedRoute;