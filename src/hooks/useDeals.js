import { useState, useEffect } from 'react';

// Mock deals data for the CRM
const mockDeals = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    contactId: 1,
    contactName: 'John Smith',
    value: 120000,
    stage: 'negotiation',
    priority: 'high',
    assignee: 'John Doe',
    candidates: 5,
    probability: 75,
    expectedCloseDate: new Date(2024, 11, 20),
    dueDate: new Date(2024, 11, 20),
    description: 'Looking for an experienced React developer with 5+ years of experience',
    requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    notes: 'Client is looking for someone who can start immediately. Strong React skills required.',
    createdAt: new Date(2024, 10, 15),
    updatedAt: new Date(2024, 11, 10)
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    contactId: 2,
    contactName: 'Sarah Johnson',
    value: 95000,
    stage: 'proposal',
    priority: 'medium',
    assignee: 'Jane Smith',
    candidates: 8,
    probability: 60,
    expectedCloseDate: new Date(2024, 11, 25),
    dueDate: new Date(2024, 11, 25),
    description: 'Creative designer needed for mobile and web applications',
    requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    location: 'New York, NY',
    type: 'full-time',
    remote: false,
    notes: 'Looking for someone with strong portfolio in mobile design.',
    createdAt: new Date(2024, 10, 20),
    updatedAt: new Date(2024, 11, 12)
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'CloudTech Solutions',
    contactId: 3,
    contactName: 'Michael Chen',
    value: 135000,
    stage: 'qualified',
    priority: 'high',
    assignee: 'Mike Johnson',
    candidates: 3,
    probability: 80,
    expectedCloseDate: new Date(2024, 11, 18),
    dueDate: new Date(2024, 11, 18),
    description: 'Experienced backend developer for microservices architecture',
    requirements: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    location: 'Austin, TX',
    type: 'full-time',
    remote: true,
    notes: 'Urgent requirement. Client needs someone with strong Python and cloud experience.',
    createdAt: new Date(2024, 10, 25),
    updatedAt: new Date(2024, 11, 14)
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Infrastructure Inc.',
    contactId: 4,
    contactName: 'Emily Davis',
    value: 140000,
    stage: 'closed-won',
    priority: 'medium',
    assignee: 'Sarah Davis',
    candidates: 2,
    probability: 100,
    expectedCloseDate: new Date(2024, 11, 15),
    dueDate: new Date(2024, 11, 15),
    description: 'DevOps specialist for CI/CD pipeline management',
    requirements: ['AWS', 'Terraform', 'Jenkins', 'Monitoring', 'Security'],
    location: 'Seattle, WA',
    type: 'full-time',
    remote: true,
    notes: 'Successfully placed candidate. Client very satisfied with the match.',
    createdAt: new Date(2024, 10, 10),
    updatedAt: new Date(2024, 11, 8)
  },
  {
    id: 5,
    title: 'Product Manager',
    company: 'StartupXYZ',
    contactId: 5,
    contactName: 'Alex Rodriguez',
    value: 110000,
    stage: 'discovery',
    priority: 'low',
    assignee: 'Alex Brown',
    candidates: 12,
    probability: 30,
    expectedCloseDate: new Date(2024, 11, 30),
    dueDate: new Date(2024, 11, 30),
    description: 'Product manager for B2B SaaS platform',
    requirements: ['Product Strategy', 'Agile', 'Analytics', 'Stakeholder Management'],
    location: 'Remote',
    type: 'full-time',
    remote: true,
    notes: 'Early stage opportunity. Client still defining requirements.',
    createdAt: new Date(2024, 11, 1),
    updatedAt: new Date(2024, 11, 5)
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'Analytics Pro',
    contactId: 6,
    contactName: 'Lisa Wang',
    value: 125000,
    stage: 'closed-lost',
    priority: 'medium',
    assignee: 'Emma Wilson',
    candidates: 4,
    probability: 0,
    expectedCloseDate: new Date(2024, 10, 30),
    dueDate: new Date(2024, 10, 30),
    description: 'Data scientist for machine learning projects',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Visualization'],
    location: 'Boston, MA',
    type: 'full-time',
    remote: false,
    notes: 'Client decided to hire internally. Opportunity lost.',
    createdAt: new Date(2024, 9, 15),
    updatedAt: new Date(2024, 10, 28)
  }
];

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeals(mockDeals);
        setError(null);
      } catch (err) {
        setError('Failed to fetch deals');
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Create a new deal
  const createDeal = async (dealData) => {
    try {
      const newDeal = {
        ...dealData,
        id: Math.max(...deals.map(d => d.id)) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        candidates: 0
      };
      
      setDeals(prev => [...prev, newDeal]);
      return { success: true, data: newDeal };
    } catch (err) {
      console.error('Error creating deal:', err);
      return { success: false, error: 'Failed to create deal' };
    }
  };

  // Update a deal
  const updateDeal = async (dealId, updates) => {
    try {
      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, ...updates, updatedAt: new Date() }
          : deal
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating deal:', err);
      return { success: false, error: 'Failed to update deal' };
    }
  };

  // Delete a deal
  const deleteDeal = async (dealId) => {
    try {
      setDeals(prev => prev.filter(deal => deal.id !== dealId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting deal:', err);
      return { success: false, error: 'Failed to delete deal' };
    }
  };

  // Get deal by ID
  const getDealById = (dealId) => {
    return deals.find(deal => deal.id === parseInt(dealId));
  };

  // Filter deals by stage
  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  // Get deals statistics
  const getDealsStats = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = deals.length;
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
    const lostDeals = deals.filter(deal => deal.stage === 'closed-lost').length;
    const activeDeals = deals.filter(deal => 
      !['closed-won', 'closed-lost'].includes(deal.stage)
    ).length;
    
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    
    return {
      totalValue,
      totalDeals,
      wonDeals,
      lostDeals,
      activeDeals,
      winRate
    };
  };

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    getDealsByStage,
    getDealsStats
  };
};

export default useDeals;