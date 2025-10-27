import { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, Eye, ArrowRight, Sparkles, Zap, FileCheck } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-blue-100 mt-1 flex items-center space-x-2">
                  <span>Step {step} of 4:</span>
                  <span className="flex items-center space-x-1">
                    {step === 1 && <><FileText className="w-4 h-4" /> <span>Upload CSV File</span></>}
                    {step === 2 && <><Sparkles className="w-4 h-4" /> <span>Map Fields</span></>}
                    {step === 3 && <><Eye className="w-4 h-4" /> <span>Preview Data</span></>}
                    {step === 4 && <><CheckCircle className="w-4 h-4" /> <span>Import Results</span></>}
                  </span>
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

        {/* Enhanced Progress Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {[
              { num: 1, icon: FileText, label: 'Upload' },
              { num: 2, icon: Sparkles, label: 'Map' },
              { num: 3, icon: Eye, label: 'Preview' },
              { num: 4, icon: CheckCircle, label: 'Complete' }
            ].map((stepItem, index) => (
              <div key={stepItem.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                    stepItem.num <= step 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                      : stepItem.num === step + 1
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepItem.num < step ? (
                      <CheckCircle className="w-5 h-5 animate-in zoom-in duration-300" />
                    ) : stepItem.num === step ? (
                      <stepItem.icon className="w-5 h-5 animate-pulse" />
                    ) : (
                      stepItem.num
                    )}
                    {stepItem.num <= step && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    stepItem.num <= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className="flex-1 mx-4 h-0.5 relative">
                    <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-700 ${
                      stepItem.num < step ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Enhanced Upload */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Upload Your CSV File
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Select a CSV file to import {importType} data. Our smart system will automatically detect and map your fields.
                </p>
              </div>

              {/* Enhanced Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                  dragActive 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105 shadow-xl' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-lg'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <div className="relative">
                    <Upload className={`w-16 h-16 mx-auto mb-6 transition-all duration-300 ${
                      dragActive ? 'text-blue-500 animate-bounce' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    {dragActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin opacity-30"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-3">
                    {dragActive ? 'Drop your file here!' : 'Drop your CSV file here'}
                  </p>
                  <p className="text-gray-600 mb-6">
                    or click to browse your computer
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FileCheck className="w-4 h-4" />
                      <span>CSV files only</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Up to 10MB</span>
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-blue-600 font-medium">Processing your file...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Template Download */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Need a template?</h4>
                      <p className="text-blue-700 text-sm">
                        Download our sample CSV template with the correct format and example data
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
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

          {/* Step 4: Enhanced Results */}
          {step === 4 && importResults && (
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
                  Import Complete!
                </h3>
                <p className="text-gray-600 text-lg">
                  Your CSV data has been processed and imported successfully.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-green-600 mb-2 animate-in zoom-in duration-500 delay-100">
                    {importResults.successful}
                  </div>
                  <div className="text-sm font-medium text-green-700">Successful</div>
                  <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                    <div className="bg-green-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 delay-300" 
                         style={{width: `${(importResults.successful / importResults.total) * 100}%`}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100 transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-red-600 mb-2 animate-in zoom-in duration-500 delay-200">
                    {importResults.failed}
                  </div>
                  <div className="text-sm font-medium text-red-700">Failed</div>
                  <div className="w-full bg-red-200 rounded-full h-1 mt-2">
                    <div className="bg-red-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 delay-400" 
                         style={{width: `${(importResults.failed / importResults.total) * 100}%`}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2 animate-in zoom-in duration-500 delay-300">
                    {importResults.total}
                  </div>
                  <div className="text-sm font-medium text-blue-700">Total</div>
                  <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                    <div className="bg-blue-600 h-1 rounded-full animate-in slide-in-from-left duration-1000 delay-500 w-full"></div>
                  </div>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 text-left border border-red-100 animate-in slide-in-from-bottom duration-500 delay-400">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Import Errors</h4>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 bg-white/50 rounded-lg p-2">
                        <span className="font-medium">Row {error.row}:</span> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-blue-800 font-medium">
                  🎉 Great job! Your data is now ready to use in the system.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div className="flex items-center space-x-4">
            {csvFile && (
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{csvFile.name}</div>
                  <div className="text-xs text-gray-500">{csvData.length} rows detected</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              {step === 4 ? 'Close' : 'Cancel'}
            </button>
            
            {step === 2 && (
              <button
                onClick={handleProceedToPreview}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={Object.keys(fieldMapping).length === 0}
              >
                <span>Preview Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {step === 3 && (
              <button
                onClick={handleImport}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing || validationErrors.length > 0}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Import Data</span>
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