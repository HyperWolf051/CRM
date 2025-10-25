import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import Topbar from '@/components/Topbar';
import PageTransition from '@/components/PageTransition';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';

// Map routes to page titles for recruiter section
const recruiterPageTitles = {
  '/app/recruiter': 'Recruitment Dashboard',
  '/app/recruiter/dashboard': 'Recruitment Dashboard',
  '/app/recruiter/candidates': 'Candidates',
  '/app/recruiter/candidates/add': 'Add Candidate',
  '/app/recruiter/jobs': 'Jobs & Requirements',
  '/app/recruiter/jobs/add': 'Post New Job',
  '/app/recruiter/interviews': 'Interviews',
  '/app/recruiter/interviews/schedule': 'Schedule Interview',
  '/app/recruiter/offers': 'Job Offers',
  '/app/recruiter/offers/create': 'Create Offer',
  '/app/recruiter/calendar': 'Interview Calendar',
  '/app/recruiter/analytics': 'Recruitment Analytics',
  '/app/recruiter/reports': 'Daily Reports',
  '/app/recruiter/settings': 'Recruitment Settings',
};

export default function RecruiterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page title based on current route
  const getPageTitle = () => {
    // Check for exact match first
    if (recruiterPageTitles[location.pathname]) {
      return recruiterPageTitles[location.pathname];
    }
    
    // Check for dynamic routes (e.g., /app/recruiter/candidates/123)
    if (location.pathname.startsWith('/app/recruiter/candidates/') && location.pathname !== '/app/recruiter/candidates/add') {
      return 'Candidate Details';
    }
    
    if (location.pathname.startsWith('/app/recruiter/jobs/') && location.pathname !== '/app/recruiter/jobs/add') {
      return 'Job Details';
    }
    
    if (location.pathname.startsWith('/app/recruiter/interviews/') && location.pathname !== '/app/recruiter/interviews/schedule') {
      return 'Interview Details';
    }
    
    if (location.pathname.startsWith('/app/recruiter/offers/') && location.pathname !== '/app/recruiter/offers/create') {
      return 'Offer Details';
    }
    
    // Default fallback
    return 'Recruitment Dashboard';
  };

  // Recruitment-specific keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: 'r+d',
      callback: () => navigate('/app/recruiter/dashboard'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+c',
      callback: () => navigate('/app/recruiter/candidates'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+j',
      callback: () => navigate('/app/recruiter/jobs'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+i',
      callback: () => navigate('/app/recruiter/interviews'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+o',
      callback: () => navigate('/app/recruiter/offers'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+k',
      callback: () => navigate('/app/recruiter/calendar'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+a',
      callback: () => navigate('/app/recruiter/analytics'),
      options: { ignoreInputs: true }
    },
    {
      keys: 'r+r',
      callback: () => navigate('/app/recruiter/reports'),
      options: { ignoreInputs: true }
    }
  ]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed z-index for proper layering */}
      <div className="flex-shrink-0" style={{ zIndex: 100 }}>
        <CollapsibleSidebar />
      </div>
      
      {/* Main Content Area - Flexbox layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar - Fixed z-index above content */}
        <div className="flex-shrink-0" style={{ zIndex: 200 }}>
          <Topbar title={getPageTitle()} />
        </div>
        
        {/* Page Content - Scrollable area with Optimized Spacing */}
        <main className="flex-1 overflow-y-auto bg-gray-50" style={{ zIndex: 10 }}>
          <div className="p-3 lg:p-4">
            <div className="w-full max-w-none">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}