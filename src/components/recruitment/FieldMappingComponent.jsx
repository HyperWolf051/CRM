import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function FieldMappingComponent({
  csvHeaders,
  targetFields,
  fieldMapping,
  onMappingChange,
  previewData,
  config
}) {
  const [showPreview, setShowPreview] = useState(true);
  const [mappingErrors, setMappingErrors] = useState([]);

  // Validate field mappings
  useEffect(() => {
    const errors = [];
    
    // Check for required fields
    if (config?.requiredFields) {
      config.requiredFields.forEach(requiredField => {
        const isMapped = Object.values(fieldMapping).includes(requiredField);
        if (!isMapped) {
          errors.push(`Required field "${requiredField}" is not mapped`);
        }
      });
    }

    // Check for duplicate mappings
    const mappedFields = Object.values(fieldMapping);
    const duplicates = mappedFields.filter((field, index) => 
      mappedFields.indexOf(field) !== index
    );
    
    duplicates.forEach(duplicate => {
      errors.push(`Field "${duplicate}" is mapped multiple times`);
    });

    setMappingErrors(errors);
  }, [fieldMapping, config]);

  // Handle mapping change
  const handleMappingChange = (csvField, targetField) => {
    const newMapping = { ...fieldMapping };
    
    if (targetField === '') {
      delete newMapping[csvField];
    } else {
      newMapping[csvField] = targetField;
    }
    
    onMappingChange(newMapping);
  };

  // Get field description
  const getFieldDescription = (field) => {
    const descriptions = {
      'cvNo': 'Unique candidate CV number',
      'name': 'Full name of the candidate',
      'phone': 'Contact phone number',
      'email': 'Email address',
      'location': 'City, State format',
      'interestedFor': 'Position interested in',
      'designation': 'Current job title',
      'totalExperience': 'Years of experience',
      'lastSalary': 'Previous salary (e.g., 5K, 45k)',
      'salaryExpectation': 'Expected salary',
      'qualification': 'Educational qualification',
      'allocation': 'Sheet assignment',
      'registration.date': 'Registration date',
      'registration.resource': 'Source of registration',
      'registration.registrationStatus': 'Registration status (Yes/No)',
      'registration.registrationAmount': 'Registration amount',
      'resumeSharing.shortlistsForClient': 'Client name for resume sharing',
      'resumeSharing.resumeShareStatus': 'Resume share status',
      'resumeSharing.remark': 'Resume sharing remarks',
      'shortlisting.shortlistDate': 'Date of shortlisting',
      'shortlisting.shortlistsForClient': 'Client name for shortlisting',
      'shortlisting.resource': 'Shortlisting source',
      'shortlisting.shortlistStatus': 'Shortlist status',
      'lineupFeedback.shortlistDate': 'Lineup shortlist date',
      'lineupFeedback.shortlistsForClient': 'Client name for lineup',
      'lineupFeedback.lineupStatus': 'Lineup status',
      'selection.client': 'Selection client name',
      'selection.selectionDate': 'Date of selection',
      'selection.selectionStatus': 'Selection status',
      'closure.joiningDate': 'Date of joining',
      'closure.placedIn': 'Company placed in',
      'closure.offeredSalary': 'Offered salary',
      'closure.charges': 'Agency charges',
      'closure.joiningStatus': 'Joining status (Yes/No)'
    };
    return descriptions[field] || 'No description available';
  };

  // Check if field is required
  const isRequiredField = (field) => {
    return config?.requiredFields?.includes(field) || false;
  };

  // Get available target fields (excluding already mapped ones)
  const getAvailableTargetFields = (currentCsvField) => {
    const currentMapping = fieldMapping[currentCsvField];
    return targetFields.filter(field => 
      !Object.values(fieldMapping).includes(field) || field === currentMapping
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Map CSV Fields to Target Fields
        </h3>
        <p className="text-gray-600">
          Match your CSV columns to the appropriate target fields. Required fields are marked with an asterisk (*).
        </p>
      </div>

      {/* Mapping Errors */}
      {mappingErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">Mapping Issues</h4>
          </div>
          <ul className="space-y-1">
            {mappingErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Field Mapping Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">CSV Column</div>
            <div className="col-span-4">Target Field</div>
            <div className="col-span-4">Sample Data</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {csvHeaders.map((csvField, index) => {
            const mappedField = fieldMapping[csvField];
            const availableFields = getAvailableTargetFields(csvField);
            const sampleValue = previewData[0]?.[csvField] || '';
            
            return (
              <div key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* CSV Column */}
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">{csvField}</div>
                    <div className="text-sm text-gray-500">Column {index + 1}</div>
                  </div>
                  
                  {/* Target Field Dropdown */}
                  <div className="col-span-4">
                    <div className="relative">
                      <select
                        value={mappedField || ''}
                        onChange={(e) => handleMappingChange(csvField, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="">Select target field...</option>
                        {availableFields.map(field => (
                          <option key={field} value={field}>
                            {field} {isRequiredField(field) ? '*' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {mappedField && (
                      <div className="mt-1 text-xs text-gray-600">
                        {getFieldDescription(mappedField)}
                      </div>
                    )}
                  </div>
                  
                  {/* Sample Data */}
                  <div className="col-span-4">
                    <div className="text-sm text-gray-900 truncate" title={sampleValue}>
                      {sampleValue || <span className="text-gray-400 italic">No data</span>}
                    </div>
                    {previewData.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{previewData.length - 1} more samples
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreview ? 'Hide' : 'Show'} Data Preview</span>
        </button>
        
        <div className="text-sm text-gray-600">
          {Object.keys(fieldMapping).length} of {csvHeaders.length} fields mapped
        </div>
      </div>

      {/* Data Preview */}
      {showPreview && previewData.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Data Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {csvHeaders.map((header, index) => (
                    <th key={index} className="text-left py-2 px-3 font-medium text-gray-700">
                      {header}
                      {fieldMapping[header] && (
                        <div className="text-xs text-blue-600 font-normal">
                          → {fieldMapping[header]}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 3).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100">
                    {csvHeaders.map((header, colIndex) => (
                      <td key={colIndex} className="py-2 px-3 text-gray-900">
                        <div className="max-w-32 truncate" title={row[header]}>
                          {row[header] || <span className="text-gray-400 italic">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {previewData.length > 3 && (
            <div className="text-center text-sm text-gray-500 mt-3">
              ... and {previewData.length - 3} more rows
            </div>
          )}
        </div>
      )}

      {/* Mapping Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Mapping Summary</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total CSV columns:</span>
            <span className="font-medium text-blue-900 ml-2">{csvHeaders.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Mapped fields:</span>
            <span className="font-medium text-blue-900 ml-2">{Object.keys(fieldMapping).length}</span>
          </div>
          <div>
            <span className="text-blue-700">Required fields:</span>
            <span className="font-medium text-blue-900 ml-2">
              {config?.requiredFields?.filter(field => Object.values(fieldMapping).includes(field)).length || 0}
              /{config?.requiredFields?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Optional fields:</span>
            <span className="font-medium text-blue-900 ml-2">
              {config?.optionalFields?.filter(field => Object.values(fieldMapping).includes(field)).length || 0}
              /{config?.optionalFields?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}