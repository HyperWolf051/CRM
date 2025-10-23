import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';

const CrmProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

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

  // Check if user is restricted to recruiter dashboard only
  const isRecruiterOnly = user?.dashboardType === 'recruiter';

  // If recruiter-only user trying to access CRM, redirect to recruiter dashboard
  if (isRecruiterOnly) {
    // Show toast notification
    useEffect(() => {
      showToast({
        type: 'error',
        title: 'Access Restricted',
        message: 'You can only access the Recruiter Dashboard. Redirecting you now.',
        duration: 4000
      });
    }, [showToast]);

    return <Navigate to="/app/recruiter/dashboard" replace />;
  }

  // Allow access for CRM users (admin, sales, or users without restrictions)
  return children;
};

export default CrmProtectedRoute;