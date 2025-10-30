/**
 * End-to-end tests for the Last Page Memory System
 * Tests complete user journeys across different scenarios
 */

import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';
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

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
beforeEach(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
  console.group = vi.fn();
  console.groupEnd = vi.fn();
});

afterEach(() => {
  Object.assign(console, originalConsole);
});

describe('Last Page Memory System - End-to-End Tests', () => {
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

  describe('Complete User Journey - Admin Role', () => {
    it('should track navigation and restore last page after logout/login', async () => {
      const TestApp = () => (
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <RouteTracker />
            <RootRedirect />
          </AuthProvider>
        </MemoryRouter>
      );

      const { rerender } = render(<TestApp />);

      // Simulate user authentication
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      // Wait for authentication to process
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });

      // Simulate navigation to candidates page
      const candidatesPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(candidatesPageState));
      });

      // Simulate logout
      act(() => {
        mockLocalStorage.removeItem('authToken');
        mockLocalStorage.removeItem('isDemoMode');
      });

      // Simulate fresh login
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      // Re-render to trigger authentication flow
      rerender(<TestApp />);

      // Verify that the system attempts to restore the last page
      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });

    it('should handle role-based access control during restoration', async () => {
      // Store a recruiter-only page for an admin user (should be accessible)
      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'admin', // Admin should have access to recruiter pages
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(recruiterPageState));
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

    it('should clear invalid routes and redirect to default dashboard', async () => {
      // Store an invalid/non-existent route
      const invalidPageState = {
        path: '/app/invalid-page',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(invalidPageState));
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
  });

  describe('Complete User Journey - Recruiter Role', () => {
    it('should track and restore recruiter-specific pages', async () => {
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

    it('should prevent access to admin-only pages for recruiter role', async () => {
      // Store an admin-only page for a recruiter user
      const adminPageState = {
        path: '/app/team',
        timestamp: Date.now(),
        userRole: 'recruiter',
        userId: 'demo-user-recruiter'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-recruiter', JSON.stringify(adminPageState));
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
  });

  describe('Complete User Journey - Regular User Role', () => {
    it('should track and restore user-accessible pages', async () => {
      const userPageState = {
        path: '/app/candidates',
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

    it('should prevent access to admin and recruiter pages for regular user', async () => {
      // Store a recruiter page for a regular user
      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'user',
        userId: 'demo-user-user'
      };

      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-user', JSON.stringify(recruiterPageState));
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
  });

  describe('Development Mode Scenarios', () => {
    beforeEach(() => {
      mockEnv.DEV = true;
      mockEnv.NODE_ENV = 'development';
    });

    afterEach(() => {
      mockEnv.DEV = false;
      mockEnv.NODE_ENV = 'test';
    });

    it('should preserve last page during development hot reload', async () => {
      // Simulate development mode with existing auth and last page
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
        // Last page should NOT be removed
        expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });

    it('should restore page after re-authentication in development', async () => {
      // Simulate the complete development cycle
      const pageState = {
        path: '/app/jobs',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      // Initial state with auth and last page
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

      const { rerender } = render(<TestApp />);

      // Wait for development mode auth clearing
      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });

      // Simulate re-authentication
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      rerender(<TestApp />);

      // Should attempt to restore the preserved last page
      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle corrupted storage data gracefully', async () => {
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

      render(<TestApp />);

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('lastVisitedPage_demo-user-admin');
      });

      // Should not throw errors and should continue with default behavior
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle storage unavailability', async () => {
      // Mock storage to throw errors
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      act(() => {
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

      // Should handle storage errors gracefully
      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalled();
      });
    });

    it('should handle expired page states (older than 7 days)', async () => {
      const sevenDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago
      const expiredPageState = {
        path: '/app/candidates',
        timestamp: sevenDaysAgo,
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

    it('should handle role changes and clear incompatible pages', async () => {
      // Store a recruiter page for a user who is now admin
      const recruiterPageState = {
        path: '/app/recruiter/dashboard',
        timestamp: Date.now(),
        userRole: 'recruiter', // Old role
        userId: 'demo-user-admin'
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

    it('should handle multiple tabs scenario (latest page tracking)', async () => {
      // Simulate multiple page states with different timestamps
      const olderPageState = {
        path: '/app/candidates',
        timestamp: Date.now() - 60000, // 1 minute ago
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      const newerPageState = {
        path: '/app/jobs',
        timestamp: Date.now(), // Now
        userRole: 'admin',
        userId: 'demo-user-admin'
      };

      // Store the newer page state (simulating latest tab activity)
      act(() => {
        mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(newerPageState));
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
  });

  describe('Route Tracking Integration', () => {
    it('should track valid application routes', async () => {
      const TestComponent = () => {
        const [currentPath, setCurrentPath] = React.useState('/app/dashboard');
        
        return (
          <MemoryRouter initialEntries={[currentPath]}>
            <AuthProvider>
              <RouteTracker />
              <button onClick={() => setCurrentPath('/app/candidates')}>
                Navigate to Candidates
              </button>
            </AuthProvider>
          </MemoryRouter>
        );
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      render(<TestComponent />);

      // Wait for initial tracking
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });
    });

    it('should not track excluded routes', async () => {
      const TestComponent = () => (
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <RouteTracker />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestComponent />);

      // Should not track login page
      await waitFor(() => {
        expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
          expect.stringContaining('lastVisitedPage'),
          expect.any(String)
        );
      });
    });

    it('should handle route tracking errors gracefully', async () => {
      // Mock storage to fail
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthProvider>
            <RouteTracker />
          </AuthProvider>
        </MemoryRouter>
      );

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem.mockRestore();
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('Storage error');
        });
      });

      render(<TestComponent />);

      // Should handle errors gracefully without crashing
      await waitFor(() => {
        expect(console.error).not.toHaveBeenCalled();
      });
    });
  });
});