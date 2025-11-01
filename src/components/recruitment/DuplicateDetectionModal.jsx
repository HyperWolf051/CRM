import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, User, Phone, Mail, Calendar, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { duplicateUIUtils } from '../../utils/duplicateDetection';

const DuplicateDetectionModal = ({ 
  isOpen, 
  onClose, 
  newCandidate, 
  duplicates = [], 
  onMerge, 
  onCreateNew, 
  onLinkRelated,
  isLoading = false 
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  useEffect(() => {
    if (isOpen) {
      setSelectedAction('');
      setSelectedDuplicate(null);
      setShowDetails({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActionSelect = (action, duplicate = null) => {
    setSelectedAction(action);
    setSelectedDuplicate(duplicate);
  };

  const handleConfirmAction = () => {
    switch (selectedAction) {
      case 'merge':
        if (selectedDuplicate) {
          onMerge(selectedDuplicate.candidateId, selectedDuplicate.candidate);
        }
        break;
      case 'create-new':
        onCreateNew();
        break;
      case 'link-related':
        if (selectedDuplicate) {
          onLinkRelated([selectedDuplicate.candidateId]);
        }
        break;
    }
  };

  const toggleDetails = (candidateId) => {
    setShowDetails(prev => ({
      ...prev,
      [candidateId]: !prev[candidateId]
    }));
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'merge': return <Users className="w-4 h-4" />;
      case 'create-new': return <CheckCircle className="w-4 h-4" />;
      case 'link-related': return <ArrowRight className="w-4 h-4" />;
      default: return null;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'merge': return 'bg-blue-600 hover:bg-blue-700';
      case 'create-new': return 'bg-green-600 hover:bg-green-700';
      case 'link-related': return 'bg-amber-600 hover:bg-amber-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Potential Duplicates Found</h2>
              <p className="text-sm text-gray-600">
                We found {duplicates.length} potential duplicate{duplicates.length !== 1 ? 's' : ''} for this candidate
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
        <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)]">
          {/* New Candidate Info */}
          <div className="lg:w-1/3 p-6 border-r border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Candidate</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{newCandidate.name}</h4>
                  <p className="text-sm text-gray-600">{newCandidate.position || newCandidate.interestedFor}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {newCandidate.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{newCandidate.email}</span>
                  </div>
                )}
                {newCandidate.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{newCandidate.phone}</span>
                  </div>
                )}
                {newCandidate.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{newCandidate.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Duplicates List */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Potential Matches</h3>
            
            <div className="space-y-4">
              {duplicates.map((duplicate) => (
                <div key={duplicate.candidateId} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Match Header */}
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{duplicate.candidate.name}</h4>
                          <p className="text-sm text-gray-600">
                            Added by {duplicate.createdByName} • {duplicateUIUtils.formatTimeAgo(new Date(duplicate.createdAt))}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Confidence Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${duplicateUIUtils.getConfidenceColor(duplicate.confidence)}`}>
                          {duplicate.confidence.toUpperCase()} ({duplicateUIUtils.formatMatchScore(duplicate.matchScore)})
                        </span>
                        
                        {/* Toggle Details */}
                        <button
                          onClick={() => toggleDetails(duplicate.candidateId)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {showDetails[duplicate.candidateId] ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {duplicate.matchReasons.map((reason, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                        >
                          {reason.field}: {reason.similarity}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Information */}
                  {showDetails[duplicate.candidateId] && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                          <div className="space-y-1 text-gray-600">
                            <div>Email: {duplicate.candidate.email}</div>
                            <div>Phone: {duplicate.candidate.phone}</div>
                            <div>Location: {duplicate.candidate.location}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Professional Details</h5>
                          <div className="space-y-1 text-gray-600">
                            <div>Position: {duplicate.candidate.interestedFor}</div>
                            <div>Experience: {duplicate.candidate.totalExperience}</div>
                            <div>Current Stage: {duplicate.candidate.currentStage}</div>
                          </div>
                        </div>
                      </div>

                      {/* Match Details */}
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Match Details</h5>
                        <div className="space-y-2">
                          {duplicate.matchReasons.map((reason, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-white p-2 rounded border">
                              {reason.details}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 bg-white p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleActionSelect('merge', duplicate)}
                        className={`flex items-center space-x-2 px-3 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                          selectedAction === 'merge' && selectedDuplicate?.candidateId === duplicate.candidateId
                            ? 'bg-blue-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>Merge Candidates</span>
                      </button>
                      
                      <button
                        onClick={() => handleActionSelect('link-related', duplicate)}
                        className={`flex items-center space-x-2 px-3 py-2 text-amber-700 bg-amber-50 border border-amber-200 text-sm font-medium rounded-lg hover:bg-amber-100 transition-colors ${
                          selectedAction === 'link-related' && selectedDuplicate?.candidateId === duplicate.candidateId
                            ? 'bg-amber-100'
                            : ''
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Link as Related</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedAction && (
              <span>
                Selected action: <strong>
                  {selectedAction === 'merge' && 'Merge with existing candidate'}
                  {selectedAction === 'create-new' && 'Create as new candidate'}
                  {selectedAction === 'link-related' && 'Link as related candidate'}
                </strong>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleActionSelect('create-new')}
              className={`flex items-center space-x-2 px-4 py-2 text-green-700 bg-green-50 border border-green-200 font-medium rounded-lg hover:bg-green-100 transition-colors ${
                selectedAction === 'create-new' ? 'bg-green-100' : ''
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Create New Anyway</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleConfirmAction}
              disabled={!selectedAction || isLoading}
              className={`flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedAction ? getActionColor(selectedAction) : 'bg-gray-400'
              }`}
            >
              {getActionIcon(selectedAction)}
              <span>
                {isLoading ? 'Processing...' : 'Confirm Action'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateDetectionModal;