import { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NotificationPanel from '@/components/NotificationPanel';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function Topbar({ title = 'Dashboard' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Removed quick action buttons to avoid duplicates with dashboard quick actions

  // Get contextual search placeholder
  const getSearchPlaceholder = () => {
    switch (location.pathname) {
      case '/app/candidates':
        return 'Search candidates...';
      case '/app/jobs':
        return 'Search jobs...';
      case '/app/companies':
        return 'Search clients...';
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



  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm relative">
      <div className="flex items-center justify-between">
        {/* Left Side - Search */}
        <div className="flex items-center space-x-6">
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
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationPanel />

          {/* Profile Avatar */}
          <ProfileAvatar />
        </div>
      </div>
    </header>
  );
}