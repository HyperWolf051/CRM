import { useState, useCallback } from 'react';
import { X, Download, FileText, Calendar, Filter, CheckCircle, Sparkles, Zap, BarChart3, Settings, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-green-100 mt-1 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Export {exportType} data to CSV format</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!exportComplete ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Enhanced Export Summary */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 transform hover:scale-105 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 animate-in zoom-in duration-500">
                      {data.length}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-700">Total Records</div>
                  <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                    <div className="bg-blue-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 w-full"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 transform hover:scale-105 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Filter className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 animate-in zoom-in duration-500 delay-100">
                      {filteredData.length}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-700">Filtered Records</div>
                  <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                    <div className="bg-green-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 delay-200" 
                         style={{width: `${data.length > 0 ? (filteredData.length / data.length) * 100 : 0}%`}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 transform hover:scale-105 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600 animate-in zoom-in duration-500 delay-200">
                      {selectedFields.length}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-purple-700">Selected Fields</div>
                  <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
                    <div className="bg-purple-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 delay-300" 
                         style={{width: `${availableFields.length > 0 ? (selectedFields.length / availableFields.length) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Export Filters</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Enhanced Date Range */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Date Range</span>
                    </label>
                    <div className="space-y-3">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="End date"
                      />
                    </div>
                  </div>

                  {/* Enhanced Status Filter */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Filter className="w-4 h-4" />
                      <span>Status Filter</span>
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
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

                  {/* Enhanced Export Format */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Settings className="w-4 h-4" />
                      <span>Export Format</span>
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="all">All Fields</option>
                      <option value="selected">Selected Fields Only</option>
                      <option value="minimal">Minimal (Name, Email, Phone)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Enhanced Field Selection */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Select Fields to Export</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                <div className="space-y-4">
                  {Object.entries(groupedFields).map(([category, fields]) => {
                    const allSelected = fields.every(field => selectedFields.includes(field.csvField));
                    const someSelected = fields.some(field => selectedFields.includes(field.csvField));
                    
                    return (
                      <div key={category} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                allSelected ? 'bg-blue-100' : someSelected ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  allSelected ? 'bg-blue-600' : someSelected ? 'bg-yellow-600' : 'bg-gray-400'
                                }`}></div>
                              </div>
                              <h4 className="font-semibold text-gray-900">{category}</h4>
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {fields.filter(field => selectedFields.includes(field.csvField)).length}/{fields.length}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCategoryToggle(category, fields)}
                              className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                allSelected
                                  ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                  : someSelected
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            {fields.map(field => (
                              <label key={field.csvField} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                                <input
                                  type="checkbox"
                                  checked={selectedFields.includes(field.csvField)}
                                  onChange={() => handleFieldToggle(field.csvField)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-150"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
                                  {field.displayName}
                                </span>
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
            /* Enhanced Export Complete */
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white animate-in zoom-in duration-700" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto animate-ping opacity-20"></div>
                <div className="absolute -top-2 -right-8 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce delay-300">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  Export Complete!
                </h3>
                <p className="text-gray-600 text-lg">
                  Your CSV file has been downloaded successfully and is ready to use.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 max-w-md mx-auto border border-green-100">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <span className="font-medium text-green-800">Records exported:</span>
                    <span className="font-bold text-green-600">{filteredData.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <span className="font-medium text-green-800">Fields included:</span>
                    <span className="font-bold text-green-600">{selectedFields.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <span className="font-medium text-green-800">File format:</span>
                    <span className="font-bold text-green-600">CSV</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-blue-800 font-medium">
                  📊 Your data export is complete and ready for analysis!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-green-50/30">
          <div className="flex items-center space-x-4">
            {!exportComplete && (
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {filteredData.length} records ready
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedFields.length} fields selected
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              {exportComplete ? 'Close' : 'Cancel'}
            </button>
            
            {!exportComplete && (
              <button
                onClick={handleExport}
                disabled={isExporting || selectedFields.length === 0}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}