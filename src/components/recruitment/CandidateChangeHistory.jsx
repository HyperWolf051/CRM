import React, { useState } from 'react';
import { 
  History, 
  User, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  FileText,
  UserPlus,
  Edit,
  ArrowRight,
  MessageSquare,
  Upload,
  Users
} from 'lucide-react';
import { duplicateUIUtils } from '../../utils/duplicateDetection';

const CandidateChangeHistory = ({ 
  candidate, 
  onLoadMore, 
  showFilters = true, 
  maxItems = 50 
}) => {
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [filters, setFilters] = useState({
    changeType: 'all',
    dateRange: { start: '', end: '' },
    changedBy: 'all'
  });

  if (!candidate?.changeHistory) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p>No change history available</p>
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
    switch (changeType) {
      case 'created': return <UserPlus className="w-4 h-4" />;
      case 'updated': return <Edit className="w-4 h-4" />;
      case 'status_changed': return <ArrowRight className="w-4 h-4" />;
      case 'stage_changed': return <ArrowRight className="w-4 h-4" />;
      case 'note_added': return <MessageSquare className="w-4 h-4" />;
      case 'document_uploaded': return <Upload className="w-4 h-4" />;
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      case 'merged': return <Users className="w-4 h-4" />;
      case 'imported': return <FileText className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const getChangeTypeColor = (changeType) => {
    switch (changeType) {
      case 'created': return 'text-green-600 bg-green-50 border-green-200';
      case 'updated': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'status_changed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'stage_changed': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'note_added': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'document_uploaded': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'interview_scheduled': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'merged': return 'text-red-600 bg-red-50 border-red-200';
      case 'imported': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Filter change history
  const filteredHistory = candidate.changeHistory
    .filter(entry => {
      // Change type filter
      if (filters.changeType !== 'all' && entry.changeType !== filters.changeType) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange.start && new Date(entry.timestamp) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(entry.timestamp) > new Date(filters.dateRange.end)) {
        return false;
      }
      
      // Changed by filter
      if (filters.changedBy !== 'all' && entry.changedBy !== filters.changedBy) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, maxItems);

  // Get unique users for filter
  const uniqueUsers = [...new Set(candidate.changeHistory.map(entry => entry.changedByName))];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Change History</h3>
              <p className="text-sm text-gray-600">
                Complete audit trail of all modifications ({filteredHistory.length} entries)
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
              <select
                value={filters.changeType}
                onChange={(e) => setFilters(prev => ({ ...prev, changeType: e.target.value }))}
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
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Changed By</label>
              <select
                value={filters.changedBy}
                onChange={(e) => setFilters(prev => ({ ...prev, changedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
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
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index < filteredHistory.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getChangeTypeColor(entry.changeType)}`}>
                    {getChangeTypeIcon(entry.changeType)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                            {duplicateUIUtils.formatTimeAgo(new Date(entry.timestamp))}
                          </span>
                          {entry.changes.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(entry.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                            >
                              {expandedEntries.has(entry.id) ? (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  <span>Hide Details</span>
                                </>
                              ) : (
                                <>
                                  <ChevronRight className="w-4 h-4" />
                                  <span>Show Details</span>
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

// Helper function to get change description
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
    default:
      return `Action performed: ${entry.changeType}`;
  }
};

export default CandidateChangeHistory;