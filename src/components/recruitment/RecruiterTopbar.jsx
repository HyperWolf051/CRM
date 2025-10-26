import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, ChevronRight, Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfileAvatar from '@/components/ProfileAvatar';
import { useRecruitment } from '@/hooks/useRecruitment';

export default function RecruiterTopbar({ title = 'Recruitment Dashboard' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const quickActionsRef = useRef(null);
  const notificationsRef = useRef(null);

  const { searchCandidatesAndJobs, getUpcomingInterviews } = useRecruitment();

  // Mock notifications for interview reminders
  const [notifications] = useState([
    {
      id: 1,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Interview with Sarah Johnson in 30 minutes',
      time: '30 min',
      urgent: true
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Interview with Mike Chen at 3:00 PM',
      time: '2 hours',
      urgent: false
    },
    {
      id: 3,
      type: 'candidate',
      title: 'New Application',
      message: 'New candidate applied for Senior Developer',
      time: '1 hour',
      urgent: false
    }
  ]);

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Recruitment
    breadcrumbs.push({ label: 'Recruitment', path: '/app/recruiter' });

    if (pathSegments.length > 2) {
      const section = pathSegments[2];
      const sectionLabels = {
        'dashboard': 'Dashboard',
        'candidates': 'Candidates',
        'jobs': 'Jobs',
        'interviews': 'Interviews',
        'offers': 'Offers',
        'calendar': 'Calendar',
        'analytics': 'Analytics',
        'reports': 'Reports',
        'settings': 'Settings'
      };

      if (sectionLabels[section]) {
        breadcrumbs.push({
          label: sectionLabels[section],
          path: `/app/recruiter/${section}`
        });
      }

      // Add specific page if exists
      if (pathSegments.length > 3) {
        const page = pathSegments[3];
        if (page === 'add') {
          breadcrumbs.push({
            label: section === 'candidates' ? 'Add Candidate' : 'Add Job',
            path: location.pathname
          });
        } else if (page === 'schedule') {
          breadcrumbs.push({
            label: 'Schedule Interview',
            path: location.pathname
          });
        } else if (page === 'create') {
          breadcrumbs.push({
            label: 'Create Offer',
            path: location.pathname
          });
        } else {
          // Dynamic ID pages
          breadcrumbs.push({
            label: 'Details',
            path: location.pathname
          });
        }
      }
    }

    return breadcrumbs;
  };

  // Handle search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      try {
        const results = await searchCandidatesAndJobs(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Quick actions
  const quickActions = [
    {
      icon: Users,
      label: 'Add Candidate',
      action: () => navigate('/app/recruiter/candidates/add'),
      color: 'blue'
    },
    {
      icon: Briefcase,
      label: 'Post Job',
      action: () => navigate('/app/recruiter/jobs/add'),
      color: 'green'
    },
    {
      icon: Calendar,
      label: 'Schedule Interview',
      action: () => navigate('/app/recruiter/interviews/schedule'),
      color: 'purple'
    },
    {
      icon: FileText,
      label: 'Create Report',
      action: () => navigate('/app/recruiter/reports'),
      color: 'amber'
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get contextual search placeholder
  const getSearchPlaceholder = () => {
    switch (location.pathname) {
      case '/app/recruiter/candidates':
        return 'Search candidates by name, skills, position...';
      case '/app/recruiter/jobs':
        return 'Search jobs by title, company, location...';
      case '/app/recruiter/interviews':
        return 'Search interviews by candidate, position...';
      case '/app/recruiter/offers':
        return 'Search offers by candidate, company...';
      default:
        return 'Search candidates, jobs, interviews...';
    }
  };

  const urgentNotifications = notifications.filter(n => n.urgent).length;

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm relative">
      <div className="flex items-center justify-between">
        {/* Left Side - Breadcrumbs and Search */}
        <div className="flex items-center space-x-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.path} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`${
                    index === getBreadcrumbs().length - 1
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
              className="w-80 pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                         text-sm placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                         hover:bg-white/80 hover:border-slate-300/50
                         transition-all duration-300"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {searchResults.candidates && searchResults.candidates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                        Candidates
                      </h4>
                      {searchResults.candidates.map((candidate) => (
                        <button
                          key={candidate.id}
                          onClick={() => {
                            navigate(`/app/recruiter/candidates/${candidate.id}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-xs text-gray-500">{candidate.position}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.jobs && searchResults.jobs.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                        Jobs
                      </h4>
                      {searchResults.jobs.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => {
                            navigate(`/app/recruiter/jobs/${job.id}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Quick Actions</span>
            </button>
            
            {showQuickActions && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setShowQuickActions(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        action.color === 'green' ? 'bg-green-100 text-green-600' :
                        action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {urgentNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {urgentNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg mb-2 ${
                        notification.urgent ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.type === 'interview' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {notification.type === 'interview' ? (
                            <Calendar className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time} ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <ProfileAvatar />
        </div>
      </div>
    </header>
  );
}