import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect based on authentication status
  return <Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />;
};

export default RootRedirect;