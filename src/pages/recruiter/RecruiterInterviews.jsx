import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Users,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Building,
  Mail
} from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import InterviewScheduleModal from '../../components/recruitment/InterviewScheduleModal';

const INTERVIEW_TYPES = {
  phone: {
    name: 'Phone',
    icon: Phone,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  video: {
    name: 'Video',
    icon: Video,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  'in-person': {
    name: 'In-Person',
    icon: Users,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }
};

const STATUS_CONFIG = {
  scheduled: { name: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  'in-progress': { name: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  completed: { name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  rescheduled: { name: 'Rescheduled', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  'no-show': { name: 'No Show', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

const PRIORITY_CONFIG = {
  low: { name: 'Low', color: 'bg-gray-100 text-gray-700' },
  medium: { name: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { name: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { name: 'Urgent', color: 'bg-red-100 text-red-700' }
};

const RecruiterInterviews = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    interviewer: 'all',
    dateRange: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { 
    interviews, 
    loading, 
    error, 
    rescheduleInterview, 
    updateInterview, 
    cancelInterview,
    getInterviewStats 
  } = useInterviews(filters);

  const stats = getInterviewStats();

  // Filter interviews based on search term
  const filteredInterviews = interviews.filter(interview => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      interview.candidateName.toLowerCase().includes(searchLower) ||
      interview.jobTitle.toLowerCase().includes(searchLower) ||
      interview.client.toLowerCase().includes(searchLower) ||
      interview.interviewer.name.toLowerCase().includes(searchLower)
    );
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleScheduleInterview = async (interviewData) => {
    // This would typically call an API
    console.log('Scheduling interview:', interviewData);
    setShowScheduleModal(false);
  };

  const handleReschedule = async (interviewId, newDateTime) => {
    const result = await rescheduleInterview(interviewId, newDateTime);
    if (result.success) {
      // Show success message
      console.log('Interview rescheduled successfully');
    }
  };

  const handleUpdateStatus = async (interviewId, status) => {
    const result = await updateInterview(interviewId, { status });
    if (result.success) {
      console.log('Interview status updated');
    }
  };

  const handleCancel = async (interviewId, reason) => {
    const result = await cancelInterview(interviewId, reason);
    if (result.success) {
      console.log('Interview cancelled');
    }
  };

  const handleAddFeedback = (interview) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Interviews</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">Manage and track all interview appointments</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.today}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="phone">Phone</option>
              <option value="video">Video</option>
              <option value="in-person">In-Person</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInterviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            onReschedule={handleReschedule}
            onUpdateStatus={handleUpdateStatus}
            onCancel={handleCancel}
            onAddFeedback={handleAddFeedback}
          />
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some(f => f !== 'all')
              ? 'Try adjusting your search or filters'
              : 'Schedule your first interview to get started'
            }
          </p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      )}

      {/* Schedule Interview Modal */}
      <InterviewScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleInterview}
      />

      {/* Interview Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <InterviewFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          interview={selectedInterview}
          onSubmitFeedback={(feedback) => {
            console.log('Feedback submitted:', feedback);
            setShowFeedbackModal(false);
          }}
        />
      )}
    </div>
  );
};

// Interview Card Component
const InterviewCard = ({ interview, onReschedule, onUpdateStatus, onCancel, onAddFeedback }) => {
  const [showActions, setShowActions] = useState(false);
  const typeConfig = INTERVIEW_TYPES[interview.type];
  const statusConfig = STATUS_CONFIG[interview.status];
  const priorityConfig = PRIORITY_CONFIG[interview.priority];

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { date, time } = formatDateTime(interview.scheduledDate);
  const isUpcoming = interview.scheduledDate > new Date();
  const isToday = interview.scheduledDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeConfig.color}`}>
            {React.createElement(typeConfig.icon, { className: "w-5 h-5 text-white" })}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
            <p className="text-sm text-gray-600">{interview.jobTitle}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
              <button
                onClick={() => {
                  // Handle edit
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onAddFeedback(interview);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Feedback</span>
              </button>
              <button
                onClick={() => {
                  onCancel(interview.id, 'Cancelled by recruiter');
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interview Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Building className="w-4 h-4" />
          <span>{interview.client}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{date} at {time}</span>
          {isToday && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Today</span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{interview.interviewer.name}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{interview.location}</span>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.name}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
          {priorityConfig.name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {interview.type === 'video' && interview.meetingLink && (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Join Meeting
          </a>
        )}
        {isUpcoming && (
          <button
            onClick={() => {
              // Handle reschedule
              const newDate = new Date(interview.scheduledDate.getTime() + 24 * 60 * 60 * 1000);
              onReschedule(interview.id, newDate);
            }}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );
};

// Interview Feedback Modal Component
const InterviewFeedbackModal = ({ isOpen, onClose, interview, onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    technicalSkills: 0,
    communication: 0,
    culturalFit: 0,
    overallRecommendation: '',
    comments: '',
    nextSteps: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({
      ...feedback,
      interviewId: interview.id,
      submittedBy: 'current-user', // This would come from auth context
      submittedAt: new Date()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Interview Feedback</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-500 rotate-45" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
            <p className="text-sm text-gray-600">{interview.jobTitle} - {interview.client}</p>
            <p className="text-sm text-gray-600">
              {interview.scheduledDate.toLocaleDateString()} at {interview.scheduledDate.toLocaleTimeString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, technicalSkills: rating }))}
                      className={`w-8 h-8 ${
                        rating <= feedback.technicalSkills
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, communication: rating }))}
                      className={`w-8 h-8 ${
                        rating <= feedback.communication
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Fit
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, culturalFit: rating }))}
                      className={`w-8 h-8 ${
                        rating <= feedback.culturalFit
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, rating: rating }))}
                      className={`w-8 h-8 ${
                        rating <= feedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Recommendation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Recommendation
              </label>
              <select
                value={feedback.overallRecommendation}
                onChange={(e) => setFeedback(prev => ({ ...prev, overallRecommendation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select recommendation...</option>
                <option value="strong-hire">Strong Hire</option>
                <option value="hire">Hire</option>
                <option value="no-hire">No Hire</option>
                <option value="strong-no-hire">Strong No Hire</option>
              </select>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                placeholder="Detailed feedback about the candidate's performance..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Steps
              </label>
              <textarea
                value={feedback.nextSteps}
                onChange={(e) => setFeedback(prev => ({ ...prev, nextSteps: e.target.value }))}
                rows={2}
                placeholder="Recommended next steps for this candidate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterInterviews;