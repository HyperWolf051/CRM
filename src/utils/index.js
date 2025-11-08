// Utility Functions exports
// Export utilities as they are created

export { default as storageManager } from './storageManager';
export { ROUTE_PERMISSIONS, getDefaultDashboard, hasRoutePermission, getRedirectRoute } from './routePermissions';

// Change Tracking & Audit utilities
export { 
  detectChanges, 
  createChangeEntry, 
  candidateFieldConfig,
  validateChangeEntry,
  filterChangeHistory,
  exportChangeHistoryToCSV,
  calculateChangeStatistics
} from './changeTracking';

export { 
  generateMockChangeHistory, 
  generateMockCandidate 
} from './mockChangeHistory';
