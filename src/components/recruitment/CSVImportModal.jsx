import { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import { csvUtils, CSV_IMPORT_CONFIGS, VALIDATION_RULES } from '../../utils/csvMappings';
import FieldMappingComponent from './FieldMappingComponent';
import ImportPreview from './ImportPreview';

export default function CSVImportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  importType = 'registration',
  title = 'Import CSV Data'
}) {
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

  // Reset modal state
  const resetModal = useCallback(() => {
    setStep(1);
    setCsvFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMapping({});
    setValidationErrors([]);
    setImportResults(null);
    setIsProcessing(false);
    setDragActive(false);
  }, []);

  // Handle modal close
  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

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

          // Parse headers
          const headers = lines[0].split(',').map(h => csvUtils.normalizeHeader(h));
          
          // Parse data rows
          const data = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            row._rowIndex = index + 2; // +2 because we start from line 2 (after header)
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
      
      // Auto-detect CSV type and generate suggested mappings
      const detectedType = csvUtils.detectCSVType(headers);
      if (detectedType && detectedType !== importType) {
        console.log(`Detected CSV type: ${detectedType}, but importing as: ${importType}`);
      }
      
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

      // Process each mapped field
      Object.entries(fieldMapping).forEach(([csvField, targetField]) => {
        const value = row[csvField];
        
        // Get validation rule for target field
        const fieldName = targetField.split('.').pop(); // Get last part of nested field
        const validationRule = VALIDATION_RULES[fieldName];
        
        if (validationRule) {
          // Transform value if transformation function exists
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

          // Validate transformed value
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

          // Set nested field value
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
          // No validation rule, just copy the value
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

      // Call the import function passed from parent
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">
              Step {step} of 4: {
                step === 1 ? 'Upload CSV File' :
                step === 2 ? 'Map Fields' :
                step === 3 ? 'Preview Data' :
                'Import Results'
              }
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a CSV file to import {importType} data. Make sure your file follows the expected format.
                </p>
              </div>

              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Need a template?</h4>
                    <p className="text-blue-700 text-sm">
                      Download a sample CSV template with the correct format
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {step === 2 && (
            <FieldMappingComponent
              csvHeaders={csvHeaders}
              targetFields={config?.requiredFields.concat(config?.optionalFields) || []}
              fieldMapping={fieldMapping}
              onMappingChange={handleMappingChange}
              previewData={csvData.slice(0, 3)}
              config={config}
            />
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <ImportPreview
              csvData={csvData}
              fieldMapping={fieldMapping}
              validationErrors={validationErrors}
              onValidate={validateData}
            />
          )}

          {/* Step 4: Results */}
          {step === 4 && importResults && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Import Complete!
                </h3>
                <p className="text-gray-600">
                  Your CSV data has been processed successfully.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
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
                <div className="bg-red-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-red-900 mb-2">Import Errors:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {csvFile && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{csvFile.name}</span>
                <span>({csvData.length} rows)</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {step === 4 ? 'Close' : 'Cancel'}
            </button>
            
            {step === 2 && (
              <button
                onClick={handleProceedToPreview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={Object.keys(fieldMapping).length === 0}
              >
                Preview Data
              </button>
            )}
            
            {step === 3 && (
              <button
                onClick={handleImport}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={isProcessing || validationErrors.length > 0}
              >
                {isProcessing ? 'Importing...' : 'Import Data'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}