import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthAPI } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // In development, clear auth data on hot reload to prevent auto-login
        if (import.meta.env.DEV) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isDemoMode');
          setIsLoading(false);
          return;
        }
        
        const storedToken = localStorage.getItem('authToken');
        const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
        
        if (storedToken) {
          setToken(storedToken);
          
          if (isDemoMode) {
            // Demo mode - determine user based on stored token
            let demoUser;
            
            if (storedToken.includes('admin')) {
              demoUser = {
                id: 'demo-user-admin',
                name: 'Company Admin',
                email: 'admin@crm.com',
                avatar: null,
                role: 'admin',
                dashboardType: 'crm',
                isDemo: true
              };
            } else if (storedToken.includes('recruiter')) {
              demoUser = {
                id: 'demo-user-recruiter',
                name: 'Recruiter Agent',
                email: 'demo@crm.com',
                avatar: null,
                role: 'recruiter',
                dashboardType: 'recruiter',
                isDemo: true
              };
            } else {
              // Default to sales user
              demoUser = {
                id: 'demo-user-user',
                name: 'Sales User',
                email: 'sales@crm.com',
                avatar: null,
                role: 'user',
                isDemo: true
              };
            }
            
            setUser(demoUser);
            setIsAuthenticated(true);
          } else {
            // Real mode - fetch user data from API
            const response = await AuthAPI.me();
            setUser(response.data);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('isDemoMode');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Login method
  const login = useCallback(async (email, password) => {
    // Check for demo credentials first
    const demoCredentials = [
      { email: 'admin@crm.com', password: 'admin123', name: 'Company Admin', role: 'admin', dashboardType: 'crm' },
      { email: 'sales@crm.com', password: 'sales123', name: 'Sales User', role: 'user' }, // No restriction
      { email: 'demo@crm.com', password: 'demo123', name: 'Recruiter Agent', role: 'recruiter', dashboardType: 'recruiter' }
    ];

    const demoUser = demoCredentials.find(cred => cred.email === email && cred.password === password);
    
    if (demoUser) {
      // Demo login
      const demoToken = 'demo-token-' + Date.now();
      const userData = {
        id: 'demo-user-' + demoUser.role,
        name: demoUser.name,
        email: demoUser.email,
        avatar: null,
        role: demoUser.role,
        dashboardType: demoUser.dashboardType,
        isDemo: true
      };
      
      // Store demo token and flag
      localStorage.setItem('authToken', demoToken);
      localStorage.setItem('isDemoMode', 'true');
      
      // Update state
      setToken(demoToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    }

    // Real API login
    try {
      const response = await AuthAPI.login(email, password);
      const { token: authToken, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', authToken);
      
      // Update state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  // Demo login method
  const loginAsDemo = useCallback(() => {
    const demoUser = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@crm.com',
      avatar: null,
      role: 'user',
      isDemo: true
    };
    
    const demoToken = 'demo-token-' + Date.now();
    
    // Store demo token
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('isDemoMode', 'true');
    
    // Update state
    setToken(demoToken);
    setUser(demoUser);
    setIsAuthenticated(true);
    
    return { success: true };
  }, []);

  // Register method
  const register = useCallback(async (name, email, password) => {
    try {
      const response = await AuthAPI.register({ name, email, password });
      const { token: authToken, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', authToken);
      
      // Update state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  // Logout method
  const logout = useCallback(async () => {
    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
    
    try {
      // Only call API if not in demo mode
      if (!isDemoMode) {
        await AuthAPI.logout();
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('isDemoMode');
      
      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Force logout method - clears all data without API call
  const forceLogout = useCallback(() => {
    // Clear all localStorage data
    localStorage.removeItem('authToken');
    localStorage.removeItem('isDemoMode');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update user method
  const updateUser = useCallback(async (userData) => {
    try {
      const response = await AuthAPI.me(); // Get updated user data
      setUser(response.data);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user.';
      return { success: false, error: message };
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forceLogout,
    updateUser,
    loginAsDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
