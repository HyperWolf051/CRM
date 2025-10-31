import { useState, useEffect } from 'react';
import { 
  X, User, Briefcase, FileText, MessageSquare, 
  Mail, Phone, MapPin, Calendar, Star, Edit, 
  Download, Upload, Plus, Clock, CheckCircle,
  AlertCircle, Building, DollarSign, GraduationCap,
  Award, Target, TrendingUp, Users, Eye
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { CandidateAPI, InterviewAPI } from '@/services/api';
import { ProfileTab, ApplicationTab, DocumentsTab, NotesTab } from './CandidateDetailTabs';
import WorkflowManagement from './WorkflowManagement';
import InterviewHistoryTracker from './InterviewHistoryTracker';

// Helper function to get stage display info
const getStageInfo = (stage) => {
  const stageMap = {
    'registration': { label: 'Registration', color: 'bg-blue-100 text-blue-800', progress: 1, icon: User },
    'resume-sharing': { label: 'Resume Sharing', color: 'bg-purple-100 text-purple-800', progress: 2, icon: FileText },
    'shortlisting': { label: 'Shortlisting', color: 'bg-amber-100 text-amber-800', progress: 3, icon: Target },
    'lineup-feedback': { label: 'Lineup & Feedback', color: 'bg-cyan-100 text-cyan-800', progress: 4, icon: MessageSquare },
    'selection': { label: 'Selection', color: 'bg-green-100 text-green-800', progress: 5, icon: CheckCircle },
    'closure': { label: 'Closure', color: 'bg-emerald-100 text-emerald-800', progress: 6, icon: Award },
    'completed': { label: 'Completed', color: 'bg-gray-100 text-gray-800', progress: 7, icon: CheckCircle }
  };
  return stageMap[stage] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', progress: 0, icon: AlertCircle };
};

// Helper function to get status display info
const getStatusInfo = (status) => {
  const statusMap = {
    'new': { label: 'New', color: 'bg-blue-100 text-blue-800' },
    'in-process': { label: 'In Process', color: 'bg-yellow-100 text-yellow-800' },
    'shortlisted': { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
    'interviewed': { label: 'Interviewed', color: 'bg-cyan-100 text-cyan-800' },
    'selected': { label: 'Selected', color: 'bg-green-100 text-green-800' },
    'placed': { label: 'Placed', color: 'bg-emerald-100 text-emerald-800' },
    'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800' }
  };
  return statusMap[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

// Workflow Progress Component
const WorkflowProgress = ({ candidate }) => {
  const stages = [
    'registration', 'resume-sharing', 'shortlisting', 
    'lineup-feedback', 'selection', 'closure', 'completed'
  ];
  
  const currentStageIndex = stages.indexOf(candidate.currentStage);
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Progress</h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const stageInfo = getStageInfo(stage);
          const StageIcon = stageInfo.icon;
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isUpcoming = index > currentStageIndex;
          
          return (
            <div key={stage} className="flex flex-col items-center flex-1">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white' : 
                  isCurrent ? 'bg-blue-500 text-white animate-pulse' : 
                  'bg-gray-200 text-gray-400'}
              `}>
                <StageIcon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium text-center px-2 ${
                isCurrent ? 'text-blue-600' : 
                isCompleted ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                {stageInfo.label}
              </span>
              {index < stages.length - 1 && (
                <div className={`
                  absolute h-0.5 w-full mt-6 -z-10
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} style={{ left: '50%', width: 'calc(100% - 48px)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Client Feedback Component
const ClientFeedbackSection = ({ candidate }) => {
  const feedbacks = candidate.lineupFeedback?.feedbacks || [];
  
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No client feedback available yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{feedback.clientName}</h4>
              <p className="text-sm text-gray-500">Feedback #{feedback.feedbackNumber}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              feedback.feedback === 'Selected' ? 'bg-green-100 text-green-800' :
              feedback.feedback === 'Rejected' ? 'bg-red-100 text-red-800' :
              feedback.feedback === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
              feedback.feedback === 'Joined' ? 'bg-emerald-100 text-emerald-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {feedback.feedback}
            </span>
          </div>
          {feedback.scheduledDate && (
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Scheduled: {new Date(feedback.scheduledDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Change History Component
const ChangeHistorySection = ({ candidate }) => {
  const changes = candidate.changeHistory || [];
  
  if (changes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No change history available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {changes.slice(0, 10).map((change, index) => (
        <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">{change.changedByName}</p>
              <span className="text-xs text-gray-500">
                {new Date(change.timestamp).toLocaleDateString()} at {new Date(change.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 capitalize">{change.changeType.replace('_', ' ')}</p>
            {change.changes && change.changes.length > 0 && (
              <div className="mt-2 space-y-1">
                {change.changes.map((fieldChange, idx) => (
                  <div key={idx} className="text-xs text-gray-500">
                    <span className="font-medium">{fieldChange.fieldDisplayName}:</span> {fieldChange.changeDescription}
                  </div>
                ))}
              </div>
            )}
            {change.reason && (
              <p className="text-xs text-gray-500 mt-1 italic">Reason: {change.reason}</p>
            )}
          </div>
        </div>
      ))}
      {changes.length > 10 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            View All Changes ({changes.length})
          </Button>
        </div>
      )}
    </div>
  );
};

const CandidateDetailModal = ({ 
  isOpen, 
  onClose, 
  candidateId,
  onStatusUpdate,
  onAddNote,
  currentUser
}) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Load candidate data
  useEffect(() => {
    if (isOpen && candidateId) {
      loadCandidate();
    }
  }, [isOpen, candidateId]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await CandidateAPI.getById(candidateId);
      
      if (result.success) {
        setCandidate(result.data);
      } else {
        setError(result.message || 'Failed to load candidate details');
      }
    } catch (err) {
      console.error('Error loading candidate:', err);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await CandidateAPI.update(candidateId, { 
        overallStatus: newStatus,
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      });
      
      if (result.success) {
        setCandidate(prev => ({ ...prev, overallStatus: newStatus }));
        onStatusUpdate?.(newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const noteData = {
        content: newNote,
        createdBy: currentUser?.id || 'current-user',
        createdByName: currentUser?.name || 'Current User',
        createdAt: new Date().toISOString(),
        isPrivate: false
      };
      
      const updatedNotes = [...(candidate.notes || []), noteData];
      const result = await CandidateAPI.update(candidateId, { 
        notes: updatedNotes,
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      });
      
      if (result.success) {
        setCandidate(prev => ({ ...prev, notes: updatedNotes }));
        setNewNote('');
        onAddNote?.(newNote);
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setUploadingDocument(true);
      // In a real implementation, you would upload the file to a storage service
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const documentData = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser?.name || 'Current User'
      };
      
      const updatedDocuments = [...(candidate.documents || []), documentData];
      const result = await CandidateAPI.update(candidateId, { 
        documents: updatedDocuments,
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      });
      
      if (result.success) {
        setCandidate(prev => ({ ...prev, documents: updatedDocuments }));
      }
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleCandidateUpdate = async (candidateId, updates) => {
    try {
      const result = await CandidateAPI.update(candidateId, updates);
      
      if (result.success) {
        setCandidate(prev => ({ ...prev, ...updates }));
        // Reload candidate to get updated data
        await loadCandidate();
      }
    } catch (err) {
      console.error('Error updating candidate:', err);
    }
  };

  const handleInterviewSchedule = async (interviewData) => {
    try {
      const result = await InterviewAPI.create(interviewData);
      
      if (result.success) {
        // Update candidate with interview scheduled change history
        const updates = {
          lastModifiedBy: currentUser?.id,
          lastModifiedByName: currentUser?.name
        };
        
        await handleCandidateUpdate(candidateId, updates);
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'application', label: 'Application', icon: Briefcase },
    { id: 'workflow', label: 'Workflow', icon: Clock },
    { id: 'interviews', label: 'Interview History', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: MessageSquare }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidate ? `${candidate.name} - Candidate Details` : 'Loading...'}
      className="max-w-6xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading candidate details...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadCandidate} variant="outline">
            Try Again
          </Button>
        </div>
      ) : candidate ? (
        <div className="space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start space-x-6 pb-6 border-b border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{candidate.name}</h2>
                  <p className="text-lg text-gray-600 mb-2">{candidate.interestedFor || candidate.designation}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(candidate.overallStatus).color}`}>
                      {getStatusInfo(candidate.overallStatus).label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageInfo(candidate.currentStage).color}`}>
                      {getStageInfo(candidate.currentStage).label}
                    </span>
                    {candidate.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{candidate.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Added by {candidate.createdByName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  <select
                    value={candidate.overallStatus}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="in-process">In Process</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="selected">Selected</option>
                    <option value="placed">Placed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Progress */}
          <WorkflowProgress candidate={candidate} />

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'profile' && (
              <ProfileTab candidate={candidate} isEditing={isEditing} />
            )}
            {activeTab === 'application' && (
              <ApplicationTab candidate={candidate} />
            )}
            {activeTab === 'workflow' && (
              <WorkflowManagement
                candidate={candidate}
                onCandidateUpdate={handleCandidateUpdate}
                onInterviewSchedule={handleInterviewSchedule}
                currentUser={currentUser}
              />
            )}
            {activeTab === 'interviews' && (
              <InterviewHistoryTracker 
                candidateId={candidate.id}
                showFilters={false}
                maxItems={null}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsTab 
                candidate={candidate} 
                onDocumentUpload={handleDocumentUpload}
                uploadingDocument={uploadingDocument}
              />
            )}
            {activeTab === 'notes' && (
              <NotesTab 
                candidate={candidate}
                newNote={newNote}
                setNewNote={setNewNote}
                onAddNote={handleAddNote}
              />
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default CandidateDetailModal;