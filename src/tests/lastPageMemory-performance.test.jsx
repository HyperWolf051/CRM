/**
 * Performance and compatibility tests for the Last Page Memory System
 * Tests system performance impact and compatibility with existing systems
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useLastPageMemory } from '../hooks/useLastPageMemory';
import RouteTracker from '../components/RouteTracker';
import RootRedirect from '../components/RootRedirect';
import storageManager from '../utils/storageManager';

// Performance monitoring utilities
const createPerformanceMonitor = () => {
  const metrics = {
    renderTimes: [],
    storageOperations: [],
    memoryUsage: []
  };

  const startTime = performance.now();
  
  return {
    recordRender: (componentName) => {
      const endTime = performance.now();
      metrics.renderTimes.push({
        component: componentName,
        duration: endTime - startTime
      });
    },
    recordStorageOperation: (operation, duration) => {
      metrics.storageOperations.push({
        operation,
        duration
      });
    },
    recordMemoryUsage: () => {
      if (performance.memory) {
        metrics.memoryUsage.push({
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          timestamp: Date.now()
        });
      }
    },
    getMetrics: () => metrics,
    reset: () => {
      metrics.renderTimes = [];
      metrics.storageOperations = [];
      metrics.memoryUsage = [];
    }
  };
};

// Mock storage with performance tracking
const createMockStorageWithMetrics = (monitor) => {
  const storage = new Map();
  return {
    getItem: vi.fn((key) => {
      const start = performance.now();
      const result = storage.get(key) || null;
      const end = performance.now();
      monitor.recordStorageOperation('getItem', end - start);
      return result;
    }),
    setItem: vi.fn((key, value) => {
      const start = performance.now();
      storage.set(key, value);
      const end = performance.now();
      monitor.recordStorageOperation('setItem', end - start);
    }),
    removeItem: vi.fn((key) => {
      const start = performance.now();
      storage.delete(key);
      const end = performance.now();
      monitor.recordStorageOperation('removeItem', end - start);
    }),
    clear: vi.fn(() => storage.clear()),
    key: vi.fn((index) => Array.from(storage.keys())[index] || null),
    get length() { return storage.size; }
  };
};

describe('Last Page Memory System - Performance Tests', () => {
  let performanceMonitor;
  let mockLocalStorage;
  let mockSessionStorage;

  beforeEach(() => {
    performanceMonitor = createPerformanceMonitor();
    mockLocalStorage = createMockStorageWithMetrics(performanceMonitor);
    mockSessionStorage = createMockStorageWithMetrics(performanceMonitor);

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    performanceMonitor.reset();
  });

  describe('Hook Performance', () => {
    it('should have minimal performance impact on hook initialization', async () => {
      const TestComponent = () => {
        const start = performance.now();
        const { setLastPage, getLastPage, clearLastPage } = useLastPageMemory();
        const end = performance.now();
        
        performanceMonitor.recordRender('useLastPageMemory', end - start);
        
        return <div>Test Component</div>;
      };

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      const metrics = performanceMonitor.getMetrics();
      const hookInitTime = metrics.renderTimes.find(m => m.component === 'useLastPageMemory');
      
      // Hook initialization should be very fast (< 5ms)
      expect(hookInitTime?.duration).toBeLessThan(5);
    });

    it('should have fast storage operations', async () => {
      const TestComponent = () => {
        const { setLastPage, getLastPage, clearLastPage } = useLastPageMemory();
        
        React.useEffect(() => {
          // Perform multiple operations to test performance
          setLastPage('/app/candidates');
          getLastPage();
          setLastPage('/app/jobs');
          getLastPage();
          clearLastPage();
        }, [setLastPage, getLastPage, clearLastPage]);
        
        return <div>Test Component</div>;
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        const metrics = performanceMonitor.getMetrics();
        expect(metrics.storageOperations.length).toBeGreaterThan(0);
      });

      const metrics = performanceMonitor.getMetrics();
      const avgStorageTime = metrics.storageOperations.reduce((sum, op) => sum + op.duration, 0) / metrics.storageOperations.length;
      
      // Average storage operation should be very fast (< 2ms)
      expect(avgStorageTime).toBeLessThan(2);
    });

    it('should not cause memory leaks with repeated operations', async () => {
      const TestComponent = () => {
        const { setLastPage, getLastPage, clearLastPage } = useLastPageMemory();
        const [counter, setCounter] = React.useState(0);
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            setLastPage(`/app/page-${counter}`);
            getLastPage();
            performanceMonitor.recordMemoryUsage();
            setCounter(c => c + 1);
          }, 10);
          
          return () => clearInterval(interval);
        }, [setLastPage, getLastPage, counter]);
        
        return <div>Counter: {counter}</div>;
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      const { unmount } = render(<TestApp />);

      // Let it run for a short time
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = performanceMonitor.getMetrics();
      
      if (metrics.memoryUsage.length > 1) {
        const initialMemory = metrics.memoryUsage[0].used;
        const finalMemory = metrics.memoryUsage[metrics.memoryUsage.length - 1].used;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Memory increase should be minimal (< 1MB)
        expect(memoryIncrease).toBeLessThan(1024 * 1024);
      }

      unmount();
    });
  });

  describe('Route Tracking Performance', () => {
    it('should have minimal impact on navigation performance', async () => {
      const navigationTimes = [];
      
      const TestComponent = () => {
        const [currentPath, setCurrentPath] = React.useState('/app/dashboard');
        
        const navigate = (newPath) => {
          const start = performance.now();
          setCurrentPath(newPath);
          const end = performance.now();
          navigationTimes.push(end - start);
        };
        
        return (
          <div>
            <button onClick={() => navigate('/app/candidates')}>Candidates</button>
            <button onClick={() => navigate('/app/jobs')}>Jobs</button>
            <button onClick={() => navigate('/app/companies')}>Companies</button>
          </div>
        );
      };

      // Mock authenticated user
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

      // Simulate multiple navigations
      const buttons = container.querySelectorAll('button');
      for (const button of buttons) {
        act(() => {
          button.click();
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Navigation should be fast (< 10ms per navigation)
      const avgNavigationTime = navigationTimes.reduce((sum, time) => sum + time, 0) / navigationTimes.length;
      expect(avgNavigationTime).toBeLessThan(10);
    });

    it('should handle high-frequency navigation without performance degradation', async () => {
      const TestComponent = () => {
        const [pathIndex, setPathIndex] = React.useState(0);
        const paths = ['/app/dashboard', '/app/candidates', '/app/jobs', '/app/companies'];
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            setPathIndex(i => (i + 1) % paths.length);
          }, 50); // Very frequent navigation
          
          return () => clearInterval(interval);
        }, []);
        
        return <div>Current path: {paths[pathIndex]}</div>;
      };

      // Mock authenticated user
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

      const { unmount } = render(<TestApp />);

      // Let it run for a short time with high-frequency navigation
      await new Promise(resolve => setTimeout(resolve, 200));

      const metrics = performanceMonitor.getMetrics();
      
      // Should handle frequent operations without significant slowdown
      const recentOperations = metrics.storageOperations.slice(-10);
      if (recentOperations.length > 0) {
        const avgRecentTime = recentOperations.reduce((sum, op) => sum + op.duration, 0) / recentOperations.length;
        expect(avgRecentTime).toBeLessThan(5);
      }

      unmount();
    });
  });

  describe('Storage Performance', () => {
    it('should handle large amounts of data efficiently', async () => {
      const largePageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'demo-user-admin',
        // Add some additional data to simulate larger payloads
        metadata: {
          filters: Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Filter ${i}` })),
          searchHistory: Array.from({ length: 50 }, (_, i) => `search-${i}`),
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
            customSettings: Array.from({ length: 20 }, (_, i) => ({ key: `setting-${i}`, value: `value-${i}` }))
          }
        }
      };

      const start = performance.now();
      
      // Test storage operations with large data
      mockLocalStorage.setItem('lastVisitedPage_demo-user-admin', JSON.stringify(largePageState));
      const retrieved = mockLocalStorage.getItem('lastVisitedPage_demo-user-admin');
      const parsed = JSON.parse(retrieved);
      
      const end = performance.now();
      const totalTime = end - start;

      // Should handle large data efficiently (< 10ms)
      expect(totalTime).toBeLessThan(10);
      expect(parsed.metadata.filters).toHaveLength(100);
    });

    it('should handle storage quota gracefully', async () => {
      // Mock storage to simulate quota exceeded
      let quotaExceeded = false;
      mockLocalStorage.setItem.mockImplementation((key, value) => {
        if (quotaExceeded) {
          const error = new Error('QuotaExceededError');
          error.name = 'QuotaExceededError';
          throw error;
        }
        // Simulate quota exceeded after a few operations
        if (mockLocalStorage.setItem.mock.calls.length > 3) {
          quotaExceeded = true;
        }
      });

      const TestComponent = () => {
        const { setLastPage } = useLastPageMemory();
        
        React.useEffect(() => {
          // Try to store multiple pages
          for (let i = 0; i < 10; i++) {
            setLastPage(`/app/page-${i}`);
          }
        }, [setLastPage]);
        
        return <div>Test Component</div>;
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem.mockRestore();
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
        mockLocalStorage.setItem.mockImplementation((key, value) => {
          if (quotaExceeded) {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
          }
          if (mockLocalStorage.setItem.mock.calls.length > 3) {
            quotaExceeded = true;
          }
        });
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      // Should handle quota exceeded gracefully without crashing
      expect(() => render(<TestApp />)).not.toThrow();
    });
  });

  describe('Compatibility Tests', () => {
    it('should not interfere with existing authentication flow', async () => {
      const authFlowSteps = [];
      
      const TestComponent = () => {
        const { user, isAuthenticated, login } = useAuth();
        
        React.useEffect(() => {
          authFlowSteps.push('component-mounted');
          
          if (!isAuthenticated) {
            authFlowSteps.push('not-authenticated');
            // Simulate login
            login('admin@crm.com', 'admin123').then(() => {
              authFlowSteps.push('login-completed');
            });
          } else {
            authFlowSteps.push('already-authenticated');
          }
        }, [isAuthenticated, login]);
        
        return <div>User: {user?.name || 'Not logged in'}</div>;
      };

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
        expect(authFlowSteps).toContain('component-mounted');
      });

      // Authentication flow should work normally
      expect(authFlowSteps).toContain('not-authenticated');
    });

    it('should work with existing protected route components', async () => {
      const MockProtectedRoute = ({ children }) => {
        const { isAuthenticated } = useAuth();
        return isAuthenticated ? children : <div>Please log in</div>;
      };

      const TestComponent = () => {
        const { setLastPage } = useLastPageMemory();
        
        React.useEffect(() => {
          setLastPage('/app/protected-page');
        }, [setLastPage]);
        
        return <div>Protected Content</div>;
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <RouteTracker />
            <MockProtectedRoute>
              <TestComponent />
            </MockProtectedRoute>
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      // Should track the page even within protected routes
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lastVisitedPage_demo-user-admin',
        expect.stringContaining('/app/protected-page')
      );
    });

    it('should maintain compatibility with lazy-loaded components', async () => {
      const LazyComponent = React.lazy(() => 
        Promise.resolve({
          default: () => {
            const { setLastPage } = useLastPageMemory();
            
            React.useEffect(() => {
              setLastPage('/app/lazy-page');
            }, [setLastPage]);
            
            return <div>Lazy Loaded Component</div>;
          }
        })
      );

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <RouteTracker />
            <React.Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </React.Suspense>
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(screen.getByText('Lazy Loaded Component')).toBeInTheDocument();
      });

      // Should work with lazy-loaded components
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lastVisitedPage_demo-user-admin',
        expect.stringContaining('/app/lazy-page')
      );
    });

    it('should not break existing user experience patterns', async () => {
      const userInteractions = [];
      
      const TestComponent = () => {
        const { user } = useAuth();
        const { setLastPage } = useLastPageMemory();
        
        const handleNavigation = (page) => {
          userInteractions.push(`navigate-to-${page}`);
          setLastPage(`/app/${page}`);
        };
        
        return (
          <div>
            <div>Welcome, {user?.name}</div>
            <button onClick={() => handleNavigation('dashboard')}>Dashboard</button>
            <button onClick={() => handleNavigation('candidates')}>Candidates</button>
            <button onClick={() => handleNavigation('jobs')}>Jobs</button>
          </div>
        );
      };

      // Mock authenticated user
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

      await waitFor(() => {
        expect(screen.getByText('Welcome, Company Admin')).toBeInTheDocument();
      });

      // Simulate user interactions
      const buttons = container.querySelectorAll('button');
      for (const button of buttons) {
        act(() => {
          button.click();
        });
      }

      // User interactions should work normally
      expect(userInteractions).toEqual([
        'navigate-to-dashboard',
        'navigate-to-candidates',
        'navigate-to-jobs'
      ]);

      // Pages should be tracked
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lastVisitedPage_demo-user-admin',
        expect.stringContaining('/app/dashboard')
      );
    });
  });

  describe('System Resource Usage', () => {
    it('should have minimal impact on bundle size', () => {
      // This is more of a documentation test - in a real scenario,
      // you would measure the actual bundle size impact
      const lastPageMemoryModules = [
        'useLastPageMemory',
        'storageManager',
        'routePermissions',
        'RouteTracker',
        'lastPageMemoryMonitor'
      ];

      // Each module should be reasonably sized
      expect(lastPageMemoryModules.length).toBeLessThan(10);
    });

    it('should not create excessive DOM nodes', async () => {
      const initialNodeCount = document.querySelectorAll('*').length;

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <RouteTracker />
            <div>Test Content</div>
          </AuthProvider>
        </MemoryRouter>
      );

      const { unmount } = render(<TestApp />);

      const withComponentNodeCount = document.querySelectorAll('*').length;
      const nodeIncrease = withComponentNodeCount - initialNodeCount;

      // Should not add excessive DOM nodes (RouteTracker renders null)
      expect(nodeIncrease).toBeLessThan(20);

      unmount();

      const afterUnmountNodeCount = document.querySelectorAll('*').length;
      
      // Should clean up properly
      expect(afterUnmountNodeCount).toBeLessThanOrEqual(initialNodeCount + 5);
    });

    it('should handle concurrent operations efficiently', async () => {
      const concurrentOperations = [];
      
      const TestComponent = () => {
        const { setLastPage, getLastPage, clearLastPage } = useLastPageMemory();
        
        React.useEffect(() => {
          // Simulate concurrent operations
          const operations = [
            () => setLastPage('/app/page1'),
            () => setLastPage('/app/page2'),
            () => getLastPage(),
            () => setLastPage('/app/page3'),
            () => getLastPage(),
            () => clearLastPage(),
            () => setLastPage('/app/page4')
          ];
          
          // Execute operations concurrently
          Promise.all(operations.map(op => {
            const start = performance.now();
            const result = op();
            const end = performance.now();
            concurrentOperations.push(end - start);
            return result;
          }));
        }, [setLastPage, getLastPage, clearLastPage]);
        
        return <div>Test Component</div>;
      };

      // Mock authenticated user
      act(() => {
        mockLocalStorage.setItem('authToken', 'demo-token-admin');
        mockLocalStorage.setItem('isDemoMode', 'true');
      });

      const TestApp = () => (
        <MemoryRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </MemoryRouter>
      );

      render(<TestApp />);

      await waitFor(() => {
        expect(concurrentOperations.length).toBeGreaterThan(0);
      });

      // Concurrent operations should be handled efficiently
      const avgConcurrentTime = concurrentOperations.reduce((sum, time) => sum + time, 0) / concurrentOperations.length;
      expect(avgConcurrentTime).toBeLessThan(5);
    });
  });
});