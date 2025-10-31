import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Calendar as CalendarIcon,
  Filter,
  Search,
  User,
  Briefcase,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useRecruitment } from '../../hooks/useRecruitment';
import { useInterviews } from '../../hooks/useInterviews';
import { useNavigate } from 'react-router-dom';

// Interview type configurations with colors
const INTERVIEW_TYPES = {
  phone: {
    name: 'Phone Interview',
    icon: Phone,
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  video: {
    name: 'Video Interview',
    icon: Video,
    color: 'bg-green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  'in-person': {
    name: 'In-Person Interview',
    icon: Users,
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }
};



// Calendar view components
const MonthView = ({ currentDate, selectedDate, interviews, onDateClick, onInterviewClick, onInterviewDrop }) => {
  const [draggedInterview, setDraggedInterview] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getInterviewsForDate = (date) => {
    if (!date) return [];
    return interviews.filter(interview =>
      interview.scheduledDate.toDateString() === date.toDateString()
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDragStart = (e, interview) => {
    setDraggedInterview(interview);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    if (draggedInterview && date && onInterviewDrop) {
      onInterviewDrop(draggedInterview, date);
    }
    setDraggedInterview(null);
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full pb-2">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-slate-500 bg-slate-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days - 6-row grid for all month lengths */}
      <div className="grid grid-cols-7 gap-1" style={{ gridTemplateRows: 'repeat(6, 1fr)', height: 'auto', overflow: 'visible' }}>
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayInterviews = getInterviewsForDate(date);

          return (
            <div
              key={index}
              className={`
                min-h-[110px] h-auto p-2 border border-slate-200 rounded-lg cursor-pointer
                transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                ${date ? 'hover:border-blue-200' : ''}
                ${isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-white'}
                ${isSelected(date) ? 'ring-2 ring-purple-200 bg-purple-50' : ''}
                ${!date ? 'cursor-default hover:bg-transparent hover:shadow-none hover:scale-100 opacity-50' : ''}
              `}
              style={{ overflow: 'visible' }}
              onClick={() => date && onDateClick(date)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              {date && (
                <>
                  <div className={`
                    text-sm font-medium mb-2
                    ${isToday(date) ? 'text-blue-700' : 'text-slate-900'}
                    ${isSelected(date) ? 'text-purple-700' : ''}
                  `}>
                    {date.getDate()}
                  </div>

                  {/* Interviews */}
                  <div className="space-y-1">
                    {dayInterviews.slice(0, 3).map((interview) => {
                      const typeConfig = INTERVIEW_TYPES[interview.type];
                      return (
                        <div
                          key={interview.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, interview)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onInterviewClick(interview);
                          }}
                          className={`
                            text-xs px-2 py-1 rounded text-white font-medium truncate cursor-pointer
                            transition-all duration-200 hover:scale-105 hover:shadow-md
                            ${typeConfig.color}
                          `}
                          title={`${interview.candidateName} - ${interview.jobTitle} (${typeConfig.name})`}
                        >
                          <div className="flex items-center space-x-1">
                            {React.createElement(typeConfig.icon, { className: "w-3 h-3" })}
                            <span className="truncate">{interview.candidateName}</span>
                          </div>
                        </div>
                      );
                    })}
                    {dayInterviews.length > 3 && (
                      <div className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
                        +{dayInterviews.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeekView = ({ currentDate, selectedDate, interviews, onDateClick, onInterviewClick, onInterviewDrop }) => {
  const [draggedInterview, setDraggedInterview] = useState(null);

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getInterviewsForDate = (date) => {
    return interviews.filter(interview =>
      interview.scheduledDate.toDateString() === date.toDateString()
    );
  };

  const getInterviewPosition = (interview) => {
    const hour = interview.scheduledDate.getHours();
    const minutes = interview.scheduledDate.getMinutes();
    const top = (hour * 60 + minutes) * (60 / 60); // 60px per hour
    const height = (interview.duration / 60) * 60; // Convert duration to pixels
    return { top, height };
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDragStart = (e, interview) => {
    setDraggedInterview(interview);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date, hour) => {
    e.preventDefault();
    if (draggedInterview && date && onInterviewDrop) {
      const newDateTime = new Date(date);
      newDateTime.setHours(hour, 0, 0, 0);
      onInterviewDrop(draggedInterview, newDateTime);
    }
    setDraggedInterview(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-slate-200 mb-4">
        <div className="p-4 border-r border-slate-200"></div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            onClick={() => onDateClick(date)}
            className={`p-4 text-center border-r border-slate-200 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${isToday(date) ? 'bg-blue-50 text-blue-700' : ''
              } ${isSelected(date) ? 'bg-purple-50 text-purple-700' : ''}`}
          >
            <div className="text-xs font-medium text-slate-500 uppercase">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-semibold mt-1 ${isToday(date) ? 'text-blue-700' : 'text-slate-900'
              }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-h-full">
          {/* Time Column */}
          <div className="border-r border-slate-200">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-slate-100 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs text-slate-500 font-medium">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, dayIndex) => {
            const dayInterviews = getInterviewsForDate(date);

            return (
              <div key={dayIndex} className="relative border-r border-slate-200">
                {/* Hour Grid */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-slate-100 hover:bg-slate-25 transition-colors duration-150"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, date, hour)}
                  />
                ))}

                {/* Interviews */}
                {dayInterviews.map((interview) => {
                  const { top, height } = getInterviewPosition(interview);
                  const typeConfig = INTERVIEW_TYPES[interview.type];
                  return (
                    <div
                      key={interview.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, interview)}
                      onClick={() => onInterviewClick(interview)}
                      className={`
                        absolute left-1 right-1 rounded-lg p-2 cursor-pointer transition-all duration-200 
                        hover:shadow-md hover:scale-[1.02] z-10 border-l-4
                        ${typeConfig.bgColor} ${typeConfig.borderColor}
                      `}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 32)}px`
                      }}
                    >
                      <div className={`text-xs font-semibold truncate ${typeConfig.textColor}`}>
                        {interview.candidateName}
                      </div>
                      <div className="text-xs opacity-90 truncate text-slate-600">
                        {interview.scheduledDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                      <div className="text-xs opacity-75 truncate text-slate-500">
                        {interview.jobTitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DayView = ({ selectedDate, interviews, onInterviewClick, onInterviewDrop }) => {
  const [draggedInterview, setDraggedInterview] = useState(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getInterviewsForDate = (date) => {
    return interviews.filter(interview =>
      interview.scheduledDate.toDateString() === date.toDateString()
    ).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  };

  const getInterviewPosition = (interview) => {
    const hour = interview.scheduledDate.getHours();
    const minutes = interview.scheduledDate.getMinutes();
    const top = (hour * 80 + (minutes / 60) * 80); // 80px per hour for better spacing
    const height = Math.max((interview.duration / 60) * 80, 40); // Minimum 40px height
    return { top, height };
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  const dayInterviews = getInterviewsForDate(selectedDate);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handleDragStart = (e, interview) => {
    setDraggedInterview(interview);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    if (draggedInterview && onInterviewDrop) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hour, 0, 0, 0);
      onInterviewDrop(draggedInterview, newDateTime);
    }
    setDraggedInterview(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${isToday ? 'text-blue-700' : 'text-slate-900'}`}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            {isToday && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                Today
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">
              {dayInterviews.length} interview{dayInterviews.length !== 1 ? 's' : ''} scheduled
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {dayInterviews.reduce((total, interview) => total + interview.duration, 0)} minutes total
            </div>
          </div>
        </div>
      </div>

      {/* Day Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 min-h-full">
          {/* Time Column */}
          <div className="col-span-2 border-r border-slate-200 bg-slate-50/50">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b border-slate-100 flex items-start justify-end pr-4 pt-2">
                <span className="text-sm text-slate-600 font-medium">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Interview Column */}
          <div className="col-span-10 relative">
            {/* Hour Grid Lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-slate-100 hover:bg-slate-25 transition-colors duration-150"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, hour)}
              />
            ))}

            {/* Current Time Indicator */}
            {isToday && (
              <div
                className="absolute left-0 right-0 flex items-center z-20"
                style={{
                  top: `${(new Date().getHours() * 80) + ((new Date().getMinutes() / 60) * 80)}px`
                }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="flex-1 h-0.5 bg-red-500"></div>
              </div>
            )}

            {/* Interviews */}
            {dayInterviews.map((interview) => {
              const { top, height } = getInterviewPosition(interview);
              const typeConfig = INTERVIEW_TYPES[interview.type];
              return (
                <div
                  key={interview.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, interview)}
                  onClick={() => onInterviewClick(interview)}
                  className={`
                    absolute left-4 right-4 rounded-xl p-4 cursor-pointer transition-all duration-200 
                    hover:shadow-lg hover:scale-[1.02] z-10 border-l-4
                    ${typeConfig.bgColor} ${typeConfig.borderColor}
                  `}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`
                  }}
                >
                  <div className="flex items-start justify-between h-full">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm mb-1 truncate ${typeConfig.textColor}`}>
                        {interview.candidateName}
                      </h3>
                      <div className="text-xs text-slate-600 mb-1 truncate">
                        {interview.jobTitle} - {interview.client}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {interview.scheduledDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })} ({interview.duration}m)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{interview.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span className="truncate">{interview.interviewer.name}</span>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end space-y-1">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${typeConfig.color} text-white`}>
                        Round {interview.round}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${interview.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        interview.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {interview.priority}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {dayInterviews.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">No interviews scheduled</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-md">
                    {isToday ? "You have a free day today! Perfect time to catch up or plan ahead." : "This day is available for scheduling new interviews."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruiterCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    interviewer: 'all'
  });

  // Use the interviews hook
  const {
    interviews,
    loading,
    error,
    rescheduleInterview,
    createInterview,
    getTodaysInterviews,
    getInterviewsForDate
  } = useInterviews(filters);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigation(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigation(1);
          break;
        case 'm':
        case 'M':
          setViewMode('month');
          break;
        case 'w':
        case 'W':
          setViewMode('week');
          break;
        case 'd':
        case 'D':
          setViewMode('day');
          break;
        case 't':
        case 'T':
          const today = new Date();
          setCurrentDate(today);
          setSelectedDate(today);
          break;
        case 'n':
        case 'N':
          setShowInterviewModal(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
    setCurrentDate(newDate);
  };

  const getNavigationLabel = () => {
    if (viewMode === 'month') {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
    } else {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleNavigation = (direction) => {
    if (viewMode === 'month') {
      navigateMonth(direction);
    } else if (viewMode === 'week') {
      navigateWeek(direction);
    } else {
      navigateDay(direction);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = (candidateId = null, jobId = null, date = null) => {
    const params = new URLSearchParams();
    if (candidateId) params.append('candidateId', candidateId);
    if (jobId) params.append('jobId', jobId);
    if (date) params.append('date', date.toISOString().split('T')[0]);
    
    navigate(`/app/recruiter/calendar/schedule?${params.toString()}`);
  };

  const handleInterviewDrop = useCallback(async (interview, newDateTime) => {
    const result = await rescheduleInterview(interview.id, newDateTime);
    if (!result.success) {
      console.error('Failed to reschedule interview:', result.error);
      // You could show a toast notification here
    }
  }, [rescheduleInterview]);

  // Interviews are already filtered by the hook based on the filters state
  const filteredInterviews = interviews;

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
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Interview Calendar
            </h1>
            <p className="text-slate-600 mt-1">Schedule and manage candidate interviews</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center space-x-2 ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => {
                handleScheduleInterview(null, null, selectedDate);
              }}
              className="px-4 py-2 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 btn-primary-slide">
              <Plus className="w-4 h-4 mr-2 inline" />
              Schedule Interview
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="all">All Types</option>
                  <option value="phone">Phone</option>
                  <option value="video">Video</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Interviewer</label>
                <select
                  value={filters.interviewer}
                  onChange={(e) => setFilters(prev => ({ ...prev, interviewer: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="all">All Interviewers</option>
                  <option value="1">John Doe</option>
                  <option value="2">Jane Smith</option>
                  <option value="3">Mike Johnson</option>
                  <option value="4">Sarah Davis</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl" style={{ overflow: 'visible' }}>
              {/* Calendar Header */}
              <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {getNavigationLabel()}
                    </h2>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleNavigation(-1)}
                        className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleNavigation(1)}
                        className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      Today
                    </button>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      {['month', 'week', 'day'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setViewMode(mode)}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 capitalize ${viewMode === mode
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Content - Fixed height removed, auto sizing */}
              <div className="p-4 pb-4" style={{ height: 'auto', overflow: 'visible', minHeight: '480px' }}>
                {viewMode === 'month' && (
                  <MonthView
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    interviews={filteredInterviews}
                    onDateClick={handleDateClick}
                    onInterviewClick={handleInterviewClick}
                    onInterviewDrop={handleInterviewDrop}
                  />
                )}

                {viewMode === 'week' && (
                  <WeekView
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    interviews={filteredInterviews}
                    onDateClick={handleDateClick}
                    onInterviewClick={handleInterviewClick}
                    onInterviewDrop={handleInterviewDrop}
                  />
                )}

                {viewMode === 'day' && (
                  <DayView
                    selectedDate={selectedDate}
                    interviews={filteredInterviews}
                    onInterviewClick={handleInterviewClick}
                    onInterviewDrop={handleInterviewDrop}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Types Legend */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Interview Types</h3>
              <div className="space-y-3">
                {Object.entries(INTERVIEW_TYPES).map(([type, config]) => (
                  <div key={type} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${config.color}`}></div>
                    {React.createElement(config.icon, { className: "w-4 h-4 text-slate-600" })}
                    <span className="text-sm text-slate-700">{config.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Interviews */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Interviews</h3>
              <div className="space-y-3">
                {filteredInterviews
                  .filter(interview => interview.scheduledDate.toDateString() === new Date().toDateString())
                  .slice(0, 5)
                  .map((interview) => {
                    const typeConfig = INTERVIEW_TYPES[interview.type];
                    return (
                      <div
                        key={interview.id}
                        onClick={() => handleInterviewClick(interview)}
                        className="p-3 rounded-xl border border-slate-200/50 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${typeConfig.color}`}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                              {interview.candidateName}
                            </h4>
                            <div className="text-xs text-slate-600 truncate">
                              {interview.jobTitle}
                            </div>
                            <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {interview.scheduledDate.toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {filteredInterviews.filter(interview => interview.scheduledDate.toDateString() === new Date().toDateString()).length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No interviews today</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleScheduleInterview(null, null, selectedDate)}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:scale-110 transition-all duration-300">
                    <Plus className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">Schedule Interview</span>
                </button>

                <button
                  onClick={() => {
                    const today = new Date();
                    setCurrentDate(today);
                    setSelectedDate(today);
                    setViewMode('day');
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 group-hover:scale-110 transition-all duration-300">
                    <CalendarIcon className="w-4 h-4 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">View Today</span>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Navigate</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">← →</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Month View</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Week View</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Day View</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">D</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Today</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">New Interview</span>
                  <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">N</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Detail Modal */}
        {showInterviewModal && selectedInterview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Interview Details</h2>
                  <button
                    onClick={() => {
                      setShowInterviewModal(false);
                      setSelectedInterview(null);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Interview Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {selectedInterview.candidateName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{selectedInterview.candidateName}</h3>
                      <p className="text-slate-600">{selectedInterview.jobTitle}</p>
                      <p className="text-sm text-slate-500">{selectedInterview.client}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${INTERVIEW_TYPES[selectedInterview.type].bgColor
                        } ${INTERVIEW_TYPES[selectedInterview.type].textColor}`}>
                        {React.createElement(INTERVIEW_TYPES[selectedInterview.type].icon, { className: "w-4 h-4 mr-1" })}
                        {INTERVIEW_TYPES[selectedInterview.type].name}
                      </div>
                    </div>
                  </div>

                  {/* Interview Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                      <div className="flex items-center space-x-2 text-slate-900">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>
                          {selectedInterview.scheduledDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-slate-600 ml-6">
                        {selectedInterview.scheduledDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })} ({selectedInterview.duration} minutes)
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <div className="flex items-center space-x-2 text-slate-900">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{selectedInterview.location}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Interviewer</label>
                      <div className="flex items-center space-x-2 text-slate-900">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <div>{selectedInterview.interviewer.name}</div>
                          <div className="text-sm text-slate-500">{selectedInterview.interviewer.role}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Round & Priority</label>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          Round {selectedInterview.round}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${selectedInterview.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          selectedInterview.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {selectedInterview.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Link */}
                  {selectedInterview.meetingLink && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Link</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedInterview.meetingLink}
                          readOnly
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => window.open(selectedInterview.meetingLink, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedInterview.notes && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                        {selectedInterview.notes}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setShowInterviewModal(false);
                        setSelectedInterview(null);
                      }}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-all duration-200">
                      Reschedule
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200">
                      Edit Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterCalendar;