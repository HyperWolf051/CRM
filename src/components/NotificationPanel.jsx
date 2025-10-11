import { useState, useRef, useEffect } from 'react';
import { Bell, X, Clock, User, Briefcase, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react';

const demoNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'New Candidate Applied',
    message: 'Sarah Johnson applied for Senior Developer position',
    name: 'Sarah Johnson',
    time: '2 minutes ago',
    icon: User,
    unread: true
  },
  {
    id: 2,
    type: 'info',
    title: 'Interview Scheduled',
    message: 'Interview with Michael Chen scheduled for tomorrow at 2:00 PM',
    name: 'Michael Chen',
    time: '15 minutes ago',
    icon: Calendar,
    unread: true
  },
  {
    id: 3,
    type: 'warning',
    title: 'Application Deadline',
    message: 'Frontend Developer position closes in 2 days',
    name: 'System',
    time: '1 hour ago',
    icon: AlertCircle,
    unread: false
  },
  {
    id: 4,
    type: 'success',
    title: 'Offer Accepted',
    message: 'Emma Wilson accepted the UX Designer offer',
    name: 'Emma Wilson',
    time: '3 hours ago',
    icon: CheckCircle,
    unread: false
  },
  {
    id: 5,
    type: 'info',
    title: 'New Job Posted',
    message: 'Backend Developer position has been published',
    name: 'HR Team',
    time: '5 hours ago',
    icon: Briefcase,
    unread: false
  },
  {
    id: 6,
    type: 'info',
    title: 'Profile Updated',
    message: 'Alex Rodriguez updated their portfolio',
    name: 'Alex Rodriguez',
    time: '1 day ago',
    icon: User,
    unread: false
  }
];

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'error':
        return 'from-red-50 to-rose-50 border-red-200';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 
                   hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                   hover:border-blue-300/50 hover:shadow-lg hover:scale-110
                   transition-all duration-300 transform group
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 
                        notification-bell-hover" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 
                          rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
      </button>

      {/* Notification Panel - Fixed positioning to appear on top */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed right-4 top-20 w-96 bg-white/98 backdrop-blur-xl 
                     border border-slate-200/50 rounded-2xl shadow-2xl z-[99999]
                     animate-in slide-in-from-top-2 duration-300"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium 
                               hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors duration-200"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <div className="p-2 stagger-fade-in">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`
                        group relative p-3 mb-2 rounded-xl border transition-all duration-300
                        hover:shadow-md hover:scale-[1.02] cursor-pointer liquid-hover
                        ${notification.unread 
                          ? `bg-gradient-to-r ${getNotificationBg(notification.type)} shadow-sm` 
                          : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-100/50'
                        }
                      `}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {/* Unread Indicator */}
                      {notification.unread && (
                        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 
                                        bg-blue-500 rounded-full animate-pulse"></div>
                      )}

                      <div className="flex items-start space-x-3 ml-2">
                        {/* Icon */}
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                          bg-white/80 backdrop-blur-sm border border-slate-200/50
                          group-hover:scale-110 transition-transform duration-300 icon-wiggle
                        `}>
                          <IconComponent className={`w-4 h-4 ${getNotificationIcon(notification.type)}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/80 
                                         rounded-lg transition-all duration-200"
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{notification.name}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200/50 bg-slate-50/50">
            <button className="w-full text-sm text-white font-medium 
                               py-2 rounded-lg btn-primary-slide">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;