import { Job, PipelineBreakdown } from '../types/recruitment';

// Utility functions for job management
export const jobUtils = {
  // Generate a unique job ID
  generateJobId: (): string => {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create a new job with default values
  createNewJob: (data: Partial<Job>): Job => {
    const now = new Date();
    
    return {
      id: data.id || jobUtils.generateJobId(),
      title: data.title || '',
      client: data.client || '',
      clientContact: data.clientContact,
      department: data.department,
      location: {
        type: data.location?.type || 'onsite',
        city: data.location?.city,
        state: data.location?.state,
        country: data.location?.country || 'India'
      },
      employment: {
        type: data.employment?.type || 'full-time',
        experienceLevel: data.employment?.experienceLevel || 'mid'
      },
      description: data.description,
      requirements: {
        skills: data.requirements?.skills || [],
        experience: data.requirements?.experience,
        education: data.requirements?.education,
        mustHave: data.requirements?.mustHave || [],
        niceToHave: data.requirements?.niceToHave || []
      },
      compensation: {
        salaryRange: data.compensation?.salaryRange,
        benefits: data.compensation?.benefits || [],
        negotiable: data.compensation?.negotiable || false
      },
      status: data.status || 'active',
      priority: data.priority || 'medium',
      applicants: {
        total: 0,
        pipeline: {
          registration: 0,
          resumeSharing: 0,
          shortlisting: 0,
          lineupFeedback: 0,
          selection: 0,
          closure: 0
        }
      },
      postedDate: data.postedDate || now,
      closingDate: data.closingDate,
      expectedStartDate: data.expectedStartDate,
      createdBy: data.createdBy || '',
      assignedRecruiters: data.assignedRecruiters || [],
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now
    };
  },

  // Update job applicant pipeline
  updateJobPipeline: (job: Job, pipeline: Partial<PipelineBreakdown>): Job => {
    const updatedPipeline = {
      ...job.applicants.pipeline,
      ...pipeline
    };
    
    const total = Object.values(updatedPipeline).reduce((sum, count) => sum + count, 0);
    
    return {
      ...job,
      applicants: {
        total,
        pipeline: updatedPipeline
      },
      updatedAt: new Date()
    };
  },

  // Calculate job metrics
  calculateJobMetrics: (job: Job) => {
    const { pipeline } = job.applicants;
    
    // Conversion rates between stages
    const conversionRates = {
      registrationToResumeShare: pipeline.registration > 0 ? (pipeline.resumeSharing / pipeline.registration) * 100 : 0,
      resumeShareToShortlist: pipeline.resumeSharing > 0 ? (pipeline.shortlisting / pipeline.resumeSharing) * 100 : 0,
      shortlistToLineup: pipeline.shortlisting > 0 ? (pipeline.lineupFeedback / pipeline.shortlisting) * 100 : 0,
      lineupToSelection: pipeline.lineupFeedback > 0 ? (pipeline.selection / pipeline.lineupFeedback) * 100 : 0,
      selectionToClosure: pipeline.selection > 0 ? (pipeline.closure / pipeline.selection) * 100 : 0,
      overallConversion: pipeline.registration > 0 ? (pipeline.closure / pipeline.registration) * 100 : 0
    };
    
    // Time metrics
    const daysOpen = Math.ceil((new Date().getTime() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilClosing = job.closingDate ? 
      Math.ceil((job.closingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
    
    // Status indicators
    const isUrgent = job.priority === 'urgent' || (daysUntilClosing !== null && daysUntilClosing <= 7);
    const isStale = daysOpen > 30 && pipeline.registration === 0;
    const isActive = job.status === 'active' || job.status === 'hot-requirement';
    
    return {
      conversionRates,
      daysOpen,
      daysUntilClosing,
      isUrgent,
      isStale,
      isActive,
      fillRate: conversionRates.overallConversion,
      averageTimeToHire: daysOpen // Simplified - could be more sophisticated
    };
  },

  // Format job for display
  formatJobForDisplay: (job: Job) => {
    const metrics = jobUtils.calculateJobMetrics(job);
    
    return {
      ...job,
      displayTitle: job.title,
      displayClient: job.client,
      displayLocation: jobUtils.formatLocation(job.location),
      displaySalary: jobUtils.formatSalaryRange(job.compensation.salaryRange),
      displayStatus: jobUtils.getStatusDisplay(job.status),
      displayPriority: jobUtils.getPriorityDisplay(job.priority),
      metrics,
      statusColor: jobUtils.getStatusColor(job.status),
      priorityColor: jobUtils.getPriorityColor(job.priority)
    };
  },

  // Format location for display
  formatLocation: (location: Job['location']): string => {
    const parts = [];
    
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country && location.country !== 'India') parts.push(location.country);
    
    const locationStr = parts.join(', ');
    
    switch (location.type) {
      case 'remote':
        return `Remote${locationStr ? ` (${locationStr})` : ''}`;
      case 'hybrid':
        return `Hybrid${locationStr ? ` - ${locationStr}` : ''}`;
      case 'onsite':
      default:
        return locationStr || 'Location TBD';
    }
  },

  // Format salary range for display
  formatSalaryRange: (salaryRange?: Job['compensation']['salaryRange']): string => {
    if (!salaryRange) return 'Salary not specified';
    
    const { min, max, currency } = salaryRange;
    const formatAmount = (amount: number) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
      }
      return amount.toString();
    };
    
    if (min === max) {
      return `${currency} ${formatAmount(min)}`;
    }
    
    return `${currency} ${formatAmount(min)} - ${formatAmount(max)}`;
  },

  // Get status display text
  getStatusDisplay: (status: Job['status']): string => {
    const statusMap = {
      'hot-requirement': 'Hot Requirement',
      'active': 'Active',
      'paused': 'Paused',
      'closed': 'Closed',
      'filled': 'Filled'
    };
    
    return statusMap[status] || status;
  },

  // Get priority display text
  getPriorityDisplay: (priority: Job['priority']): string => {
    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'urgent': 'Urgent'
    };
    
    return priorityMap[priority] || priority;
  },

  // Get status color
  getStatusColor: (status: Job['status']): string => {
    const colorMap = {
      'hot-requirement': '#EF4444', // Red
      'active': '#10B981', // Green
      'paused': '#F59E0B', // Yellow
      'closed': '#6B7280', // Gray
      'filled': '#059669' // Dark green
    };
    
    return colorMap[status] || '#6B7280';
  },

  // Get priority color
  getPriorityColor: (priority: Job['priority']): string => {
    const colorMap = {
      'low': '#10B981', // Green
      'medium': '#F59E0B', // Yellow
      'high': '#F97316', // Orange
      'urgent': '#EF4444' // Red
    };
    
    return colorMap[priority] || '#6B7280';
  },

  // Validate job data
  validateJob: (job: Partial<Job>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields
    if (!job.title?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!job.client?.trim()) {
      errors.push('Client name is required');
    }
    
    if (!job.createdBy?.trim()) {
      errors.push('Created by field is required');
    }
    
    // Salary validation
    if (job.compensation?.salaryRange) {
      const { min, max } = job.compensation.salaryRange;
      if (min && max && min > max) {
        errors.push('Minimum salary cannot be greater than maximum salary');
      }
    }
    
    // Date validation
    if (job.closingDate && job.postedDate && job.closingDate < job.postedDate) {
      errors.push('Closing date cannot be before posted date');
    }
    
    if (job.expectedStartDate && job.closingDate && job.expectedStartDate < job.closingDate) {
      errors.push('Expected start date should be after closing date');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Search and filter jobs
  filterJobs: (jobs: Job[], filters: {
    search?: string;
    status?: string[];
    priority?: string[];
    client?: string[];
    location?: string[];
    dateRange?: { start: Date; end: Date };
  }): Job[] => {
    return jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          job.title,
          job.client,
          job.description,
          job.location.city,
          job.location.state,
          ...(job.requirements.skills || []),
          ...(job.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(job.status)) {
          return false;
        }
      }
      
      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(job.priority)) {
          return false;
        }
      }
      
      // Client filter
      if (filters.client && filters.client.length > 0) {
        if (!filters.client.includes(job.client)) {
          return false;
        }
      }
      
      // Location filter
      if (filters.location && filters.location.length > 0) {
        const jobLocation = jobUtils.formatLocation(job.location);
        if (!filters.location.some(loc => jobLocation.includes(loc))) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange) {
        const jobDate = job.postedDate;
        if (jobDate < filters.dateRange.start || jobDate > filters.dateRange.end) {
          return false;
        }
      }
      
      return true;
    });
  },

  // Sort jobs
  sortJobs: (jobs: Job[], sortBy: 'title' | 'client' | 'postedDate' | 'priority' | 'status', order: 'asc' | 'desc' = 'asc'): Job[] => {
    return [...jobs].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'client':
          comparison = a.client.localeCompare(b.client);
          break;
        case 'postedDate':
          comparison = a.postedDate.getTime() - b.postedDate.getTime();
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
  }
};