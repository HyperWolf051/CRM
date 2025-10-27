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
   * Set data in storage with error handling
   */
  set(key, value) {
    if (!this.isAvailable()) {
      console.warn('No storage available for last page memory');
      return false;
    }

    try {
      const storage = this.getActiveStorage();
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, attempting to clear old entries');
        this.clearOldEntries();
        
        // Retry once after clearing
        try {
          const storage = this.getActiveStorage();
          const serializedValue = JSON.stringify(value);
          storage.setItem(key, serializedValue);
          return true;
        } catch (retryError) {
          console.error('Failed to store data after clearing old entries:', retryError);
          return false;
        }
      }
      
      console.error('Storage error:', error);
      return false;
    }
  }

  /**
   * Get data from storage with validation and corruption recovery
   */
  get(key) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const storage = this.getActiveStorage();
      const serializedValue = storage.getItem(key);
      
      if (!serializedValue) {
        return null;
      }

      const parsedValue = JSON.parse(serializedValue);
      
      // Validate data structure
      if (this.validateLastPageState(parsedValue)) {
        return parsedValue;
      } else {
        console.warn('Invalid last page state data, removing corrupted entry');
        this.remove(key);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data from storage:', error);
      // Remove corrupted data
      this.remove(key);
      return null;
    }
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