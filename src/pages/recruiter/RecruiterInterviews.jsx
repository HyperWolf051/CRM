import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Users,
  Eye,
  Edit,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Building
} from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import InterviewScheduleModal from '../../components/recruitment/InterviewScheduleModal';
import InterviewNotesModal from '../../components/recruitment/InterviewNotesModal';
import InterviewStatusModal from '../../components/recruitment/InterviewStatusModal';

// Interview type configurations with colors and icons
const INTERVIEW_TYPES = {
  phone: {
    name: 'Phone',
    icon: Phone,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  video: {
    name: 'Video',
    icon: Video,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  'in-person': {
    name: 'In-Person',
    icon: Users,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  }
};

// Status configurations
const STATUS_CONFIG = {
  scheduled: {
    name: 'Scheduled',
    color: 'bg-blue-100 text-blue-800',
    icon: Calendar
  },
  'in-progress': {
    name: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  completed: {
    name: 'Completed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    name: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: X
  },
  rescheduled: {
    name: 'Rescheduled',
    color: 'bg-orange-100 text-orange-800',
    icon: Edit
  },
  'no-show': {
    name: 'No Show',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle
  }
};

// Priority configurations
const PRIORITY_CONFIG = {
  low: { name: 'Low', color: 'bg-gray-100 text-gray-700' },
  medium: { name: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { name: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { name: 'Urgent', color: 'bg-red-100 text-red-700' }
};

// Interview Card Component
const InterviewCard = ({ interview, onJoin, onReschedule, onAddNotes, onUpdateStatus, onViewDetails }) => {
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
  const isToday = interview.scheduledDate.toDateString() === new Date().toDateString();
  const isPast = interview.scheduledDate < new Date();

  return (
    <div className={`
      bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200
      ${isToday ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}
      ${isPast && interview.status === 'scheduled' ? 'border-orange-200 bg-orange-50/30' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${typeConfig.bgColor} flex-shrink-0`}>
            {React.createElement(typeConfig.icon, { 
              className: `w-4 h-4 sm:w-5 sm:h-5 ${typeConfig.textColor}` 
            })}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-base sm:text-lg truncate">
              {interview.candidateName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center space-x-1 truncate">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{interview.jobTitle}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} hidden sm:inline-flex`}>
            {priorityConfig.name}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors touch-target"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    onViewDetails(interview);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    onReschedule(interview);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Reschedule</span>
                </button>
                <button
                  onClick={() => {
                    onAddNotes(interview);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Add Notes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interview Details */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className={isToday ? 'font-medium text-blue-700' : ''}>{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className={isToday ? 'font-medium text-blue-700' : ''}>{time}</span>
            </div>
            <div className="flex items-center space-x-1 min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-[120px]">{interview.location}</span>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} self-start sm:self-auto`}>
            {statusConfig.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center space-x-1 text-slate-600 min-w-0">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{interview.interviewer.name}</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="truncate hidden sm:inline">{interview.interviewer.role}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-slate-600 min-w-0">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{interview.client}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Round {interview.round} • {interview.duration} min
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${typeConfig.color} text-white`}>
            {typeConfig.name}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {interview.status === 'scheduled' && (
          <>
            {interview.type === 'video' && interview.meetingLink && (
              <button
                onClick={() => onJoin(interview)}
                className="flex-1 px-4 py-3 sm:py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 touch-target"
              >
                <Video className="w-4 h-4" />
                <span>Join</span>
              </button>
            )}
            <button
              onClick={() => onReschedule(interview)}
              className="flex-1 px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 touch-target"
            >
              <Edit className="w-4 h-4" />
              <span>Reschedule</span>
            </button>
          </>
        )}
        
        <button
          onClick={() => onAddNotes(interview)}
          className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2 touch-target"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Notes</span>
        </button>
        
        <button
          onClick={() => onUpdateStatus(interview)}
          className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors touch-target"
        >
          <span className="hidden sm:inline">Update Status</span>
          <span className="sm:hidden">Status</span>
        </button>
      </div>

      {/* Notes Preview */}
      {interview.notes && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 line-clamp-2">{interview.notes}</p>
        </div>
      )}
    </div>
  );
};

// Advanced Filters Component
const InterviewFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = {
    type: [
      { value: 'all', label: 'All Types' },
      { value: 'phone', label: 'Phone' },
      { value: 'video', label: 'Video' },
      { value: 'in-person', label: 'In-Person' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'rescheduled', label: 'Rescheduled' }
    ],
    priority: [
      { value: 'all', label: 'All Priorities' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== ''
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center space-x-2 ${
          showFilters || activeFiltersCount > 0
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="absolute top-12 left-0 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-20 min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Filter Interviews</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => onFilterChange('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value ? new Date(e.target.value) : null
                  })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => onFilterChange('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value ? new Date(e.target.value) : null
                  })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {filterOptions.type.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {filterOptions.status.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select
                value={filters.priority || 'all'}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {filterOptions.priority.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
              <input
                type="text"
                placeholder="Filter by job title..."
                value={filters.position || ''}
                onChange={(e) => onFilterChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Interviewer Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interviewer</label>
              <input
                type="text"
                placeholder="Filter by interviewer name..."
                value={filters.interviewer || ''}
                onChange={(e) => onFilterChange('interviewer', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RecruiterInterviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    dateRange: null,
    position: '',
    interviewer: ''
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Use the interviews hook with filters
  const {
    interviews,
    loading,
    error,
    rescheduleInterview,
    updateInterview,
    getInterviewStats
  } = useInterviews(filters);

  const stats = getInterviewStats();

  // Filter interviews based on search term
  const filteredInterviews = interviews.filter(interview => {
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

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      dateRange: null,
      position: '',
      interviewer: ''
    });
    setSearchTerm('');
  };

  const handleJoinInterview = (interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    }
  };

  const handleRescheduleInterview = (interview) => {
    setSelectedInterview(interview);
    setShowScheduleModal(true);
  };

  const handleAddNotes = (interview) => {
    setSelectedInterview(interview);
    setShowNotesModal(true);
  };

  const handleUpdateStatus = (interview) => {
    setSelectedInterview(interview);
    setShowStatusModal(true);
  };

  const handleSaveNotes = async (interviewId, notes) => {
    await updateInterview(interviewId, { notes });
  };

  const handleUpdateInterviewStatus = async (interviewId, status, notes) => {
    await updateInterview(interviewId, { status, statusNotes: notes });
  };

  const handleViewDetails = (interview) => {
    // TODO: Navigate to interview details page
    console.log('View details for interview:', interview.id);
  };

  const handleScheduleInterview = () => {
    setSelectedInterview(null);
    setShowScheduleModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading interviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-slate-600">Error loading interviews: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Interviews
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Manage and track candidate interviews</p>
          </div>

          <button
            onClick={handleScheduleInterview}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl touch-target"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Interview</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">Today</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.today}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.thisWeek}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">Done</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.completed}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search interviews by candidate, job, or interviewer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
            />
          </div>

          <InterviewFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Interviews Grid */}
        {filteredInterviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredInterviews.map(interview => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onJoin={handleJoinInterview}
                onReschedule={handleRescheduleInterview}
                onAddNotes={handleAddNotes}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No interviews found</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                ? "No interviews match your current search and filters."
                : "You haven't scheduled any interviews yet. Start by scheduling your first interview."
              }
            </p>
            <button
              onClick={handleScheduleInterview}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Schedule Interview</span>
            </button>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <InterviewScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedInterview(null);
          }}
          onSchedule={async (interviewData) => {
            // Handle interview scheduling/updating
            console.log('Interview data:', interviewData);
            setShowScheduleModal(false);
            setSelectedInterview(null);
          }}
          existingInterview={selectedInterview}
        />
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <InterviewNotesModal
          isOpen={showNotesModal}
          onClose={() => {
            setShowNotesModal(false);
            setSelectedInterview(null);
          }}
          interview={selectedInterview}
          onSaveNotes={handleSaveNotes}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <InterviewStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedInterview(null);
          }}
          interview={selectedInterview}
          onUpdateStatus={handleUpdateInterviewStatus}
        />
      )}
    </div>
  );
};

export default RecruiterInterviews;