import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Crown, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ProfileAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Profile Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-full"
        title={`${user?.name || 'User'} - Click for profile menu`}
      >
        {/* Avatar Container */}
        <div className={`
          relative w-10 h-10 rounded-full overflow-hidden
          bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
          transition-all duration-300 transform avatar-soft-hover
          ${isHovering ? 'scale-110 shadow-xl' : 'scale-100 shadow-lg'}
        `}>
          {/* Avatar Content */}
          <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center">
            <span className="text-sm font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getInitials(user?.name)}
            </span>
          </div>

          {/* Animated Ring */}
          <div className={`
            absolute inset-0 rounded-full border-2 border-transparent
            bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
            transition-all duration-500
            ${isHovering ? 'animate-spin opacity-100' : 'opacity-0'}
          `} style={{ 
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
            WebkitMask: 'radial-gradient(circle, transparent 18px, black 20px)',
            mask: 'radial-gradient(circle, transparent 18px, black 20px)'
          }}></div>

          {/* Pulse Effect */}
          <div className={`
            absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30
            transition-all duration-300
            ${isHovering ? 'animate-ping opacity-75' : 'opacity-0'}
          `}></div>

          {/* Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>

        {/* Hover Glow */}
        <div className={`
          absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md -z-10
          transition-all duration-300
          ${isHovering ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}
        `}></div>
      </button>

      {/* Dropdown Menu - Fixed positioning */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed right-4 top-20 w-72 bg-white/98 backdrop-blur-xl 
                     border border-slate-200/50 rounded-2xl shadow-2xl
                     animate-in slide-in-from-top-2 duration-300 overflow-hidden"
          style={{ zIndex: 300 }} // Using dropdown z-index from our system
        >
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200/50">
            <div className="flex items-center space-x-3">
              {/* Large Avatar */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {getInitials(user?.name)}
                  </span>
                </div>
                {/* Crown for demo user */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Crown className="w-3 h-3 text-yellow-700" />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name || 'Demo User'}
                </h3>
                <p className="text-xs text-slate-600 truncate flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{user?.email || 'demo@crm.com'}</span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Online
                  </div>
                  <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Admin
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Profile Section */}
            <div className="mb-2">
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-left
                               hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                               hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                               group liquid-hover">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center
                               group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500
                               group-hover:scale-110 transition-all duration-300 icon-wiggle">
                  <User className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">View Profile</div>
                  <div className="text-xs text-slate-500">Manage your account</div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-left
                               hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 
                               hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                               group liquid-hover">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center
                               group-hover:bg-gradient-to-r group-hover:from-slate-500 group-hover:to-blue-500
                               group-hover:scale-110 transition-all duration-300 icon-wiggle">
                  <Settings className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Settings</div>
                  <div className="text-xs text-slate-500">Preferences & privacy</div>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-left
                         hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 
                         hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]
                         group liquid-hover"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center
                             group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500
                             group-hover:scale-110 transition-all duration-300 icon-wiggle">
                <LogOut className="w-4 h-4 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">Sign Out</div>
                <div className="text-xs text-slate-500">End your session</div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50/50 border-t border-slate-200/50">
            <div className="text-xs text-slate-500 text-center">
              CRM Pro v2.1.0 • Demo Mode
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;