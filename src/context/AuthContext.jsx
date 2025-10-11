import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
          setToken(storedToken);
          
          // Use stored user data
          const storedUser = localStorage.getItem('userData');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
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
    // Check for demo credentials
    const demoCredentials = [
      { email: 'admin@crm.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { email: 'sales@crm.com', password: 'sales123', name: 'Sales User', role: 'user' },
      { email: 'demo@crm.com', password: 'demo123', name: 'Demo User', role: 'user' },
      { email: 'john@crm.com', password: 'john123', name: 'John Doe', role: 'user' }
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
        isDemo: true
      };
      
      // Store demo token and user data
      localStorage.setItem('authToken', demoToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setToken(demoToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid credentials. Please use demo accounts.' };
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
    
    // Store demo token and user data
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('userData', JSON.stringify(demoUser));
    
    // Update state
    setToken(demoToken);
    setUser(demoUser);
    setIsAuthenticated(true);
    
    return { success: true };
  }, []);

  // Register method
  const register = useCallback(async (name, email, password) => {
    // Simple demo registration
    const userData = {
      id: 'user-' + Date.now(),
      name,
      email,
      avatar: null,
      role: 'user',
      isDemo: true
    };
    
    const authToken = 'token-' + Date.now();
    
    // Store token and user data
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update state
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    return { success: true };
  }, []);

  // Logout method
  const logout = useCallback(async () => {
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update user method
  const updateUser = useCallback(async (userData) => {
    // Update user data in localStorage and state
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    return { success: true };
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
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
