import React, { useState } from 'react';
import { 
  Package, 
  Webhook, 
  Settings, 
  Code,
  Download,
  Upload,
  Database
} from 'lucide-react';
import IntegrationMarketplace from '../../components/recruitment/IntegrationMarketplace';
import WebhookManager from '../../components/recruitment/WebhookManager';
import CustomFieldsManager from '../../components/recruitment/CustomFieldsManager';
import APIDocumentation from '../../components/recruitment/APIDocumentation';

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState('marketplace');

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: Package },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'custom-fields', label: 'Custom Fields', icon: Settings },
    { id: 'api-docs', label: 'API Docs', icon: Code },
    { id: 'import-export', label: 'Import/Export', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'marketplace' && <IntegrationMarketplace />}
        {activeTab === 'webhooks' && <WebhookManager />}
        {activeTab === 'custom-fields' && <CustomFieldsManager />}
        {activeTab === 'api-docs' && <APIDocumentation />}
        {activeTab === 'import-export' && <ImportExportManager />}
      </div>
    </div>
  );
};

const ImportExportManager = () => {
  const [selectedEntity, setSelectedEntity] = useState('candidates');
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const entities = [
    { value: 'candidates', label: 'Candidates' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'offers', label: 'Offers' },
    { value: 'clients', label: 'Clients' }
  ];

  const formats = [
    { value: 'csv', label: 'CSV', icon: '📄' },
    { value: 'json', label: 'JSON', icon: '📋' },
    { value: 'excel', label: 'Excel', icon: '📊' }
  ];

  const handleExport = () => {
    alert(`Exporting ${selectedEntity} as ${selectedFormat.toUpperCase()}`);
  };

  const handleImport = () => {
    alert(`Import ${selectedEntity} from ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Import & Export</h1>
          <p className="text-gray-600">Bulk import and export data in various formats</p>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Entity Type
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {entities.map(entity => (
                  <option key={entity.value} value={entity.value}>
                    {entity.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {formats.map(format => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      selectedFormat === format.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{format.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export {selectedEntity}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Import Data</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Entity Type
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {entities.map(entity => (
                  <option key={entity.value} value={entity.value}>
                    {entity.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports CSV, JSON, and Excel files
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Import Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure your file matches the expected format</li>
                <li>• Duplicate detection will run automatically</li>
                <li>• Invalid records will be skipped with error report</li>
                <li>• Large imports may take several minutes</li>
              </ul>
            </div>

            <button
              onClick={handleImport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Start Import
            </button>
          </div>
        </div>

        {/* Recent Imports/Exports */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Candidates Export</p>
                  <p className="text-xs text-gray-500">CSV • 2 hours ago</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Download
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jobs Import</p>
                  <p className="text-xs text-gray-500">Excel • Yesterday</p>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
