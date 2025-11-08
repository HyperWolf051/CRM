import React, { useState, useMemo } from 'react';
import { 
  History, 
  User, 
  Calendar, 
  Filter, 
  Download,
  ChevronDown, 
  ChevronRight,
  FileText,
  UserPlus,
  Edit,
  ArrowRight,
  MessageSquare,
  Upload,
  Users,
  Eye,
  Trash2,
  Shield,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { auditService } from '../../services/auditService';
import { calculateChangeStatistics } from '../../utils/changeTracking';

const ChangeHistoryTimeline = ({ 
  candidate, 
  onLoadMore, 
  showFilters = true,
  showStatistics = true,
  maxItems = 50,
  groupByDate = true,
  onFilterByUser,
  onFilterByType
}) => {
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [filters, setFilters] = useState({
    changeType: 'all',
    dateRange: { start: '', end: '' },
    changedBy: 'all'
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!candidate?.changeHistory) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p>No change history available</p>
          <p className="text-sm mt-2">Changes will appear here once modifications are made</p>
        </div>
      </div>
    );
  }

  const toggleExpanded = (entryId) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const getChangeTypeIcon = (changeType) => {
    const icons = {
      created: UserPlus,
      updated: Edit,
      status_changed: ArrowRight,
      stage_changed: ArrowRight,
      note_added: MessageSquare,
      document_uploaded: Upload,
      interview_scheduled: Calendar,
      merged: Users,
      imported: FileText,
      data_accessed: Eye
    };
    const Icon = icons[changeType] || Edit;
    return <Icon className="w-4 h-4" />;
  };

  const getChangeTypeColor = (changeType) => {
    const colors = {
      created: 'text-green-600 bg-green-50 border-green-200',
      updated: 'text-blue-600 bg-blue-50 border-blue-200',
      status_changed: 'text-purple-600 bg-purple-50 border-purple-200',
      stage_changed: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      note_added: 'text-amber-600 bg-amber-50 border-amber-200',
      document_uploaded: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      interview_scheduled: 'text-pink-600 bg-pink-50 border-pink-200',
      merged: 'text-red-600 bg-red-50 border-red-200',
      imported: 'text-gray-600 bg-gray-50 border-gray-200',
      data_accessed: 'text-teal-600 bg-teal-50 border-teal-200'
    };
    return colors[changeType] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Filter change history
  const filteredHistory = useMemo(() => {
    return candidate.changeHistory
      .filter(entry => {
        if (filters.changeType !== 'all' && entry.changeType !== filters.changeType) {
          return false;
        }
        
        if (filters.dateRange.start && new Date(entry.timestamp) < new Date(filters.dateRange.start)) {
          return false;
        }
        
        if (filters.dateRange.end && new Date(entry.timestamp) > new Date(filters.dateRange.end)) {
          return false;
        }
        
        if (filters.changedBy !== 'all' && entry.changedBy !== filters.changedBy) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, maxItems);
  }, [candidate.changeHistory, filters, maxItems]);

  // Group by date if enabled
  const groupedHistory = useMemo(() => {
    if (!groupByDate) {
      return { 'All Changes': filteredHistory };
    }

    const groups = {};
    filteredHistory.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });
    
    return groups;
  }, [filteredHistory, groupByDate]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return calculateChangeStatistics(candidate.changeHistory);
  }, [candidate.changeHistory]);

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    return [...new Set(candidate.changeHistory.map(entry => ({
      id: entry.changedBy,
      name: entry.changedByName
    })))];
  }, [candidate.changeHistory]);

  // Export handlers
  const handleExport = async (format) => {
    try {
      const data = await auditService.exportChangeHistory(candidate.id, format);
      
      if (data) {
        const blob = new Blob([data], { 
          type: format === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `change-history-${candidate.id}-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting change history:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return then.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getChangeDescription = (entry) => {
    switch (entry.changeType) {
      case 'created':
        return `Candidate profile created by ${entry.changedByName}`;
      case 'updated':
        return `${entry.changes.length} field(s) updated`;
      case 'status_changed':
        const statusChange = entry.changes.find(c => c.field === 'overallStatus');
        return statusChange ? 
          `Status changed from "${statusChange.oldValue}" to "${statusChange.newValue}"` :
          'Status updated';
      case 'stage_changed':
        const stageChange = entry.changes.find(c => c.field === 'currentStage');
        return stageChange ? 
          `Stage changed from "${stageChange.oldValue}" to "${stageChange.newValue}"` :
          'Stage updated';
      case 'note_added':
        return 'New note added to candidate profile';
      case 'document_uploaded':
        return 'Document uploaded to candidate profile';
      case 'interview_scheduled':
        return 'Interview scheduled for candidate';
      case 'merged':
        return 'Candidate merged with duplicate record';
      case 'imported':
        return 'Candidate imported from external source';
      case 'data_accessed':
        return 'Candidate data accessed';
      default:
        return `Action performed: ${entry.changeType}`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Change History & Audit Trail</h3>
              <p className="text-sm text-gray-600">
                Complete audit trail of all modifications ({filteredHistory.length} entries)
              </p>
            </div>
          </div>
          
          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg"
                >
                  Export as CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {showStatistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Changes</p>
                  <p className="text-2xl font-bold text-blue-900">{statistics.totalChanges}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Object.keys(statistics.changesByUser).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Change Types</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Object.keys(statistics.changesByType).length}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Last Activity</p>
                  <p className="text-sm font-bold text-amber-900">
                    {statistics.recentActivity[0] ? 
                      formatTimeAgo(statistics.recentActivity[0].timestamp) : 
                      'No activity'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
              <select
                value={filters.changeType}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, changeType: e.target.value }));
                  if (onFilterByType) onFilterByType(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="status_changed">Status Changed</option>
                <option value="stage_changed">Stage Changed</option>
                <option value="note_added">Note Added</option>
                <option value="document_uploaded">Document Uploaded</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="merged">Merged</option>
                <option value="imported">Imported</option>
                <option value="data_accessed">Data Accessed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Changed By</label>
              <select
                value={filters.changedBy}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, changedBy: e.target.value }));
                  if (onFilterByUser) onFilterByUser(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Change History Timeline */}
      <div className="p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No changes match the current filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date}>
                {groupByDate && (
                  <div className="flex items-center mb-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-4 text-sm font-medium text-gray-600">{date}</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <div key={entry.id} className="relative">
                      {/* Timeline line */}
                      {index < entries.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getChangeTypeColor(entry.changeType)}`}>
                          {getChangeTypeIcon(entry.changeType)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {entry.changeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                                <span className="text-sm text-gray-500">by {entry.changedByName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {formatTimeAgo(entry.timestamp)}
                                </span>
                                {entry.changes.length > 0 && (
                                  <button
                                    onClick={() => toggleExpanded(entry.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                                  >
                                    {expandedEntries.has(entry.id) ? (
                                      <>
                                        <ChevronDown className="w-4 h-4" />
                                        <span>Hide</span>
                                      </>
                                    ) : (
                                      <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span>Details</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Summary */}
                            <p className="text-sm text-gray-700 mb-2">
                              {getChangeDescription(entry)}
                            </p>
                            
                            {/* Reason */}
                            {entry.reason && (
                              <p className="text-sm text-gray-600 italic">
                                Reason: {entry.reason}
                              </p>
                            )}
                            
                            {/* Audit Info */}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Shield className="w-3 h-3" />
                                <span>IP: {entry.ipAddress || 'N/A'}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                              </span>
                            </div>
                            
                            {/* Detailed Changes */}
                            {expandedEntries.has(entry.id) && entry.changes.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Field Changes:</h5>
                                <div className="space-y-2">
                                  {entry.changes.map((change, changeIndex) => (
                                    <div key={changeIndex} className="bg-white rounded p-3 border border-gray-200">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                          {change.fieldDisplayName}
                                        </span>
                                        {change.isSensitive && (
                                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                            Sensitive
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <div>
                                            <span className="font-medium">Before:</span>
                                            <span className="ml-2 text-red-600">
                                              {change.oldValue || <em>Empty</em>}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium">After:</span>
                                            <span className="ml-2 text-green-600">
                                              {change.newValue || <em>Empty</em>}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Load More */}
        {candidate.changeHistory.length > maxItems && onLoadMore && (
          <div className="text-center mt-6">
            <button
              onClick={onLoadMore}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Load More History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeHistoryTimeline;
