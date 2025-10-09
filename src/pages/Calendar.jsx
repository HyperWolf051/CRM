import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    Users,
    Phone,
    Video,
    MapPin,
    Search,
    Edit,
    Trash2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useToast } from '../context/ToastContext';

// Mock calendar events data
const mockEvents = [
    {
        id: '1',
        title: 'Sales Call with TechCorp',
        type: 'call',
        date: '2024-02-15',
        time: '10:00',
        duration: 60,
        attendees: ['John Smith'],
        companyId: '1',
        companyName: 'TechCorp Inc.',
        dealId: '1',
        dealName: 'Enterprise Software License',
        location: 'Phone Call',
        description: 'Discuss pricing and implementation timeline',
        status: 'scheduled',
        priority: 'high'
    },
    {
        id: '2',
        title: 'Product Demo - Cloud Migration',
        type: 'meeting',
        date: '2024-02-16',
        time: '14:30',
        duration: 90,
        attendees: ['Sarah Johnson', 'Mike Wilson'],
        companyId: '2',
        companyName: 'Innovate Solutions',
        dealId: '2',
        dealName: 'Cloud Migration Project',
        location: 'Conference Room A',
        description: 'Demonstrate our cloud migration capabilities',
        status: 'scheduled',
        priority: 'high'
    }
];

const Calendar = () => {
    const { showToast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
    const [events, setEvents] = useState(mockEvents);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Form state for creating/editing events
    const [formData, setFormData] = useState({
        title: '',
        type: 'meeting',
        date: '',
        time: '',
        duration: 60,
        attendees: '',
        companyName: '',
        dealName: '',
        location: '',
        description: '',
        priority: 'medium'
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calendar navigation
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
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get calendar data based on view mode
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    // Get events for a specific date
    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const matchesDate = event.date === dateStr;
            const matchesSearch = searchTerm === '' ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' || event.type === filterType;
            return matchesDate && matchesSearch && matchesFilter;
        });
    };

    // Event handlers
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setFormData(prev => ({
            ...prev,
            date: date.toISOString().split('T')[0]
        }));
        setIsCreateModalOpen(true);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.date) errors.date = 'Date is required';
        if (!formData.time) errors.time = 'Time is required';
        if (!formData.location.trim()) errors.location = 'Location is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newEvent = {
                id: Date.now().toString(),
                ...formData,
                attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a),
                status: 'scheduled',
                createdAt: new Date().toISOString()
            };

            setEvents(prev => [...prev, newEvent]);
            setIsCreateModalOpen(false);
            setFormData({
                title: '',
                type: 'meeting',
                date: '',
                time: '',
                duration: 60,
                attendees: '',
                companyName: '',
                dealName: '',
                location: '',
                description: '',
                priority: 'medium'
            });
            showToast('success', 'Event created successfully!');
        } catch (error) {
            showToast('error', 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setIsEventModalOpen(false);
        showToast('success', 'Event deleted successfully!');
    };

    // Format date helpers
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    // Event type styling
    const getEventTypeStyle = (type) => {
        const styles = {
            meeting: 'bg-blue-100 text-blue-800 border-blue-200',
            call: 'bg-green-100 text-green-800 border-green-200',
            demo: 'bg-purple-100 text-purple-800 border-purple-200',
            followup: 'bg-orange-100 text-orange-800 border-orange-200',
            other: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return styles[type] || styles.other;
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            meeting: <Users className="w-3 h-3" />,
            call: <Phone className="w-3 h-3" />,
            demo: <Video className="w-3 h-3" />,
            followup: <Clock className="w-3 h-3" />,
            other: <CalendarIcon className="w-3 h-3" />
        };
        return icons[type] || icons.other;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'border-l-red-500',
            medium: 'border-l-yellow-500',
            low: 'border-l-green-500'
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="h-screen flex flex-col animate-fade-in overflow-hidden">
            {/* Compact Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Calendar
                    </h1>
                    <p className="text-sm text-gray-600">Manage your meetings, calls, and events</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={goToToday}
                    >
                        Today
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => {
                            setSelectedDate(new Date());
                            setFormData(prev => ({
                                ...prev,
                                date: new Date().toISOString().split('T')[0]
                            }));
                            setIsCreateModalOpen(true);
                        }}
                    >
                        Add Event
                    </Button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    if (viewMode === 'month') navigateMonth(-1);
                                    else if (viewMode === 'week') navigateWeek(-1);
                                    else navigateDay(-1);
                                }}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                                {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                {viewMode === 'day' && formatDate(currentDate)}
                            </h2>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    if (viewMode === 'month') navigateMonth(1);
                                    else if (viewMode === 'week') navigateWeek(1);
                                    else navigateDay(1);
                                }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* View Mode & Filters */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {['month', 'week', 'day'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === mode
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg hover:border-gray-400 hover:shadow-md transition-all duration-200"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg hover:border-gray-400 hover:shadow-md transition-all duration-200"
                        >
                            <option value="all">All Events</option>
                            <option value="meeting">Meetings</option>
                            <option value="call">Calls</option>
                            <option value="demo">Demos</option>
                            <option value="followup">Follow-ups</option>
                        </select>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-hidden bg-white">
                    {/* Calendar Grid */}
                    {viewMode === 'month' && (
                        <div className="h-full grid grid-cols-7 gap-1 p-4">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {getCalendarDays().map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isCurrentMonthDay = isCurrentMonth(date);
                                const isTodayDate = isToday(date);

                                return (
                                    <div
                                        key={index}
                                        className={`h-[calc((100vh-200px)/6)] p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${!isCurrentMonthDay ? 'bg-gray-50 text-gray-400' : 'bg-white'
                                            } ${isTodayDate ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        <div className={`text-sm font-medium mb-1 ${isTodayDate ? 'text-blue-600' : ''}`}>
                                            {date.getDate()}
                                        </div>

                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`text-xs p-1 rounded border-l-2 ${getEventTypeStyle(event.type)} ${getPriorityColor(event.priority)} cursor-pointer hover:shadow-sm`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEventClick(event);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {getEventTypeIcon(event.type)}
                                                        <span className="truncate">{event.title}</span>
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {formatTime(event.time)}
                                                    </div>
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-gray-500 text-center">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Week View */}
                    {viewMode === 'week' && (
                        <div className="h-full grid grid-cols-7 gap-1 p-4">
                            {getWeekDays().map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isTodayDate = isToday(date);

                                return (
                                    <div key={index} className="h-full flex flex-col">
                                        <div className={`p-2 text-center border-b border-gray-200 flex-shrink-0 ${isTodayDate ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'}`}>
                                            <div className="text-xs font-medium">
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className={`text-sm font-bold ${isTodayDate ? 'text-blue-600' : ''}`}>
                                                {date.getDate()}
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
                                            {dayEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`p-2 rounded border-l-2 ${getEventTypeStyle(event.type)} ${getPriorityColor(event.priority)} cursor-pointer hover:shadow-sm`}
                                                    onClick={() => handleEventClick(event)}
                                                >
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {getEventTypeIcon(event.type)}
                                                        <span className="text-sm font-medium truncate">{event.title}</span>
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {formatTime(event.time)} ({event.duration}m)
                                                    </div>
                                                    {event.companyName && (
                                                        <div className="text-xs opacity-75 truncate">
                                                            {event.companyName}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Day View */}
                    {viewMode === 'day' && (
                        <div className="h-full overflow-y-auto p-4">
                            <div className="space-y-1">
                                {Array.from({ length: 24 }, (_, hour) => {
                                    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                                    const hourEvents = getEventsForDate(currentDate).filter(event => {
                                        const eventHour = parseInt(event.time.split(':')[0]);
                                        return eventHour === hour;
                                    });

                                    return (
                                        <div key={hour} className="flex border-b border-gray-100">
                                            <div className="w-20 p-2 text-sm text-gray-500 text-right">
                                                {new Date(`2000-01-01T${timeSlot}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    hour12: true
                                                })}
                                            </div>
                                            <div className="flex-1 p-2 h-12">
                                                {hourEvents.map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={`p-3 rounded-lg border-l-4 ${getEventTypeStyle(event.type)} ${getPriorityColor(event.priority)} cursor-pointer hover:shadow-md mb-2`}
                                                        onClick={() => handleEventClick(event)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                {getEventTypeIcon(event.type)}
                                                                <span className="font-medium">{event.title}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                {formatTime(event.time)} - {event.duration}m
                                                            </span>
                                                        </div>
                                                        {event.companyName && (
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {event.companyName}
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {event.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Event Modal - Compact Desktop Layout */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Event"
                className="max-w-5xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1: Title and Type/Priority */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <Input
                                label="Event Title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                error={formErrors.title}
                                placeholder="Enter event title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Type & Priority
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg hover:border-gray-400 hover:shadow-md hover:bg-white/90 transition-all duration-200"
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="call">Call</option>
                                    <option value="demo">Demo</option>
                                    <option value="followup">Follow-up</option>
                                    <option value="other">Other</option>
                                </select>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg hover:border-gray-400 hover:shadow-md hover:bg-white/90 transition-all duration-200"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Date, Time, Duration, Location */}
                    <div className="grid grid-cols-4 gap-4">
                        <Input
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            error={formErrors.date}
                        />
                        <Input
                            label="Time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            error={formErrors.time}
                        />
                        <Input
                            label="Duration (min)"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                            placeholder="60"
                        />
                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            error={formErrors.location}
                            placeholder="Room A, Zoom, etc."
                        />
                    </div>

                    {/* Row 3: Company, Deal, Attendees */}
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Company"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="Company name (optional)"
                        />
                        <Input
                            label="Related Deal"
                            value={formData.dealName}
                            onChange={(e) => handleInputChange('dealName', e.target.value)}
                            placeholder="Deal name (optional)"
                        />
                        <Input
                            label="Attendees"
                            value={formData.attendees}
                            onChange={(e) => handleInputChange('attendees', e.target.value)}
                            placeholder="John, Jane (comma separated)"
                        />
                    </div>

                    {/* Row 4: Description and Actions */}
                    <div className="grid grid-cols-4 gap-4 items-end">
                        <div className="col-span-3">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg hover:border-gray-400 hover:shadow-md hover:bg-white/90 transition-all duration-200 resize-none"
                                placeholder="Event description and agenda..."
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                className="w-full"
                            >
                                Create Event
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Event Details Modal */}
            <Modal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                title="Event Details"
            >
                {selectedEvent && (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {selectedEvent.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant={selectedEvent.type === 'call' ? 'success' : 'info'}>
                                        <div className="flex items-center gap-1">
                                            {getEventTypeIcon(selectedEvent.type)}
                                            {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                                        </div>
                                    </Badge>
                                    <Badge variant={
                                        selectedEvent.priority === 'high' ? 'danger' :
                                            selectedEvent.priority === 'medium' ? 'warning' : 'default'
                                    }>
                                        {selectedEvent.priority.charAt(0).toUpperCase() + selectedEvent.priority.slice(1)} Priority
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<Edit className="w-4 h-4" />}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    icon={<Trash2 className="w-4 h-4" />}
                                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date & Time
                                </label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-gray-900 mt-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    {formatTime(selectedEvent.time)} ({selectedEvent.duration} minutes)
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    {selectedEvent.location}
                                </div>
                            </div>
                        </div>

                        {(selectedEvent.companyName || selectedEvent.dealName) && (
                            <div className="grid grid-cols-2 gap-4">
                                {selectedEvent.companyName && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company
                                        </label>
                                        <p className="text-gray-900">{selectedEvent.companyName}</p>
                                    </div>
                                )}

                                {selectedEvent.dealName && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Related Deal
                                        </label>
                                        <p className="text-gray-900">{selectedEvent.dealName}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attendees
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEvent.attendees.map((attendee, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                            <Avatar name={attendee} size="sm" />
                                            <span className="text-sm text-gray-700">{attendee}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedEvent.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {selectedEvent.description}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setIsEventModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Calendar;