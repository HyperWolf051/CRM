import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Building2,
  Calendar,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Candidates',
    href: '/app/candidates',
    icon: Users,
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Jobs',
    href: '/app/deals',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Calendar',
    href: '/app/calendar',
    icon: Calendar,
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Tasks',
    href: '/app/tasks',
    icon: CheckSquare,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    name: 'Clients',
    href: '/app/companies',
    icon: Building2,
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Reports',
    href: '/app/analytics',
    icon: BarChart3,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Settings',
    href: '/app/settings',
    icon: Settings,
    color: 'from-gray-500 to-gray-600'
  },
];

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setTimeout(() => setIsExpanded(true), 50);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTimeout(() => setIsExpanded(false), 100);
  };

  return (
    <div 
      className={`
        ${isExpanded ? 'w-64' : 'w-20'} 
        bg-white/95 backdrop-blur-xl border-r border-slate-200/50 
        flex flex-col h-full shadow-xl 
        transition-all duration-500 ease-out
        relative z-10 overflow-hidden
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-20"
      >
        {isExpanded ? (
          <ChevronLeft className="w-3 h-3 text-slate-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-600" />
        )}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-slate-200/50">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <div className={`ml-3 transition-all duration-500 ease-out ${
            isExpanded 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
          }`}>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">CRM Pro</span>
            <div className="text-xs text-slate-500 whitespace-nowrap">Business Suite</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-b border-slate-200/50 transition-all duration-500 ease-out ${
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}>
        {isExpanded && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto" aria-label="Main navigation">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  group flex items-center px-3 py-3 rounded-xl text-sm font-medium 
                  transition-all duration-300 transform hover:scale-[1.05]
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                  relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg border border-blue-200/50' 
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:shadow-md'
                  }
                `}
                title={!isExpanded ? item.name : ''}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  relative overflow-hidden group-hover:scale-110
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg` 
                    : 'bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-slate-200 group-hover:to-blue-100'
                  }
                `}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-600 group-hover:text-blue-600'
                  }`} aria-hidden="true" />
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </div>
                <span className={`ml-3 transition-all duration-500 ease-out whitespace-nowrap ${
                  isExpanded 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
                {isActive && isExpanded && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse transition-all duration-300"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-200/50">
        <button
          onClick={handleLogout}
          className={`
            group flex items-center w-full px-3 py-3 rounded-xl text-sm font-medium 
            text-slate-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 
            transition-all duration-300 transform hover:scale-[1.05] 
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            relative overflow-hidden hover:shadow-md
          `}
          title={!isExpanded ? 'Logout' : ''}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
            <LogOut className="w-5 h-5 transition-all duration-300 group-hover:text-red-600" aria-hidden="true" />
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </div>
          <span className={`ml-3 transition-all duration-500 ease-out whitespace-nowrap ${
            isExpanded 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
          }`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}