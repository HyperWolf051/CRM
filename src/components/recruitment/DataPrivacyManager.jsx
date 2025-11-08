import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Mail
} from 'lucide-react';
import { auditService } from '../../services/auditService';

const DataPrivacyManager = ({ candidate, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('consent');
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Mock consent records (in production, fetch from API)
  const [consentRecords] = useState([
    {
      id: '1',
      candidateId: candidate.id,
      consentType: 'data-processing',
      granted: true,
      grantedAt: new Date('2024-01-15'),
      source: 'web-form'
    },
    {
      id: '2',
      candidateId: candidate.id,
      consentType: 'marketing',
      granted: false,
      grantedAt: new Date('2024-01-15'),
      revokedAt: new Date('2024-02-20'),
      source: 'email'
    },
    {
      id: '3',
      candidateId: candidate.id,
      consentType: 'third-party-sharing',
      granted: true,
      grantedAt: new Date('2024-01-15'),
      source: 'web-form'
    }
  ]);

  // Mock data requests (in production, fetch from API)
  const [dataRequests] = useState([
    {
      id: '1',
      candidateId: candidate.id,
      type: 'access',
      status: 'completed',
      requestedAt: new Date('2024-03-01'),
      processedAt: new Date('2024-03-02'),
      processedBy: 'Admin User'
    }
  ]);

  const handleExportData = async () => {
    setProcessing(true);
    try {
      const data = await auditService.exportChangeHistory(candidate.id, 'json');
      
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `candidate-data-${candidate.id}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAnonymizeData = async () => {
    setProcessing(true);
    try {
      await auditService.anonymizeChangeHistory(candidate.id);
      setShowConfirmDialog(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error anonymizing data:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteHistory = async () => {
    setProcessing(true);
    try {
      await auditService.deleteChangeHistory(
        candidate.id, 
        'User requested data deletion under GDPR/CCPA'
      );
      setShowConfirmDialog(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting history:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getConsentIcon = (granted) => {
    return granted ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <EyeOff className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status] || badges.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Privacy & Compliance</h3>
            <p className="text-sm text-gray-600">
              GDPR/CCPA compliance tools and consent management
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'consent'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Consent Records
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Data Requests
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'actions'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Privacy Actions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Consent Records Tab */}
        {activeTab === 'consent' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Consent Management</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Track and manage candidate consent for data processing, marketing, and third-party sharing
                  </p>
                </div>
              </div>
            </div>

            {consentRecords.map(record => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getConsentIcon(record.granted)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {record.consentType.split('-').map(w => 
                          w.charAt(0).toUpperCase() + w.slice(1)
                        ).join(' ')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Source: {record.source}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.granted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.granted ? 'Granted' : 'Revoked'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Granted:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(record.grantedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {record.revokedAt && (
                    <div>
                      <span className="text-gray-600">Revoked:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(record.revokedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Data Subject Requests</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Handle GDPR/CCPA data access, portability, deletion, and rectification requests
                  </p>
                </div>
              </div>
            </div>

            {dataRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No data requests on record</p>
              </div>
            ) : (
              dataRequests.map(request => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                      </h4>
                      <p className="text-sm text-gray-600">
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  {request.processedAt && (
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <span className="text-gray-600">Processed:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(request.processedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">By:</span>
                        <span className="ml-2 text-gray-900">
                          {request.processedBy}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Privacy Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Privacy Actions</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Execute privacy-related actions including data export, anonymization, and deletion
                  </p>
                </div>
              </div>
            </div>

            {/* Export Data */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Export Personal Data</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Download all candidate data in JSON format (GDPR Article 20 - Right to Data Portability)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {processing ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>

            {/* Anonymize Data */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <EyeOff className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Anonymize Change History</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Remove personally identifiable information from change history while preserving audit trail
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmDialog('anonymize')}
                  disabled={processing}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Anonymize
                </button>
              </div>
            </div>

            {/* Delete History */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Trash2 className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-red-900">Delete Change History</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Permanently delete all change history (GDPR Article 17 - Right to Erasure). This action cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmDialog('delete')}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              {showConfirmDialog === 'anonymize' 
                ? 'Are you sure you want to anonymize the change history? This will remove all personally identifiable information.'
                : 'Are you sure you want to delete the change history? This action cannot be undone and will permanently remove all audit trail data.'}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showConfirmDialog === 'anonymize' ? handleAnonymizeData : handleDeleteHistory}
                disabled={processing}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  showConfirmDialog === 'anonymize'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPrivacyManager;
