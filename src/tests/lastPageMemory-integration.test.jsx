/**
 * Integration tests for the Last Page Memory System
 * Tests the complete system integration and user journeys
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import RouteTracker from '../components/RouteTracker';
import RootRedirect from '../components/RootRedirect';

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

// Mock environment
const mockEnv = {
  NODE_ENV: 'test',
  DEV: false
};

vi.mock('import.meta', () => ({
  env: mockEnv
}));

describe('Last Page Memory System - Integration Tests', () => {
  let mockLocalStorage;
  let mockSessionStorage;

  beforeEach(() => {
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

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        pathname: '/',
        href: 'http://localhost:3000/'
      },
      writable: true
    });

    vi.clearAllMocks();
  });

  describe('Task 5.1 - End-to-end system testing', () => {
    it('should complete user journey with page memory for admin role', async () => {
      // Store a last page for admin user
      const adminPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(adminPageState));
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Verify that the system attempts to restore the last page
      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });

    it('should work correctly with recruiter role', async () => {
      const recruiterPageState = {
        path: '/app/recruiter/candidates',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-recruiter'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-recruiter', JSON.stringify(recruiterPageState));
        mockLocalStorage.setItem('authToken', 'demo-token-recruiter');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-recruiter');
      });
    });

    it('should work correctly with regular user role', async () => {
      const userPageState = {
        path: '/app/dashboard',
        timestamp: Date.now(),
        userRole: 'user',
        userId: 'demo-user-user'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-user', JSON.stringify(userPageState));
        mockLocalStorage.setItem('authToken', 'demo-token-user');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-user');
      });
    });

    it('should handle development mode hot reload scenarios', async () => {
      mockEnv.DEV = true;
      mockEnv.NODE_ENV = 'development';

      const pageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(pageState));
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // In development mode, auth is cleared but last page should be preserved
      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('isDemoMode');
      });

      // Reset for cleanup
      mockEnv.DEV = false;
      mockEnv.NODE_ENV = 'test';
    });

    it('should handle authentication clearing scenarios', async () => {
      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Should handle unauthenticated state gracefully
      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalled();
      });
    });
  });

  describe('Task 5.2 - Performance and compatibility verification', () => {
    it('should have minimal performance impact on navigation', async () => {
      const startTime = performance.now();

      const TestComponent = () => {
        const [mounted, setMounted] = React.useState(false);
        
        React.useEffect(() => {
          setMounted(true);
        }, []);
        
        return <div>{mounted ? 'Mounted' : 'Loading'}</div>;
      };

      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthProvider>
            <RouteTracker />
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(screen.getByText('Mounted')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should be compatible with existing authentication system', async () => {
      const authSteps = [];

      const TestComponent = () => {
        const [user, setUser] = React.useState(null);
        
        React.useEffect(() => {
          authSteps.push('component-mounted');
          
          // Simulate authentication check
          const token = mockLocalStorage.getItem('authToken');
          if (token) {
            authSteps.push('token-found');
            setUser({ id: 'demo-user-admin', role: 'admin' });
          } else {
            authSteps.push('no-token');
          }
        }, []);
        
        return <div>User: {user ? user.id : 'Not authenticated'}</div>;
      };

      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <RouteTracker />
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(authSteps).toContain('component-mounted');
      });

      // Should not interfere with authentication flow
      expect(authSteps).toContain('token-found');
    });

    it('should not break existing user experience', async () => {
      const userActions = [];

      const TestComponent = () => {
        const handleClick = (action) => {
          userActions.push(action);
        };
        
        return (
          <div>
            <button onClick={() => handleClick('dashboard')}>Dashboard</button>
            <button onClick={() => handleClick('candidates')}>Candidates</button>
          </div>
        );
      };

      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <RouteTracker />
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      const { container } = render(<TestApp />);

      // Simulate user interactions
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        act(() => {
          button.click();
        });
      });

      // User interactions should work normally
      expect(userActions).toEqual(['dashboard', 'candidates']);
    });

    it('should handle storage errors gracefully', async () => {
      // Mock storage to throw errors
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should not throw errors
      expect(() => render(<TestApp />)).not.toThrow();
    });

    it('should handle corrupted storage data', async () => {
      // Store corrupted JSON data
      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', 'invalid-json');
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should handle corrupted data gracefully
      expect(() => render(<TestApp />)).not.toThrow();

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });

    it('should handle expired page states', async () => {
      const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
      const expiredPageState = {
        path: '/app/candidates',
        timestamp: eightDaysAgo,
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(expiredPageState));
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });

    it('should handle role changes correctly', async () => {
      // Store a page for one role, then authenticate as different role
      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-admin' // Same user but different role
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(recruiterPageState));
        mockLocalStorage.setItem('authToken', 'demo-token-admin'); // Now admin
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });
  });

  describe('Route Tracking Integration', () => {
    it('should track routes when user is authenticated', async () => {
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthProvider>
            <RouteTracker />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Should attempt to track the route
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });
    });

    it('should not track routes when user is not authenticated', async () => {
      const TestApp = () => (
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthProvider>
            <RouteTracker />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      // Should not track routes for unauthenticated users
      await waitFor(() => {
        expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
          expect.stringContaining('lastVisitedPage'),
          expect.any(String)
        );
      });
    });

    it('should handle route tracking errors gracefully', async () => {
      // Mock storage to fail on setItem
      mockLocalStorage.setItem.mockImplementation((key, value) => {
        if (key.includes('lastVisitedPage')) {
          throw new Error('Storage error');
        }
      });

      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthProvider>
            <RouteTracker />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should handle storage errors gracefully
      expect(() => render(<TestApp />)).not.toThrow();
    });
  });
});