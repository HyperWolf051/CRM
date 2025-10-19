import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  Building2,
  Calendar,
  BarChart3,
  CheckSquare,
  UserCheck,
  Menu,
  X
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
    icon: Briefcase,
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
    name: 'Team',
    href: '/app/team',
    icon: UserCheck,
    color: 'from-violet-500 to-violet-600'
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);



  const handleMouseEnter = () => {
    if (!isMobile) {
      setTimeout(() => setIsExpanded(true), 50);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setTimeout(() => setIsExpanded(false), 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden"
          style={{ zIndex: 90 }}
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 p-3 bg-white rounded-xl shadow-lg border border-slate-200"
        style={{ zIndex: 150 }}
        onClick={toggleMobileMenu}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-slate-600" />
        ) : (
          <Menu className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `${isExpanded ? 'w-72' : 'w-28'} relative`
          }
          bg-white/95 backdrop-blur-xl border-r border-slate-200/50 
          flex flex-col h-full shadow-xl 
          ${!isMobile ? 'transition-all duration-500 ease-out' : ''}
          overflow-hidden
        `}
        style={{ zIndex: isMobile ? 100 : 'auto' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >


      {/* Logo */}
      <div className="p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <div className={`ml-3 transition-all duration-500 ease-out ${
            (isExpanded || isMobile) 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
          }`}>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">CRM Pro</span>
            <div className="text-xs text-slate-500 whitespace-nowrap">Business Suite</div>
          </div>
        </div>
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
                  group flex items-center ${(isExpanded || isMobile) ? 'justify-start' : 'justify-center'} 
                  px-4 py-3 mx-1 rounded-xl text-sm font-medium 
                  transition-all duration-300 transform magnetic-hover
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                  relative overflow-hidden enhanced-gradient-slide
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg border border-blue-200/50' 
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:shadow-md'
                  }
                `}
                title={!(isExpanded || isMobile) ? item.name : ''}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  relative overflow-hidden group-hover:scale-110 icon-wiggle
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg` 
                    : 'group-hover:bg-slate-600/50'
                  }
                `}>
                  <Icon className={`w-5 h-5 transition-all duration-300 enhanced-icon-wiggle ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-600 group-hover:text-blue-600'
                  }`} aria-hidden="true" />
                  {/* Enhanced hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </div>
                <span className={`ml-4 transition-all duration-500 ease-out whitespace-nowrap font-medium ${
                  (isExpanded || isMobile) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
                {isActive && (isExpanded || isMobile) && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse transition-all duration-300"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>


      </div>
    </>
  );
}