import { useState } from 'react';
import { Upload, Download, Trash2, Edit, Mail, Phone, X, CheckCircle } from 'lucide-react';
import CSVImportModal from './CSVImportModal';
import CSVExportModal from './CSVExportModal';

export default function BulkActionsPanel({
  selectedItems = [],
  onBulkEdit,
  onBulkDelete,
  onBulkExport,
  onImport,
  totalSelected = 0,
  data = [],
  onClearSelection,
  className = ''
}) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [importType, setImportType] = useState('registration');
  const [bulkEditData, setBulkEditData] = useState({
    allocation: '',
    overallStatus: '',
    currentStage: '',
    tags: ''
  });

  // Handle CSV import
  const handleImport = async (processedData, fieldMapping) => {
    try {
      if (onImport) {
        const result = await onImport(processedData, fieldMapping, importType);
        return result;
      }
      return { successful: processedData.length, failed: 0, errors: [] };
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };

  // Handle CSV export
  const handleExport = async (exportConfig) => {
    try {
      if (onBulkExport) {
        await onBulkExport(exportConfig);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  // Handle bulk edit
  const handleBulkEdit = async () => {
    if (!onBulkEdit || selectedItems.length === 0) return;

    const updates = {};
    if (bulkEditData.allocation) updates.allocation = bulkEditData.allocation;
    if (bulkEditData.overallStatus) updates.overallStatus = bulkEditData.overallStatus;
    if (bulkEditData.currentStage) updates.currentStage = bulkEditData.currentStage;
    if (bulkEditData.tags) updates.tags = bulkEditData.tags.split(',').map(tag => tag.trim());

    if (Object.keys(updates).length === 0) {
      alert('Please select at least one field to update');
      return;
    }

    try {
      await onBulkEdit(selectedItems, updates);
      setShowBulkEditModal(false);
      setBulkEditData({ allocation: '', overallStatus: '', currentStage: '', tags: '' });
    } catch (error) {
      console.error('Bulk edit error:', error);
      alert('Bulk edit failed: ' + error.message);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedItems.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} selected item${selectedItems.length !== 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await onBulkDelete(selectedItems);
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Bulk delete failed: ' + error.message);
      }
    }
  };

  if (totalSelected === 0 && !showImportModal && !showExportModal) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Select items to perform bulk actions
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {totalSelected} item{totalSelected !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bulk Actions */}
            <button
              onClick={() => setShowBulkEditModal(true)}
              className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-300 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            {/* Import/Export Actions */}
            <div className="border-l border-blue-300 pl-2 ml-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        importType={importType}
        title="Import Candidate Data"
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        data={selectedItems.length > 0 ? data.filter(item => selectedItems.includes(item.id)) : data}
        exportType="registration"
        title="Export Candidate Data"
      />

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Bulk Edit {totalSelected} Items
              </h3>
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allocation
                </label>
                <input
                  type="text"
                  value={bulkEditData.allocation}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, allocation: e.target.value }))}
                  placeholder="e.g., Sheet-1, Team Alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={bulkEditData.overallStatus}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, overallStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status...</option>
                  <option value="new">New</option>
                  <option value="in-process">In Process</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="placed">Placed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  value={bulkEditData.currentStage}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, currentStage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select stage...</option>
                  <option value="registration">Registration</option>
                  <option value="resume-sharing">Resume Sharing</option>
                  <option value="shortlisting">Shortlisting</option>
                  <option value="lineup-feedback">Lineup & Feedback</option>
                  <option value="selection">Selection</option>
                  <option value="closure">Closure</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={bulkEditData.tags}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowBulkEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkEdit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update {totalSelected} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}