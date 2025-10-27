import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const RootRedirect = () => {
  const { forceLogout } = useAuth();

  // Clear authentication data when accessing root path
  useEffect(() => {
    forceLogout();
  }, [forceLogout]);

  // Always redirect to login page when accessing root path
  return <Navigate to="/login" replace />;
};

export default RootRedirect;