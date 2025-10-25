import { useState, useCallback } from 'react';
import CSVService from '../services/csvService';

export function useCSVOperations() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [exportResults, setExportResults] = useState(null);

  // Import CSV data
  const importCSV = useCallback(async (processedData, fieldMapping, importType = 'registration') => {
    setIsImporting(true);
    setImportResults(null);
    
    try {
      const results = await CSVService.importCandidates(processedData, fieldMapping, importType);
      setImportResults(results);
      return results;
    } catch (error) {
      console.error('CSV import error:', error);
      const errorResults = {
        successful: 0,
        failed: processedData.length,
        errors: [{ row: 'all', message: error.message }],
        importedCandidates: []
      };
      setImportResults(errorResults);
      throw error;
    } finally {
      setIsImporting(false);
    }
  }, []);

  // Export CSV data
  const exportCSV = useCallback(async (candidates, exportConfig) => {
    setIsExporting(true);
    setExportResults(null);
    
    try {
      const results = await CSVService.exportCandidates(candidates, exportConfig);
      setExportResults(results);
      return results;
    } catch (error) {
      console.error('CSV export error:', error);
      const errorResults = {
        success: false,
        message: error.message,
        data: null,
        count: 0
      };
      setExportResults(errorResults);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Detect duplicates
  const detectDuplicates = useCallback(async (newCandidates, existingCandidates = []) => {
    try {
      return await CSVService.detectDuplicates(newCandidates, existingCandidates);
    } catch (error) {
      console.error('Duplicate detection error:', error);
      return [];
    }
  }, []);

  // Generate CSV template
  const generateTemplate = useCallback((importType) => {
    try {
      return CSVService.generateCSVTemplate(importType);
    } catch (error) {
      console.error('Template generation error:', error);
      throw error;
    }
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setImportResults(null);
    setExportResults(null);
  }, []);

  return {
    // State
    isImporting,
    isExporting,
    importResults,
    exportResults,
    
    // Actions
    importCSV,
    exportCSV,
    detectDuplicates,
    generateTemplate,
    clearResults
  };
}

export default useCSVOperations;