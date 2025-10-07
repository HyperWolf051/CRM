// Mock data for demo mode
export const mockContacts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    status: 'active',
    avatar: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovate.com',
    phone: '+1 (555) 987-6543',
    company: 'Innovate Solutions',
    status: 'lead',
    avatar: null,
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T16:20:00Z'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@startupxyz.com',
    phone: '+1 (555) 456-7890',
    company: 'StartupXYZ',
    status: 'active',
    avatar: null,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-25T13:30:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@globaltech.com',
    phone: '+1 (555) 321-0987',
    company: 'Global Tech',
    status: 'inactive',
    avatar: null,
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-18T10:15:00Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'dwilson@futuresoft.com',
    phone: '+1 (555) 654-3210',
    company: 'FutureSoft',
    status: 'lead',
    avatar: null,
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-28T09:40:00Z'
  }
];

export const mockDeals = [
  {
    id: '1',
    name: 'Enterprise Software License',
    value: 50000,
    stage: 'proposal',
    probability: 75,
    contactId: '1',
    contactName: 'John Smith',
    contactAvatar: null,
    expectedCloseDate: '2024-02-15',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-28T14:45:00Z'
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    value: 125000,
    stage: 'negotiation',
    probability: 85,
    contactId: '2',
    contactName: 'Sarah Johnson',
    contactAvatar: null,
    expectedCloseDate: '2024-02-28',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-29T16:20:00Z'
  },
  {
    id: '3',
    name: 'Mobile App Development',
    value: 75000,
    stage: 'qualified',
    probability: 60,
    contactId: '3',
    contactName: 'Michael Chen',
    contactAvatar: null,
    expectedCloseDate: '2024-03-10',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-30T13:30:00Z'
  },
  {
    id: '4',
    name: 'Security Audit Service',
    value: 25000,
    stage: 'closed_won',
    probability: 100,
    contactId: '4',
    contactName: 'Emily Davis',
    contactAvatar: null,
    expectedCloseDate: '2024-01-30',
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-30T10:15:00Z'
  },
  {
    id: '5',
    name: 'AI Integration Consulting',
    value: 200000,
    stage: 'lead',
    probability: 30,
    contactId: '5',
    contactName: 'David Wilson',
    contactAvatar: null,
    expectedCloseDate: '2024-04-15',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-30T09:40:00Z'
  },
  {
    id: '6',
    name: 'Website Redesign',
    value: 15000,
    stage: 'closed_lost',
    probability: 0,
    contactId: '1',
    contactName: 'John Smith',
    contactAvatar: null,
    expectedCloseDate: '2024-01-25',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-25T15:30:00Z'
  }
];

export const mockDashboardStats = {
  totalContacts: mockContacts.length,
  activeDeals: mockDeals.filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage)).length,
  totalRevenue: mockDeals.filter(deal => deal.stage === 'closed_won').reduce((sum, deal) => sum + deal.value, 0),
  conversionRate: 67, // Percentage
  
  // Trends (percentage change from last month)
  contactsTrend: 12,
  dealsTrend: -5,
  revenueTrend: 23,
  conversionTrend: 8,
  
  // Recent activities
  recentActivities: [
    {
      id: '1',
      type: 'deal_won',
      title: 'Deal closed successfully',
      description: 'Security Audit Service - $25,000',
      timestamp: '2024-01-30T10:15:00Z'
    },
    {
      id: '2',
      type: 'contact_added',
      title: 'New contact added',
      description: 'David Wilson from FutureSoft',
      timestamp: '2024-01-25T14:20:00Z'
    },
    {
      id: '3',
      type: 'deal_updated',
      title: 'Deal stage updated',
      description: 'Cloud Migration Project moved to Negotiation',
      timestamp: '2024-01-29T16:20:00Z'
    },
    {
      id: '4',
      type: 'contact_updated',
      title: 'Contact information updated',
      description: 'Michael Chen contact details updated',
      timestamp: '2024-01-25T13:30:00Z'
    }
  ]
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};