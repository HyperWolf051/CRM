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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return { recentCandidates, upcomingInterviews, loading, error };
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
        // Mock job data
        const mockJobs = [
          {
            id: '1',
            title: 'Software Engineer',
            client: 'Tech Corp',
            status: 'hot-requirement',
            applicants: { total: 45, pipeline: {} },
            postedDate: new Date('2024-01-10')
          },
          {
            id: '2',
            title: 'Product Manager',
            client: 'StartupXYZ',
            status: 'active',
            applicants: { total: 32, pipeline: {} },
            postedDate: new Date('2024-01-08')
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