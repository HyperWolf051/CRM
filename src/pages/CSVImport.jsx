import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, Download, Info } from 'lucide-react';
import { csvUtils, CSV_IMPORT_CONFIGS, VALIDATION_RULES } from '../utils/csvMappings';
import FieldMappingComponent from '../components/recruitment/FieldMappingComponent';
import ImportPreview from '../components/recruitment/ImportPreview';

export default function CSVImport() {
  const importType = 'registration'; // Default import type
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Upload, 2: Map Fields, 3: Preview, 4: Import
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const config = CSV_IMPORT_CONFIGS[importType];

  // Parse CSV file
  const parseCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          const headers = lines[0].split(',').map(h => csvUtils.normalizeHeader(h));
          const data = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            row._rowIndex = index + 2;
            return row;
          });

          resolve({ headers, data });
        } catch (error) {
          reject(new Error('Failed to parse CSV file: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    try {
      const { headers, data } = await parseCSV(file);
      
      setCsvFile(file);
      setCsvHeaders(headers);
      setCsvData(data);
      
      const suggestedMappings = csvUtils.generateSuggestedMappings(headers, importType);
      setFieldMapping(suggestedMappings);
      
      setStep(2);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [parseCSV, importType]);

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Validate mapped data
  const validateData = useCallback(() => {
    const errors = [];
    const processedData = [];

    csvData.forEach((row, index) => {
      const processedRow = { _rowIndex: row._rowIndex };
      let hasErrors = false;

      Object.entries(fieldMapping).forEach(([csvField, targetField]) => {
        const value = row[csvField];
        const fieldName = targetField.split('.').pop();
        const validationRule = VALIDATION_RULES[fieldName];
        
        if (validationRule) {
          let transformedValue = value;
          if (validationRule.transform) {
            try {
              transformedValue = validationRule.transform(value);
            } catch (error) {
              errors.push({
                row: row._rowIndex,
                field: csvField,
                message: `Transformation error: ${error.message}`,
                data: value
              });
              hasErrors = true;
              return;
            }
          }

          if (validationRule.validate) {
            const validationResult = validationRule.validate(transformedValue);
            if (validationResult !== true) {
              errors.push({
                row: row._rowIndex,
                field: csvField,
                message: validationResult,
                data: value
              });
              hasErrors = true;
            }
          }

          const fieldParts = targetField.split('.');
          let current = processedRow;
          for (let i = 0; i < fieldParts.length - 1; i++) {
            if (!current[fieldParts[i]]) {
              current[fieldParts[i]] = {};
            }
            current = current[fieldParts[i]];
          }
          current[fieldParts[fieldParts.length - 1]] = transformedValue;
        } else {
          processedRow[targetField] = value;
        }
      });

      if (!hasErrors) {
        processedData.push(processedRow);
      }
    });

    setValidationErrors(errors);
    return { errors, processedData };
  }, [csvData, fieldMapping]);

  // Handle field mapping change
  const handleMappingChange = useCallback((mapping) => {
    setFieldMapping(mapping);
  }, []);

  // Proceed to preview step
  const handleProceedToPreview = useCallback(() => {
    const { errors } = validateData();
    if (errors.length > 0) {
      alert(`Found ${errors.length} validation errors. Please fix them before proceeding.`);
      return;
    }
    setStep(3);
  }, [validateData]);

  // Default import handler
  const onImport = async (processedData, fieldMapping) => {
    // This would typically call an API to import the data
    // For now, we'll simulate a successful import
    return {
      successful: processedData.length,
      failed: 0,
      errors: []
    };
  };

  // Handle import
  const handleImport = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { errors, processedData } = validateData();
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsProcessing(false);
        return;
      }

      const result = await onImport(processedData, fieldMapping);
      
      setImportResults({
        successful: result.successful || processedData.length,
        failed: result.failed || 0,
        errors: result.errors || [],
        total: processedData.length
      });
      
      setStep(4);
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [validateData, onImport, fieldMapping]);

  // Download sample CSV template
  const downloadTemplate = useCallback(() => {
    if (!config) return;
    
    const headers = Object.keys(config.fieldMappings);
    const csvContent = headers.join(',') + '\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [config, importType]);

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
                <h1 className="text-xl font-semibold text-gray-900">Import Data</h1>
                <p className="text-sm text-gray-500">Step {step} of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {csvFile && (
                <div className="text-sm text-gray-500">
                  {csvFile.name} • {csvData.length} rows
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center">
              {[
                { num: 1, label: 'Upload File' },
                { num: 2, label: 'Map Fields' },
                { num: 3, label: 'Preview Data' },
                { num: 4, label: 'Complete' }
              ].map((stepItem, index) => (
                <div key={stepItem.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepItem.num <= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepItem.num < step ? <CheckCircle className="w-4 h-4" /> : stepItem.num}
                    </div>
                    <span className={`text-xs mt-1 ${
                      stepItem.num <= step ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {stepItem.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-24 h-0.5 mx-4 ${
                      stepItem.num < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload CSV File</h2>
                  <p className="text-gray-600">
                    Select a CSV file to import your data. Make sure your file follows the expected format.
                  </p>
                </div>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your CSV file here, or click to browse
                  </p>
                  <p className="text-gray-600 mb-4">
                    Supports CSV files up to 10MB
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                {/* Template Download */}
                <div className="mt-8 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-900">Need a template?</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Download a sample CSV template with the correct format
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Field Mapping */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Map Your Fields</h2>
              <FieldMappingComponent
                csvHeaders={csvHeaders}
                targetFields={config?.requiredFields.concat(config?.optionalFields) || []}
                fieldMapping={fieldMapping}
                onMappingChange={handleMappingChange}
                previewData={csvData.slice(0, 3)}
                config={config}
              />
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Preview Your Data</h2>
              <ImportPreview
                csvData={csvData}
                fieldMapping={fieldMapping}
                validationErrors={validationErrors}
                onValidate={validateData}
              />
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && importResults && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete</h2>
                <p className="text-gray-600 mb-8">
                  Your CSV data has been processed successfully.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {importResults.successful}
                    </div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {importResults.failed}
                    </div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {importResults.total}
                    </div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 text-left mb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-medium text-red-900">Import Errors</h3>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(-1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {step < 4 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                
                {step === 2 && (
                  <button
                    onClick={handleProceedToPreview}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={Object.keys(fieldMapping).length === 0}
                  >
                    Continue
                  </button>
                )}
                
                {step === 3 && (
                  <button
                    onClick={handleImport}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={isProcessing || validationErrors.length > 0}
                  >
                    {isProcessing ? 'Importing...' : 'Import Data'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}