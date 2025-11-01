import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

// Mock data for demonstration
const mockOffers = [
  {
    id: '1',
    candidateId: 'c1',
    candidateName: 'John Smith',
    candidateEmail: 'john.smith@email.com',
    candidatePhone: '+1-555-0123',
    candidateAvatar: null,
    jobId: 'j1',
    jobTitle: 'Senior Software Engineer',
    clientName: 'TechCorp Inc.',
    
    offerDetails: {
      position: 'Senior Software Engineer',
      department: 'Engineering',
      startDate: new Date('2024-02-15'),
      salary: {
        base: 120000,
        currency: 'USD',
        frequency: 'annual'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        retirement401k: true,
        paidTimeOff: 25,
        flexibleSchedule: true,
        remoteWork: true,
        stockOptions: {
          granted: true,
          vesting: '4 years with 1 year cliff'
        }
      },
      bonuses: {
        signing: 10000,
        performance: 15000,
        annual: 20000
      }
    },
    
    status: 'sent',
    
    timeline: {
      createdAt: new Date('2024-01-15'),
      sentAt: new Date('2024-01-16'),
      expiryDate: new Date('2024-02-01'),
      respondedAt: null,
      acceptedAt: null,
      declinedAt: null
    },
    
    negotiations: [],
    
    documents: {
      offerLetter: '/documents/offer-letter-1.pdf',
      contract: null,
      additionalDocs: []
    },
    
    approvals: {
      hr: { approved: true, approvedBy: 'HR Manager', approvedAt: new Date('2024-01-15') },
      manager: { approved: true, approvedBy: 'Engineering Manager', approvedAt: new Date('2024-01-15') },
      finance: { approved: false, approvedBy: null, approvedAt: null }
    },
    
    createdBy: 'user1',
    createdByName: 'Sarah Johnson',
    updatedAt: new Date('2024-01-16'),
    notes: 'Candidate has competing offers. Need to expedite approval process.',
    priority: 'high'
  },
  
  {
    id: '2',
    candidateId: 'c2',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    candidatePhone: '+1-555-0124',
    candidateAvatar: null,
    jobId: 'j2',
    jobTitle: 'Product Manager',
    clientName: 'InnovateLabs',
    
    offerDetails: {
      position: 'Senior Product Manager',
      department: 'Product',
      startDate: new Date('2024-03-01'),
      salary: {
        base: 135000,
        currency: 'USD',
        frequency: 'annual'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: false,
        retirement401k: true,
        paidTimeOff: 30,
        flexibleSchedule: true,
        remoteWork: false,
        stockOptions: {
          granted: true,
          vesting: '4 years with 6 month cliff'
        }
      },
      bonuses: {
        signing: 15000,
        performance: 25000,
        annual: 30000
      }
    },
    
    status: 'negotiating',
    
    timeline: {
      createdAt: new Date('2024-01-10'),
      sentAt: new Date('2024-01-12'),
      expiryDate: new Date('2024-02-12'),
      respondedAt: new Date('2024-01-18'),
      acceptedAt: null,
      declinedAt: null
    },
    
    negotiations: [
      {
        id: 'n1',
        initiatedBy: 'candidate',
        type: 'salary',
        originalValue: 135000,
        proposedValue: 150000,
        status: 'pending',
        notes: 'Candidate requesting salary increase due to market rates',
        createdAt: new Date('2024-01-18'),
        resolvedAt: null
      }
    ],
    
    documents: {
      offerLetter: '/documents/offer-letter-2.pdf',
      contract: null,
      additionalDocs: []
    },
    
    approvals: {
      hr: { approved: true, approvedBy: 'HR Manager', approvedAt: new Date('2024-01-10') },
      manager: { approved: true, approvedBy: 'Product Director', approvedAt: new Date('2024-01-11') },
      finance: { approved: true, approvedBy: 'Finance Manager', approvedAt: new Date('2024-01-11') }
    },
    
    createdBy: 'user2',
    createdByName: 'Mike Chen',
    updatedAt: new Date('2024-01-18'),
    notes: 'Strong candidate with multiple offers. Willing to negotiate on salary.',
    priority: 'urgent'
  },

  {
    id: '3',
    candidateId: 'c3',
    candidateName: 'Alex Rodriguez',
    candidateEmail: 'alex.rodriguez@email.com',
    candidatePhone: '+1-555-0125',
    candidateAvatar: null,
    jobId: 'j3',
    jobTitle: 'UX Designer',
    clientName: 'DesignStudio',
    
    offerDetails: {
      position: 'Senior UX Designer',
      department: 'Design',
      startDate: new Date('2024-02-20'),
      salary: {
        base: 95000,
        currency: 'USD',
        frequency: 'annual'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        retirement401k: false,
        paidTimeOff: 20,
        flexibleSchedule: true,
        remoteWork: true,
        stockOptions: {
          granted: false,
          vesting: ''
        }
      },
      bonuses: {
        signing: 5000,
        performance: 8000,
        annual: 10000
      }
    },
    
    status: 'accepted',
    
    timeline: {
      createdAt: new Date('2024-01-05'),
      sentAt: new Date('2024-01-06'),
      expiryDate: new Date('2024-01-20'),
      respondedAt: new Date('2024-01-08'),
      acceptedAt: new Date('2024-01-08'),
      declinedAt: null
    },
    
    negotiations: [],
    
    documents: {
      offerLetter: '/documents/offer-letter-3.pdf',
      contract: '/documents/contract-3.pdf',
      additionalDocs: ['/documents/benefits-summary-3.pdf']
    },
    
    approvals: {
      hr: { approved: true, approvedBy: 'HR Manager', approvedAt: new Date('2024-01-05') },
      manager: { approved: true, approvedBy: 'Design Director', approvedAt: new Date('2024-01-05') },
      finance: { approved: true, approvedBy: 'Finance Manager', approvedAt: new Date('2024-01-05') }
    },
    
    createdBy: 'user1',
    createdByName: 'Sarah Johnson',
    updatedAt: new Date('2024-01-08'),
    notes: 'Quick acceptance. Candidate was very excited about the role and company culture.',
    priority: 'medium'
  },

  {
    id: '4',
    candidateId: 'c4',
    candidateName: 'Lisa Thompson',
    candidateEmail: 'lisa.thompson@email.com',
    candidatePhone: '+1-555-0126',
    candidateAvatar: null,
    jobId: 'j4',
    jobTitle: 'Data Scientist',
    clientName: 'DataDriven Solutions',
    
    offerDetails: {
      position: 'Senior Data Scientist',
      department: 'Analytics',
      startDate: new Date('2024-03-15'),
      salary: {
        base: 140000,
        currency: 'USD',
        frequency: 'annual'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        retirement401k: true,
        paidTimeOff: 28,
        flexibleSchedule: false,
        remoteWork: false,
        stockOptions: {
          granted: true,
          vesting: '3 years with no cliff'
        }
      },
      bonuses: {
        signing: 20000,
        performance: 30000,
        annual: 35000
      }
    },
    
    status: 'draft',
    
    timeline: {
      createdAt: new Date('2024-01-20'),
      sentAt: null,
      expiryDate: new Date('2024-02-20'),
      respondedAt: null,
      acceptedAt: null,
      declinedAt: null
    },
    
    negotiations: [],
    
    documents: {
      offerLetter: null,
      contract: null,
      additionalDocs: []
    },
    
    approvals: {
      hr: { approved: false, approvedBy: null, approvedAt: null },
      manager: { approved: true, approvedBy: 'Analytics Director', approvedAt: new Date('2024-01-20') },
      finance: { approved: false, approvedBy: null, approvedAt: null }
    },
    
    createdBy: 'user3',
    createdByName: 'David Wilson',
    updatedAt: new Date('2024-01-20'),
    notes: 'Waiting for HR and Finance approval before sending offer.',
    priority: 'medium'
  },

  {
    id: '5',
    candidateId: 'c5',
    candidateName: 'Michael Brown',
    candidateEmail: 'michael.brown@email.com',
    candidatePhone: '+1-555-0127',
    candidateAvatar: null,
    jobId: 'j5',
    jobTitle: 'DevOps Engineer',
    clientName: 'CloudFirst Technologies',
    
    offerDetails: {
      position: 'Senior DevOps Engineer',
      department: 'Infrastructure',
      startDate: new Date('2024-01-25'),
      salary: {
        base: 125000,
        currency: 'USD',
        frequency: 'annual'
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: false,
        retirement401k: true,
        paidTimeOff: 22,
        flexibleSchedule: true,
        remoteWork: true,
        stockOptions: {
          granted: false,
          vesting: ''
        }
      },
      bonuses: {
        signing: 8000,
        performance: 12000,
        annual: 15000
      }
    },
    
    status: 'declined',
    
    timeline: {
      createdAt: new Date('2024-01-02'),
      sentAt: new Date('2024-01-03'),
      expiryDate: new Date('2024-01-17'),
      respondedAt: new Date('2024-01-10'),
      acceptedAt: null,
      declinedAt: new Date('2024-01-10')
    },
    
    negotiations: [],
    
    documents: {
      offerLetter: '/documents/offer-letter-5.pdf',
      contract: null,
      additionalDocs: []
    },
    
    approvals: {
      hr: { approved: true, approvedBy: 'HR Manager', approvedAt: new Date('2024-01-02') },
      manager: { approved: true, approvedBy: 'Infrastructure Manager', approvedAt: new Date('2024-01-02') },
      finance: { approved: true, approvedBy: 'Finance Manager', approvedAt: new Date('2024-01-02') }
    },
    
    createdBy: 'user2',
    createdByName: 'Mike Chen',
    updatedAt: new Date('2024-01-10'),
    notes: 'Candidate declined due to better offer from competitor. Salary was the main concern.',
    priority: 'low'
  }
];

// Mock pipeline data
const mockPipelineData = [
  { status: 'draft', count: 8, previousCount: 6, conversionRate: 85 },
  { status: 'sent', count: 12, previousCount: 10, conversionRate: 75 },
  { status: 'under-review', count: 6, previousCount: 8, conversionRate: 60 },
  { status: 'negotiating', count: 4, previousCount: 5, conversionRate: 80 },
  { status: 'accepted', count: 15, previousCount: 12, conversionRate: null },
  { status: 'declined', count: 3, previousCount: 4, conversionRate: null },
  { status: 'expired', count: 2, previousCount: 1, conversionRate: null },
  { status: 'withdrawn', count: 1, previousCount: 2, conversionRate: null }
];

export function useOffers(filters = {}, searchQuery = '') {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOffers = [...mockOffers];
      
      // Apply filters
      if (filters.status && filters.status.length > 0) {
        filteredOffers = filteredOffers.filter(offer => 
          filters.status.includes(offer.status)
        );
      }
      
      if (filters.position && filters.position.length > 0) {
        filteredOffers = filteredOffers.filter(offer => 
          filters.position.includes(offer.offerDetails.position)
        );
      }
      
      if (filters.client && filters.client.length > 0) {
        filteredOffers = filteredOffers.filter(offer => 
          filters.client.includes(offer.clientName)
        );
      }
      
      if (filters.priority && filters.priority.length > 0) {
        filteredOffers = filteredOffers.filter(offer => 
          filters.priority.includes(offer.priority)
        );
      }
      
      if (filters.createdBy && filters.createdBy.length > 0) {
        filteredOffers = filteredOffers.filter(offer => 
          filters.createdBy.includes(offer.createdByName)
        );
      }
      
      if (filters.salaryRange) {
        const { min, max } = filters.salaryRange;
        if (min) {
          filteredOffers = filteredOffers.filter(offer => 
            offer.offerDetails.salary.base >= parseInt(min)
          );
        }
        if (max) {
          filteredOffers = filteredOffers.filter(offer => 
            offer.offerDetails.salary.base <= parseInt(max)
          );
        }
      }
      
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        if (start) {
          filteredOffers = filteredOffers.filter(offer => 
            new Date(offer.timeline.createdAt) >= new Date(start)
          );
        }
        if (end) {
          filteredOffers = filteredOffers.filter(offer => 
            new Date(offer.timeline.createdAt) <= new Date(end)
          );
        }
      }
      
      setOffers(filteredOffers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const createOffer = useCallback(async (offerData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOffer = {
        id: `offer_${Date.now()}`,
        candidateId: offerData.candidateId,
        candidateName: 'New Candidate', // Would come from candidate lookup
        candidateEmail: 'candidate@email.com',
        candidatePhone: '+1-555-0000',
        candidateAvatar: null,
        jobId: offerData.jobId,
        jobTitle: offerData.position,
        clientName: 'New Client', // Would come from job lookup
        
        offerDetails: {
          position: offerData.position,
          department: offerData.department,
          startDate: offerData.startDate,
          salary: offerData.salary,
          benefits: offerData.benefits,
          bonuses: offerData.bonuses
        },
        
        status: 'draft',
        
        timeline: {
          createdAt: new Date(),
          sentAt: null,
          expiryDate: offerData.expiryDate,
          respondedAt: null,
          acceptedAt: null,
          declinedAt: null
        },
        
        negotiations: [],
        
        documents: {
          offerLetter: null,
          contract: null,
          additionalDocs: []
        },
        
        approvals: {
          hr: { approved: false, approvedBy: null, approvedAt: null },
          manager: { approved: false, approvedBy: null, approvedAt: null },
          finance: { approved: false, approvedBy: null, approvedAt: null }
        },
        
        createdBy: user?.id || 'current_user',
        createdByName: user?.name || 'Current User',
        updatedAt: new Date(),
        notes: offerData.notes || '',
        priority: offerData.priority
      };
      
      setOffers(prev => [newOffer, ...prev]);
      return newOffer;
    } catch (error) {
      throw new Error('Failed to create offer');
    }
  }, [user]);

  const updateOffer = useCallback(async (offerId, updates) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, ...updates, updatedAt: new Date() }
          : offer
      ));
    } catch (error) {
      throw new Error('Failed to update offer');
    }
  }, []);

  const deleteOffer = useCallback(async (offerId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (error) {
      throw new Error('Failed to delete offer');
    }
  }, []);

  const extendOffer = useCallback(async (offerId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { 
              ...offer, 
              status: 'sent',
              timeline: {
                ...offer.timeline,
                sentAt: new Date()
              },
              updatedAt: new Date()
            }
          : offer
      ));
    } catch (error) {
      throw new Error('Failed to extend offer');
    }
  }, []);

  const withdrawOffer = useCallback(async (offerId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { 
              ...offer, 
              status: 'withdrawn',
              updatedAt: new Date()
            }
          : offer
      ));
    } catch (error) {
      throw new Error('Failed to withdraw offer');
    }
  }, []);

  const negotiateOffer = useCallback(async (offerId, negotiationData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNegotiation = {
        id: `neg_${Date.now()}`,
        initiatedBy: 'company',
        type: negotiationData.type || 'salary',
        originalValue: negotiationData.originalValue,
        proposedValue: negotiationData.proposedValue,
        status: 'pending',
        notes: negotiationData.notes || '',
        createdAt: new Date(),
        resolvedAt: null
      };
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { 
              ...offer, 
              status: 'negotiating',
              negotiations: [...offer.negotiations, newNegotiation],
              updatedAt: new Date()
            }
          : offer
      ));
    } catch (error) {
      throw new Error('Failed to negotiate offer');
    }
  }, []);

  return {
    offers,
    loading,
    error,
    pipelineData: mockPipelineData,
    createOffer,
    updateOffer,
    deleteOffer,
    extendOffer,
    withdrawOffer,
    negotiateOffer,
    refetch: fetchOffers
  };
}