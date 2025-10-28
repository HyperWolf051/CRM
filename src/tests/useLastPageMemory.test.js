import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useLastPageMemory } from '../hooks/useLastPageMemory';
import storageManager from '../utils/storageManager';

// Mock the AuthContext
const mockUser = {
  id: 'user123',
  role: 'admin',
  email: 'test@example.com'
};

const mockAuthContext = {
  user: mockUser
};

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock the route permissions utility
vi.mock('@/utils/routePermissions', () => ({
  hasRoutePermission: vi.fn(() => true),
  getRedirectRoute: vi.fn(() => '/app/dashboard'),
  getDefaultDashboard: vi.fn(() => '/app/dashboard'),
  validateRouteAccess: vi.fn(() => ({ allowed: true, reason: null, redirectTo: null })),
  validateAndSanitizeRoute: vi.fn((path) => ({ 
    isValid: true, 
    sanitizedPath: path, 
    error: null, 
    fallbackPath: null 
  }))
}));

// Mock storage manager
vi.mock('../utils/storageManager', () => ({
  default: {
    set: vi.fn(() => true),
    get: vi.fn(() => null),
    remove: vi.fn(() => true),
    isAvailable: vi.fn(() => true)
  }
}));

// Mock the monitor
vi.mock('@/utils/lastPageMemoryMonitor', () => ({
  default: {
    logError: vi.fn(),
    logSuccess: vi.fn(),
    runDiagnostics: vi.fn(() => Promise.resolve({})),
    getHealthStatus: vi.fn(() => ({ status: 'healthy' }))
  }
}));

describe('useLastPageMemory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = mockUser;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setLastPage', () => {
    it('should store valid app page', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.setLastPage('/app/candidates');
      });

      expect(storageManager.set).toHaveBeenCalledWith(
        'lastVisitedPage_user123',
        expect.objectContaining({
          path: '/app/candidates',
          userRole: 'admin',
          userId: 'user123',
          timestamp: expect.any(Number)
        })
      );
    });

    it('should not store login page', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.setLastPage('/login');
      });

      expect(storageManager.set).not.toHaveBeenCalled();
    });

    it('should not store non-app routes', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.setLastPage('/public/about');
      });

      expect(storageManager.set).not.toHaveBeenCalled();
    });

    it('should not store when user is null', () => {
      mockAuthContext.user = null;
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.setLastPage('/app/candidates');
      });

      expect(storageManager.set).not.toHaveBeenCalled();
    });

    it('should not store empty path', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.setLastPage('');
      });

      expect(storageManager.set).not.toHaveBeenCalled();
    });
  });

  describe('getLastPage', () => {
    it('should return stored page for current user', () => {
      const mockPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'user123'
      };
      
      storageManager.get.mockReturnValue(mockPageState);
      
      const { result } = renderHook(() => useLastPageMemory());
      
      let lastPage;
      act(() => {
        lastPage = result.current.getLastPage();
      });

      expect(lastPage).toBe('/app/candidates');
      expect(storageManager.get).toHaveBeenCalledWith('lastVisitedPage_user123');
    });

    it('should return null when no stored page exists', () => {
      storageManager.get.mockReturnValue(null);
      
      const { result } = renderHook(() => useLastPageMemory());
      
      let lastPage;
      act(() => {
        lastPage = result.current.getLastPage();
      });

      expect(lastPage).toBeNull();
    });

    it('should clear and return null for different user', () => {
      const mockPageState = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'different_user'
      };
      
      storageManager.get.mockReturnValue(mockPageState);
      
      const { result } = renderHook(() => useLastPageMemory());
      
      let lastPage;
      act(() => {
        lastPage = result.current.getLastPage();
      });

      expect(lastPage).toBeNull();
      expect(storageManager.remove).toHaveBeenCalledWith('lastVisitedPage_user123');
    });

    it('should return null when user is null', () => {
      mockAuthContext.user = null;
      const { result } = renderHook(() => useLastPageMemory());
      
      let lastPage;
      act(() => {
        lastPage = result.current.getLastPage();
      });

      expect(lastPage).toBeNull();
      expect(storageManager.get).not.toHaveBeenCalled();
    });
  });

  describe('clearLastPage', () => {
    it('should remove stored page', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.clearLastPage();
      });

      expect(storageManager.remove).toHaveBeenCalledWith('lastVisitedPage_user123');
    });

    it('should not call remove when user is null', () => {
      mockAuthContext.user = null;
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.clearLastPage();
      });

      expect(storageManager.remove).not.toHaveBeenCalled();
    });
  });

  describe('isStorageAvailable', () => {
    it('should return storage availability status', () => {
      storageManager.isAvailable.mockReturnValue(true);
      
      const { result } = renderHook(() => useLastPageMemory());
      
      let isAvailable;
      act(() => {
        isAvailable = result.current.isStorageAvailable();
      });

      expect(isAvailable).toBe(true);
      expect(storageManager.isAvailable).toHaveBeenCalled();
    });
  });

  describe('handleRoleChange', () => {
    it('should not process when user is null', () => {
      mockAuthContext.user = null;
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.handleRoleChange('user', 'admin');
      });

      expect(storageManager.get).not.toHaveBeenCalled();
    });

    it('should not process when roles are the same', () => {
      const { result } = renderHook(() => useLastPageMemory());
      
      act(() => {
        result.current.handleRoleChange('admin', 'admin');
      });

      expect(storageManager.get).not.toHaveBeenCalled();
    });
  });
});