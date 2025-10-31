import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  User,
  Phone,
  Video,
  Users,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  X,
  Settings
} from 'lucide-react';
import { useInterviews, useInterviewReminders } from '../../hooks/useInterviews';

const REMINDER_TYPES = {
  email: {
    name: 'Email',
    icon: Mail,
    color: 'bg-blue-500',
    description: 'Send email notification'
  },
  sms: {
    name: 'SMS',
    icon: MessageSquare,
    color: 'bg-green-500',
    description: 'Send text message'
  },
  push: {
    name: 'Push',
    icon: Bell,
    color: 'bg-purple-500',
    description: 'Browser notification'
  }
};

const REMINDER_INTERVALS = [
  { value: 60, label: '1 hour before' },
  { value: 30, label: '30 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 5, label: '5 minutes before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' }
];

const InterviewReminderSystem = () => {
  const [activeReminders, setActiveReminders] = useState([]);
  const [reminderSettings, setReminderSettings] = useState({
    defaultIntervals: [60, 30], // 1 hour and 30 minutes before
    enabledTypes: ['email', 'push'],
    autoSchedule: true
  });
  const [showSettings, setShowSettings] = useState(false);

  const { getUpcomingInterviews } = useInterviews();
  const { reminders, scheduleReminder, sendReminder } = useInterviewReminders();

  const upcomingInterviews = getUpcomingInterviews(10);

  useEffect(() => {
    // Check for interviews that need reminders
    const checkAndScheduleReminders = () => {
      upcomingInterviews.forEach(interview => {
        if (reminderSettings.autoSchedule) {
          reminderSettings.defaultIntervals.forEach(minutes => {
            const reminderTime = new Date(interview.scheduledDate.getTime() - minutes * 60 * 1000);
            
            // Only schedule if reminder time is in the future
            if (reminderTime > new Date()) {
              scheduleReminder(interview.id, reminderTime);
            }
          });
        }
      });
    };

    checkAndScheduleReminders();
  }, [upcomingInterviews, reminderSettings, scheduleReminder]);

  useEffect(() => {
    // Check for reminders that need to be sent
    const checkPendingReminders = () => {
      const now = new Date();
      const pendingReminders = reminders.filter(
        reminder => !reminder.sent && reminder.scheduledFor <= now
      );

      pendingReminders.forEach(reminder => {
        const interview = upcomingInterviews.find(i => i.id === reminder.interviewId);
        if (interview) {
          showReminderNotification(interview, reminder);
          sendReminder(reminder.id);
        }
      });
    };

    const interval = setInterval(checkPendingReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, upcomingInterviews, sendReminder]);

  const showReminderNotification = (interview, reminder) => {
    const notification = {
      id: `reminder-${reminder.id}`,
      type: 'interview-reminder',
      interview,
      reminder,
      timestamp: new Date()
    };

    setActiveReminders(prev => [...prev, notification]);

    // Browser notification if supported and enabled
    if (reminderSettings.enabledTypes.includes('push') && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Interview Reminder: ${interview.candidateName}`, {
          body: `Interview scheduled in ${getTimeUntilInterview(interview.scheduledDate)}`,
          icon: '/favicon.ico',
          tag: `interview-${interview.id}`
        });
      }
    }

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      dismissReminder(notification.id);
    }, 30000);
  };

  const getTimeUntilInterview = (scheduledDate) => {
    const now = new Date();
    const diff = scheduledDate.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
    }
  };

  const dismissReminder = (reminderId) => {
    setActiveReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const handleSettingsChange = (key, value) => {
    setReminderSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return (
    <>
      {/* Active Reminder Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {activeReminders.map((notification) => (
          <InterviewReminderCard
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissReminder(notification.id)}
          />
        ))}
      </div>

      {/* Reminder Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reminder Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Auto Schedule */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={reminderSettings.autoSchedule}
                      onChange={(e) => handleSettingsChange('autoSchedule', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Auto-schedule reminders for new interviews
                    </span>
                  </label>
                </div>

                {/* Default Intervals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Default Reminder Times
                  </label>
                  <div className="space-y-2">
                    {REMINDER_INTERVALS.map((interval) => (
                      <label key={interval.value} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={reminderSettings.defaultIntervals.includes(interval.value)}
                          onChange={(e) => {
                            const intervals = e.target.checked
                              ? [...reminderSettings.defaultIntervals, interval.value]
                              : reminderSettings.defaultIntervals.filter(i => i !== interval.value);
                            handleSettingsChange('defaultIntervals', intervals);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{interval.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notification Methods
                  </label>
                  <div className="space-y-2">
                    {Object.entries(REMINDER_TYPES).map(([type, config]) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={reminderSettings.enabledTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...reminderSettings.enabledTypes, type]
                              : reminderSettings.enabledTypes.filter(t => t !== type);
                            handleSettingsChange('enabledTypes', types);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          {React.createElement(config.icon, { className: "w-4 h-4 text-gray-600" })}
                          <span className="text-sm text-gray-700">{config.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Browser Notifications */}
                {reminderSettings.enabledTypes.includes('push') && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Browser Notifications</span>
                    </div>
                    <p className="text-xs text-blue-700 mb-3">
                      Enable browser notifications to receive reminders even when the app is not active.
                    </p>
                    {Notification.permission === 'default' && (
                      <button
                        onClick={requestNotificationPermission}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enable Notifications
                      </button>
                    )}
                    {Notification.permission === 'granted' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Notifications enabled</span>
                      </div>
                    )}
                    {Notification.permission === 'denied' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Notifications blocked</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
        title="Reminder Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </>
  );
};

// Individual Reminder Card Component
const InterviewReminderCard = ({ notification, onDismiss }) => {
  const { interview } = notification;
  const timeUntil = getTimeUntilInterview(interview.scheduledDate);
  
  const getInterviewTypeIcon = (type) => {
    const icons = {
      phone: Phone,
      video: Video,
      'in-person': Users
    };
    return icons[type] || Calendar;
  };

  const InterviewIcon = getInterviewTypeIcon(interview.type);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 animate-slide-in-right">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Interview Reminder</h3>
            <p className="text-xs text-gray-500">Starting in {timeUntil}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">{interview.candidateName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <InterviewIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{interview.jobTitle}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {interview.scheduledDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        {interview.type === 'video' && interview.meetingLink && (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Join Meeting
          </a>
        )}
        <button
          onClick={onDismiss}
          className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// Helper function
const getTimeUntilInterview = (scheduledDate) => {
  const now = new Date();
  const diff = scheduledDate.getTime() - now.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
  }
};

export default InterviewReminderSystem;