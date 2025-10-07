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
  Mail,
  ArrowDownZA,
  Phone,
  FileText,
  Target,
  Briefcase,
  UserCheck,
  Zap
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
    name: 'Contacts',
    href: '/app/contacts',
    icon: Users,
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Deals',
    href: '/app/deals',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Companies',
    href: '/app/companies',
    icon: Building2,
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Calendar',
    href: '/app/calendar',
    icon: Calendar,
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Email',
    href: '/app/email',
    icon: Mail,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: 'Calls',
    href: '/app/calls',
    icon: Phone,
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Documents',
    href: '/app/documents',
    icon: FileText,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'Goals',
    href: '/app/goals',
    icon: Target,
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: 'Projects',
    href: '/app/projects',
    icon: Briefcase,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    name: 'Team',
    href: '/app/team',
    icon: UserCheck,
    color: 'from-violet-500 to-violet-600'
  },
  {
    name: 'Automation',
    href: '/app/automation',
    icon: Zap,
    color: 'from-amber-500 to-amber-600'
  },
  {
    name: 'Settings',
    href: '/app/settings',
    icon: Settings,
    color: 'from-gray-500 to-gray-600'
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-full shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CRM Pro</span>
            <div className="text-xs text-slate-400">Business Suite</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin" aria-label="Main navigation">
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
                  group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium 
                  transition-all duration-200 transform hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-500/30 backdrop-blur-sm' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg` 
                    : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                  }
                `}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-200">
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}