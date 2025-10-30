import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthAPI } from '@/services/api';
import storageManager from '@/utils/storageManager';
import { hasRoutePermission, getDefaultDashboard } from '@/utils/routePermissions';
import { devConsole } from '@/utils/console-wrapper';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisitedPage, setLastVisitedPage] = useState(null);
  const [shouldRestoreLastPage, setShouldRestoreLastPage] = useState(false);

  // Generate user-specific storage key for last page
  const generateLastPageStorageKey = useCallback((userId) => {
    return `lastVisitedPage_${userId}`;
  }, []);

  // Load token from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // In development mode, we want to preserve authentication across page refreshes
        // Only clear auth data if explicitly requested (e.g., via a dev flag)
        if (import.meta.env.DEV) {
          // Check if there's an explicit flag to clear auth in development
          const shouldClearAuth = sessionStorage.getItem('__dev_clear_auth__') === 'true';
          
          if (shouldClearAuth) {
            // Clear the flag and proceed with auth clearing
            sessionStorage.removeItem('__dev_clear_auth__');
            
            // Check if there was a user before clearing auth
            const storedToken = localStorage.getItem('authToken');
            const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
            let previousUser = null;
            
            if (storedToken && isDemoMode) {
              // Determine previous user from stored token for last page preservation
              if (storedToken.includes('token-admin')) {
                previousUser = {
                  id: 'demo-user-admin',
                  role: 'admin'
                };
              } else if (storedToken.includes('token-recruiter')) {
                previousUser = {
                  id: 'demo-user-recruiter',
                  role: 'recruiter'
                };
              } else if (storedToken.includes('token-user')) {
                previousUser = {
                  id: 'demo-user-user',
                  role: 'user'
                };
              } else {
                // Fallback for old tokens
                previousUser = {
                  id: 'demo-user-user',
                  role: 'user'
                };
              }
            }
            
            // Clear auth data but preserve last page memory
            localStorage.removeItem('authToken');
            localStorage.removeItem('isDemoMode');
            
            // If there was a previous user, check for stored last page
            if (previousUser) {
              const storageKey = generateLastPageStorageKey(previousUser.id);
              const lastPageState = storageManager.get(storageKey);
              
              if (lastPageState && lastPageState.userId === previousUser.id) {
                // Validate the stored page is still accessible for the user role
                if (hasRoutePermission(lastPageState.path, previousUser.role)) {
                  setLastVisitedPage(lastPageState.path);
                  // Don't set shouldRestoreLastPage here - wait for actual authentication
                }
              }
            }
            
            setIsLoading(false);
            return;
          }
          
          // In development mode without the clear flag, proceed with normal auth loading
          // This allows authentication to persist across page refreshes
        }
        
        const storedToken = localStorage.getItem('authToken');
        const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
        
        if (storedToken) {
          setToken(storedToken);
          
          if (isDemoMode) {
            // Demo mode - determine user based on stored token
            let demoUser;
            
            if (storedToken.includes('token-admin')) {
              demoUser = {
                id: 'demo-user-admin',
                name: 'Company Admin',
                email: 'admin@crm.com',
                avatar: null,
                role: 'admin',
                dashboardType: 'crm',
                isDemo: true
              };
            } else if (storedToken.includes('token-recruiter')) {
              demoUser = {
                id: 'demo-user-recruiter',
                name: 'Recruiter Agent',
                email: 'demo@crm.com',
                avatar: null,
                role: 'recruiter',
                dashboardType: 'recruiter',
                isDemo: true
              };
            } else if (storedToken.includes('token-user')) {
              // Sales user
              demoUser = {
                id: 'demo-user-user',
                name: 'Sales User',
                email: 'sales@crm.com',
                avatar: null,
                role: 'user',
                isDemo: true
              };
            } else {
              // Fallback for old tokens or unknown format
              console.warn('Unknown token format, defaulting to user role:', storedToken);
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
  }, [generateLastPageStorageKey]);

  // Login method
  const login = useCallback(async (email, password) => {
    // ========================================
    // DEMO AUTHENTICATION - REMOVE IN PRODUCTION
    // ========================================
    // Check for demo credentials first
    const demoCredentials = [
      { email: 'admin@crm.com', password: 'admin123', name: 'Company Admin', role: 'admin', dashboardType: 'crm' },
      { email: 'sales@crm.com', password: 'sales123', name: 'Sales User', role: 'user' }, // No restriction
      { email: 'demo@crm.com', password: 'demo123', name: 'Recruiter Agent', role: 'recruiter', dashboardType: 'recruiter' }
    ];

    const demoUser = demoCredentials.find(cred => cred.email === email && cred.password === password);
    
    if (demoUser) {
      // Demo login - include role in token for proper detection on refresh
      const demoToken = `demo-token-${demoUser.role}-${Date.now()}`;
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
      
      // Check for stored last page and validate permissions
      const storageKey = generateLastPageStorageKey(userData.id);
      const lastPageState = storageManager.get(storageKey);
      
      if (lastPageState && lastPageState.userId === userData.id) {
        const storedPage = lastPageState.path;
        
        // Validate user has permission to access the stored page
        if (hasRoutePermission(storedPage, userData.role)) {
          // Check if the stored page is not too old (older than 7 days)
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          if (lastPageState.timestamp >= sevenDaysAgo) {
            setLastVisitedPage(storedPage);
            setShouldRestoreLastPage(true);
            return { success: true, redirectTo: storedPage };
          }
        }
        
        // Clear invalid or expired page
        storageManager.remove(storageKey);
      }
      
      // No valid last page, use default dashboard
      const defaultDashboard = getDefaultDashboard(userData.role);
      return { success: true, redirectTo: defaultDashboard };
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
      
      // Check for stored last page and validate permissions
      const storageKey = generateLastPageStorageKey(userData.id);
      const lastPageState = storageManager.get(storageKey);
      
      if (lastPageState && lastPageState.userId === userData.id) {
        const storedPage = lastPageState.path;
        
        // Validate user has permission to access the stored page
        if (hasRoutePermission(storedPage, userData.role)) {
          // Check if the stored page is not too old (older than 7 days)
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          if (lastPageState.timestamp >= sevenDaysAgo) {
            setLastVisitedPage(storedPage);
            setShouldRestoreLastPage(true);
            return { success: true, redirectTo: storedPage };
          }
        }
        
        // Clear invalid or expired page
        storageManager.remove(storageKey);
      }
      
      // No valid last page, use default dashboard
      const defaultDashboard = getDefaultDashboard(userData.role);
      return { success: true, redirectTo: defaultDashboard };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  }, [generateLastPageStorageKey]);

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
    
    const demoToken = `demo-token-${demoUser.role}-${Date.now()}`;
    
    // Store demo token
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('isDemoMode', 'true');
    
    // Update state
    setToken(demoToken);
    setUser(demoUser);
    setIsAuthenticated(true);
    
    // Check for stored last page and validate permissions
    const storageKey = generateLastPageStorageKey(demoUser.id);
    const lastPageState = storageManager.get(storageKey);
    
    if (lastPageState && lastPageState.userId === demoUser.id) {
      const storedPage = lastPageState.path;
      
      // Validate user has permission to access the stored page
      if (hasRoutePermission(storedPage, demoUser.role)) {
        // Check if the stored page is not too old (older than 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (lastPageState.timestamp >= sevenDaysAgo) {
          setLastVisitedPage(storedPage);
          setShouldRestoreLastPage(true);
          return { success: true, redirectTo: storedPage };
        }
      }
      
      // Clear invalid or expired page
      storageManager.remove(storageKey);
    }
    
    // No valid last page, use default dashboard
    const defaultDashboard = getDefaultDashboard(demoUser.role);
    return { success: true, redirectTo: defaultDashboard };
  }, [generateLastPageStorageKey]);

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
      devConsole.error('Logout API call failed:', error);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('isDemoMode');
      
      // In development mode, preserve last page state for better UX
      // In production, clear everything including last page state
      if (!import.meta.env.DEV && user) {
        const storageKey = generateLastPageStorageKey(user.id);
        storageManager.remove(storageKey);
      }
      
      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLastVisitedPage(null);
      setShouldRestoreLastPage(false);
    }
  }, [user, generateLastPageStorageKey]);

  // Force logout method - clears all data without API call
  const forceLogout = useCallback(() => {
    // Clear all localStorage data
    localStorage.removeItem('authToken');
    localStorage.removeItem('isDemoMode');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLastVisitedPage(null);
    setShouldRestoreLastPage(false);
  }, []);

  // Development helper to clear auth on next reload
  const clearAuthOnNextReload = useCallback(() => {
    if (import.meta.env.DEV) {
      sessionStorage.setItem('__dev_clear_auth__', 'true');
      console.log('🔄 Auth will be cleared on next page reload');
      window.location.reload();
    }
  }, []);

  // Expose helper to window in development for easy access
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      window.clearAuth = clearAuthOnNextReload;
      console.log('🛠️ Development helper available: window.clearAuth() to clear authentication');
    }
  }, [clearAuthOnNextReload]);

  // Get stored last page for current user
  const getStoredLastPage = useCallback(() => {
    if (!user) return null;
    
    const storageKey = generateLastPageStorageKey(user.id);
    const lastPageState = storageManager.get(storageKey);
    
    if (!lastPageState || lastPageState.userId !== user.id) {
      return null;
    }
    
    return lastPageState.path;
  }, [user, generateLastPageStorageKey]);

  // Restore last page method
  const restoreLastPage = useCallback(() => {
    if (!user) {
      setShouldRestoreLastPage(false);
      return null;
    }

    const storedPage = getStoredLastPage();
    
    if (!storedPage) {
      setShouldRestoreLastPage(false);
      return getDefaultDashboard(user.role);
    }

    // Validate user has permission to access the stored page
    if (!hasRoutePermission(storedPage, user.role)) {
      // Clear invalid page
      const storageKey = generateLastPageStorageKey(user.id);
      storageManager.remove(storageKey);
      setShouldRestoreLastPage(false);
      return getDefaultDashboard(user.role);
    }

    // Check if the stored page is too old (older than 7 days)
    const storageKey = generateLastPageStorageKey(user.id);
    const lastPageState = storageManager.get(storageKey);
    
    if (lastPageState) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (lastPageState.timestamp < sevenDaysAgo) {
        storageManager.remove(storageKey);
        setShouldRestoreLastPage(false);
        return getDefaultDashboard(user.role);
      }
    }

    setLastVisitedPage(storedPage);
    setShouldRestoreLastPage(true);
    return storedPage;
  }, [user, getStoredLastPage, generateLastPageStorageKey]);

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
    lastVisitedPage,
    shouldRestoreLastPage,
    restoreLastPage,
    clearAuthOnNextReload, // Development helper
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
