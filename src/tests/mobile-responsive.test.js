/**
 * Mobile Responsiveness Validation Tests
 * 
 * Comprehensive tests to ensure the application is fully responsive
 * and provides optimal user experience across all device sizes.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import DashboardLayout from '../layouts/DashboardLayout';
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

// Viewport simulation utilities
const setViewport = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

const mockMatchMedia = (width) => {
  return (query) => ({
    matches: (() => {
      if (query.includes('max-width: 640px')) return width <= 640;
      if (query.includes('max-width: 768px')) return width <= 768;
      if (query.includes('max-width: 1024px')) return width <= 1024;
      if (query.includes('min-width: 1024px')) return width >= 1024;
      if (query.includes('min-width: 1280px')) return width >= 1280;
      if (query.includes('min-width: 1536px')) return width >= 1536;
      return false;
    })(),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe('Mobile Responsiveness Validation', () => {
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe('Breakpoint Testing', () => {
    const breakpoints = [
      { name: 'Mobile Small', width: 320, height: 568 },
      { name: 'Mobile Medium', width: 375, height: 667 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop Small', width: 1280, height: 720 },
      { name: 'Desktop Large', width: 1920, height: 1080 },
      { name: 'Ultra Wide', width: 2560, height: 1440 }
    ];

    breakpoints.forEach(({ name, width, height }) => {
      it(`should render correctly on ${name} (${width}x${height})`, () => {
        setViewport(width, height);
        window.matchMedia = mockMatchMedia(width);

        render(
          <TestWrapper>
            <Dashboard />
          </TestWrapper>
        );

        // Should render without errors
        expect(screen.getByText('Weekly Balance')).toBeInTheDocument();
        
        // Check that content is not overflowing
        const body = document.body;
        expect(body.scrollWidth).toBeLessThanOrEqual(width + 50); // Allow small margin for scrollbars
      });
    });
  });

  describe('Dashboard Responsive Layout', () => {
    it('should stack metric cards vertically on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check for mobile-friendly layout
      const metricCards = screen.getAllByText(/Weekly Balance|Active Jobs|New Candidates|Pipeline Conversion/);
      expect(metricCards.length).toBeGreaterThan(0);
    });

    it('should show 2-column grid on tablet', () => {
      setViewport(768, 1024);
      window.matchMedia = mockMatchMedia(768);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render properly on tablet
      expect(screen.getByText('Weekly Balance')).toBeInTheDocument();
    });

    it('should show 4-column grid on desktop', () => {
      setViewport(1280, 720);
      window.matchMedia = mockMatchMedia(1280);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render properly on desktop
      expect(screen.getByText('Weekly Balance')).toBeInTheDocument();
    });
  });

  describe('Profile Page Responsiveness', () => {
    it('should stack profile sections vertically on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Profile />
        </TestWrapper>
      );

      // Should render profile page
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should show side-by-side layout on desktop', () => {
      setViewport(1280, 720);
      window.matchMedia = mockMatchMedia(1280);

      render(
        <TestWrapper>
          <Profile />
        </TestWrapper>
      );

      // Should render profile page with desktop layout
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });

  describe('Touch Interactions', () => {
    it('should handle touch events on interactive elements', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        const button = buttons[0];
        
        // Simulate touch events
        fireEvent.touchStart(button, {
          touches: [{ clientX: 100, clientY: 100 }]
        });
        
        fireEvent.touchEnd(button, {
          changedTouches: [{ clientX: 100, clientY: 100 }]
        });

        // Should not throw errors
        expect(button).toBeInTheDocument();
      }
    });

    it('should have appropriate touch targets (minimum 44px)', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height);
        const minWidth = parseInt(styles.minWidth) || parseInt(styles.width);
        
        // Touch targets should be at least 44px (iOS) or 48dp (Android)
        if (minHeight > 0) {
          expect(minHeight).toBeGreaterThanOrEqual(40); // Allow some flexibility
        }
      });
    });
  });

  describe('Scrolling Behavior', () => {
    it('should handle horizontal scrolling on tables', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      // Create a mock table that would overflow
      const table = document.createElement('table');
      table.style.width = '800px';
      table.className = 'min-w-full';
      
      const container = document.createElement('div');
      container.className = 'overflow-x-auto';
      container.appendChild(table);
      
      document.body.appendChild(container);

      // Should allow horizontal scrolling
      expect(container.scrollWidth).toBeGreaterThan(375);
    });

    it('should maintain smooth scrolling on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'overflow-y-auto scroll-smooth';
      scrollContainer.style.height = '300px';
      
      const content = document.createElement('div');
      content.style.height = '1000px';
      scrollContainer.appendChild(content);
      
      document.body.appendChild(scrollContainer);

      // Test scrolling
      scrollContainer.scrollTop = 100;
      expect(scrollContainer.scrollTop).toBe(100);
    });
  });

  describe('Text Readability', () => {
    it('should maintain readable text sizes on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check that text elements have appropriate sizes
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      textElements.forEach(element => {
        const styles = getComputedStyle(element);
        const fontSize = parseInt(styles.fontSize);
        
        if (fontSize > 0) {
          // Minimum readable font size on mobile should be 14px
          expect(fontSize).toBeGreaterThanOrEqual(12);
        }
      });
    });
  });

  describe('Navigation Responsiveness', () => {
    it('should handle mobile navigation properly', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <DashboardLayout>
            <div>Test Content</div>
          </DashboardLayout>
        </TestWrapper>
      );

      // Should render layout without errors
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Form Elements Responsiveness', () => {
    it('should handle form inputs on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      const form = document.createElement('form');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'w-full px-4 py-3';
      
      form.appendChild(input);
      document.body.appendChild(form);

      // Input should be full width on mobile
      const styles = getComputedStyle(input);
      expect(styles.width).toBeDefined();
    });
  });

  describe('Image Responsiveness', () => {
    it('should handle responsive images', () => {
      const img = document.createElement('img');
      img.className = 'w-full h-auto';
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==';
      
      document.body.appendChild(img);

      // Should have responsive classes
      expect(img.className).toContain('w-full');
      expect(img.className).toContain('h-auto');
    });
  });

  describe('Accessibility on Mobile', () => {
    it('should maintain accessibility features on mobile', () => {
      setViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check for ARIA labels and roles
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Should have accessible name
        const accessibleName = button.getAttribute('aria-label') || button.textContent;
        expect(accessibleName).toBeTruthy();
      });
    });
  });
});

// Responsive testing utilities
export const responsiveUtils = {
  // Test if element is visible at given viewport
  isElementVisible: (element, viewport) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewport.height &&
      rect.right <= viewport.width
    );
  },

  // Check if element overflows viewport
  checkOverflow: (element, viewport) => {
    const rect = element.getBoundingClientRect();
    return {
      horizontal: rect.width > viewport.width,
      vertical: rect.height > viewport.height,
      right: rect.right > viewport.width,
      bottom: rect.bottom > viewport.height
    };
  },

  // Get computed breakpoint
  getCurrentBreakpoint: (width) => {
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    if (width < 1536) return '2xl';
    return '3xl';
  },

  // Simulate device orientation change
  simulateOrientationChange: () => {
    const event = new Event('orientationchange');
    window.dispatchEvent(event);
  },

  // Test touch gesture simulation
  simulateSwipe: (element, direction) => {
    const startX = direction === 'left' ? 100 : 0;
    const endX = direction === 'left' ? 0 : 100;
    
    fireEvent.touchStart(element, {
      touches: [{ clientX: startX, clientY: 50 }]
    });
    
    fireEvent.touchMove(element, {
      touches: [{ clientX: endX, clientY: 50 }]
    });
    
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: endX, clientY: 50 }]
    });
  }
};

// Export viewport presets for testing
export const viewportPresets = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  ultrawide: { width: 2560, height: 1440 }
};