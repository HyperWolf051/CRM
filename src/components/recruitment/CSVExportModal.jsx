import { useState, useCallback } from 'react';
import { X, Download, FileText, Calendar, Filter, CheckCircle } from 'lucide-react';
import { CSV_FIELD_MAPPINGS } from '../../utils/csvMappings';

export default function CSVExportModal({
  isOpen,
  onClose,
  onExport,
  data = [],
  exportType = 'registration',
  title = 'Export CSV Data'
}) {
  const [selectedFields, setSelectedFields] = useState([]);
  const [exportFormat, setExportFormat] = useState('all'); // 'all', 'filtered', 'selected'
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

  // Initialize selected fields when modal opens
  useState(() => {
    if (isOpen) {
      const availableFields = getAvailableFields();
      setSelectedFields(availableFields.map(field => field.csvField));
      setExportComplete(false);
    }
  }, [isOpen, getAvailableFields]);

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
      // Deselect all in category
      setSelectedFields(prev => 
        prev.filter(field => !categoryFields.some(catField => catField.csvField === field))
      );
    } else {
      // Select all in category
      const newFields = categoryFields.map(field => field.csvField);
      setSelectedFields(prev => [...new Set([...prev, ...newFields])]);
    }
  };

  // Filter data based on criteria
  const getFilteredData = useCallback(() => {
    let filtered = [...data];

    // Apply date range filter
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

    // Apply status filter
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
        
        // Get nested field value
        const fieldParts = targetField.split('.');
        let value = item;
        for (const part of fieldParts) {
          value = value?.[part];
        }
        
        // Format value for CSV
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
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Call parent export handler if provided
      if (onExport) {
        await onExport({
          type: exportType,
          fields: selectedFields,
          data: exportData,
          filters: { dateRange, statusFilter }
        });
      }

      setExportComplete(true);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  }, [selectedFields, getFilteredData, convertToCSV, exportType, onExport, dateRange, statusFilter]);

  // Reset and close modal
  const handleClose = () => {
    setSelectedFields([]);
    setExportFormat('all');
    setDateRange({ start: '', end: '' });
    setStatusFilter('all');
    setIsExporting(false);
    setExportComplete(false);
    onClose();
  };

  if (!isOpen) return null;

  const availableFields = getAvailableFields();
  const groupedFields = availableFields.reduce((groups, field) => {
    const category = field.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(field);
    return groups;
  }, {});

  const filteredData = getFilteredData();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">
              Export {exportType} data to CSV format
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!exportComplete ? (
            <div className="space-y-6">
              {/* Export Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                  <div className="text-sm text-blue-700">Total Records</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{filteredData.length}</div>
                  <div className="text-sm text-green-700">Filtered Records</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{selectedFields.length}</div>
                  <div className="text-sm text-purple-700">Selected Fields</div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Export Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="End date"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  {/* Export Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Fields</option>
                      <option value="selected">Selected Fields Only</option>
                      <option value="minimal">Minimal (Name, Email, Phone)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Select Fields to Export</h3>
                <div className="space-y-4">
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
                              className={`text-sm px-3 py-1 rounded transition-colors ${
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
          ) : (
            /* Export Complete */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Export Complete!
                </h3>
                <p className="text-gray-600">
                  Your CSV file has been downloaded successfully.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-sm text-green-700">
                  <div><strong>Records exported:</strong> {filteredData.length}</div>
                  <div><strong>Fields included:</strong> {selectedFields.length}</div>
                  <div><strong>File format:</strong> CSV</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {!exportComplete && `${filteredData.length} records will be exported`}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {exportComplete ? 'Close' : 'Cancel'}
            </button>
            
            {!exportComplete && (
              <button
                onClick={handleExport}
                disabled={isExporting || selectedFields.length === 0}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}