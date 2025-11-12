import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, ChevronRight, Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfileAvatar from '@/components/ProfileAvatar';
import { useRecruitment } from '@/hooks/useRecruitment';

/**
 * MinimalRecruiterTopbar Component
 * 
 * A deliberately understated topbar following human-crafted design principles:
 * - Clean white background with subtle border
 * - No colorful gradients or flashy effects
 * - Simple, functional buttons
 * - Understated hover states
 */
export default function MinimalRecruiterTopbar({ title = 'Recruitment Dashboard' }) {
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
      action: () => navigate('/app/recruiter/candidates/add')
    },
    {
      icon: Briefcase,
      label: 'Post Job',
      action: () => navigate('/app/recruiter/jobs/add')
    },
    {
      icon: Calendar,
      label: 'Schedule Interview',
      action: () => navigate('/app/recruiter/interviews/schedule')
    },
    {
      icon: FileText,
      label: 'Create Report',
      action: () => navigate('/app/recruiter/reports')
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
        return 'Search candidates...';
      case '/app/recruiter/jobs':
        return 'Search jobs...';
      case '/app/recruiter/interviews':
        return 'Search interviews...';
      case '/app/recruiter/offers':
        return 'Search offers...';
      default:
        return 'Search...';
    }
  };

  const urgentNotifications = notifications.filter(n => n.urgent).length;

  return (
    <header className="bg-white border-b border-minimal-border-gray px-6 py-4 shadow-minimal-subtle">
      <div className="flex items-center justify-between">
        {/* Left Side - Breadcrumbs and Search */}
        <div className="flex items-center space-x-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.path} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-minimal-text-light" />}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`${
                    index === getBreadcrumbs().length - 1
                      ? 'text-minimal-text-dark font-medium'
                      : 'text-minimal-text-medium hover:text-minimal-text-dark'
                  } transition-colors duration-150`}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-minimal-text-light" />
            </div>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
              className="w-80 pl-10 pr-4 py-2.5 bg-minimal-light-gray border border-minimal-border-gray rounded
                         text-sm placeholder-minimal-text-light placeholder-italic
                         focus:outline-none focus:border-minimal-accent focus:shadow-[0_0_0_1px_#4a5568]
                         hover:bg-white hover:border-minimal-text-medium
                         transition-all duration-150"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded border border-minimal-border-gray shadow-minimal-elevated z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {searchResults.candidates && searchResults.candidates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-minimal-text-medium uppercase tracking-wide px-3 py-2">
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
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-minimal-off-white transition-colors duration-150"
                        >
                          <div className="w-8 h-8 bg-minimal-light-gray rounded-full flex items-center justify-center text-minimal-text-dark text-sm font-medium">
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-minimal-text-dark">{candidate.name}</p>
                            <p className="text-xs text-minimal-text-medium">{candidate.position}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.jobs && searchResults.jobs.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-minimal-text-medium uppercase tracking-wide px-3 py-2">
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
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-minimal-off-white transition-colors duration-150"
                        >
                          <div className="w-8 h-8 bg-minimal-light-gray rounded-full flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-minimal-text-dark" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-minimal-text-dark">{job.title}</p>
                            <p className="text-xs text-minimal-text-medium">{job.company} • {job.location}</p>
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
              className="flex items-center space-x-2 px-3 py-2 bg-minimal-text-dark text-white rounded hover:bg-minimal-accent transition-colors duration-150"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Quick Actions</span>
            </button>
            
            {showQuickActions && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded border border-minimal-border-gray shadow-minimal-elevated z-50">
                <div className="p-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setShowQuickActions(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-minimal-off-white transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded flex items-center justify-center bg-minimal-light-gray text-minimal-text-dark">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-minimal-text-dark">{action.label}</span>
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
              className="relative p-2 text-minimal-text-medium hover:text-minimal-text-dark hover:bg-minimal-light-gray rounded transition-colors duration-150"
            >
              <Bell className="w-5 h-5" />
              {urgentNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-minimal-text-dark text-white text-xs rounded-full flex items-center justify-center">
                  {urgentNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded border border-minimal-border-gray shadow-minimal-elevated z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-minimal-border-gray">
                  <h3 className="text-sm font-semibold text-minimal-text-dark">Notifications</h3>
                </div>
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded mb-2 ${
                        notification.urgent ? 'bg-red-50 border border-minimal-status-critical' : 'hover:bg-minimal-off-white'
                      } transition-colors duration-150`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-minimal-light-gray text-minimal-text-dark">
                          {notification.type === 'interview' ? (
                            <Calendar className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-minimal-text-dark">{notification.title}</p>
                          <p className="text-xs text-minimal-text-medium mt-1">{notification.message}</p>
                          <p className="text-xs text-minimal-text-light mt-1 italic">{notification.time} ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-minimal-border-gray">
                  <button className="w-full text-sm text-minimal-accent hover:text-minimal-accent-dark font-medium transition-colors duration-150">
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
