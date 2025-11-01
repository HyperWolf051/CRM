import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, CheckCircle, User, Calendar, FileText, History } from 'lucide-react';

const MergePreviewModal = ({ 
  isOpen, 
  onClose, 
  mergePreview, 
  onConfirmMerge,
  isLoading = false 
}) => {
  const [mergeDecisions, setMergeDecisions] = useState({});
  const [preserveDecisions, setPreserveDecisions] = useState({});

  useEffect(() => {
    if (isOpen && mergePreview) {
      // Initialize decisions with suggested values
      const initialDecisions = {};
      mergePreview.conflicts.forEach(conflict => {
        initialDecisions[conflict.field] = {
          selectedValue: conflict.suggestedValue,
          source: conflict.primaryValue === conflict.suggestedValue ? 'primary' : 'duplicate'
        };
      });
      setMergeDecisions(initialDecisions);

      // Initialize preserve decisions (default to preserve all)
      const initialPreserve = {};
      mergePreview.preservedData.forEach((data, index) => {
        initialPreserve[index] = data.preserveInMerged;
      });
      setPreserveDecisions(initialPreserve);
    }
  }, [isOpen, mergePreview]);

  if (!isOpen || !mergePreview) return null;

  const handleFieldDecision = (field, value, source) => {
    setMergeDecisions(prev => ({
      ...prev,
      [field]: { selectedValue: value, source }
    }));
  };

  const handlePreserveDecision = (index, preserve) => {
    setPreserveDecisions(prev => ({
      ...prev,
      [index]: preserve
    }));
  };

  const handleConfirm = () => {
    const decisions = Object.entries(mergeDecisions).map(([field, decision]) => ({
      field,
      selectedValue: decision.selectedValue,
      source: decision.source
    }));

    // Update preserved data based on decisions
    const updatedPreservedData = mergePreview.preservedData.map((data, index) => ({
      ...data,
      preserveInMerged: preserveDecisions[index] !== undefined ? preserveDecisions[index] : data.preserveInMerged
    }));

    onConfirmMerge(decisions, updatedPreservedData);
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'name': return <User className="w-4 h-4" />;
      case 'email': return <FileText className="w-4 h-4" />;
      case 'phone': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConflictTypeColor = (conflictType) => {
    switch (conflictType) {
      case 'different-values': return 'border-red-200 bg-red-50';
      case 'missing-data': return 'border-amber-200 bg-amber-50';
      case 'format-mismatch': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPreservedDataIcon = (type) => {
    switch (type) {
      case 'note': return <FileText className="w-4 h-4" />;
      case 'change-history': return <History className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Merge Preview</h2>
              <p className="text-sm text-gray-600">
                Review and resolve conflicts before merging candidates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Candidate Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Candidate */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Primary Candidate</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {mergePreview.primaryCandidate.name}</div>
                  <div><strong>Email:</strong> {mergePreview.primaryCandidate.email}</div>
                  <div><strong>Phone:</strong> {mergePreview.primaryCandidate.phone}</div>
                  <div><strong>Added by:</strong> {mergePreview.primaryCandidate.createdByName}</div>
                </div>
              </div>

              {/* Duplicate Candidate */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Duplicate Candidate</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {mergePreview.duplicateCandidate.name}</div>
                  <div><strong>Email:</strong> {mergePreview.duplicateCandidate.email}</div>
                  <div><strong>Phone:</strong> {mergePreview.duplicateCandidate.phone}</div>
                  <div><strong>Added by:</strong> {mergePreview.duplicateCandidate.createdByName}</div>
                </div>
              </div>

              {/* Merged Result Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Merged Result</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {mergeDecisions.name?.selectedValue || mergePreview.mergedCandidate.name}</div>
                  <div><strong>Email:</strong> {mergeDecisions.email?.selectedValue || mergePreview.mergedCandidate.email}</div>
                  <div><strong>Phone:</strong> {mergeDecisions.phone?.selectedValue || mergePreview.mergedCandidate.phone}</div>
                  <div><strong>Will preserve:</strong> {mergePreview.preservedData.length} data items</div>
                </div>
              </div>
            </div>

            {/* Conflicts Resolution */}
            {mergePreview.conflicts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolve Conflicts</h3>
                <div className="space-y-4">
                  {mergePreview.conflicts.map((conflict, index) => (
                    <div key={conflict.field} className={`border rounded-lg p-4 ${getConflictTypeColor(conflict.conflictType)}`}>
                      <div className="flex items-center space-x-2 mb-3">
                        {getFieldIcon(conflict.field)}
                        <h4 className="font-medium text-gray-900">{conflict.fieldDisplayName}</h4>
                        <span className="text-xs px-2 py-1 bg-white rounded-full border">
                          {conflict.conflictType.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Primary Value */}
                        <div>
                          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                            <input
                              type="radio"
                              name={`conflict-${conflict.field}`}
                              checked={mergeDecisions[conflict.field]?.source === 'primary'}
                              onChange={() => handleFieldDecision(conflict.field, conflict.primaryValue, 'primary')}
                              className="text-green-600"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Primary Value</div>
                              <div className="text-sm text-gray-600 break-all">
                                {conflict.primaryValue || <em className="text-gray-400">Empty</em>}
                              </div>
                            </div>
                          </label>
                        </div>

                        {/* Duplicate Value */}
                        <div>
                          <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                            <input
                              type="radio"
                              name={`conflict-${conflict.field}`}
                              checked={mergeDecisions[conflict.field]?.source === 'duplicate'}
                              onChange={() => handleFieldDecision(conflict.field, conflict.duplicateValue, 'duplicate')}
                              className="text-red-600"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Duplicate Value</div>
                              <div className="text-sm text-gray-600 break-all">
                                {conflict.duplicateValue || <em className="text-gray-400">Empty</em>}
                              </div>
                            </div>
                          </label>
                        </div>

                        {/* Custom Value */}
                        <div>
                          <label className="flex items-center space-x-2 p-3 border rounded-lg">
                            <input
                              type="radio"
                              name={`conflict-${conflict.field}`}
                              checked={mergeDecisions[conflict.field]?.source === 'custom'}
                              onChange={() => handleFieldDecision(conflict.field, '', 'custom')}
                              className="text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Custom Value</div>
                              <input
                                type="text"
                                value={mergeDecisions[conflict.field]?.source === 'custom' ? mergeDecisions[conflict.field]?.selectedValue : ''}
                                onChange={(e) => handleFieldDecision(conflict.field, e.target.value, 'custom')}
                                className="w-full text-sm text-gray-600 bg-transparent border-none outline-none"
                                placeholder="Enter custom value..."
                                disabled={mergeDecisions[conflict.field]?.source !== 'custom'}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preserved Data */}
            {mergePreview.preservedData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data to Preserve</h3>
                <div className="space-y-3">
                  {mergePreview.preservedData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {getPreservedDataIcon(data.type)}
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{data.type.replace('-', ' ')}</div>
                          <div className="text-sm text-gray-600">{data.description}</div>
                        </div>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preserveDecisions[index] !== undefined ? preserveDecisions[index] : data.preserveInMerged}
                          onChange={(e) => handlePreserveDecision(index, e.target.checked)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Preserve</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Important Notice</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    This action cannot be undone. The duplicate candidate will be permanently merged into the primary candidate. 
                    All selected data will be preserved and a complete audit trail will be maintained.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {mergePreview.conflicts.length > 0 && (
              <span>
                {mergePreview.conflicts.filter(c => c.requiresDecision).length} conflicts require your decision
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{isLoading ? 'Merging...' : 'Confirm Merge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergePreviewModal;