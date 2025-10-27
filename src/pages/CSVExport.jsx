import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, Filter, CheckCircle, BarChart3 } from 'lucide-react';
import { CSV_FIELD_MAPPINGS } from '../utils/csvMappings';

export default function CSVExport() {
  const exportType = 'registration'; // Default export type
  const data = []; // This will be populated from API or context
  const navigate = useNavigate();
  const [selectedFields, setSelectedFields] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Get available fields for export type
  const getAvailableFields = useCallback(() => {
    const fieldMappings = CSV_FIELD_MAPPINGS[exportType];
    if (!fieldMappings) return [];

    return Object.entries(fieldMappings).map(([csvField, targetField]) => ({
      csvField,
      targetField,
      displayName: getFieldDisplayName(targetField),
      category: getFieldCategory(targetField)
    }));
  }, [exportType]);

  // Get field display name
  const getFieldDisplayName = (targetField) => {
    const displayNames = {
      'cvNo': 'CV Number',
      'name': 'Name',
      'phone': 'Phone',
      'email': 'Email',
      'location': 'Location',
      'interestedFor': 'Interested For',
      'designation': 'Designation',
      'totalExperience': 'Experience',
      'lastSalary': 'Last Salary',
      'salaryExpectation': 'Expected Salary',
      'qualification': 'Qualification',
      'allocation': 'Allocation',
      'registration.date': 'Registration Date',
      'registration.resource': 'Source',
      'registration.registrationStatus': 'Registration Status',
      'registration.registrationAmount': 'Registration Amount',
      'resumeSharing.shortlistsForClient': 'Client (Resume)',
      'resumeSharing.resumeShareStatus': 'Resume Status',
      'resumeSharing.remark': 'Resume Remark',
      'shortlisting.shortlistDate': 'Shortlist Date',
      'shortlisting.shortlistsForClient': 'Client (Shortlist)',
      'shortlisting.resource': 'Shortlist Source',
      'shortlisting.shortlistStatus': 'Shortlist Status',
      'lineupFeedback.shortlistDate': 'Lineup Date',
      'lineupFeedback.shortlistsForClient': 'Lineup Client',
      'lineupFeedback.lineupStatus': 'Lineup Status',
      'selection.client': 'Selection Client',
      'selection.selectionDate': 'Selection Date',
      'selection.selectionStatus': 'Selection Status',
      'closure.joiningDate': 'Joining Date',
      'closure.placedIn': 'Placed In',
      'closure.offeredSalary': 'Offered Salary',
      'closure.charges': 'Charges',
      'closure.joiningStatus': 'Joining Status'
    };
    return displayNames[targetField] || targetField;
  };

  // Get field category for grouping
  const getFieldCategory = (targetField) => {
    if (targetField.startsWith('registration.')) return 'Registration';
    if (targetField.startsWith('resumeSharing.')) return 'Resume Sharing';
    if (targetField.startsWith('shortlisting.')) return 'Shortlisting';
    if (targetField.startsWith('lineupFeedback.')) return 'Lineup & Feedback';
    if (targetField.startsWith('selection.')) return 'Selection';
    if (targetField.startsWith('closure.')) return 'Closure';
    return 'Basic Information';
  };

  // Initialize selected fields
  useState(() => {
    const availableFields = getAvailableFields();
    setSelectedFields(availableFields.map(field => field.csvField));
  }, [getAvailableFields]);

  // Handle field selection
  const handleFieldToggle = (csvField) => {
    setSelectedFields(prev => 
      prev.includes(csvField)
        ? prev.filter(field => field !== csvField)
        : [...prev, csvField]
    );
  };

  // Handle select all/none for category
  const handleCategoryToggle = (category, fields) => {
    const categoryFields = fields.filter(field => field.category === category);
    const allSelected = categoryFields.every(field => selectedFields.includes(field.csvField));
    
    if (allSelected) {
      setSelectedFields(prev => 
        prev.filter(field => !categoryFields.some(catField => catField.csvField === field))
      );
    } else {
      const newFields = categoryFields.map(field => field.csvField);
      setSelectedFields(prev => [...new Set([...prev, ...newFields])]);
    }
  };

  // Filter data based on criteria
  const getFilteredData = useCallback(() => {
    let filtered = [...data];

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt || item.registration?.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.overallStatus === statusFilter);
    }

    return filtered;
  }, [data, dateRange, statusFilter]);

  // Convert data to CSV format
  const convertToCSV = useCallback((exportData, fields) => {
    const fieldMappings = CSV_FIELD_MAPPINGS[exportType];
    const headers = fields.map(csvField => csvField);
    
    const rows = exportData.map(item => {
      return fields.map(csvField => {
        const targetField = fieldMappings[csvField];
        if (!targetField) return '';
        
        const fieldParts = targetField.split('.');
        let value = item;
        for (const part of fieldParts) {
          value = value?.[part];
        }
        
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return String(value);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  }, [exportType]);

  // Handle export
  const handleExport = useCallback(async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export');
      return;
    }

    setIsExporting(true);
    try {
      const exportData = getFilteredData();
      const csvContent = convertToCSV(exportData, selectedFields);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Default export handler - could be extended to call API
      console.log('Export completed:', {
        type: exportType,
        fields: selectedFields,
        data: exportData,
        filters: { dateRange, statusFilter }
      });

      setExportComplete(true);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  }, [selectedFields, getFilteredData, convertToCSV, exportType, dateRange, statusFilter]);

  const availableFields = getAvailableFields();
  const groupedFields = availableFields.reduce((groups, field) => {
    const category = field.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(field);
    return groups;
  }, {});

  const filteredData = getFilteredData();

  if (exportComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Export Complete</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Complete</h2>
              <p className="text-gray-600 mb-8">
                Your CSV file has been downloaded successfully.
              </p>

              <div className="bg-green-50 rounded-lg p-4 mb-8">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Records exported:</span>
                    <span className="text-green-600">{filteredData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Fields included:</span>
                    <span className="text-green-600">{selectedFields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">File format:</span>
                    <span className="text-green-600">CSV</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Export Data</h1>
                <p className="text-sm text-gray-500">Export {exportType} data to CSV format</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Export Summary & Filters */}
          <div className="space-y-6">
            {/* Export Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Export Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total Records</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{data.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Filtered Records</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{filteredData.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Selected Fields</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{selectedFields.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Export Filters</h3>
                <div className="space-y-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Filter
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-process">In Process</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="selected">Selected</option>
                      <option value="placed">Placed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Field Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Select Fields to Export</h3>
                <div className="space-y-6">
                  {Object.entries(groupedFields).map(([category, fields]) => {
                    const allSelected = fields.every(field => selectedFields.includes(field.csvField));
                    const someSelected = fields.some(field => selectedFields.includes(field.csvField));
                    
                    return (
                      <div key={category} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{category}</h4>
                            <button
                              onClick={() => handleCategoryToggle(category, fields)}
                              className={`text-sm px-3 py-1 rounded-md font-medium transition-colors ${
                                allSelected
                                  ? 'bg-blue-600 text-white'
                                  : someSelected
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-3">
                            {fields.map(field => (
                              <label key={field.csvField} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedFields.includes(field.csvField)}
                                  onChange={() => handleFieldToggle(field.csvField)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{field.displayName}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-gray-600">
              {filteredData.length} records will be exported
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting || selectedFields.length === 0}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}