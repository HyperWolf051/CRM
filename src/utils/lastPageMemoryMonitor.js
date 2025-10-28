/**
 * Last Page Memory System Monitor
 * Provides health monitoring, diagnostics, and debugging utilities
 */

import storageManager from './storageManager';
import { getDefaultDashboard, validateRouteAccess } from './routePermissions';

class LastPageMemoryMonitor {
  constructor() {
    this.errors = [];
    this.metrics = {
      totalTrackedPages: 0,
      successfulRestorations: 0,
      failedRestorations: 0,
      storageErrors: 0,
      validationErrors: 0,
      permissionErrors: 0
    };
    this.maxErrorHistory = 100;
    this.isMonitoring = process.env.NODE_ENV === 'development';
  }

  /**
   * Log an error with context
   */
  logError(error, context = {}) {
    const errorEntry = {
      timestamp: Date.now(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        operation: context.operation || 'unknown',
        path: context.path,
        userRole: context.userRole,
        userId: context.userId,
        component: context.component,
        ...context
      },
      id: this.generateErrorId()
    };

    this.errors.push(errorEntry);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(-this.maxErrorHistory);
    }

    // Update metrics
    this.updateMetricsFromError(error, context);

    // Log to console in development
    if (this.isMonitoring) {
      console.group(`🚨 [LastPageMemoryMonitor] Error #${errorEntry.id}`);
      console.error('Error:', error);
      console.table(errorEntry.context);
      console.groupEnd();
    }

    return errorEntry.id;
  }

  /**
   * Log a successful operation
   */
  logSuccess(operation, context = {}) {
    if (operation === 'pageTracked') {
      this.metrics.totalTrackedPages++;
    } else if (operation === 'pageRestored') {
      this.metrics.successfulRestorations++;
    }

    if (this.isMonitoring && context.path) {
      console.log(`✅ [LastPageMemoryMonitor] ${operation}: ${context.path}`);
    }
  }

  /**
   * Update metrics based on error type
   */
  updateMetricsFromError(error, context) {
    if (context.operation === 'pageRestoration') {
      this.metrics.failedRestorations++;
    }

    if (error.name === 'QuotaExceededError' || error.message?.includes('storage')) {
      this.metrics.storageErrors++;
    }

    if (context.operation === 'routeValidation' || error.message?.includes('validation')) {
      this.metrics.validationErrors++;
    }

    if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
      this.metrics.permissionErrors++;
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get system health status
   */
  getHealthStatus() {
    const recentErrors = this.getRecentErrors(5 * 60 * 1000); // Last 5 minutes
    const errorRate = recentErrors.length;
    const totalOperations = this.metrics.totalTrackedPages + this.metrics.successfulRestorations;
    const successRate = totalOperations > 0 ? 
      (this.metrics.successfulRestorations / totalOperations) * 100 : 100;

    let status = 'healthy';
    let issues = [];

    if (errorRate > 10) {
      status = 'critical';
      issues.push('High error rate detected');
    } else if (errorRate > 5) {
      status = 'warning';
      issues.push('Elevated error rate');
    }

    if (successRate < 80) {
      status = status === 'healthy' ? 'warning' : 'critical';
      issues.push('Low success rate for page restoration');
    }

    if (this.metrics.storageErrors > 5) {
      status = status === 'healthy' ? 'warning' : 'critical';
      issues.push('Multiple storage errors detected');
    }

    return {
      status,
      issues,
      metrics: { ...this.metrics },
      recentErrorCount: errorRate,
      successRate: Math.round(successRate),
      storageAvailable: storageManager.isAvailable(),
      storageInfo: storageManager.getStorageInfo()
    };
  }

  /**
   * Get recent errors within a time window
   */
  getRecentErrors(timeWindowMs = 60000) {
    const cutoff = Date.now() - timeWindowMs;
    return this.errors.filter(error => error.timestamp > cutoff);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errorsByType = {};
    const errorsByOperation = {};
    const errorsByComponent = {};

    this.errors.forEach(errorEntry => {
      const errorType = errorEntry.error.name || 'Unknown';
      const operation = errorEntry.context.operation || 'unknown';
      const component = errorEntry.context.component || 'unknown';

      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
      errorsByOperation[operation] = (errorsByOperation[operation] || 0) + 1;
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1;
    });

    return {
      totalErrors: this.errors.length,
      errorsByType,
      errorsByOperation,
      errorsByComponent,
      recentErrors: this.getRecentErrors().length
    };
  }

  /**
   * Perform system diagnostics
   */
  async runDiagnostics(userId, userRole) {
    const diagnostics = {
      timestamp: Date.now(),
      storage: this.diagnoseStorage(),
      permissions: this.diagnosePermissions(userRole),
      userContext: this.diagnoseUserContext(userId, userRole),
      systemHealth: this.getHealthStatus()
    };

    if (this.isMonitoring) {
      console.group('🔍 [LastPageMemoryMonitor] System Diagnostics');
      console.log('Storage:', diagnostics.storage);
      console.log('Permissions:', diagnostics.permissions);
      console.log('User Context:', diagnostics.userContext);
      console.log('System Health:', diagnostics.systemHealth);
      console.groupEnd();
    }

    return diagnostics;
  }

  /**
   * Diagnose storage issues
   */
  diagnoseStorage() {
    const diagnosis = {
      available: storageManager.isAvailable(),
      info: storageManager.getStorageInfo(),
      issues: []
    };

    if (!diagnosis.available) {
      diagnosis.issues.push('No storage available');
    }

    // Test storage functionality
    try {
      const testKey = '__lastPageMemory_test__';
      const testData = { test: true, timestamp: Date.now() };
      
      const setResult = storageManager.set(testKey, testData);
      if (!setResult) {
        diagnosis.issues.push('Storage write test failed');
      }

      const getData = storageManager.get(testKey);
      if (!getData || getData.test !== true) {
        diagnosis.issues.push('Storage read test failed');
      }

      storageManager.remove(testKey);
    } catch (error) {
      diagnosis.issues.push(`Storage test error: ${error.message}`);
    }

    return diagnosis;
  }

  /**
   * Diagnose permission system
   */
  diagnosePermissions(userRole) {
    const diagnosis = {
      userRole,
      issues: []
    };

    if (!userRole) {
      diagnosis.issues.push('No user role provided');
      return diagnosis;
    }

    // Test common routes for the user role
    const testRoutes = [
      '/app/dashboard',
      '/app/contacts',
      '/app/candidates',
      '/app/team',
      '/app/recruiter/dashboard'
    ];

    const accessResults = {};
    testRoutes.forEach(route => {
      try {
        const validation = validateRouteAccess(route, userRole);
        accessResults[route] = {
          allowed: validation.allowed,
          reason: validation.reason
        };
      } catch (error) {
        accessResults[route] = {
          allowed: false,
          reason: 'validation_error',
          error: error.message
        };
        diagnosis.issues.push(`Route validation error for ${route}: ${error.message}`);
      }
    });

    diagnosis.routeAccess = accessResults;
    return diagnosis;
  }

  /**
   * Diagnose user context issues
   */
  diagnoseUserContext(userId, userRole) {
    const diagnosis = {
      userId,
      userRole,
      issues: []
    };

    if (!userId) {
      diagnosis.issues.push('No user ID provided');
    }

    if (!userRole) {
      diagnosis.issues.push('No user role provided');
    }

    // Check for stored data for this user
    if (userId) {
      try {
        const storageKey = `lastVisitedPage_${userId}`;
        const storedData = storageManager.get(storageKey);
        
        diagnosis.hasStoredData = !!storedData;
        
        if (storedData) {
          diagnosis.storedData = {
            path: storedData.path,
            timestamp: storedData.timestamp,
            userRole: storedData.userRole,
            age: Date.now() - storedData.timestamp
          };

          // Check for data consistency issues
          if (storedData.userId !== userId) {
            diagnosis.issues.push('Stored data user ID mismatch');
          }

          if (storedData.userRole !== userRole) {
            diagnosis.issues.push('Stored data user role mismatch');
          }

          // Check if stored data is too old
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          if (storedData.timestamp < sevenDaysAgo) {
            diagnosis.issues.push('Stored data is expired');
          }
        }
      } catch (error) {
        diagnosis.issues.push(`Error checking stored data: ${error.message}`);
      }
    }

    return diagnosis;
  }

  /**
   * Clear all monitoring data
   */
  reset() {
    this.errors = [];
    this.metrics = {
      totalTrackedPages: 0,
      successfulRestorations: 0,
      failedRestorations: 0,
      storageErrors: 0,
      validationErrors: 0,
      permissionErrors: 0
    };

    if (this.isMonitoring) {
      console.log('🔄 [LastPageMemoryMonitor] Monitor data reset');
    }
  }

  /**
   * Export monitoring data for debugging
   */
  exportData() {
    return {
      timestamp: Date.now(),
      errors: this.errors,
      metrics: this.metrics,
      healthStatus: this.getHealthStatus(),
      errorStats: this.getErrorStats()
    };
  }

  /**
   * Enable or disable monitoring
   */
  setMonitoring(enabled) {
    this.isMonitoring = enabled;
    if (enabled) {
      console.log('📊 [LastPageMemoryMonitor] Monitoring enabled');
    }
  }
}

// Create singleton instance
const lastPageMemoryMonitor = new LastPageMemoryMonitor();

export default lastPageMemoryMonitor;