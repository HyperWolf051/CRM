import { useState } from 'react';
import { Search, Command, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NotificationPanel from '@/components/NotificationPanel';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function Topbar({ title = 'Dashboard' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get the appropriate button text and action based on current page
  const getQuickActionButton = () => {
    switch (location.pathname) {
      case '/app/dashboard':
      case '/app/candidates':
        return {
          text: 'Add Candidate',
          action: () => navigate('/app/candidates'),
          icon: Plus
        };
      case '/app/calendar':
        return {
          text: 'New Event',
          action: () => {
            // This could trigger the calendar event modal
            console.log('Open calendar event modal');
          },
          icon: Plus
        };
      case '/app/tasks':
        return {
          text: 'New Task',
          action: () => {
            // This could trigger the task creation modal
            console.log('Open task creation modal');
          },
          icon: Plus
        };
      default:
        return null;
    }
  };

  // Get contextual search placeholder
  const getSearchPlaceholder = () => {
    switch (location.pathname) {
      case '/app/candidates':
        return 'Search candidates...';
      case '/app/deals':
        return 'Search jobs and deals...';
      case '/app/companies':
        return 'Search clients and companies...';
      case '/app/calendar':
        return 'Search events...';
      case '/app/tasks':
        return 'Search tasks...';
      case '/app/contacts':
        return 'Search contacts...';
      default:
        return 'Search candidates, jobs, clients...';
    }
  };

  const quickAction = getQuickActionButton();

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side - Page Title and Search */}
        <div className="flex items-center space-x-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="text-sm text-slate-500 mt-0.5">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                         text-sm placeholder-slate-400 smart-search-bar
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                         hover:bg-white/80 hover:border-slate-300/50
                         transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-slate-200 rounded text-xs font-mono text-slate-500 bg-slate-100">
                <Command className="w-3 h-3 mr-1" />
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          {quickAction && (
            <div className="hidden lg:flex items-center space-x-2">
              <button 
                onClick={quickAction.action}
                className="px-4 py-2 text-white text-sm font-medium 
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                           btn-primary-slide">
                <quickAction.icon className="w-4 h-4 mr-2 inline" />
                {quickAction.text}
              </button>
            </div>
          )}

          {/* Notifications */}
          <NotificationPanel />

          {/* Profile Avatar */}
          <ProfileAvatar />
        </div>
      </div>
    </header>
  );
}