import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  Users,
  MapPin,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Eye
} from 'lucide-react';

const INTERVIEW_TYPES = {
  phone: { name: 'Phone', icon: Phone, color: 'text-blue-600' },
  video: { name: 'Video', icon: Video, color: 'text-green-600' },
  'in-person': { name: 'In-Person', icon: Users, color: 'text-purple-600' }
};

const STATUS_CONFIG = {
  scheduled: { name: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  'in-progress': { name: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  completed: { name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  rescheduled: { name: 'Rescheduled', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  'no-show': { name: 'No Show', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

const InterviewHistoryTracker = ({ candidateId, showFilters = true, maxItems = null }) => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all',
    round: 'all'
  });
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock interview history data
  const mockInterviewHistory = [
    {
      id: '1',
      candidateId: candidateId || '1',
      candidateName: 'Tanishka Negi',
      jobId: '1',
      jobTitle: 'Senior React Developer',
      client: 'TechCorp Solutions',
      type: 'video',
      scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      duration: 60,
      interviewer: {
        id: '1',
        name: 'John Doe',
        role: 'Technical Lead'
      },
      status: 'completed',
      round: 2,
      location: 'Virtual',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Technical round focusing on React and system design',
      feedback: {
        rating: 4,
        technicalSkills: 4,
        communication: 5,
        culturalFit: 4,
        overallRecommendation: 'hire',
        comments: 'Strong technical skills, excellent communication. Good fit for the team.',
        nextSteps: 'Proceed to final round with hiring manager',
        submittedBy: 'John Doe',
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      outcome: 'advanced',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      candidateId: candidateId || '1',
      candidateName: 'Tanishka Negi',
      jobId: '1',
      jobTitle: 'Senior React Developer',
      client: 'TechCorp Solutions',
      type: 'phone',
      scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      duration: 30,
      interviewer: {
        id: '2',
        name: 'Jane Smith',
        role: 'HR Manager'
      },
      status: 'completed',
      round: 1,
      location: 'Phone',
      notes: 'Initial screening call to assess basic qualifications',
      feedback: {
        rating: 4,
        technicalSkills: 3,
        communication: 5,
        culturalFit: 4,
        overallRecommendation: 'hire',
        comments: 'Great communication skills, meets basic requirements. Ready for technical round.',
        nextSteps: 'Schedule technical interview',
        submittedBy: 'Jane Smith',
        submittedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
      },
      outcome: 'advanced',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      candidateId: candidateId || '2',
      candidateName: 'Rahul Sharma',
      jobId: '2',
      jobTitle: 'Product Manager',
      client: 'StartupXYZ',
      type: 'in-person',
      scheduledDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      duration: 90,
      interviewer: {
        id: '3',
        name: 'Mike Johnson',
        role: 'VP Product'
      },
      status: 'completed',
      round: 3,
      location: 'StartupXYZ Office, Conference Room A',
      notes: 'Final round with leadership team',
      feedback: {
        rating: 3,
        technicalSkills: 3,
        communication: 4,
        culturalFit: 2,
        overallRecommendation: 'no-hire',
        comments: 'Good technical knowledge but concerns about cultural fit and leadership style.',
        nextSteps: 'Thank candidate and provide feedback',
        submittedBy: 'Mike Johnson',
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      outcome: 'rejected',
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let data = mockInterviewHistory;
        
        // Filter by candidate if specified
        if (candidateId) {
          data = data.filter(interview => interview.candidateId === candidateId);
        }
        
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interview history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, [candidateId]);

  useEffect(() => {
    let filtered = [...interviews];

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(interview => interview.status === filters.status);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(interview => interview.type === filters.type);
    }

    if (filters.round !== 'all') {
      filtered = filtered.filter(interview => interview.round === parseInt(filters.round));
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(interview => interview.scheduledDate >= startDate);
      }
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());

    // Apply max items limit
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredInterviews(filtered);
  }, [interviews, filters, maxItems]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getInterviewStats = () => {
    const total = interviews.length;
    const completed = interviews.filter(i => i.status === 'completed').length;
    const avgRating = interviews
      .filter(i => i.feedback?.rating)
      .reduce((sum, i) => sum + i.feedback.rating, 0) / 
      interviews.filter(i => i.feedback?.rating).length || 0;
    
    const outcomes = interviews.reduce((acc, interview) => {
      if (interview.outcome) {
        acc[interview.outcome] = (acc[interview.outcome] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      total,
      completed,
      avgRating: Math.round(avgRating * 10) / 10,
      outcomes
    };
  };

  const exportHistory = () => {
    const csvContent = [
      ['Date', 'Candidate', 'Job Title', 'Client', 'Type', 'Round', 'Status', 'Interviewer', 'Rating', 'Outcome'].join(','),
      ...filteredInterviews.map(interview => [
        interview.scheduledDate.toLocaleDateString(),
        interview.candidateName,
        interview.jobTitle,
        interview.client,
        interview.type,
        interview.round,
        interview.status,
        interview.interviewer.name,
        interview.feedback?.rating || 'N/A',
        interview.outcome || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getInterviewStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {!candidateId && (
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
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating || 'N/A'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.total > 0 ? Math.round((stats.outcomes.advanced || 0) / stats.total * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>

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
                value={filters.round}
                onChange={(e) => handleFilterChange('round', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Rounds</option>
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
                <option value="3">Round 3</option>
                <option value="4">Round 4</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>

            <button
              onClick={exportHistory}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Interview History List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <InterviewHistoryCard
            key={interview.id}
            interview={interview}
            onViewDetails={() => {
              setSelectedInterview(interview);
              setShowDetailModal(true);
            }}
          />
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interview history found</h3>
          <p className="text-gray-600">
            {Object.values(filters).some(f => f !== 'all')
              ? 'Try adjusting your filters to see more results'
              : 'Interview history will appear here once interviews are completed'
            }
          </p>
        </div>
      )}

      {/* Interview Detail Modal */}
      {showDetailModal && selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

// Interview History Card Component
const InterviewHistoryCard = ({ interview, onViewDetails }) => {
  const typeConfig = INTERVIEW_TYPES[interview.type];
  const statusConfig = STATUS_CONFIG[interview.status];
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'advanced': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'advanced': return TrendingUp;
      case 'rejected': return TrendingDown;
      default: return AlertCircle;
    }
  };

  const OutcomeIcon = getOutcomeIcon(interview.outcome);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
            <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
            <p className="text-sm text-gray-600">{interview.jobTitle} - {interview.client}</p>
            <p className="text-xs text-gray-500">Round {interview.round}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {interview.scheduledDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-xs text-gray-500">
            {interview.scheduledDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{interview.interviewer.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{interview.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{interview.duration} minutes</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.name}
          </span>
          {interview.feedback?.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{interview.feedback.rating}/5</span>
            </div>
          )}
          {interview.outcome && (
            <div className="flex items-center space-x-1">
              <OutcomeIcon className={`w-4 h-4 ${getOutcomeColor(interview.outcome)}`} />
              <span className={`text-sm capitalize ${getOutcomeColor(interview.outcome)}`}>
                {interview.outcome}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

// Interview Detail Modal Component
const InterviewDetailModal = ({ interview, onClose }) => {
  if (!interview) return null;

  const typeConfig = INTERVIEW_TYPES[interview.type];
  const statusConfig = STATUS_CONFIG[interview.status];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Interview Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Candidate</label>
                    <p className="text-gray-900">{interview.candidateName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-gray-900">{interview.jobTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client</label>
                    <p className="text-gray-900">{interview.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Round</label>
                    <p className="text-gray-900">Round {interview.round}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date & Time</label>
                    <p className="text-gray-900">
                      {interview.scheduledDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })} at {interview.scheduledDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-gray-900">{interview.duration} minutes</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <div className="flex items-center space-x-2">
                      {React.createElement(typeConfig.icon, { className: `w-4 h-4 ${typeConfig.color}` })}
                      <span className="text-gray-900">{typeConfig.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{interview.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interviewer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interviewer</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{interview.interviewer.name}</p>
                    <p className="text-sm text-gray-600">{interview.interviewer.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {interview.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{interview.notes}</p>
                </div>
              </div>
            )}

            {/* Feedback */}
            {interview.feedback && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Feedback</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Overall Rating</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-4 h-4 ${
                              rating <= interview.feedback.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {interview.feedback.rating}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Recommendation</label>
                      <p className="text-gray-900 capitalize mt-1">
                        {interview.feedback.overallRecommendation.replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Technical Skills</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-3 h-3 ${
                              rating <= interview.feedback.technicalSkills
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          {interview.feedback.technicalSkills}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Communication</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-3 h-3 ${
                              rating <= interview.feedback.communication
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          {interview.feedback.communication}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cultural Fit</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`w-3 h-3 ${
                              rating <= interview.feedback.culturalFit
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          {interview.feedback.culturalFit}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {interview.feedback.comments && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Comments</label>
                      <p className="text-gray-700 mt-1">{interview.feedback.comments}</p>
                    </div>
                  )}

                  {interview.feedback.nextSteps && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Next Steps</label>
                      <p className="text-gray-700 mt-1">{interview.feedback.nextSteps}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Feedback submitted by {interview.feedback.submittedBy} on{' '}
                    {interview.feedback.submittedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistoryTracker;