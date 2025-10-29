import { useState } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  MessageSquare, 
  Building, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Video,
  MapPin
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { candidateUtils } from '@/utils/candidateUtils';
import { RECRUITMENT_STAGES } from '@/types/recruitment';

// Stage Action Buttons Component
const StageActionButtons = ({ candidate, onStageUpdate, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const currentStageOrder = RECRUITMENT_STAGES[candidate.currentStage]?.order || 0;
  const nextStages = Object.entries(RECRUITMENT_STAGES)
    .filter(([_, config]) => config.order === currentStageOrder + 1)
    .map(([stage, config]) => ({ stage, config }));

  const handleStageAdvance = async (newStage) => {
    setLoading(true);
    try {
      const updates = {
        currentStage: newStage,
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      };

      // Add stage-specific updates
      const now = new Date();
      switch (newStage) {
        case 'resume-sharing':
          updates.resumeSharing = {
            ...candidate.resumeSharing,
            date: now,
            resumeShareStatus: 'Done'
          };
          break;
        case 'shortlisting':
          updates.shortlisting = {
            ...candidate.shortlisting,
            shortlistDate: now,
            shortlistStatus: 'Done'
          };
          break;
        case 'lineup-feedback':
          updates.lineupFeedback = {
            ...candidate.lineupFeedback,
            shortlistDate: now,
            lineupStatus: 'Done'
          };
          break;
        case 'selection':
          updates.selection = {
            ...candidate.selection,
            selectionDate: now,
            selectionStatus: 'Selected'
          };
          break;
        case 'closure':
          updates.closure = {
            ...candidate.closure,
            joiningDate: now
          };
          break;
      }

      await onStageUpdate(updates);
    } catch (error) {
      console.error('Error updating stage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (nextStages.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <p className="text-sm">Recruitment process completed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 mb-3">Advance to Next Stage</h4>
      {nextStages.map(({ stage, config }) => (
        <Button
          key={stage}
          onClick={() => handleStageAdvance(stage)}
          disabled={loading}
          className="w-full justify-between"
          variant="outline"
        >
          <span>Move to {config.name}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};

// Client Feedback Form Component
const ClientFeedbackForm = ({ candidate, onFeedbackSubmit, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    feedback: 'Pending',
    scheduledDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const feedbackOptions = [
    { value: 'Selected', label: 'Selected', color: 'text-green-600' },
    { value: 'Rejected', label: 'Rejected', color: 'text-red-600' },
    { value: 'Hold', label: 'On Hold', color: 'text-yellow-600' },
    { value: 'Joined', label: 'Joined', color: 'text-emerald-600' },
    { value: 'Pending', label: 'Pending', color: 'text-gray-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const existingFeedbacks = candidate.lineupFeedback?.feedbacks || [];
      const newFeedback = {
        feedbackNumber: existingFeedbacks.length + 1,
        clientName: formData.clientName,
        feedback: formData.feedback,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        notes: formData.notes,
        createdAt: new Date()
      };

      const updatedFeedbacks = [...existingFeedbacks, newFeedback];
      
      const updates = {
        lineupFeedback: {
          ...candidate.lineupFeedback,
          feedbacks: updatedFeedbacks,
          lineupStatus: 'Done'
        },
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      };

      await onFeedbackSubmit(updates);
      
      // Reset form and close modal
      setFormData({
        clientName: '',
        feedback: 'Pending',
        scheduledDate: '',
        notes: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        icon={<MessageSquare className="w-4 h-4" />}
        className="w-full"
      >
        Add Client Feedback
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Client Feedback"
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Status *
            </label>
            <select
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {feedbackOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the feedback..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Feedback'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// Interview Scheduling Component
const InterviewScheduler = ({ candidate, onInterviewSchedule, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'video',
    scheduledDate: '',
    duration: 60,
    interviewer: '',
    interviewerEmail: '',
    meetingLink: '',
    location: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const interviewTypes = [
    { value: 'phone', label: 'Phone Interview', icon: Phone },
    { value: 'video', label: 'Video Interview', icon: Video },
    { value: 'in-person', label: 'In-Person Interview', icon: MapPin }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interviewData = {
        id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        candidateId: candidate.id,
        type: formData.type,
        scheduledDate: new Date(formData.scheduledDate),
        duration: parseInt(formData.duration),
        interviewer: {
          id: currentUser?.id || 'current-user',
          name: formData.interviewer || currentUser?.name || 'Current User',
          email: formData.interviewerEmail || currentUser?.email || '',
        },
        status: 'scheduled',
        meetingLink: formData.meetingLink,
        location: formData.location,
        notes: formData.notes,
        createdAt: new Date()
      };

      await onInterviewSchedule(interviewData);
      
      // Reset form and close modal
      setFormData({
        type: 'video',
        scheduledDate: '',
        duration: 60,
        interviewer: '',
        interviewerEmail: '',
        meetingLink: '',
        location: '',
        notes: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        icon={<Calendar className="w-4 h-4" />}
        className="w-full"
        variant="outline"
      >
        Schedule Interview
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Schedule Interview"
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {interviewTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer Name
              </label>
              <input
                type="text"
                value={formData.interviewer}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={currentUser?.name || 'Enter interviewer name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer Email
              </label>
              <input
                type="email"
                value={formData.interviewerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewerEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={currentUser?.email || 'Enter email'}
              />
            </div>
          </div>

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link
              </label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://zoom.us/j/... or Teams link"
              />
            </div>
          )}

          {formData.type === 'in-person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Office address or meeting room"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Interview agenda, preparation notes, etc."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// Placement Details Form Component
const PlacementDetailsForm = ({ candidate, onPlacementUpdate, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    placedIn: candidate.closure?.placedIn || '',
    joiningDate: candidate.closure?.joiningDate ? 
      new Date(candidate.closure.joiningDate).toISOString().split('T')[0] : '',
    offeredSalary: candidate.closure?.offeredSalary || '',
    charges: candidate.closure?.charges || '',
    joiningStatus: candidate.closure?.joiningStatus || 'No',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        closure: {
          ...candidate.closure,
          placedIn: formData.placedIn,
          joiningDate: formData.joiningDate ? new Date(formData.joiningDate) : undefined,
          offeredSalary: formData.offeredSalary,
          charges: formData.charges,
          joiningStatus: formData.joiningStatus
        },
        currentStage: formData.joiningStatus === 'Yes' ? 'completed' : 'closure',
        overallStatus: formData.joiningStatus === 'Yes' ? 'placed' : 'selected',
        lastModifiedBy: currentUser?.id,
        lastModifiedByName: currentUser?.name
      };

      await onPlacementUpdate(updates);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating placement details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        icon={<Building className="w-4 h-4" />}
        className="w-full"
        variant="outline"
      >
        Update Placement Details
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Placement Details"
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Placed In *
            </label>
            <input
              type="text"
              value={formData.placedIn}
              onChange={(e) => setFormData(prev => ({ ...prev, placedIn: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Status *
              </label>
              <select
                value={formData.joiningStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, joiningStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="No">Not Joined</option>
                <option value="Yes">Joined</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offered Salary
              </label>
              <input
                type="text"
                value={formData.offeredSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, offeredSalary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50K, 8 LPA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Charges
              </label>
              <input
                type="text"
                value={formData.charges}
                onChange={(e) => setFormData(prev => ({ ...prev, charges: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10K, 15%"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional placement details, terms, etc."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Details'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// Main Workflow Management Component
const WorkflowManagement = ({ 
  candidate, 
  onCandidateUpdate, 
  onInterviewSchedule,
  currentUser 
}) => {
  const handleStageUpdate = async (updates) => {
    await onCandidateUpdate(candidate.id, updates);
  };

  const handleFeedbackSubmit = async (updates) => {
    await onCandidateUpdate(candidate.id, updates);
  };

  const handlePlacementUpdate = async (updates) => {
    await onCandidateUpdate(candidate.id, updates);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Workflow Management</h3>
      </div>

      <div className="space-y-6">
        {/* Stage Advancement */}
        <div className="border-b border-gray-100 pb-6">
          <StageActionButtons
            candidate={candidate}
            onStageUpdate={handleStageUpdate}
            currentUser={currentUser}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <ClientFeedbackForm
            candidate={candidate}
            onFeedbackSubmit={handleFeedbackSubmit}
            currentUser={currentUser}
          />
          
          <InterviewScheduler
            candidate={candidate}
            onInterviewSchedule={onInterviewSchedule}
            currentUser={currentUser}
          />
          
          <PlacementDetailsForm
            candidate={candidate}
            onPlacementUpdate={handlePlacementUpdate}
            currentUser={currentUser}
          />
        </div>

        {/* Current Stage Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Stage</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              RECRUITMENT_STAGES[candidate.currentStage]?.name === 'Completed' 
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {RECRUITMENT_STAGES[candidate.currentStage]?.name || 'Unknown'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {RECRUITMENT_STAGES[candidate.currentStage]?.description || 'Stage description not available'}
          </p>
          
          {/* Progress indicator */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{candidateUtils.getCandidateProgress(candidate)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${candidateUtils.getCandidateProgress(candidate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowManagement;