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
  Zap,
  Video,
  FileText,
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  Stethoscope,
  GraduationCap
} from 'lucide-react';

// Define business sectors and their navigation configurations
export const businessSectors = {
  crm: {
    id: 'crm',
    name: 'CRM',
    displayName: 'Business CRM',
    description: 'Customer Relationship Management',
    primaryColor: 'blue',
    routes: [
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
        href: '/app/jobs',
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
        name: 'Analytics',
        href: '/app/analytics',
        icon: BarChart3,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Automation',
        href: '/app/automation',
        icon: Zap,
        color: 'from-yellow-500 to-orange-600'
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
      }
    ]
  },
  
  recruitment: {
    id: 'recruitment',
    name: 'Recruitment',
    displayName: 'Recruitment Suite',
    description: 'Talent Acquisition & Management',
    primaryColor: 'purple',
    routes: [
      {
        name: 'Dashboard',
        href: '/app/recruiter/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Candidates',
        href: '/app/recruiter/candidates',
        icon: Users,
        color: 'from-green-500 to-green-600',
        submenu: [
          {
            name: 'All Candidates',
            href: '/app/recruiter/candidates',
            description: 'View and manage all candidates'
          },
          {
            name: 'Add Candidate',
            href: '/app/recruiter/candidates/add',
            description: 'Add a new candidate'
          },
          {
            name: 'Duplicate Management',
            href: '/app/recruiter/candidates/duplicates',
            description: 'Manage duplicate candidates'
          }
        ]
      },
      {
        name: 'Jobs',
        href: '/app/recruiter/jobs',
        icon: Briefcase,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'Interviews',
        href: '/app/recruiter/interviews',
        icon: Video,
        color: 'from-amber-500 to-orange-600'
      },
      {
        name: 'Offers',
        href: '/app/recruiter/offers',
        icon: FileText,
        color: 'from-emerald-500 to-teal-600'
      },
      {
        name: 'Clients',
        href: '/app/recruiter/clients',
        icon: Building2,
        color: 'from-orange-500 to-orange-600'
      },
      {
        name: 'Calendar',
        href: '/app/recruiter/calendar',
        icon: Calendar,
        color: 'from-pink-500 to-rose-600'
      },
      {
        name: 'Automation',
        href: '/app/recruiter/automation',
        icon: Zap,
        color: 'from-yellow-500 to-orange-600'
      },
      {
        name: 'Analytics',
        href: '/app/recruiter/analytics',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Reports',
        href: '/app/recruiter/reports',
        icon: BarChart3,
        color: 'from-cyan-500 to-blue-600'
      },
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-600'
      }
    ]
  },

  // Future sectors - ready for expansion
  sales: {
    id: 'sales',
    name: 'Sales',
    displayName: 'Sales Management',
    description: 'Sales Pipeline & Lead Management',
    primaryColor: 'green',
    routes: [
      {
        name: 'Dashboard',
        href: '/app/sales/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Leads',
        href: '/app/sales/leads',
        icon: Users,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'Opportunities',
        href: '/app/sales/opportunities',
        icon: DollarSign,
        color: 'from-yellow-500 to-orange-600'
      },
      {
        name: 'Accounts',
        href: '/app/sales/accounts',
        icon: Building2,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'Analytics',
        href: '/app/sales/analytics',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-600'
      }
    ]
  },

  realEstate: {
    id: 'realEstate',
    name: 'Real Estate',
    displayName: 'Real Estate Management',
    description: 'Property & Client Management',
    primaryColor: 'orange',
    routes: [
      {
        name: 'Dashboard',
        href: '/app/realestate/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Properties',
        href: '/app/realestate/properties',
        icon: Home,
        color: 'from-orange-500 to-red-600'
      },
      {
        name: 'Clients',
        href: '/app/realestate/clients',
        icon: Users,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'Locations',
        href: '/app/realestate/locations',
        icon: MapPin,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'Analytics',
        href: '/app/realestate/analytics',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-600'
      }
    ]
  },

  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    displayName: 'Healthcare Management',
    description: 'Patient & Practice Management',
    primaryColor: 'teal',
    routes: [
      {
        name: 'Dashboard',
        href: '/app/healthcare/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Patients',
        href: '/app/healthcare/patients',
        icon: Users,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'Appointments',
        href: '/app/healthcare/appointments',
        icon: Calendar,
        color: 'from-pink-500 to-rose-600'
      },
      {
        name: 'Medical Records',
        href: '/app/healthcare/records',
        icon: Stethoscope,
        color: 'from-teal-500 to-cyan-600'
      },
      {
        name: 'Analytics',
        href: '/app/healthcare/analytics',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-600'
      }
    ]
  },

  education: {
    id: 'education',
    name: 'Education',
    displayName: 'Education Management',
    description: 'Student & Course Management',
    primaryColor: 'indigo',
    routes: [
      {
        name: 'Dashboard',
        href: '/app/education/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Students',
        href: '/app/education/students',
        icon: Users,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'Courses',
        href: '/app/education/courses',
        icon: GraduationCap,
        color: 'from-indigo-500 to-purple-600'
      },
      {
        name: 'Schedule',
        href: '/app/education/schedule',
        icon: Calendar,
        color: 'from-pink-500 to-rose-600'
      },
      {
        name: 'Analytics',
        href: '/app/education/analytics',
        icon: TrendingUp,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-600'
      }
    ]
  }
};

/**
 * Get sector configuration based on current route
 * @param {string} pathname - Current route pathname
 * @returns {Object} Sector configuration object
 */
export function getSectorFromRoute(pathname) {
  if (pathname.startsWith('/app/recruiter')) {
    return businessSectors.recruitment;
  }
  if (pathname.startsWith('/app/sales')) {
    return businessSectors.sales;
  }
  if (pathname.startsWith('/app/realestate')) {
    return businessSectors.realEstate;
  }
  if (pathname.startsWith('/app/healthcare')) {
    return businessSectors.healthcare;
  }
  if (pathname.startsWith('/app/education')) {
    return businessSectors.education;
  }
  
  // Default to CRM
  return businessSectors.crm;
}

/**
 * Get navigation items for current sector
 * @param {string} pathname - Current route pathname
 * @returns {Array} Navigation items array
 */
export function getNavigationItems(pathname) {
  const sector = getSectorFromRoute(pathname);
  return sector.routes;
}

/**
 * Get sector display information
 * @param {string} pathname - Current route pathname
 * @returns {Object} Sector display info
 */
export function getSectorDisplayInfo(pathname) {
  const sector = getSectorFromRoute(pathname);
  return {
    name: sector.name,
    displayName: sector.displayName,
    description: sector.description,
    primaryColor: sector.primaryColor
  };
}

/**
 * Check if user has access to a specific sector
 * @param {Object} user - User object
 * @param {string} sectorId - Sector ID to check
 * @returns {boolean} Whether user has access
 */
export function hasAccessToSector(user, sectorId) {
  // For now, recruitment access is limited to demo users
  if (sectorId === 'recruitment') {
    return user?.dashboardType === 'recruiter' || user?.email === 'sales@crm.com';
  }
  
  // Other sectors can be configured based on user roles/permissions
  // This is where you'd implement role-based access control
  
  return true; // Default allow access for other sectors
}

/**
 * Get available sectors for a user
 * @param {Object} user - User object
 * @returns {Array} Array of available sector configurations
 */
export function getAvailableSectors(user) {
  return Object.values(businessSectors).filter(sector => 
    hasAccessToSector(user, sector.id)
  );
}