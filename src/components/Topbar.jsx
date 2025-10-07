import { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';

export default function Topbar({ title = 'Dashboard' }) {
  const { user, logout } = useAuth();
  const [notificationCount] = useState(3); // Mock notification count

  const userMenuItems = [
    {
      label: 'Profile',
      onClick: () => {
        // Navigate to profile/settings
        console.log('Navigate to profile');
      },
    },
    {
      label: 'Settings',
      onClick: () => {
        // Navigate to settings
        console.log('Navigate to settings');
      },
    },
    {
      label: 'Logout',
      onClick: logout,
      className: 'text-red-600 hover:text-red-700',
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right Side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-150 rounded-lg hover:bg-gray-100 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {notificationCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  aria-hidden="true"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <Dropdown
            trigger={
              <button 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-150 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="User menu"
              aria-expanded="false"
            >
                <Avatar
                  src={user?.avatar}
                  name={user?.name || 'User'}
                  size="sm"
                />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
              </button>
            }
            items={userMenuItems}
            align="right"
          />
        </div>
      </div>
    </header>
  );
}