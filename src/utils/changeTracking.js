/**
 * Change Tracking Utility
 * Provides comprehensive change detection, logging, and audit trail functionality
 * for candidate data modifications with GDPR/CCPA compliance support
 */

/**
 * Detects changes between two objects and generates detailed change records
 * @param {Object} oldData - Previous state of the object
 * @param {Object} newData - New state of the object
 * @param {Object} fieldConfig - Configuration for field display names and sensitivity
 * @returns {Array} Array of field changes with old/new values and descriptions
 */
export const detectChanges = (oldData, newData, fieldConfig = {}) => {
  const changes = [];
  
  // Get all unique keys from both objects
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {})
  ]);
  
  allKeys.forEach(key => {
    const oldValue = oldData?.[key];
    const newValue = newData?.[key];
    
    // Skip if values are the same
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
      return;
    }
    
    // Skip internal fields
    if (key.startsWith('_') || key === 'changeHistory' || key === 'updatedAt') {
      return;
    }
    
    const fieldDisplayName = fieldConfig[key]?.displayName || formatFieldName(key);
    const isSensitive = fieldConfig[key]?.sensitive || false;
    
    changes.push({
      field: key,
      fieldDisplayName,
      oldValue: isSensitive ? maskSensitiveData(oldValue) : formatValue(oldValue),
      newValue: isSensitive ? maskSensitiveData(newValue) : formatValue(newValue),
      changeDescription: generateChangeDescription(fieldDisplayName, oldValue, newValue),
      isSensitive
    });
  });
  
  return changes;
};

/**
 * Creates a change history entry for audit trail
 * @param {Object} params - Change entry parameters
 * @returns {Object} Formatted change history entry
 */
export const createChangeEntry = ({
  candidateId,
  changedBy,
  changedByName,
  changeType,
  changes = [],
  reason = '',
  metadata = {}
}) => {
  return {
    id: generateChangeId(),
    candidateId,
    changedBy,
    changedByName,
    changeType,
    changes,
    timestamp: new Date().toISOString(),
    reason,
    ipAddress: metadata.ipAddress || 'unknown',
    userAgent: metadata.userAgent || navigator.userAgent,
    sessionId: metadata.sessionId || generateSessionId()
  };
};

/**
 * Formats field names for display (camelCase to Title Case)
 */
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Formats values for display in change history
 */
const formatValue = (value) => {
  if (value === null || value === undefined) {
    return 'Empty';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Empty';
    }
    return JSON.stringify(value);
  }
  
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...';
  }
  
  return String(value);
};

/**
 * Masks sensitive data for privacy compliance
 */
const maskSensitiveData = (value) => {
  if (!value) return 'Empty';
  
  const str = String(value);
  
  // Email masking
  if (str.includes('@')) {
    const [local, domain] = str.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  }
  
  // Phone masking
  if (/^\+?\d{10,}$/.test(str.replace(/[\s-()]/g, ''))) {
    return `***${str.slice(-4)}`;
  }
  
  // Default masking
  return '***';
};

/**
 * Generates human-readable change description
 */
const generateChangeDescription = (fieldName, oldValue, newValue) => {
  if (!oldValue || oldValue === 'Empty') {
    return `${fieldName} was set to "${formatValue(newValue)}"`;
  }
  
  if (!newValue || newValue === 'Empty') {
    return `${fieldName} was cleared (was "${formatValue(oldValue)}")`;
  }
  
  return `${fieldName} changed from "${formatValue(oldValue)}" to "${formatValue(newValue)}"`;
};

/**
 * Generates unique change ID
 */
const generateChangeId = () => {
  return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates session ID for tracking
 */
const generateSessionId = () => {
  const sessionId = sessionStorage.getItem('audit_session_id');
  if (sessionId) return sessionId;
  
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('audit_session_id', newSessionId);
  return newSessionId;
};

/**
 * Field configuration for candidate data
 * Defines display names and sensitivity flags
 */
export const candidateFieldConfig = {
  // Personal Information
  name: { displayName: 'Full Name', sensitive: false },
  email: { displayName: 'Email Address', sensitive: true },
  phone: { displayName: 'Phone Number', sensitive: true },
  location: { displayName: 'Location', sensitive: false },
  
  // Professional Information
  designation: { displayName: 'Current Designation', sensitive: false },
  currentCompany: { displayName: 'Current Company', sensitive: false },
  industry: { displayName: 'Industry', sensitive: false },
  totalExperience: { displayName: 'Total Experience', sensitive: false },
  qualification: { displayName: 'Qualification', sensitive: false },
  
  // Salary Information
  lastSalary: { displayName: 'Last Salary', sensitive: true },
  salaryExpectation: { displayName: 'Salary Expectation', sensitive: true },
  
  // Application Information
  interestedFor: { displayName: 'Position Interested For', sensitive: false },
  allocation: { displayName: 'Sheet Allocation', sensitive: false },
  
  // Status Fields
  currentStage: { displayName: 'Current Stage', sensitive: false },
  overallStatus: { displayName: 'Overall Status', sensitive: false },
  
  // Ownership
  createdBy: { displayName: 'Created By', sensitive: false },
  createdByName: { displayName: 'Created By Name', sensitive: false },
  lastModifiedBy: { displayName: 'Last Modified By', sensitive: false },
  lastModifiedByName: { displayName: 'Last Modified By Name', sensitive: false }
};

/**
 * Validates change entry before saving
 */
export const validateChangeEntry = (entry) => {
  const errors = [];
  
  if (!entry.candidateId) {
    errors.push('Candidate ID is required');
  }
  
  if (!entry.changedBy) {
    errors.push('Changed by user ID is required');
  }
  
  if (!entry.changedByName) {
    errors.push('Changed by user name is required');
  }
  
  if (!entry.changeType) {
    errors.push('Change type is required');
  }
  
  if (!entry.timestamp) {
    errors.push('Timestamp is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Filters change history based on criteria
 */
export const filterChangeHistory = (history, filters) => {
  return history.filter(entry => {
    // Change type filter
    if (filters.changeType && filters.changeType !== 'all' && entry.changeType !== filters.changeType) {
      return false;
    }
    
    // User filter
    if (filters.userId && entry.changedBy !== filters.userId) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(entry.timestamp) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(entry.timestamp) > new Date(filters.endDate)) {
      return false;
    }
    
    // Field filter
    if (filters.field && !entry.changes.some(c => c.field === filters.field)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Exports change history to CSV format
 */
export const exportChangeHistoryToCSV = (history) => {
  const headers = [
    'Timestamp',
    'Change Type',
    'Changed By',
    'Field',
    'Old Value',
    'New Value',
    'Reason',
    'IP Address'
  ];
  
  const rows = history.flatMap(entry => 
    entry.changes.map(change => [
      new Date(entry.timestamp).toLocaleString(),
      entry.changeType,
      entry.changedByName,
      change.fieldDisplayName,
      change.oldValue,
      change.newValue,
      entry.reason || '',
      entry.ipAddress || ''
    ])
  );
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Calculates statistics from change history
 */
export const calculateChangeStatistics = (history) => {
  const stats = {
    totalChanges: history.length,
    changesByType: {},
    changesByUser: {},
    mostChangedFields: {},
    recentActivity: []
  };
  
  history.forEach(entry => {
    // Count by type
    stats.changesByType[entry.changeType] = (stats.changesByType[entry.changeType] || 0) + 1;
    
    // Count by user
    stats.changesByUser[entry.changedByName] = (stats.changesByUser[entry.changedByName] || 0) + 1;
    
    // Count field changes
    entry.changes.forEach(change => {
      stats.mostChangedFields[change.field] = (stats.mostChangedFields[change.field] || 0) + 1;
    });
  });
  
  // Get recent activity (last 10 changes)
  stats.recentActivity = history
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
  
  return stats;
};

export default {
  detectChanges,
  createChangeEntry,
  candidateFieldConfig,
  validateChangeEntry,
  filterChangeHistory,
  exportChangeHistoryToCSV,
  calculateChangeStatistics
};
