/**
 * Storage Manager utility for last page memory system
 * Provides localStorage/sessionStorage fallback with error handling
 */

class StorageManager {
  constructor() {
    this.primaryStorage = null;
    this.fallbackStorage = null;
    this.initializeStorage();
  }

  /**
   * Initialize storage with fallback mechanism
   */
  initializeStorage() {
    // Test localStorage availability
    if (this.testStorage(window.localStorage)) {
      this.primaryStorage = window.localStorage;
    }

    // Test sessionStorage availability as fallback
    if (this.testStorage(window.sessionStorage)) {
      this.fallbackStorage = window.sessionStorage;
    }
  }

  /**
   * Test if a storage mechanism is available and working
   */
  testStorage(storage) {
    try {
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the active storage (primary or fallback)
   */
  getActiveStorage() {
    return this.primaryStorage || this.fallbackStorage;
  }

  /**
   * Check if any storage is available
   */
  isAvailable() {
    return !!(this.primaryStorage || this.fallbackStorage);
  }

  /**
   * Set data in storage with comprehensive error handling
   */
  set(key, value) {
    if (!this.isAvailable()) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageManager] No storage available for last page memory');
      }
      return false;
    }

    // Validate input parameters
    if (!key || typeof key !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageManager] Invalid key provided:', key);
      }
      return false;
    }

    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageManager] Undefined value provided for key:', key);
      }
      return false;
    }

    try {
      const storage = this.getActiveStorage();
      
      // Validate data before serialization
      if (!this.validateDataForStorage(value)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[StorageManager] Invalid data structure for storage:', value);
        }
        return false;
      }

      const serializedValue = JSON.stringify(value);
      
      // Check if serialized value is too large (most browsers limit to ~5-10MB)
      if (serializedValue.length > 5 * 1024 * 1024) { // 5MB limit
        if (process.env.NODE_ENV === 'development') {
          console.warn('[StorageManager] Data too large for storage:', serializedValue.length, 'bytes');
        }
        return false;
      }

      storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      return this.handleStorageError(error, 'set', key, value);
    }
  }

  /**
   * Handle storage errors with comprehensive fallback strategies
   */
  handleStorageError(error, operation, key, value = null) {
    const errorInfo = {
      operation,
      key,
      error: error.message,
      errorName: error.name,
      timestamp: Date.now()
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('[StorageManager] Storage error:', errorInfo);
    }

    // Handle quota exceeded errors
    if (error.name === 'QuotaExceededError') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageManager] Storage quota exceeded, attempting cleanup');
      }

      try {
        // Clear old entries
        this.clearOldEntries();
        
        // Try to clear some additional space by removing non-essential items
        this.emergencyCleanup();

        // Retry the operation once after clearing
        if (operation === 'set' && key && value !== null) {
          try {
            const storage = this.getActiveStorage();
            const serializedValue = JSON.stringify(value);
            storage.setItem(key, serializedValue);
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorageManager] Successfully stored data after cleanup');
            }
            return true;
          } catch (retryError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[StorageManager] Failed to store data after cleanup:', retryError);
            }
            return false;
          }
        }
      } catch (cleanupError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[StorageManager] Cleanup failed:', cleanupError);
        }
        return false;
      }
    }

    // Handle security errors (private browsing, etc.)
    if (error.name === 'SecurityError') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageManager] Storage access denied due to security restrictions');
      }
      
      // Try fallback storage
      if (this.primaryStorage && this.fallbackStorage) {
        try {
          if (operation === 'set' && key && value !== null) {
            const serializedValue = JSON.stringify(value);
            this.fallbackStorage.setItem(key, serializedValue);
            return true;
          }
        } catch (fallbackError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[StorageManager] Fallback storage also failed:', fallbackError);
          }
        }
      }
      return false;
    }

    // Handle data corruption or serialization errors
    if (error.name === 'DataError' || error.message?.includes('serialize')) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageManager] Data serialization error, attempting to clean corrupted data');
      }
      
      // Remove potentially corrupted entry
      if (operation === 'get' && key) {
        try {
          this.remove(key);
        } catch (removeError) {
          // Ignore removal errors
        }
      }
      return false;
    }

    // Generic error handling
    if (process.env.NODE_ENV === 'development') {
      console.error('[StorageManager] Unhandled storage error:', error);
    }
    return false;
  }

  /**
   * Validate data structure before storage
   */
  validateDataForStorage(data) {
    try {
      // Check for circular references
      JSON.stringify(data);
      
      // For last page state, validate specific structure
      if (data && typeof data === 'object' && data.path) {
        return this.validateLastPageState(data);
      }
      
      // For other data types, basic validation
      return data !== null && data !== undefined;
    } catch (error) {
      return false;
    }
  }

  /**
   * Emergency cleanup to free up storage space
   */
  emergencyCleanup() {
    if (!this.isAvailable()) return;

    try {
      const storage = this.getActiveStorage();
      const keysToRemove = [];
      
      // Remove any keys that look corrupted or invalid
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          try {
            const value = storage.getItem(key);
            if (!value || value === 'undefined' || value === 'null') {
              keysToRemove.push(key);
            } else {
              // Try to parse the value
              JSON.parse(value);
            }
          } catch (e) {
            // If we can't parse it, it's corrupted
            keysToRemove.push(key);
          }
        }
      }

      // Remove corrupted entries
      keysToRemove.forEach(key => {
        try {
          storage.removeItem(key);
        } catch (e) {
          // Ignore individual removal errors
        }
      });

      if (process.env.NODE_ENV === 'development' && keysToRemove.length > 0) {
        console.log(`[StorageManager] Emergency cleanup removed ${keysToRemove.length} corrupted entries`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageManager] Emergency cleanup failed:', error);
      }
    }
  }

  /**
   * Get data from storage with comprehensive validation and corruption recovery
   */
  get(key) {
    if (!this.isAvailable()) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageManager] No storage available for retrieval');
      }
      return null;
    }

    // Validate input key
    if (!key || typeof key !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.error('[StorageManager] Invalid key provided for get operation:', key);
      }
      return null;
    }

    try {
      const storage = this.getActiveStorage();
      const serializedValue = storage.getItem(key);
      
      if (!serializedValue) {
        return null;
      }

      // Check for obviously corrupted data
      if (serializedValue === 'undefined' || serializedValue === 'null' || serializedValue.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[StorageManager] Found corrupted data for key:', key);
        }
        this.remove(key);
        return null;
      }

      let parsedValue;
      try {
        parsedValue = JSON.parse(serializedValue);
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[StorageManager] JSON parse error for key:', key, parseError);
        }
        // Remove corrupted data
        this.remove(key);
        return null;
      }

      // Validate data structure based on key type
      if (key.includes('lastVisitedPage')) {
        if (this.validateLastPageState(parsedValue)) {
          // Additional validation for expired data
          if (this.isDataExpired(parsedValue)) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[StorageManager] Removing expired data for key:', key);
            }
            this.remove(key);
            return null;
          }
          return parsedValue;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[StorageManager] Invalid last page state data structure, removing corrupted entry:', key);
          }
          this.remove(key);
          return null;
        }
      }

      // For other data types, basic validation
      if (parsedValue !== null && parsedValue !== undefined) {
        // If it looks like it should be a last page state but key doesn't match pattern,
        // still validate it (for backward compatibility and test cases)
        if (parsedValue && typeof parsedValue === 'object' && parsedValue.path) {
          if (!this.validateLastPageState(parsedValue)) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[StorageManager] Invalid data structure detected, removing corrupted entry:', key);
            }
            this.remove(key);
            return null;
          }
        }
        return parsedValue;
      }

      return null;
    } catch (error) {
      return this.handleStorageError(error, 'get', key);
    }
  }

  /**
   * Check if stored data has expired
   */
  isDataExpired(data, maxAgeMs = 7 * 24 * 60 * 60 * 1000) { // Default 7 days
    if (!data || !data.timestamp || typeof data.timestamp !== 'number') {
      return true; // Consider invalid timestamp as expired
    }

    const now = Date.now();
    const age = now - data.timestamp;
    
    // Check for future timestamps (clock skew or tampering)
    if (data.timestamp > now + (5 * 60 * 1000)) { // 5 minutes tolerance
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StorageManager] Future timestamp detected, considering expired');
      }
      return true;
    }

    return age > maxAgeMs;
  }

  /**
   * Remove data from storage
   */
  remove(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const storage = this.getActiveStorage();
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data from storage:', error);
      return false;
    }
  }

  /**
   * Validate LastPageState data structure
   */
  validateLastPageState(data) {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.path === 'string' &&
      typeof data.timestamp === 'number' &&
      typeof data.userRole === 'string' &&
      typeof data.userId === 'string' &&
      data.path.length > 0 &&
      data.timestamp > 0
    );
  }

  /**
   * Clear old entries to free up storage space
   * Removes entries older than 30 days
   */
  clearOldEntries() {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const storage = this.getActiveStorage();
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const keysToRemove = [];

      // Find old entries
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.includes('lastVisitedPage')) {
          try {
            const value = storage.getItem(key);
            const parsedValue = JSON.parse(value);
            if (parsedValue.timestamp && parsedValue.timestamp < thirtyDaysAgo) {
              keysToRemove.push(key);
            }
          } catch (e) {
            // If we can't parse it, it's probably corrupted, so remove it
            keysToRemove.push(key);
          }
        }
      }

      // Remove old entries
      keysToRemove.forEach(key => storage.removeItem(key));
      
      if (keysToRemove.length > 0) {
        console.log(`Cleared ${keysToRemove.length} old last page memory entries`);
      }
    } catch (error) {
      console.error('Error clearing old entries:', error);
    }
  }

  /**
   * Get storage info for debugging
   */
  getStorageInfo() {
    return {
      primaryAvailable: !!this.primaryStorage,
      fallbackAvailable: !!this.fallbackStorage,
      activeStorage: this.primaryStorage ? 'localStorage' : 
                    this.fallbackStorage ? 'sessionStorage' : 'none'
    };
  }
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager;