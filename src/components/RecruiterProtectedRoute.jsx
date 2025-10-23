import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';

const RecruiterProtectedRoute = ({ children }) => {
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

  // Check if user is using demo credentials (any demo account)
  const isDemoUser = user?.isDemo === true;

  // If not a demo user, show access denied and redirect
  if (!isDemoUser) {
    // Show toast notification
    useEffect(() => {
      showToast({
        type: 'error',
        title: 'Access Restricted',
        message: 'The Recruiter Dashboard is only available for demo accounts. Please use demo@crm.com to access this feature.',
        duration: 6000
      });
    }, [showToast]);

    return <Navigate to="/app/dashboard" replace />;
  }

  // If demo user, allow access
  return children;
};

export default RecruiterProtectedRoute;