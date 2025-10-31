import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

const InteractiveCalendar = ({ 
  events = [], 
  onEventClick, 
  onDateClick, 
  onEventDrop,
  onEventAdd,
  currentDate,
  onDateChange 
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    title: '',
    time: '',
    date: new Date(),
    type: 'meeting'
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date, events) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isDateToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleEventDrop = (e, date) => {
    e.preventDefault();
    if (draggedEvent && onEventDrop) {
      onEventDrop(draggedEvent, date);
    }
    setDraggedEvent(null);
  };

  const defaultForm = { title: '', time: '10:00 AM', date: new Date(), type: 'meeting' };

  const handleQuickAdd = () => {
    setQuickAddForm(defaultForm);
    setShowQuickAdd(true);
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (quickAddForm.title.trim() && onEventAdd) {
      const newEvent = {
        id: Date.now(),
        title: quickAddForm.title.trim(),
        date: quickAddForm.date,
        time: quickAddForm.time,
        type: quickAddForm.type,
        color: getEventColor(quickAddForm.type)
      };
      
      onEventAdd(newEvent);
      setShowQuickAdd(false);
      setQuickAddForm(defaultForm);
    }
  };

  const getEventColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500',
      interview: 'bg-green-500',
      call: 'bg-purple-500',
      task: 'bg-orange-500',
      event: 'bg-pink-500'
    };
    return colors[type] || 'bg-blue-500';
  };

  const handleDateClickForAdd = (date) => {
    if (date) {
      setQuickAddForm(prev => ({ ...prev, date }));
      setShowQuickAdd(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 pb-8 shadow-sm border border-gray-200" style={{ minHeight: '650px' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
          Calendar Overview
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onDateChange && onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="relative p-2 rounded-lg transition-all duration-200 overflow-hidden group hover:shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white relative z-10 transition-colors duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                            transform scale-0 group-hover:scale-100 
                            transition-transform duration-200 ease-out rounded-lg"></div>
          </button>
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => onDateChange && onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="relative p-2 rounded-lg transition-all duration-200 overflow-hidden group hover:shadow-md"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white relative z-10 transition-colors duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                            transform scale-0 group-hover:scale-100 
                            transition-transform duration-200 ease-out rounded-lg"></div>
          </button>
        </div>
      </div>
      
      {/* Calendar Grid - Optimized for wider layout with extra bottom margin */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 rounded">
            {day}
          </div>
        ))}
        
        {/* Calendar Days - Significantly increased height to prevent bottom cropping */}
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayEvents = getEventsForDate(date, events);
          const isToday = isDateToday(date);
          const isHovered = hoveredDate === index;
          
          return (
            <div
              key={index}
              className={`min-h-[140px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200 ${
                isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              } ${isHovered ? 'shadow-md scale-105' : ''}`}
              onClick={() => {
                if (onDateClick) onDateClick(date);
                handleDateClickForAdd(date);
              }}
              onMouseEnter={() => setHoveredDate(index)}
              onMouseLeave={() => setHoveredDate(null)}
              onDrop={(e) => handleEventDrop(e, date)}
              onDragOver={(e) => e.preventDefault()}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Event Indicators */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        draggable
                        onDragStart={() => setDraggedEvent(event)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick && onEventClick(event);
                        }}
                        className={`text-xs px-2 py-1 rounded text-white font-medium truncate cursor-pointer transition-all duration-200 hover:scale-105 ${
                          event.color || 'bg-blue-500'
                        }`}
                        title={`${event.title} - ${event.time}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
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
      
      {/* Quick Add Event */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Click a date to add an event
        </div>
        <button 
          onClick={handleQuickAdd}
          className="relative px-4 py-2 bg-blue-600 text-white rounded-lg text-sm transition-all duration-200 
                     flex items-center space-x-2 overflow-hidden group hover:shadow-lg hover:scale-105"
        >
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Quick Add</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600 
                          transform translate-x-full group-hover:translate-x-0 
                          transition-transform duration-200 ease-out"></div>
        </button>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Quick Add Event</h3>
              <button 
                onClick={() => setShowQuickAdd(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={quickAddForm.title}
                  onChange={(e) => setQuickAddForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  autoFocus
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={quickAddForm.date.toISOString().split('T')[0]}
                  onChange={(e) => setQuickAddForm(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={quickAddForm.time}
                  onChange={(e) => setQuickAddForm(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g., 10:00 AM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={quickAddForm.type}
                  onChange={(e) => setQuickAddForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="meeting">Meeting</option>
                  <option value="interview">Interview</option>
                  <option value="call">Call</option>
                  <option value="task">Task</option>
                  <option value="event">Event</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="relative px-4 py-2 text-gray-600 hover:text-white transition-all duration-200 
                             rounded-lg overflow-hidden group border border-gray-300 hover:border-gray-500"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 
                                  transform -translate-x-full group-hover:translate-x-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
                <button
                  type="submit"
                  className="relative px-6 py-2 bg-blue-600 text-white rounded-lg transition-all duration-200 
                             flex items-center space-x-2 overflow-hidden group hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Add Event</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600 
                                  transform translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalendar;