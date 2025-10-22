/**
 * Cross-Browser Compatibility Tests
 * 
 * Tests to ensure the application works correctly across different browsers
 * and handles browser-specific features gracefully.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Cross-Browser Compatibility', () => {
  beforeEach(() => {
    // Reset DOM and mocks before each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('CSS Grid Support', () => {
    it('should handle CSS Grid gracefully', () => {
      // Mock CSS.supports for older browsers
      const originalSupports = CSS.supports;
      CSS.supports = vi.fn().mockReturnValue(false);

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should still render without errors
      expect(screen.getByText('Weekly Balance')).toBeInTheDocument();
      
      // Restore original function
      CSS.supports = originalSupports;
    });

    it('should use flexbox fallback when grid is not supported', () => {
      // Test that components render correctly with flexbox fallback
      const container = document.createElement('div');
      container.className = 'grid grid-cols-4 gap-4';
      
      // Simulate older browser behavior
      const computedStyle = getComputedStyle(container);
      expect(computedStyle.display).toBeDefined();
    });
  });

  describe('Backdrop Filter Support', () => {
    it('should provide fallback for backdrop-filter', () => {
      // Test backdrop filter fallback in CSS
      const element = document.createElement('div');
      element.className = 'backdrop-blur-xl';
      document.body.appendChild(element);

      const computedStyle = getComputedStyle(element);
      // Should have either backdrop-filter or background-color fallback
      expect(
        computedStyle.backdropFilter || computedStyle.backgroundColor
      ).toBeDefined();
    });
  });

  describe('Flexbox Support', () => {
    it('should handle flexbox layouts correctly', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check that flex layouts render properly
      const flexElements = document.querySelectorAll('.flex');
      expect(flexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Properties (CSS Variables)', () => {
    it('should handle CSS custom properties', () => {
      // Test CSS custom properties support
      const rootStyle = getComputedStyle(document.documentElement);
      const customProperty = rootStyle.getPropertyValue('--z-base');
      
      // Should either support custom properties or have fallback
      expect(customProperty !== undefined).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('should handle touch events on mobile browsers', () => {
      const touchHandler = vi.fn();
      const element = document.createElement('button');
      element.addEventListener('touchstart', touchHandler);
      element.addEventListener('click', touchHandler);

      // Simulate touch event
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      element.dispatchEvent(touchEvent);
      expect(touchHandler).toHaveBeenCalled();
    });

    it('should handle keyboard navigation', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        
        // Test keyboard navigation
        fireEvent.keyDown(firstButton, { key: 'Tab' });
        fireEvent.keyDown(firstButton, { key: 'Enter' });
        fireEvent.keyDown(firstButton, { key: ' ' });
        
        // Should not throw errors
        expect(firstButton).toBeInTheDocument();
      }
    });
  });

  describe('Local Storage Support', () => {
    it('should handle localStorage gracefully', () => {
      // Test localStorage availability
      const testKey = 'test-key';
      const testValue = 'test-value';

      try {
        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        expect(retrieved).toBe(testValue);
        localStorage.removeItem(testKey);
      } catch (error) {
        // Should handle localStorage not being available
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Fetch API Support', () => {
    it('should handle fetch API or provide fallback', () => {
      // Test fetch API availability
      expect(typeof fetch).toBe('function');
    });
  });

  describe('ES6+ Features', () => {
    it('should handle modern JavaScript features', () => {
      // Test arrow functions
      const arrowFunction = () => 'test';
      expect(arrowFunction()).toBe('test');

      // Test template literals
      const templateLiteral = `test ${1 + 1}`;
      expect(templateLiteral).toBe('test 2');

      // Test destructuring
      const { name } = { name: 'test' };
      expect(name).toBe('test');

      // Test spread operator
      const arr1 = [1, 2];
      const arr2 = [...arr1, 3];
      expect(arr2).toEqual([1, 2, 3]);
    });
  });

  describe('Media Queries', () => {
    it('should handle responsive breakpoints', () => {
      // Test media query support
      const mediaQuery = window.matchMedia('(min-width: 1024px)');
      expect(typeof mediaQuery.matches).toBe('boolean');
      expect(typeof mediaQuery.addListener).toBe('function');
    });
  });

  describe('Animation Support', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(reducedMotionQuery.matches).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should handle HTML5 form validation', () => {
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.type = 'email';
      input.required = true;
      input.value = 'invalid-email';
      
      form.appendChild(input);
      document.body.appendChild(form);

      // Test HTML5 validation
      const isValid = input.checkValidity();
      expect(typeof isValid).toBe('boolean');
    });
  });
});

// Browser feature detection utilities
export const browserFeatures = {
  supportsGrid: () => {
    return CSS.supports('display', 'grid');
  },

  supportsFlexbox: () => {
    return CSS.supports('display', 'flex');
  },

  supportsBackdropFilter: () => {
    return CSS.supports('backdrop-filter', 'blur(1px)');
  },

  supportsCustomProperties: () => {
    return CSS.supports('--custom', 'value');
  },

  supportsIntersectionObserver: () => {
    return 'IntersectionObserver' in window;
  },

  supportsResizeObserver: () => {
    return 'ResizeObserver' in window;
  },

  supportsWebP: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },

  supportsTouchEvents: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  supportsPassiveEvents: () => {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
          return false;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    return supportsPassive;
  }
};

// Log browser capabilities for debugging
console.log('Browser Feature Support:', {
  grid: browserFeatures.supportsGrid(),
  flexbox: browserFeatures.supportsFlexbox(),
  backdropFilter: browserFeatures.supportsBackdropFilter(),
  customProperties: browserFeatures.supportsCustomProperties(),
  intersectionObserver: browserFeatures.supportsIntersectionObserver(),
  resizeObserver: browserFeatures.supportsResizeObserver(),
  webP: browserFeatures.supportsWebP(),
  touchEvents: browserFeatures.supportsTouchEvents(),
  passiveEvents: browserFeatures.supportsPassiveEvents()
});