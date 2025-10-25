import { useState } from 'react';
import { Upload, Download, FileText, Users } from 'lucide-react';
import CSVImportModal from '../components/recruitment/CSVImportModal';
import CSVExportModal from '../components/recruitment/CSVExportModal';
import BulkActionsPanel from '../components/recruitment/BulkActionsPanel';
import useCSVOperations from '../hooks/useCSVOperations';

export default function CSVDemo() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mockData] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      position: 'Software Developer',
      allocation: 'Sheet-1',
      overallStatus: 'new',
      currentStage: 'registration',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91 9876543211',
      position: 'UI/UX Designer',
      allocation: 'Sheet-2',
      overallStatus: 'shortlisted',
      currentStage: 'shortlisting',
      createdAt: new Date()
    }
  ]);

  const {
    isImporting,
    isExporting,
    importResults,
    exportResults,
    importCSV,
    exportCSV,
    clearResults
  } = useCSVOperations();

  // Handle CSV import
  const handleImport = async (processedData, fieldMapping, importType) => {
    try {
      const results = await importCSV(processedData, fieldMapping, importType);
      console.log('Import results:', results);
      return results;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  };

  // Handle CSV export
  const handleExport = async (exportConfig) => {
    try {
      const results = await exportCSV(mockData, exportConfig);
      console.log('Export results:', results);
      return results;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };

  // Handle bulk operations
  const handleBulkEdit = async (selectedIds, updates) => {
    console.log('Bulk edit:', selectedIds, updates);
    alert(`Would update ${selectedIds.length} items with:`, JSON.stringify(updates, null, 2));
  };

  const handleBulkDelete = async (selectedIds) => {
    console.log('Bulk delete:', selectedIds);
    alert(`Would delete ${selectedIds.length} items`);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              CSV Import/Export Demo
            </h1>
            <p className="text-slate-600 mt-1">Test the CSV import and export functionality</p>
          </div>
          <div className="flex items-center space-x-3">
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

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{mockData.length}</div>
              <div className="text-sm text-slate-600">Mock Records</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {importResults?.successful || 0}
              </div>
              <div className="text-sm text-slate-600">Imported</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {exportResults?.count || 0}
              </div>
              <div className="text-sm text-slate-600">Exported</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{selectedItems.length}</div>
              <div className="text-sm text-slate-600">Selected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedItems={selectedItems}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleExport}
        onImport={handleImport}
        totalSelected={selectedItems.length}
        data={mockData}
        onClearSelection={() => setSelectedItems([])}
        className="mb-6"
      />

      {/* Mock Data Display */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Mock Data</h2>
        <div className="space-y-3">
          {mockData.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(prev => [...prev, item.id]);
                  } else {
                    setSelectedItems(prev => prev.filter(id => id !== item.id));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-600">{item.email} • {item.position}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{item.allocation}</div>
                <div className="text-xs text-slate-500">{item.overallStatus}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {(importResults || exportResults) && (
        <div className="mt-6 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Operation Results</h2>
            <button
              onClick={clearResults}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          {importResults && (
            <div className="mb-4">
              <h3 className="font-medium text-slate-900 mb-2">Import Results</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                    <div className="text-sm text-slate-600">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                    <div className="text-sm text-slate-600">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{importResults.errors.length}</div>
                    <div className="text-sm text-slate-600">Errors</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {exportResults && (
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Export Results</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">
                  <div><strong>Status:</strong> {exportResults.success ? 'Success' : 'Failed'}</div>
                  <div><strong>Records:</strong> {exportResults.count}</div>
                  {exportResults.message && (
                    <div><strong>Message:</strong> {exportResults.message}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        importType="registration"
        title="Import Candidate Data"
      />

      <CSVExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        data={mockData}
        exportType="registration"
        title="Export Candidate Data"
      />
    </div>
  );
}