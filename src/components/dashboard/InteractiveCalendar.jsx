import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

const InteractiveCalendar = ({ 
  events = [], 
  onEventClick, 
  onDateClick, 
  onEventDrop,
  currentDate,
  onDateChange 
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
          Calendar Overview
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onDateChange && onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => onDateChange && onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 rounded">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayEvents = getEventsForDate(date, events);
          const isToday = isDateToday(date);
          const isHovered = hoveredDate === index;
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200 ${
                isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              } ${isHovered ? 'shadow-md scale-105' : ''}`}
              onClick={() => onDateClick && onDateClick(date)}
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>
      </div>
    </div>
  );
};

export default InteractiveCalendar;