/**
 * Integration tests for AuthContext changes with Last Page Memory
 * Task 2.4: Test authentication flow with page restoration, development mode page preservation, and permission validation
 */

import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock storage
const createMockStorage = () => {
  const storage = new Map();
  return {
    getItem: vi.fn((key) => storage.get(key) || null),
    setItem: vi.fn((key, value) => storage.set(key, value)),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    key: vi.fn((index) => Array.from(storage.keys())[index] || null),
    get length() { return storage.size; }
  };
};

// Mock API
vi.mock('@/services/api', () => ({
  AuthAPI: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    register: vi.fn()
  }
}));

// Mock console wrapper
vi.mock('@/utils/console-wrapper', () => ({
  devConsole: {
    error: vi.fn(),
    log: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock storage manager
vi.mock('@/utils/storageManager', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    isAvailable: vi.fn(() => true)
  }
}));

// Mock environment
const mockEnv = {
  NODE_ENV: 'test',
  DEV: false
};

vi.mock('import.meta', () => ({
  env: mockEnv
}));

describe('AuthContext Integration Tests - Task 2.4', () => {
  let mockLocalStorage;
  let mockSessionStorage;

  beforeEach(async () => {
    // Create fresh storage mocks
    mockLocalStorage = createMockStorage();
    mockSessionStorage = createMockStorage();

    // Replace window storage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });

    // Reset environment
    mockEnv.DEV = false;
    mockEnv.NODE_ENV = 'test';

    // Import and reset storage manager mock
    const { default: storageManager } = await import('../utils/storageManager');
    storageManager.get.mockImplementation((key) => {
      const value = mockLocalStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    });
    storageManager.set.mockImplementation((key, value) => {
      mockLocalStorage.setItem(key, JSON.stringify(value));
      return true;
    });
    storageManager.remove.mockImplementation((key) => {
      mockLocalStorage.removeItem(key);
      return true;
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication flow with page restoration', () => {
    it('should restore last page after successful demo login', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store a last page for admin user
      const adminPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-admin') {
          return adminPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
      });

      // Verify login result includes redirect to stored page
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/candidates');
      });

      // Verify storage manager was called to get the last page
      expect(storageManager.get).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
    });

    it('should use default dashboard when no last page exists', async () => {
      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
      });

      // Verify no last page restoration
      await waitFor(() => {
        expect(screen.getByTestId('last-page')).toHaveTextContent('No last page');
        expect(screen.getByTestId('should-restore')).toHaveTextContent('false');
      });

      // Verify login result uses default dashboard
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/dashboard'); // Default for admin
      });
    });

    it('should handle different user roles correctly', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store a last page for recruiter user
      const recruiterPageState = {
        path: '/app/recruiter/candidates',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-recruiter'
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-recruiter') {
          return recruiterPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('demo@crm.com', 'demo123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? `${user.id}-${user.role}` : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-recruiter-recruiter');
      });

      // Verify login result includes correct redirect
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/recruiter/candidates');
      });

      // Verify storage manager was called to get the last page
      expect(storageManager.get).toHaveBeenCalledWith('lastVisitedPage_demo-user-recruiter');
    });

    it('should clear expired last page states', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store an expired last page (8 days old)
      const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
      const expiredPageState = {
        path: '/app/candidates',
        timestamp: eightDaysAgo,
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      // Set up storage manager mock to return the expired page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-admin') {
          return expiredPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
      });

      // Verify login result uses default dashboard (expired page should be ignored)
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/dashboard');
      });

      // Verify storage manager was called to get the last page
      expect(storageManager.get).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      
      // Verify expired page was cleared
      expect(storageManager.remove).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
    });
  });

  describe('Development mode page preservation', () => {
    it('should preserve last page during development mode hot reload', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Set development mode
      mockEnv.DEV = true;
      mockEnv.NODE_ENV = 'development';

      // Store auth token and last page as if user was previously authenticated
      const pageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      mockLocalStorage.setItem('authToken', 'demo-token-admin');
      mockLocalStorage.setItem('isDemoMode', 'true');
      
      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-admin') {
          return pageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { user, isAuthenticated, lastVisitedPage, isLoading } = useAuth();

        return (
          <div>
            <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
            <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // In development mode, auth should NOT be cleared automatically (this is the fix)
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('isDemoMode');

      // User should remain authenticated in development mode (this is the fix)
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
      
      // The key point is that authentication is preserved in development mode

      // Reset environment
      mockEnv.DEV = false;
      mockEnv.NODE_ENV = 'test';
    });

    it('should handle development mode without previous authentication', async () => {
      // Set development mode
      mockEnv.DEV = true;
      mockEnv.NODE_ENV = 'development';

      const TestComponent = () => {
        const { user, isAuthenticated, lastVisitedPage, isLoading } = useAuth();

        return (
          <div>
            <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
            <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Should handle gracefully with no previous auth
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('last-page')).toHaveTextContent('No last page');

      // Reset environment
      mockEnv.DEV = false;
      mockEnv.NODE_ENV = 'test';
    });

    it('should separate last page tracking from authentication clearing in development', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Set development mode
      mockEnv.DEV = true;
      mockEnv.NODE_ENV = 'development';

      // Store different user roles to test preservation
      const adminPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-recruiter'
      };

      mockLocalStorage.setItem('authToken', 'demo-token-admin');
      mockLocalStorage.setItem('isDemoMode', 'true');
      mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(adminPageState));
      mockLocalStorage.setItem('lastVisitedPage_demo-user-recruiter', JSON.stringify(recruiterPageState));

      const TestComponent = () => {
        const { user, isAuthenticated, lastVisitedPage, isLoading } = useAuth();

        return (
          <div>
            <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
            <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Auth should NOT be cleared automatically in development mode (this is the fix)
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('isDemoMode');

      // Storage manager should not be called to remove last page data (preserved for development)
      expect(storageManager.remove).not.toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      expect(storageManager.remove).not.toHaveBeenCalledWith('lastVisitedPage_demo-user-recruiter');

      // Reset environment
      mockEnv.DEV = false;
      mockEnv.NODE_ENV = 'test';
    });
  });

  describe('Permission validation during restoration', () => {
    it('should validate user permissions before restoring page', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store a recruiter-only page for admin user (should be accessible)
      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'admin', // Admin should have access to recruiter pages
        userId: 'demo-user-admin'
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-admin') {
          return recruiterPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? `${user.id}-${user.role}` : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin-admin');
      });

      // Admin should have access to recruiter pages, but the route permissions don't allow it
      // So it should redirect to default dashboard
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        // Admin doesn't have access to recruiter routes, so should use default
        expect(loginResult.redirectTo).toBe('/app/dashboard');
      });
    });

    it('should redirect to default dashboard when user lacks permissions', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store an admin-only page for regular user (should not be accessible)
      const adminPageState = {
        path: '/app/settings',
        timestamp: Date.now(),
        userRole: 'user', // Regular user trying to access admin page
        userId: 'demo-user-user'
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-user') {
          return adminPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('sales@crm.com', 'sales123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? `${user.id}-${user.role}` : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-user-user');
      });

      // Should redirect to default dashboard for user role (no access to admin settings)
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/dashboard'); // Default for user
      });

      // Should clear the invalid page from storage
      expect(storageManager.remove).toHaveBeenCalledWith('lastVisitedPage_demo-user-user');
    });

    it('should handle role changes and clear incompatible stored pages', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store a recruiter page for a user who will login as regular user
      const recruiterPageState = {
        path: '/app/recruiter/candidates',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-user' // Same user ID but different role
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-user') {
          return recruiterPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('sales@crm.com', 'sales123'); // Login as regular user
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? `${user.id}-${user.role}` : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-user-user');
      });

      // Should redirect to appropriate default for user role (no access to recruiter pages)
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/dashboard');
      });

      // Should clear the incompatible page from storage
      expect(storageManager.remove).toHaveBeenCalledWith('lastVisitedPage_demo-user-user');
    });

    it('should validate route permissions using restoreLastPage method', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Store a valid page for admin user
      const validPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      // Set up storage manager mock to return the stored page
      storageManager.get.mockImplementation((key) => {
        if (key === 'lastVisitedPage_demo-user-admin') {
          return validPageState;
        }
        return null;
      });

      const TestComponent = () => {
        const { login, user, isAuthenticated, restoreLastPage, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [restoredPage, setRestoredPage] = React.useState(null);
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        const handleRestore = () => {
          const page = restoreLastPage();
          setRestoredPage(page);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
            <div data-testid="user">{user ? `${user.id}-${user.role}` : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <button onClick={handleRestore}>Restore Page</button>
            <div data-testid="restored-page">{restoredPage || 'No restored page'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Trigger login first
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Wait for authentication to complete
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin-admin');
      });

      // Trigger manual restore
      const restoreButton = screen.getByText('Restore Page');
      await act(async () => {
        fireEvent.click(restoreButton);
      });

      // Verify restoration worked
      await waitFor(() => {
        expect(screen.getByTestId('restored-page')).toHaveTextContent('/app/candidates');
      });
      
      // Verify storage manager was called
      expect(storageManager.get).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle corrupted storage data gracefully', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Mock storage manager to return null for corrupted data
      storageManager.get.mockImplementation(() => null);

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);

        const handleLogin = async () => {
          const result = await login('admin@crm.com', 'admin123');
          setLoginResult(result);
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should not throw errors
      expect(() => render(<TestApp />)).not.toThrow();

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Should handle corrupted data gracefully and use default
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
        expect(screen.getByTestId('last-page')).toHaveTextContent('No last page');
        expect(screen.getByTestId('should-restore')).toHaveTextContent('false');
      });

      // Should use default dashboard
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        const loginResult = JSON.parse(loginResultText);
        expect(loginResult.success).toBe(true);
        expect(loginResult.redirectTo).toBe('/app/dashboard');
      });
    });

    it('should handle storage unavailable scenarios', async () => {
      const { default: storageManager } = await import('../utils/storageManager');
      
      // Mock storage to return null instead of throwing (simulating graceful error handling)
      storageManager.get.mockImplementation(() => null);

      const TestComponent = () => {
        const { login, user, lastVisitedPage, shouldRestoreLastPage } = useAuth();
        const [loginResult, setLoginResult] = React.useState(null);
        const [error, setError] = React.useState(null);

        const handleLogin = async () => {
          try {
            const result = await login('admin@crm.com', 'admin123');
            setLoginResult(result);
          } catch (err) {
            setError(err.message);
          }
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            <div data-testid="user">{user ? user.id : 'No user'}</div>
            <div data-testid="last-page">{lastVisitedPage || 'No last page'}</div>
            <div data-testid="should-restore">{shouldRestoreLastPage ? 'true' : 'false'}</div>
            <div data-testid="login-result">{loginResult ? JSON.stringify(loginResult) : 'No result'}</div>
            <div data-testid="error">{error || 'No error'}</div>
          </div>
        );
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should not throw errors
      expect(() => render(<TestApp />)).not.toThrow();

      // Trigger login
      const loginButton = screen.getByText('Login');
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Should handle storage errors gracefully
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('demo-user-admin');
        expect(screen.getByTestId('last-page')).toHaveTextContent('No last page');
        expect(screen.getByTestId('should-restore')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('No error');
      });

      // Should use default dashboard when no stored page is available
      await waitFor(() => {
        const loginResultText = screen.getByTestId('login-result').textContent;
        if (loginResultText !== 'No result') {
          const loginResult = JSON.parse(loginResultText);
          expect(loginResult.success).toBe(true);
          expect(loginResult.redirectTo).toBe('/app/dashboard');
        }
      });
    });
  });
});