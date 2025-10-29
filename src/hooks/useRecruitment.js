import { useState, useEffect } from 'react';

// Mock data for recruitment dashboard
const mockRecruitmentData = {
  metrics: {
    totalCandidates: 1247,
    activeJobs: 23,
    interviewsScheduled: 8,
    offersExtended: 5,
    placementsMade: 18,
    conversionRate: 12.5,
    trends: {
      candidates: { value: 12, direction: 'up', period: 'this month' },
      jobs: { value: 8, direction: 'up', period: 'this week' },
      interviews: { value: 5, direction: 'down', period: 'this week' },
      offers: { value: 15, direction: 'up', period: 'this month' }
    },
    sparklineData: {
      candidates: [1180, 1195, 1210, 1185, 1220, 1205, 1235, 1215, 1240, 1247],
      jobs: [18, 20, 19, 21, 22, 20, 23, 21, 22, 23],
      interviews: [12, 10, 15, 11, 9, 13, 8, 10, 9, 8],
      offers: [3, 4, 2, 5, 4, 6, 3, 4, 5, 5]
    }
  },
  pipelineData: [
    { stage: 'Registration', count: 150, color: 'bg-blue-500', conversionRate: 100 },
    { stage: 'Resume Share', count: 120, color: 'bg-purple-500', conversionRate: 80 },
    { stage: 'Shortlisting', count: 85, color: 'bg-amber-500', conversionRate: 71 },
    { stage: 'Interview', count: 45, color: 'bg-cyan-500', conversionRate: 53 },
    { stage: 'Selection', count: 25, color: 'bg-green-500', conversionRate: 56 },
    { stage: 'Placement', count: 18, color: 'bg-emerald-600', conversionRate: 72 }
  ],
  recentCandidates: [
    {
      id: '1',
      name: 'Tanishka Negi',
      position: 'Software Engineer',
      status: 'shortlisted',
      appliedDate: '2024-01-15',
      rating: 4.5,
      avatar: null
    },
    {
      id: '2', 
      name: 'Rahul Sharma',
      position: 'Product Manager',
      status: 'interviewed',
      appliedDate: '2024-01-14',
      rating: 4.2,
      avatar: null
    },
    {
      id: '3',
      name: 'Priya Patel',
      position: 'UI/UX Designer',
      status: 'new',
      appliedDate: '2024-01-13',
      rating: 4.0,
      avatar: null
    }
  ],
  upcomingInterviews: [
    {
      id: '1',
      candidateName: 'Tanishka Negi',
      position: 'Software Engineer',
      dateTime: '2024-01-16T10:00:00',
      type: 'video',
      interviewer: 'John Doe'
    },
    {
      id: '2',
      candidateName: 'Rahul Sharma', 
      position: 'Product Manager',
      dateTime: '2024-01-16T14:30:00',
      type: 'phone',
      interviewer: 'Jane Smith'
    },
    {
      id: '3',
      candidateName: 'Priya Patel',
      position: 'UI/UX Designer',
      dateTime: '2024-01-17T09:00:00',
      type: 'in-person',
      interviewer: 'Mike Johnson'
    }
  ],
  recentActivities: [
    {
      id: '1',
      type: 'candidate-added',
      title: 'New candidate added',
      description: 'Tanishka Negi applied for Software Engineer position',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      candidateId: '1',
      jobId: '1'
    },
    {
      id: '2',
      type: 'interview-scheduled',
      title: 'Interview scheduled',
      description: 'Video interview with Rahul Sharma for Product Manager',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      candidateId: '2',
      jobId: '2'
    },
    {
      id: '3',
      type: 'email-sent',
      title: 'Email sent',
      description: 'Follow-up email sent to Priya Patel',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      candidateId: '3'
    },
    {
      id: '4',
      type: 'status-updated',
      title: 'Status updated',
      description: 'Sarah Johnson moved to Interview stage',
      user: 'Lisa Chen',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      candidateId: '4'
    },
    {
      id: '5',
      type: 'note-added',
      title: 'Note added',
      description: 'Added interview feedback for Alex Wilson',
      user: 'David Brown',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      candidateId: '5'
    },
    {
      id: '6',
      type: 'offer-sent',
      title: 'Offer sent',
      description: 'Job offer sent to Maria Garcia for Senior Developer',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      candidateId: '6',
      jobId: '3'
    }
  ]
};

export function useRecruitmentMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setMetrics(mockRecruitmentData.metrics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}

export function useRecruitmentPipeline() {
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchPipelineData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setPipelineData(mockRecruitmentData.pipelineData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
  }, []);

  return { pipelineData, loading, error };
}

export function useRecentActivity() {
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 200));
        setRecentCandidates(mockRecruitmentData.recentCandidates);
        setUpcomingInterviews(mockRecruitmentData.upcomingInterviews);
        setRecentActivities(mockRecruitmentData.recentActivities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return { recentCandidates, upcomingInterviews, recentActivities, loading, error };
}

export function useCandidates(filters = {}) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Simulate API call with filters
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        // In real implementation, this would filter based on the filters parameter
        setCandidates(mockRecruitmentData.recentCandidates);
        setTotalCount(mockRecruitmentData.recentCandidates.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [filters]);

  return { candidates, loading, error, totalCount };
}

export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Simulate API call with filters
    const fetchJobs = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Enhanced mock job data with pipeline information
        const mockJobs = [
          {
            id: '1',
            title: 'Senior React Developer',
            client: 'TechCorp Solutions',
            department: 'Engineering',
            location: 'Bengaluru, Karnataka',
            employmentType: 'Full-time',
            experienceLevel: 'Senior',
            status: 'hot-requirement',
            priority: 'urgent',
            postedDate: new Date('2024-01-10'),
            closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            minSalary: 1800000,
            maxSalary: 2500000,
            applicants: { 
              total: 45, 
              pipeline: {
                registration: 45,
                resumeSharing: 32,
                shortlisting: 18,
                lineupFeedback: 12,
                selection: 8,
                closure: 3
              }
            }
          },
          {
            id: '2',
            title: 'Product Manager',
            client: 'StartupXYZ',
            department: 'Product',
            location: 'Mumbai, Maharashtra',
            employmentType: 'Full-time',
            experienceLevel: 'Mid-level',
            status: 'active',
            priority: 'high',
            postedDate: new Date('2024-01-08'),
            closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            minSalary: 1500000,
            maxSalary: 2200000,
            applicants: { 
              total: 32, 
              pipeline: {
                registration: 32,
                resumeSharing: 25,
                shortlisting: 15,
                lineupFeedback: 8,
                selection: 4,
                closure: 1
              }
            }
          },
          {
            id: '3',
            title: 'UI/UX Designer',
            client: 'Design Studio Pro',
            department: 'Design',
            location: 'Remote',
            employmentType: 'Contract',
            experienceLevel: 'Mid-level',
            status: 'hot-requirement',
            priority: 'urgent',
            postedDate: new Date('2024-01-12'),
            closingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            minSalary: 800000,
            maxSalary: 1200000,
            applicants: { 
              total: 28, 
              pipeline: {
                registration: 28,
                resumeSharing: 22,
                shortlisting: 16,
                lineupFeedback: 10,
                selection: 5,
                closure: 2
              }
            }
          },
          {
            id: '4',
            title: 'DevOps Engineer',
            client: 'CloudTech Inc',
            department: 'Infrastructure',
            location: 'Hyderabad, Telangana',
            employmentType: 'Full-time',
            experienceLevel: 'Senior',
            status: 'active',
            priority: 'medium',
            postedDate: new Date('2024-01-05'),
            closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            minSalary: 2000000,
            maxSalary: 2800000,
            applicants: { 
              total: 22, 
              pipeline: {
                registration: 22,
                resumeSharing: 18,
                shortlisting: 12,
                lineupFeedback: 7,
                selection: 3,
                closure: 0
              }
            }
          }
        ];
        setJobs(mockJobs);
        setTotalCount(mockJobs.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  return { jobs, loading, error, totalCount };
}

// Search functionality for candidates and jobs
export function useRecruitment() {
  const searchCandidatesAndJobs = async (query) => {
    // Simulate API search
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allCandidates = [
      ...mockRecruitmentData.recentCandidates,
      {
        id: '4',
        name: 'Sarah Johnson',
        position: 'Data Scientist',
        status: 'new',
        appliedDate: '2024-01-12',
        rating: 4.3
      },
      {
        id: '5',
        name: 'Mike Chen',
        position: 'DevOps Engineer',
        status: 'interviewed',
        appliedDate: '2024-01-11',
        rating: 4.1
      }
    ];

    const allJobs = [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'New York, NY'
      },
      {
        id: '3',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Remote'
      },
      {
        id: '4',
        title: 'Data Scientist',
        company: 'Analytics Inc',
        location: 'Boston, MA'
      }
    ];

    const queryLower = query.toLowerCase();
    
    const filteredCandidates = allCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(queryLower) ||
      candidate.position.toLowerCase().includes(queryLower)
    );

    const filteredJobs = allJobs.filter(job =>
      job.title.toLowerCase().includes(queryLower) ||
      job.company.toLowerCase().includes(queryLower) ||
      job.location.toLowerCase().includes(queryLower)
    );

    return {
      candidates: filteredCandidates.slice(0, 5), // Limit to 5 results
      jobs: filteredJobs.slice(0, 5)
    };
  };

  const getUpcomingInterviews = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockRecruitmentData.upcomingInterviews;
  };

  return {
    searchCandidatesAndJobs,
    getUpcomingInterviews
  };
}