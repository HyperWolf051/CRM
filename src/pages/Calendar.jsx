import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  Calendar as CalendarIcon,
  Filter,
  Search
} from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Interview - Sarah Johnson',
      type: 'interview',
      date: new Date(2024, 11, 15, 14, 0),
      duration: 60,
      location: 'Conference Room A',
      attendees: ['John Doe', 'Sarah Johnson'],
      color: 'blue'
    },
    {
      id: 2,
      title: 'Team Standup',
      type: 'meeting',
      date: new Date(2024, 11, 16, 9, 0),
      duration: 30,
      location: 'Virtual',
      attendees: ['Team'],
      color: 'green'
    },
    {
      id: 3,
      title: 'Client Presentation',
      type: 'presentation',
      date: new Date(2024, 11, 18, 15, 30),
      duration: 90,
      location: 'Main Conference Room',
      attendees: ['Client Team', 'Sales Team'],
      color: 'purple'
    },
    {
      id: 4,
      title: 'Code Review Session',
      type: 'review',
      date: new Date(2024, 11, 20, 11, 0),
      duration: 45,
      location: 'Dev Room',
      attendees: ['Dev Team'],
      color: 'orange'
    },
    {
      id: 5,
      title: 'Candidate Phone Screen',
      type: 'interview',
      date: new Date(2024, 11, 22, 10, 0),
      duration: 30,
      location: 'Phone',
      attendees: ['HR', 'Michael Chen'],
      color: 'blue'
    }
  ]);

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    duration: 60,
    location: '',
    attendees: '',
    description: ''
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventColor = (color) => {
    const colors = {
      blue: 'bg-blue-500 border-blue-600',
      green: 'bg-green-500 border-green-600',
      purple: 'bg-purple-500 border-purple-600',
      orange: 'bg-orange-500 border-orange-600',
      red: 'bg-red-500 border-red-600'
    };
    return colors[color] || colors.blue;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
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

  // Event creation functions
  const handleCreateEvent = () => {
    setEventForm({
      title: '',
      type: 'meeting',
      date: selectedDate.toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      location: '',
      attendees: '',
      description: ''
    });
    setShowEventModal(true);
  };

  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    
    if (!eventForm.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    // Create new event
    const eventDateTime = new Date(`${eventForm.date}T${eventForm.time}`);
    const newEvent = {
      id: Math.max(...events.map(e => e.id), 0) + 1,
      title: eventForm.title,
      type: eventForm.type,
      date: eventDateTime,
      duration: parseInt(eventForm.duration),
      location: eventForm.location || 'TBD',
      attendees: eventForm.attendees ? eventForm.attendees.split(',').map(a => a.trim()) : [],
      description: eventForm.description,
      color: getEventTypeColor(eventForm.type)
    };

    setEvents(prev => [...prev, newEvent]);
    setShowEventModal(false);
    
    // Reset form
    setEventForm({
      title: '',
      type: 'meeting',
      date: '',
      time: '',
      duration: 60,
      location: '',
      attendees: '',
      description: ''
    });
  };

  const getEventTypeColor = (type) => {
    const typeColors = {
      interview: 'blue',
      meeting: 'green',
      presentation: 'purple',
      review: 'orange',
      call: 'red',
      training: 'indigo'
    };
    return typeColors[type] || 'blue';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventForm(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-slate-600 mt-1">Manage your schedule and appointments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleCreateEvent}
            className="px-4 py-2 text-white text-sm font-medium 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       btn-primary-slide">
            <Plus className="w-4 h-4 mr-2 inline" />
            New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    Today
                  </button>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    {['month', 'week', 'day'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 capitalize ${
                          viewMode === mode
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

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-slate-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[100px] p-2 border border-slate-100 rounded-lg cursor-pointer
                        transition-all duration-200 hover:bg-slate-50 hover:shadow-md hover:scale-[1.02]
                        ${date ? 'hover:border-blue-200' : ''}
                        ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}
                        ${isSelected(date) ? 'bg-purple-50 border-purple-200' : ''}
                        ${!date ? 'cursor-default hover:bg-transparent hover:shadow-none hover:scale-100' : ''}
                      `}
                      onClick={() => date && handleDateClick(date)}
                    >
                      {date && (
                        <>
                          <div className={`
                            text-sm font-medium mb-1
                            ${isToday(date) ? 'text-blue-700' : 'text-slate-900'}
                            ${isSelected(date) ? 'text-purple-700' : ''}
                          `}>
                            {date.getDate()}
                          </div>
                          
                          {/* Events */}
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`
                                  text-xs px-2 py-1 rounded text-white font-medium truncate
                                  ${getEventColor(event.color)} hover:scale-105 transition-transform duration-200
                                `}
                                title={`${event.title} - ${formatTime(event.date)}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-slate-500 px-2">
                                +{dayEvents.length - 2} more
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick View</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {selectedDate.getDate()}
              </div>
              <div className="text-sm text-slate-600">
                {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
            </div>
          </div>

          {/* Today's Events */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Events</h3>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No events scheduled</p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl border border-slate-200/50 hover:shadow-md transition-all duration-200 hover:scale-[1.02] liquid-hover"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getEventColor(event.color)}`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setEventForm(prev => ({
                    ...prev,
                    type: 'interview',
                    title: 'Interview - ',
                    date: selectedDate.toISOString().split('T')[0],
                    time: '14:00',
                    duration: 60
                  }));
                  setShowEventModal(true);
                }}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-xl
                           hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                           hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                           group liquid-hover">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center
                               group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500
                               group-hover:scale-110 transition-all duration-300 icon-wiggle">
                  <Plus className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-slate-900">Schedule Interview</span>
              </button>
              
              <button 
                onClick={() => {
                  setEventForm(prev => ({
                    ...prev,
                    type: 'call',
                    title: 'Video Call - ',
                    date: selectedDate.toISOString().split('T')[0],
                    time: '10:00',
                    duration: 30,
                    location: 'Virtual'
                  }));
                  setShowEventModal(true);
                }}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-xl
                           hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 
                           hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                           group liquid-hover">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center
                               group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500
                               group-hover:scale-110 transition-all duration-300 icon-wiggle">
                  <Video className="w-4 h-4 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-slate-900">Video Call</span>
              </button>
              
              <button 
                onClick={() => {
                  setEventForm(prev => ({
                    ...prev,
                    type: 'meeting',
                    title: 'Team Meeting - ',
                    date: selectedDate.toISOString().split('T')[0],
                    time: '09:00',
                    duration: 60,
                    attendees: 'Team'
                  }));
                  setShowEventModal(true);
                }}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-xl
                           hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                           hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                           group liquid-hover">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center
                               group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500
                               group-hover:scale-110 transition-all duration-300 icon-wiggle">
                  <Users className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-slate-900">Team Meeting</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-4">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => handleEventFormChange('title', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => handleEventFormChange('type', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="interview">Interview</option>
                    <option value="presentation">Presentation</option>
                    <option value="review">Review</option>
                    <option value="call">Call</option>
                    <option value="training">Training</option>
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => handleEventFormChange('date', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                                 hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => handleEventFormChange('time', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                                 hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={eventForm.duration}
                    onChange={(e) => handleEventFormChange('duration', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => handleEventFormChange('location', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                    placeholder="Conference Room A, Virtual, etc."
                  />
                </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attendees
                  </label>
                  <input
                    type="text"
                    value={eventForm.attendees}
                    onChange={(e) => handleEventFormChange('attendees', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300"
                    placeholder="John Doe, Jane Smith (comma separated)"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => handleEventFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                               hover:bg-white/80 hover:border-slate-300/50 transition-all duration-300 resize-none"
                    placeholder="Event description or notes..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl
                               hover:bg-slate-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white font-medium rounded-xl
                               btn-primary-slide"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;