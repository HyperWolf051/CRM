import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Calendar,
  User,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { duplicateUIUtils } from '../../utils/duplicateDetection';

const BulkDuplicateManagementPanel = ({ 
  duplicateGroups = [], 
  onResolveGroup, 
  onIgnoreGroup,
  onRefresh,
  isLoading = false 
}) => {
  const [filters, setFilters] = useState({
    status: 'all',
    confidence: 'all',
    dateRange: { start: '', end: '' },
    recruiter: [],
    matchType: 'all',
    minScore: 0,
    maxScore: 100
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('detectedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter and sort groups
  const filteredGroups = duplicateGroups
    .filter(group => {
      // Status filter
      if (filters.status !== 'all' && group.status !== filters.status) return false;
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatch = group.candidates.some(candidate => 
          candidate.name?.toLowerCase().includes(searchLower) ||
          candidate.email?.toLowerCase().includes(searchLower) ||
          candidate.phone?.includes(searchTerm)
        );
        if (!hasMatch) return false;
      }
      
      // Date range filter
      if (filters.dateRange.start && new Date(group.detectedAt) < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && new Date(group.detectedAt) > new Date(filters.dateRange.end)) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'detectedAt':
          aValue = new Date(a.detectedAt);
          bValue = new Date(b.detectedAt);
          break;
        case 'candidateCount':
          aValue = a.candidates.length;
          bValue = b.candidates.length;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleGroupSelection = (groupId, selected) => {
    const newSelection = new Set(selectedGroups);
    if (selected) {
      newSelection.add(groupId);
    } else {
      newSelection.delete(groupId);
    }
    setSelectedGroups(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedGroups.size === filteredGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(filteredGroups.map(g => g.id)));
    }
  };

  const handleBulkAction = (action) => {
    selectedGroups.forEach(groupId => {
      const group = duplicateGroups.find(g => g.id === groupId);
      if (group) {
        if (action === 'ignore') {
          onIgnoreGroup(groupId);
        }
        // Add more bulk actions as needed
      }
    });
    setSelectedGroups(new Set());
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ignored': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'ignored': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Duplicate Management</h2>
            <p className="text-gray-600">Manage and resolve duplicate candidate groups</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="ignored">Ignored</option>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedGroups.size > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedGroups.size} group{selectedGroups.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('ignore')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ignore Selected
              </button>
              <button
                onClick={() => setSelectedGroups(new Set())}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Groups List */}
      <div className="overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedGroups.size === filteredGroups.length && filteredGroups.length > 0}
                onChange={handleSelectAll}
                className="text-blue-600"
              />
            </label>
            <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-4">Candidates</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Detected</div>
              <div className="col-span-2">Added By</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="divide-y divide-gray-200">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Loading duplicate groups...</span>
                </div>
              ) : (
                <div>
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p>No duplicate groups found</p>
                </div>
              )}
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <label className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedGroups.has(group.id)}
                      onChange={(e) => handleGroupSelection(group.id, e.target.checked)}
                      className="text-blue-600"
                    />
                  </label>
                  
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    {/* Candidates */}
                    <div className="col-span-4">
                      <div className="space-y-2">
                        {group.candidates.map((candidate, index) => (
                          <div key={candidate.id} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{candidate.name}</div>
                              <div className="text-sm text-gray-600 truncate">{candidate.email}</div>
                            </div>
                            {index === 0 && group.primaryCandidateId === candidate.id && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(group.status)}`}>
                        {getStatusIcon(group.status)}
                        <span className="capitalize">{group.status}</span>
                      </span>
                    </div>

                    {/* Detected Date */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{duplicateUIUtils.formatTimeAgo(new Date(group.detectedAt))}</span>
                      </div>
                    </div>

                    {/* Added By */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">
                        {group.candidates.map(c => c.createdByName).filter((name, index, arr) => arr.indexOf(name) === index).join(', ')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      {group.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onResolveGroup(group.id, { type: 'merge', primaryCandidateId: group.candidates[0].id })}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>Merge</span>
                          </button>
                          
                          <button
                            onClick={() => onIgnoreGroup(group.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-gray-600 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Ignore</span>
                          </button>
                        </div>
                      )}
                      
                      {group.status === 'resolved' && group.resolution && (
                        <div className="text-sm text-gray-600">
                          <div>Resolved by {group.resolution.resolvedByName}</div>
                          <div className="text-xs text-gray-500">
                            {duplicateUIUtils.formatTimeAgo(new Date(group.resolvedAt))}
                          </div>
                        </div>
                      )}
                      
                      {group.status === 'ignored' && (
                        <div className="text-sm text-gray-500">
                          Ignored
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      {filteredGroups.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredGroups.length} of {duplicateGroups.length} duplicate groups
            </span>
            <div className="flex items-center space-x-4">
              <span>
                Pending: {duplicateGroups.filter(g => g.status === 'pending').length}
              </span>
              <span>
                Resolved: {duplicateGroups.filter(g => g.status === 'resolved').length}
              </span>
              <span>
                Ignored: {duplicateGroups.filter(g => g.status === 'ignored').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkDuplicateManagementPanel;