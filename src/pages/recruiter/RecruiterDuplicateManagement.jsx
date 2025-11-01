import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Users, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BulkDuplicateManagementPanel from '../../components/recruitment/BulkDuplicateManagementPanel';
import { useDuplicateDetection } from '../../hooks/useDuplicateDetection';

const RecruiterDuplicateManagement = () => {
  const navigate = useNavigate();
  const {
    duplicateGroups,
    isLoading,
    error,
    getDuplicateGroups,
    resolveDuplicateGroup,
    ignoreDuplicateGroup
  } = useDuplicateDetection();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    ignored: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0
  });

  useEffect(() => {
    loadDuplicateGroups();
  }, []);

  useEffect(() => {
    // Update stats when duplicate groups change
    const newStats = {
      total: duplicateGroups.length,
      pending: duplicateGroups.filter(g => g.status === 'pending').length,
      resolved: duplicateGroups.filter(g => g.status === 'resolved').length,
      ignored: duplicateGroups.filter(g => g.status === 'ignored').length,
      highConfidence: 0, // Would need to calculate based on match scores
      mediumConfidence: 0,
      lowConfidence: 0
    };
    setStats(newStats);
  }, [duplicateGroups]);

  const loadDuplicateGroups = async () => {
    try {
      await getDuplicateGroups();
    } catch (err) {
      console.error('Error loading duplicate groups:', err);
    }
  };

  const handleResolveGroup = async (groupId, resolution) => {
    try {
      const result = await resolveDuplicateGroup(groupId, resolution);
      if (result.success) {
        // Optionally show success message
        console.log('Group resolved successfully');
      }
    } catch (err) {
      console.error('Error resolving group:', err);
      alert('Failed to resolve duplicate group. Please try again.');
    }
  };

  const handleIgnoreGroup = async (groupId) => {
    try {
      const result = await ignoreDuplicateGroup(groupId);
      if (result.success) {
        // Optionally show success message
        console.log('Group ignored successfully');
      }
    } catch (err) {
      console.error('Error ignoring group:', err);
      alert('Failed to ignore duplicate group. Please try again.');
    }
  };

  const handleRefresh = () => {
    loadDuplicateGroups();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app/recruiter/candidates')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duplicate Management</h1>
            <p className="text-gray-600">Identify and resolve duplicate candidate records</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Error</h4>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ignored</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ignored}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Management Panel */}
      <BulkDuplicateManagementPanel
        duplicateGroups={duplicateGroups}
        onResolveGroup={handleResolveGroup}
        onIgnoreGroup={handleIgnoreGroup}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How Duplicate Detection Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Detection Algorithms</h4>
            <ul className="space-y-1">
              <li>• Email matching (exact and fuzzy)</li>
              <li>• Phone number normalization and comparison</li>
              <li>• Name similarity using Jaro-Winkler algorithm</li>
              <li>• Phonetic matching for name variations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Confidence Levels</h4>
            <ul className="space-y-1">
              <li>• <strong>High (90%+):</strong> Very likely duplicates</li>
              <li>• <strong>Medium (75-89%):</strong> Probable duplicates</li>
              <li>• <strong>Low (60-74%):</strong> Possible duplicates</li>
              <li>• All matches preserve original recruiter information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDuplicateManagement;