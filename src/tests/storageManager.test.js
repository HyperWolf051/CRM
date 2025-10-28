import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import storageManager from '../utils/storageManager';

// Mock localStorage and sessionStorage
const createMockStorage = (shouldThrow = false, quotaExceeded = false) => ({
  getItem: vi.fn((key) => {
    if (shouldThrow) throw new Error('Storage error');
    return null;
  }),
  setItem: vi.fn((key, value) => {
    if (quotaExceeded) {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    }
    if (shouldThrow) throw new Error('Storage error');
  }),
  removeItem: vi.fn((key) => {
    if (shouldThrow) throw new Error('Storage error');
  }),
  key: vi.fn((index) => `testKey${index}`),
  length: 0
});

describe('StorageManager', () => {
  let mockLocalStorage;
  let mockSessionStorage;
  let originalLocalStorage;
  let originalSessionStorage;

  beforeEach(() => {
    // Store original storage objects
    originalLocalStorage = window.localStorage;
    originalSessionStorage = window.sessionStorage;

    // Create fresh mocks
    mockLocalStorage = createMockStorage();
    mockSessionStorage = createMockStorage();

    // Replace window storage objects
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });

    // Reset storage manager properties
    storageManager.primaryStorage = null;
    storageManager.fallbackStorage = null;
    storageManager.initializeStorage();
  });

  afterEach(() => {
    // Restore original storage objects
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true
    });
    
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with localStorage as primary storage', () => {
      expect(storageManager.isAvailable()).toBe(true);
      expect(storageManager.getStorageInfo().primaryAvailable).toBe(true);
      expect(storageManager.getStorageInfo().activeStorage).toBe('localStorage');
    });

    it('should fallback to sessionStorage when localStorage fails', () => {
      // Mock localStorage to fail
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      // Reset and reinitialize storage manager
      storageManager.primaryStorage = null;
      storageManager.fallbackStorage = null;
      storageManager.initializeStorage();

      expect(storageManager.isAvailable()).toBe(true);
      expect(storageManager.getStorageInfo().primaryAvailable).toBe(false);
      expect(storageManager.getStorageInfo().fallbackAvailable).toBe(true);
      expect(storageManager.getStorageInfo().activeStorage).toBe('sessionStorage');
    });

    it('should handle no storage available', () => {
      // Mock both storages to fail
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('sessionStorage not available');
      });

      // Reset and reinitialize storage manager
      storageManager.primaryStorage = null;
      storageManager.fallbackStorage = null;
      storageManager.initializeStorage();

      expect(storageManager.isAvailable()).toBe(false);
      expect(storageManager.getStorageInfo().activeStorage).toBe('none');
    });
  });

  describe('set method', () => {
    it('should store data successfully', () => {
      const testData = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'user123'
      };

      const result = storageManager.set('testKey', testData);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );
    });

    it('should return false when no storage available', () => {
      // Mock both storages to fail initialization
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('sessionStorage not available');
      });

      // Reset and reinitialize storage manager
      storageManager.primaryStorage = null;
      storageManager.fallbackStorage = null;
      storageManager.initializeStorage();

      const result = storageManager.set('testKey', { test: 'data' });

      expect(result).toBe(false);
    });

    it('should handle quota exceeded error and retry after clearing', () => {
      // Reset call count
      mockLocalStorage.setItem.mockClear();
      
      // First call throws quota exceeded, second call succeeds
      mockLocalStorage.setItem
        .mockImplementationOnce(() => {
          const error = new Error('QuotaExceededError');
          error.name = 'QuotaExceededError';
          throw error;
        })
        .mockImplementationOnce(() => {
          // Success on retry
        });

      // Mock clearOldEntries method
      const clearOldEntriesSpy = vi.spyOn(storageManager, 'clearOldEntries').mockImplementation(() => {});

      const result = storageManager.set('testKey', { test: 'data' });

      expect(result).toBe(true);
      expect(clearOldEntriesSpy).toHaveBeenCalled();
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should return false when quota exceeded persists after retry', () => {
      // Both calls throw quota exceeded
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const clearOldEntriesSpy = vi.spyOn(storageManager, 'clearOldEntries').mockImplementation(() => {});

      const result = storageManager.set('testKey', { test: 'data' });

      expect(result).toBe(false);
      expect(clearOldEntriesSpy).toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should retrieve and parse valid data', () => {
      const testData = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'user123'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = storageManager.get('testKey');

      expect(result).toEqual(testData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('should return null when no data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storageManager.get('testKey');

      expect(result).toBeNull();
    });

    it('should return null when no storage available', () => {
      // Mock both storages to fail initialization
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('sessionStorage not available');
      });

      storageManager.initializeStorage();

      const result = storageManager.get('testKey');

      expect(result).toBeNull();
    });

    it('should handle corrupted data and remove it', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const result = storageManager.get('testKey');

      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should validate data structure and remove invalid data', () => {
      const invalidData = {
        path: '/app/candidates',
        // missing required fields
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(invalidData));

      const result = storageManager.get('testKey');

      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey');
    });
  });

  describe('remove method', () => {
    it('should remove data successfully', () => {
      const result = storageManager.remove('testKey');

      expect(result).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should return false when no storage available', () => {
      // Mock both storages to fail initialization
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('sessionStorage not available');
      });

      // Reset and reinitialize storage manager
      storageManager.primaryStorage = null;
      storageManager.fallbackStorage = null;
      storageManager.initializeStorage();

      const result = storageManager.remove('testKey');

      expect(result).toBe(false);
    });

    it('should handle removal errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      const result = storageManager.remove('testKey');

      expect(result).toBe(false);
    });
  });

  describe('validateLastPageState', () => {
    it('should validate correct data structure', () => {
      const validData = {
        path: '/app/candidates',
        timestamp: Date.now(),
        userRole: 'admin',
        userId: 'user123'
      };

      const result = storageManager.validateLastPageState(validData);

      expect(result).toBe(true);
    });

    it('should reject invalid data structures', () => {
      const invalidCases = [
        null,
        undefined,
        'string',
        123,
        {},
        { path: '' }, // empty path
        { path: '/app/test' }, // missing fields
        { path: '/app/test', timestamp: 'invalid' }, // wrong type
        { path: '/app/test', timestamp: 0 }, // invalid timestamp
        { path: '/app/test', timestamp: Date.now(), userRole: '' }, // empty role
      ];

      invalidCases.forEach(invalidData => {
        const result = storageManager.validateLastPageState(invalidData);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('clearOldEntries', () => {
    it('should clear entries older than 30 days', () => {
      const thirtyOneDaysAgo = Date.now() - (31 * 24 * 60 * 60 * 1000);
      const oldData = {
        path: '/app/old',
        timestamp: thirtyOneDaysAgo,
        userRole: 'admin',
        userId: 'user123'
      };

      // Ensure storage is available
      expect(storageManager.isAvailable()).toBe(true);

      // Clear previous calls
      mockLocalStorage.removeItem.mockClear();
      mockLocalStorage.key.mockClear();
      mockLocalStorage.getItem.mockClear();
      
      // Create a more complete mock that behaves like real localStorage
      const mockStorage = {
        ...mockLocalStorage,
        length: 1,
        key: vi.fn((index) => {
          if (index === 0) return 'lastVisitedPage_user123';
          return null;
        }),
        getItem: vi.fn((key) => {
          if (key === 'lastVisitedPage_user123') return JSON.stringify(oldData);
          return null;
        }),
        removeItem: vi.fn()
      };

      // Replace the storage manager's primary storage with our mock
      storageManager.primaryStorage = mockStorage;

      storageManager.clearOldEntries();

      expect(mockStorage.removeItem).toHaveBeenCalledWith('lastVisitedPage_user123');
    });

    it('should remove corrupted entries', () => {
      // Ensure storage is available
      expect(storageManager.isAvailable()).toBe(true);

      // Create a more complete mock that behaves like real localStorage
      const mockStorage = {
        ...mockLocalStorage,
        length: 1,
        key: vi.fn((index) => {
          if (index === 0) return 'lastVisitedPage_user123';
          return null;
        }),
        getItem: vi.fn((key) => {
          if (key === 'lastVisitedPage_user123') return 'corrupted json';
          return null;
        }),
        removeItem: vi.fn()
      };

      // Replace the storage manager's primary storage with our mock
      storageManager.primaryStorage = mockStorage;

      storageManager.clearOldEntries();

      expect(mockStorage.removeItem).toHaveBeenCalledWith('lastVisitedPage_user123');
    });

    it('should handle errors during clearing gracefully', () => {
      mockLocalStorage.length = 1;
      mockLocalStorage.key.mockImplementation(() => {
        throw new Error('Key access error');
      });

      // Should not throw
      expect(() => storageManager.clearOldEntries()).not.toThrow();
    });
  });
});