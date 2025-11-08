/**
 * Audit Service
 * Handles change history tracking, audit trails, and compliance features
 * Supports GDPR/CCPA data privacy requirements
 */

import { 
  detectChanges, 
  createChangeEntry, 
  candidateFieldConfig,
  validateChangeEntry 
} from '../utils/changeTracking';

class AuditService {
  constructor() {
    this.storageKey = 'candidate_change_history';
    this.retentionPeriodDays = 2555; // 7 years for compliance
    this.encryptionEnabled = true;
  }

  /**
   * Tracks a change to candidate data
   */
  async trackChange(candidateId, oldData, newData, user, changeType = 'updated', reason = '') {
    try {
      // Detect changes
      const changes = detectChanges(oldData, newData, candidateFieldConfig);
      
      // Skip if no changes detected
      if (changes.length === 0 && changeType === 'updated') {
        return null;
      }
      
      // Create change entry
      const entry = createChangeEntry({
        candidateId,
        changedBy: user.id,
        changedByName: user.name,
        changeType,
        changes,
        reason,
        metadata: {
          ipAddress: await this.getClientIP(),
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId()
        }
      });
      
      // Validate entry
      const validation = validateChangeEntry(entry);
      if (!validation.isValid) {
        console.error('Invalid change entry:', validation.errors);
        return null;
      }
      
      // Save to storage
      await this.saveChangeEntry(candidateId, entry);
      
      return entry;
    } catch (error) {
      console.error('Error tracking change:', error);
      return null;
    }
  }

  /**
   * Saves change entry to storage
   */
  async saveChangeEntry(candidateId, entry) {
    try {
      const history = await this.getChangeHistory(candidateId);
      history.push(entry);
      
      // Apply retention policy
      const retainedHistory = this.applyRetentionPolicy(history);
      
      // Save to localStorage (in production, this would be an API call)
      const storageData = this.encryptionEnabled 
        ? this.encryptData(retainedHistory)
        : retainedHistory;
      
      localStorage.setItem(`${this.storageKey}_${candidateId}`, JSON.stringify(storageData));
      
      return true;
    } catch (error) {
      console.error('Error saving change entry:', error);
      return false;
    }
  }

  /**
   * Retrieves change history for a candidate
   */
  async getChangeHistory(candidateId, filters = {}) {
    try {
      const storageData = localStorage.getItem(`${this.storageKey}_${candidateId}`);
      
      if (!storageData) {
        return [];
      }
      
      const data = JSON.parse(storageData);
      const history = this.encryptionEnabled ? this.decryptData(data) : data;
      
      // Apply filters if provided
      if (Object.keys(filters).length > 0) {
        return this.filterHistory(history, filters);
      }
      
      return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error retrieving change history:', error);
      return [];
    }
  }

  /**
   * Filters change history based on criteria
   */
  filterHistory(history, filters) {
    return history.filter(entry => {
      if (filters.changeType && filters.changeType !== 'all' && entry.changeType !== filters.changeType) {
        return false;
      }
      
      if (filters.userId && entry.changedBy !== filters.userId) {
        return false;
      }
      
      if (filters.startDate && new Date(entry.timestamp) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(entry.timestamp) > new Date(filters.endDate)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Applies data retention policy (GDPR/CCPA compliance)
   */
  applyRetentionPolicy(history) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);
    
    return history.filter(entry => new Date(entry.timestamp) >= cutoffDate);
  }

  /**
   * Exports change history for data portability (GDPR right)
   */
  async exportChangeHistory(candidateId, format = 'json') {
    try {
      const history = await this.getChangeHistory(candidateId);
      
      if (format === 'json') {
        return JSON.stringify(history, null, 2);
      }
      
      if (format === 'csv') {
        return this.convertToCSV(history);
      }
      
      return null;
    } catch (error) {
      console.error('Error exporting change history:', error);
      return null;
    }
  }

  /**
   * Converts change history to CSV format
   */
  convertToCSV(history) {
    const headers = [
      'Timestamp',
      'Change Type',
      'Changed By',
      'Field',
      'Old Value',
      'New Value',
      'Reason'
    ];
    
    const rows = history.flatMap(entry => 
      entry.changes.length > 0 
        ? entry.changes.map(change => [
            new Date(entry.timestamp).toLocaleString(),
            entry.changeType,
            entry.changedByName,
            change.fieldDisplayName,
            change.oldValue,
            change.newValue,
            entry.reason || ''
          ])
        : [[
            new Date(entry.timestamp).toLocaleString(),
            entry.changeType,
            entry.changedByName,
            '',
            '',
            '',
            entry.reason || ''
          ]]
    );
    
    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  }

  /**
   * Deletes change history (GDPR right to erasure)
   */
  async deleteChangeHistory(candidateId, reason = '') {
    try {
      // Log the deletion for audit purposes
      const deletionEntry = createChangeEntry({
        candidateId,
        changedBy: 'system',
        changedByName: 'System',
        changeType: 'history_deleted',
        changes: [],
        reason: `Change history deleted: ${reason}`,
        metadata: {}
      });
      
      // Save deletion record before removing history
      await this.saveDeletionRecord(candidateId, deletionEntry);
      
      // Remove from storage
      localStorage.removeItem(`${this.storageKey}_${candidateId}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting change history:', error);
      return false;
    }
  }

  /**
   * Saves deletion record for compliance
   */
  async saveDeletionRecord(candidateId, entry) {
    try {
      const deletionLog = JSON.parse(localStorage.getItem('deletion_log') || '[]');
      deletionLog.push(entry);
      localStorage.setItem('deletion_log', JSON.stringify(deletionLog));
    } catch (error) {
      console.error('Error saving deletion record:', error);
    }
  }

  /**
   * Anonymizes change history (GDPR compliance)
   */
  async anonymizeChangeHistory(candidateId) {
    try {
      const history = await this.getChangeHistory(candidateId);
      
      const anonymizedHistory = history.map(entry => ({
        ...entry,
        changedBy: 'anonymized',
        changedByName: 'Anonymized User',
        ipAddress: 'anonymized',
        userAgent: 'anonymized',
        changes: entry.changes.map(change => ({
          ...change,
          oldValue: change.isSensitive ? '***' : change.oldValue,
          newValue: change.isSensitive ? '***' : change.newValue
        }))
      }));
      
      localStorage.setItem(
        `${this.storageKey}_${candidateId}`, 
        JSON.stringify(anonymizedHistory)
      );
      
      return true;
    } catch (error) {
      console.error('Error anonymizing change history:', error);
      return false;
    }
  }

  /**
   * Gets client IP address (for audit trail)
   */
  async getClientIP() {
    try {
      // In production, this would call an API to get the real IP
      // For demo purposes, return a placeholder
      return 'demo-ip-address';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Gets or creates session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('audit_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('audit_session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Simple encryption for demo (in production, use proper encryption)
   */
  encryptData(data) {
    // In production, use proper encryption library
    return btoa(JSON.stringify(data));
  }

  /**
   * Simple decryption for demo
   */
  decryptData(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      // If decryption fails, assume data is not encrypted
      return encryptedData;
    }
  }

  /**
   * Generates audit report
   */
  async generateAuditReport(candidateId, startDate, endDate) {
    try {
      const history = await this.getChangeHistory(candidateId, {
        startDate,
        endDate
      });
      
      const report = {
        candidateId,
        reportGeneratedAt: new Date().toISOString(),
        period: { startDate, endDate },
        totalChanges: history.length,
        changesByType: {},
        changesByUser: {},
        timeline: history.map(entry => ({
          timestamp: entry.timestamp,
          type: entry.changeType,
          user: entry.changedByName,
          changesCount: entry.changes.length
        }))
      };
      
      // Aggregate by type
      history.forEach(entry => {
        report.changesByType[entry.changeType] = 
          (report.changesByType[entry.changeType] || 0) + 1;
        
        report.changesByUser[entry.changedByName] = 
          (report.changesByUser[entry.changedByName] || 0) + 1;
      });
      
      return report;
    } catch (error) {
      console.error('Error generating audit report:', error);
      return null;
    }
  }

  /**
   * Validates data access for compliance
   */
  async logDataAccess(candidateId, userId, userName, accessType = 'view') {
    try {
      const accessEntry = createChangeEntry({
        candidateId,
        changedBy: userId,
        changedByName: userName,
        changeType: 'data_accessed',
        changes: [{
          field: 'access_type',
          fieldDisplayName: 'Access Type',
          oldValue: '',
          newValue: accessType,
          changeDescription: `Data accessed: ${accessType}`
        }],
        reason: `User accessed candidate data`,
        metadata: {
          ipAddress: await this.getClientIP(),
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId()
        }
      });
      
      await this.saveChangeEntry(candidateId, accessEntry);
      
      return true;
    } catch (error) {
      console.error('Error logging data access:', error);
      return false;
    }
  }
}

// Export singleton instance
export const auditService = new AuditService();

export default auditService;
