import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Eye, Filter, Search } from 'lucide-react';

export default function ImportPreview({
  csvData,
  fieldMapping,
  validationErrors,
  onValidate
}) {
  const [previewData, setPreviewData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Process data for preview
  useEffect(() => {
    const processedData = csvData.map((row, index) => {
      const processedRow = {
        _originalRow: row,
        _rowIndex: row._rowIndex || index + 2,
        _hasErrors: validationErrors.some(error => error.row === (row._rowIndex || index + 2))
      };

      // Apply field mappings
      Object.entries(fieldMapping).forEach(([csvField, targetField]) => {
        const value = row[csvField];
        
        // Handle nested field paths
        const fieldParts = targetField.split('.');
        let current = processedRow;
        for (let i = 0; i < fieldParts.length - 1; i++) {
          if (!current[fieldParts[i]]) {
            current[fieldParts[i]] = {};
          }
          current = current[fieldParts[i]];
        }
        current[fieldParts[fieldParts.length - 1]] = value;
      });

      return processedRow;
    });

    setPreviewData(processedData);
  }, [csvData, fieldMapping, validationErrors]);

  // Filter data based on search and error filter
  useEffect(() => {
    let filtered = previewData;

    // Filter by errors
    if (showErrorsOnly) {
      filtered = filtered.filter(row => row._hasErrors);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(row => {
        const searchableText = Object.entries(fieldMapping)
          .map(([csvField]) => row._originalRow[csvField] || '')
          .join(' ')
          .toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [previewData, showErrorsOnly, searchTerm, fieldMapping]);

  // Get errors for a specific row
  const getRowErrors = (rowIndex) => {
    return validationErrors.filter(error => error.row === rowIndex);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Get total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Validate data on mount
  useEffect(() => {
    if (onValidate) {
      onValidate();
    }
  }, [onValidate]);

  // Get mapped field display name
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
      'resumeSharing.shortlistsForClient': 'Client (Resume)',
      'resumeSharing.resumeShareStatus': 'Resume Status',
      'shortlisting.shortlistDate': 'Shortlist Date',
      'shortlisting.shortlistsForClient': 'Client (Shortlist)',
      'selection.client': 'Selection Client',
      'selection.selectionDate': 'Selection Date',
      'closure.joiningDate': 'Joining Date',
      'closure.placedIn': 'Placed In',
      'closure.offeredSalary': 'Offered Salary',
      'closure.charges': 'Charges'
    };
    return displayNames[targetField] || targetField;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Preview Import Data
        </h3>
        <p className="text-gray-600">
          Review the processed data before importing. Fix any validation errors before proceeding.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{previewData.length}</div>
          <div className="text-sm text-blue-700">Total Records</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {previewData.filter(row => !row._hasErrors).length}
          </div>
          <div className="text-sm text-green-700">Valid Records</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {previewData.filter(row => row._hasErrors).length}
          </div>
          <div className="text-sm text-red-700">Records with Errors</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(fieldMapping).length}
          </div>
          <div className="text-sm text-purple-700">Mapped Fields</div>
        </div>
      </div>

      {/* Validation Errors Summary */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">
              {validationErrors.length} Validation Error{validationErrors.length !== 1 ? 's' : ''} Found
            </h4>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {validationErrors.slice(0, 10).map((error, index) => (
              <div key={index} className="text-sm text-red-700">
                <span className="font-medium">Row {error.row}:</span> {error.message}
                {error.field && <span className="text-red-600"> (Field: {error.field})</span>}
              </div>
            ))}
            {validationErrors.length > 10 && (
              <div className="text-sm text-red-600 font-medium">
                ... and {validationErrors.length - 10} more errors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowErrorsOnly(!showErrorsOnly)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              showErrorsOnly
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Errors Only</span>
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {previewData.length} records
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Row
                </th>
                {Object.values(fieldMapping).map((targetField, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getFieldDisplayName(targetField)}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedData().map((row, index) => {
                const rowErrors = getRowErrors(row._rowIndex);
                const hasErrors = rowErrors.length > 0;
                
                return (
                  <tr key={index} className={hasErrors ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row._rowIndex}
                    </td>
                    {Object.entries(fieldMapping).map(([csvField, targetField], colIndex) => {
                      const value = row._originalRow[csvField];
                      const hasFieldError = rowErrors.some(error => error.field === csvField);
                      
                      return (
                        <td key={colIndex} className={`px-4 py-3 text-sm ${
                          hasFieldError ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          <div className="max-w-32 truncate" title={value}>
                            {value || <span className="text-gray-400 italic">—</span>}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-sm">
                      {hasErrors ? (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-red-700 font-medium">
                            {rowErrors.length} error{rowErrors.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700">Valid</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Error Details */}
      {showErrorsOnly && validationErrors.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">Error Details</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <div key={index} className="bg-white rounded border border-red-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">Row {error.row}</span>
                  {error.field && (
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                      {error.field}
                    </span>
                  )}
                </div>
                <p className="text-sm text-red-700">{error.message}</p>
                {error.data && (
                  <p className="text-xs text-red-600 mt-1">
                    Data: "{error.data}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}