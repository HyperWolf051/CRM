import { Video, Phone, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function UpcomingInterviewsWidget({ 
  interviews = [], 
  loading = false,
  onJoinInterview,
  onRescheduleInterview,
  onViewAllInterviews
}) {
  const [hoveredInterview, setHoveredInterview] = useState(null);

  const getInterviewTypeIcon = (type) => {
    const icons = {
      video: Video,
      phone: Phone,
      'in-person': MapPin,
      technical: Video,
      'hr-round': Video,
      'final-round': Video
    };
    return icons[type] || Video;
  };

  const getInterviewTypeClass = (type) => {
    const classes = {
      video: 'bg-blue-100 text-blue-800 border-blue-200',
      phone: 'bg-green-100 text-green-800 border-green-200',
      'in-person': 'bg-purple-100 text-purple-800 border-purple-200',
      technical: 'bg-amber-100 text-amber-800 border-amber-200',
      'hr-round': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'final-round': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[type] || classes.video;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffTime = date - now;
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeLabel = '';
    if (diffHours < 1) timeLabel = 'Starting soon';
    else if (diffHours < 24) timeLabel = `In ${diffHours}h`;
    else if (diffDays === 1) timeLabel = 'Tomorrow';
    else if (diffDays <= 7) timeLabel = `In ${diffDays} days`;
    else timeLabel = 'Upcoming';
    
    return {
      time: date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      label: timeLabel,
      isUrgent: diffHours < 2,
      isToday: diffDays === 0
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      {interviews.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No upcoming interviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => {
            const dateTime = formatDateTime(interview.dateTime);
            const InterviewIcon = getInterviewTypeIcon(interview.type);
            const isHovered = hoveredInterview === interview.id;
            
            return (
              <div 
                key={interview.id} 
                className={`group relative p-3 rounded-lg border transition-all duration-200 ${
                  isHovered 
                    ? 'border-blue-200 bg-blue-50 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200'
                } ${dateTime.isUrgent ? 'ring-2 ring-red-100' : ''}`}
                onMouseEnter={() => setHoveredInterview(interview.id)}
                onMouseLeave={() => setHoveredInterview(null)}
              >
                {/* Urgent indicator */}
                {dateTime.isUrgent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {interview.candidateName}
                    </p>
                    {dateTime.isToday && (
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getInterviewTypeClass(interview.type)}`}>
                      <InterviewIcon className="w-3 h-3 mr-1" />
                      {interview.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {interview.position}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {dateTime.time}
                    </span>
                    <span className={`text-xs font-medium ${
                      dateTime.isUrgent ? 'text-red-600' : 
                      dateTime.isToday ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      • {dateTime.label}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinInterview?.(interview.id);
                      }}
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                        interview.type === 'video' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : interview.type === 'phone'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {interview.type === 'video' && <Video className="w-3 h-3 mr-1" />}
                      {interview.type === 'phone' && <Phone className="w-3 h-3 mr-1" />}
                      {interview.type === 'in-person' && <MapPin className="w-3 h-3 mr-1" />}
                      {interview.type === 'video' ? 'Join' : 
                       interview.type === 'phone' ? 'Call' : 'Directions'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRescheduleInterview?.(interview.id);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-800 transition-colors px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
                
                {/* Interviewer info */}
                {interview.interviewer && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Interviewer: <span className="font-medium">{interview.interviewer}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Quick action to view all interviews */}
      {interviews.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => onViewAllInterviews?.()}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center space-x-1 hover:bg-blue-50 py-2 rounded-lg"
          >
            <span>View All Interviews</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}