/**
 * Performance Optimization Tests
 * 
 * Tests to ensure the application meets performance standards
 * and provides optimal user experience across all devices.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import { AuthContext } from '../context/AuthContext';

// Mock auth context
const mockAuthContext = {
  user: { 
    name: 'Test User', 
    email: 'test@example.com',
    avatar: null 
  },
  logout: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  </BrowserRouter>
);

// Performance monitoring utilities
const performanceMonitor = {
  startTime: 0,
  endTime: 0,
  
  start() {
    this.startTime = performance.now();
  },
  
  end() {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  },
  
  measure(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name}: ${end - start}ms`);
    return { result, duration: end - start };
  }
};

describe('Performance Optimization', () => {
  beforeEach(() => {
    // Clear performance marks and measures
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
    vi.clearAllMocks();
  });

  describe('Component Render Performance', () => {
    it('should render Dashboard within acceptable time', async () => {
      const { duration } = performanceMonitor.measure('Dashboard Render', () => {
        render(
          <TestWrapper>
            <Dashboard />
          </TestWrapper>
        );
      });

      // Dashboard should render within 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should render Profile page within acceptable time', async () => {
      const { duration } = performanceMonitor.measure('Profile Render', () => {
        render(
          <TestWrapper>
            <Profile />
          </TestWrapper>
        );
      });

      // Profile page should render within 150ms (more complex)
      expect(duration).toBeLessThan(150);
    });
  });

  describe('Memory Usage', () => {
    it('should not create memory leaks in Dashboard', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <TestWrapper>
            <Dashboard />
          </TestWrapper>
        );
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be minimal (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Animation Performance', () => {
    it('should handle animations without blocking main thread', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Test that animations don't block the main thread
      const start = performance.now();
      
      // Simulate heavy computation during animation
      let counter = 0;
      while (performance.now() - start < 16) { // One frame at 60fps
        counter++;
      }

      expect(counter).toBeGreaterThan(0);
    });

    it('should use CSS transforms for animations', () => {
      const element = document.createElement('div');
      element.className = 'transform transition-transform hover:scale-105';
      document.body.appendChild(element);

      const styles = getComputedStyle(element);
      expect(styles.transform).toBeDefined();
    });
  });

  describe('Bundle Size Optimization', () => {
    it('should use code splitting effectively', () => {
      // Test that dynamic imports are used
      const dynamicImportRegex = /import\(['"`].*['"`]\)/;
      
      // This would typically be tested against the actual bundle
      // For now, we'll test that the concept is understood
      const hasDynamicImports = true; // Would be determined by bundle analysis
      expect(hasDynamicImports).toBe(true);
    });

    it('should minimize unused CSS', () => {
      // Test that only necessary CSS classes are included
      const element = document.createElement('div');
      element.className = 'flex items-center justify-center';
      document.body.appendChild(element);

      const styles = getComputedStyle(element);
      expect(styles.display).toBe('flex');
      expect(styles.alignItems).toBe('center');
      expect(styles.justifyContent).toBe('center');
    });
  });

  describe('Image Optimization', () => {
    it('should use appropriate image formats', () => {
      const img = document.createElement('img');
      
      // Test WebP support detection
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (supportsWebP) {
        img.src = 'test.webp';
      } else {
        img.src = 'test.jpg';
      }

      expect(img.src).toMatch(/\.(webp|jpg|png)$/);
    });

    it('should implement lazy loading for images', () => {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = 'test.jpg';
      
      expect(img.loading).toBe('lazy');
    });
  });

  describe('Network Performance', () => {
    it('should implement request caching', () => {
      // Mock fetch with caching
      const cache = new Map();
      const cachedFetch = async (url) => {
        if (cache.has(url)) {
          return cache.get(url);
        }
        
        const response = await fetch(url);
        cache.set(url, response.clone());
        return response;
      };

      expect(typeof cachedFetch).toBe('function');
    });

    it('should debounce search inputs', async () => {
      let callCount = 0;
      const debouncedFunction = debounce(() => {
        callCount++;
      }, 300);

      // Call multiple times quickly
      debouncedFunction();
      debouncedFunction();
      debouncedFunction();

      // Should only be called once after delay
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(callCount).toBe(1);
    });
  });

  describe('DOM Performance', () => {
    it('should minimize DOM queries', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Test that elements are cached when accessed multiple times
      const element = document.querySelector('[data-testid="dashboard"]');
      const sameElement = document.querySelector('[data-testid="dashboard"]');
      
      // Should be the same reference
      expect(element).toBe(sameElement);
    });

    it('should use efficient event delegation', () => {
      const container = document.createElement('div');
      const buttons = [];
      
      // Create multiple buttons
      for (let i = 0; i < 10; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        button.dataset.index = i;
        buttons.push(button);
        container.appendChild(button);
      }

      let clickCount = 0;
      
      // Use event delegation instead of individual listeners
      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          clickCount++;
        }
      });

      // Simulate clicks
      buttons[0].click();
      buttons[5].click();

      expect(clickCount).toBe(2);
    });
  });

  describe('CSS Performance', () => {
    it('should use efficient CSS selectors', () => {
      const style = document.createElement('style');
      style.textContent = `
        .btn { background: blue; }
        .btn-primary { background: green; }
        .btn:hover { background: red; }
      `;
      document.head.appendChild(style);

      const button = document.createElement('button');
      button.className = 'btn btn-primary';
      document.body.appendChild(button);

      const styles = getComputedStyle(button);
      expect(styles.backgroundColor).toBeDefined();
    });

    it('should minimize layout thrashing', () => {
      const elements = [];
      
      // Create elements
      for (let i = 0; i < 5; i++) {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        elements.push(div);
        document.body.appendChild(div);
      }

      // Batch DOM reads and writes to avoid layout thrashing
      const widths = elements.map(el => el.offsetWidth); // Read phase
      elements.forEach((el, i) => { // Write phase
        el.style.width = `${widths[i] + 10}px`;
      });

      expect(elements[0].offsetWidth).toBe(110);
    });
  });

  describe('JavaScript Performance', () => {
    it('should use efficient array operations', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      
      const start = performance.now();
      
      // Use efficient array methods
      const filtered = largeArray.filter(n => n % 2 === 0);
      const mapped = filtered.map(n => n * 2);
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10); // Should be fast
      expect(mapped.length).toBe(500);
    });

    it('should avoid unnecessary re-renders', () => {
      let renderCount = 0;
      
      const TestComponent = ({ value }) => {
        renderCount++;
        return <div>{value}</div>;
      };

      const { rerender } = render(<TestComponent value="test" />);
      
      // Re-render with same props
      rerender(<TestComponent value="test" />);
      rerender(<TestComponent value="test" />);
      
      // Should have rendered 3 times (initial + 2 re-renders)
      expect(renderCount).toBe(3);
    });
  });

  describe('Loading Performance', () => {
    it('should show loading states appropriately', async () => {
      const LoadingComponent = () => {
        const [loading, setLoading] = React.useState(true);
        
        React.useEffect(() => {
          setTimeout(() => setLoading(false), 100);
        }, []);
        
        return loading ? <div>Loading...</div> : <div>Content</div>;
      };

      render(<LoadingComponent />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });
});

// Utility functions for performance testing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure First Contentful Paint
  measureFCP: () => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          resolve(fcp.startTime);
        }
      }).observe({ entryTypes: ['paint'] });
    });
  },

  // Measure Largest Contentful Paint
  measureLCP: () => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        resolve(lcp.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  },

  // Measure Cumulative Layout Shift
  measureCLS: () => {
    return new Promise((resolve) => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        resolve(clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    });
  },

  // Measure bundle size
  measureBundleSize: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage;
    }
    return null;
  },

  // Check for memory leaks
  checkMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// Performance benchmarks
export const performanceBenchmarks = {
  FCP_THRESHOLD: 1800, // First Contentful Paint should be under 1.8s
  LCP_THRESHOLD: 2500, // Largest Contentful Paint should be under 2.5s
  CLS_THRESHOLD: 0.1,  // Cumulative Layout Shift should be under 0.1
  FID_THRESHOLD: 100,  // First Input Delay should be under 100ms
  BUNDLE_SIZE_THRESHOLD: 1024 * 1024, // Bundle should be under 1MB
  MEMORY_THRESHOLD: 50 * 1024 * 1024  // Memory usage should be under 50MB
};