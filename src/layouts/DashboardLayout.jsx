import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import PageTransition from '@/components/PageTransition';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcut';

// Map routes to page titles
const pageTitles = {
  '/app/dashboard': 'Dashboard',
  '/app/contacts': 'Contacts',
  '/app/deals': 'Deals',
  '/app/settings': 'Settings',
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page title based on current route
  const getPageTitle = () => {
    // Check for exact match first
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }
    
    // Check for dynamic routes (e.g., /app/contacts/123)
    if (location.pathname.startsWith('/app/contacts/')) {
      return 'Contact Details';
    }
    
    // Default fallback
    return 'Dashboard';
  };

  // Global navigation keyboard shortcuts (simple single key shortcuts for now)
  useKeyboardShortcuts([
    {
      keys: '1',
      callback: () => navigate('/app/dashboard'),
      options: { ignoreInputs: true }
    },
    {
      keys: '2',
      callback: () => navigate('/app/contacts'),
      options: { ignoreInputs: true }
    },
    {
      keys: '3',
      callback: () => navigate('/app/deals'),
      options: { ignoreInputs: true }
    },
    {
      keys: '4',
      callback: () => navigate('/app/settings'),
      options: { ignoreInputs: true }
    }
  ]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar title={getPageTitle()} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-none lg:max-w-7xl xl:max-w-none 2xl:max-w-[1600px] mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}