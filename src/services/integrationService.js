/**
 * Integration Service
 * Handles REST API, webhooks, and third-party integrations
 */

// API Rate Limiting Configuration
const RATE_LIMITS = {
  default: { requests: 100, window: 60000 }, // 100 requests per minute
  premium: { requests: 1000, window: 60000 }, // 1000 requests per minute
  enterprise: { requests: 10000, window: 60000 } // 10000 requests per minute
};

// Rate limiter state
const rateLimitState = new Map();

/**
 * Check if request is within rate limit
 */
export const checkRateLimit = (apiKey, tier = 'default') => {
  const now = Date.now();
  const limit = RATE_LIMITS[tier] || RATE_LIMITS.default;
  
  if (!rateLimitState.has(apiKey)) {
    rateLimitState.set(apiKey, { count: 0, windowStart: now });
  }
  
  const state = rateLimitState.get(apiKey);
  
  // Reset window if expired
  if (now - state.windowStart > limit.window) {
    state.count = 0;
    state.windowStart = now;
  }
  
  // Check limit
  if (state.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: state.windowStart + limit.window
    };
  }
  
  state.count++;
  return {
    allowed: true,
    remaining: limit.requests - state.count,
    resetAt: state.windowStart + limit.window
  };
};

/**
 * REST API Service
 */
export const restApiService = {
  // Candidates API
  getCandidates: async (apiKey, filters = {}) => {
    const rateCheck = checkRateLimit(apiKey);
    if (!rateCheck.allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    // Simulate API call
    return {
      data: [],
      meta: {
        total: 0,
        page: filters.page || 1,
        perPage: filters.perPage || 20
      },
      rateLimit: rateCheck
    };
  },
  
  createCandidate: async (apiKey, candidateData) => {
    const rateCheck = checkRateLimit(apiKey);
    if (!rateCheck.allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    return {
      data: { id: Date.now(), ...candidateData },
      rateLimit: rateCheck
    };
  },
  
  updateCandidate: async (apiKey, candidateId, updates) => {
    const rateCheck = checkRateLimit(apiKey);
    if (!rateCheck.allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    return {
      data: { id: candidateId, ...updates },
      rateLimit: rateCheck
    };
  },
  
  // Jobs API
  getJobs: async (apiKey, filters = {}) => {
    const rateCheck = checkRateLimit(apiKey);
    if (!rateCheck.allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    return {
      data: [],
      meta: {
        total: 0,
        page: filters.page || 1,
        perPage: filters.perPage || 20
      },
      rateLimit: rateCheck
    };
  },
  
  // Interviews API
  getInterviews: async (apiKey, filters = {}) => {
    const rateCheck = checkRateLimit(apiKey);
    if (!rateCheck.allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    return {
      data: [],
      rateLimit: rateCheck
    };
  }
};

/**
 * Webhook Service
 */
export const webhookService = {
  // Registered webhooks
  webhooks: new Map(),
  
  // Register a webhook
  register: (event, url, secret) => {
    const id = `webhook_${Date.now()}`;
    webhookService.webhooks.set(id, {
      id,
      event,
      url,
      secret,
      active: true,
      createdAt: new Date()
    });
    return id;
  },
  
  // Trigger webhook
  trigger: async (event, payload) => {
    const webhooks = Array.from(webhookService.webhooks.values())
      .filter(w => w.active && w.event === event);
    
    const results = await Promise.allSettled(
      webhooks.map(webhook => 
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': webhook.secret
          },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data: payload
          })
        })
      )
    );
    
    return results;
  },
  
  // List webhooks
  list: () => {
    return Array.from(webhookService.webhooks.values());
  },
  
  // Delete webhook
  delete: (id) => {
    return webhookService.webhooks.delete(id);
  }
};

/**
 * Integration Marketplace
 */
export const integrationMarketplace = {
  // Available integrations
  integrations: [
    {
      id: 'workday',
      name: 'Workday',
      category: 'hr-tools',
      description: 'Sync candidates and employee data with Workday',
      icon: '💼',
      status: 'available',
      features: ['Two-way sync', 'Real-time updates', 'Custom field mapping']
    },
    {
      id: 'bamboohr',
      name: 'BambooHR',
      category: 'hr-tools',
      description: 'Integrate with BambooHR for seamless HR management',
      icon: '🎋',
      status: 'available',
      features: ['Employee sync', 'Onboarding automation', 'Document management']
    },
    {
      id: 'indeed',
      name: 'Indeed',
      category: 'job-boards',
      description: 'Post jobs and import candidates from Indeed',
      icon: '🔍',
      status: 'available',
      features: ['Job posting', 'Candidate import', 'Application tracking']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'job-boards',
      description: 'Connect with LinkedIn for job posting and candidate sourcing',
      icon: '💼',
      status: 'available',
      features: ['Job posting', 'Candidate search', 'Profile import']
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      category: 'job-boards',
      description: 'Post jobs and manage employer brand on Glassdoor',
      icon: '🏢',
      status: 'available',
      features: ['Job posting', 'Review management', 'Employer branding']
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Get notifications and updates in Slack',
      icon: '💬',
      status: 'available',
      features: ['Real-time notifications', 'Team collaboration', 'Bot commands']
    },
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'video-conferencing',
      description: 'Schedule and manage video interviews with Zoom',
      icon: '📹',
      status: 'available',
      features: ['Auto-scheduling', 'Meeting links', 'Recording integration']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      category: 'calendar',
      description: 'Sync interviews and events with Google Calendar',
      icon: '📅',
      status: 'available',
      features: ['Two-way sync', 'Automatic reminders', 'Availability checking']
    }
  ],
  
  // Get all integrations
  getAll: () => {
    return integrationMarketplace.integrations;
  },
  
  // Get by category
  getByCategory: (category) => {
    return integrationMarketplace.integrations.filter(i => i.category === category);
  },
  
  // Get by ID
  getById: (id) => {
    return integrationMarketplace.integrations.find(i => i.id === id);
  }
};

/**
 * HR Tools Integration
 */
export const hrToolsIntegration = {
  // Workday integration
  workday: {
    connect: async (credentials) => {
      // Simulate connection
      return { connected: true, message: 'Connected to Workday' };
    },
    
    syncCandidates: async () => {
      // Simulate sync
      return { synced: 0, message: 'Sync completed' };
    },
    
    exportEmployee: async (candidateId) => {
      // Simulate export
      return { success: true, employeeId: `WD_${candidateId}` };
    }
  },
  
  // BambooHR integration
  bamboohr: {
    connect: async (credentials) => {
      return { connected: true, message: 'Connected to BambooHR' };
    },
    
    syncEmployees: async () => {
      return { synced: 0, message: 'Sync completed' };
    },
    
    createEmployee: async (candidateData) => {
      return { success: true, employeeId: `BHR_${Date.now()}` };
    }
  }
};

/**
 * Job Board Integration
 */
export const jobBoardIntegration = {
  // Indeed integration
  indeed: {
    connect: async (apiKey) => {
      return { connected: true, message: 'Connected to Indeed' };
    },
    
    postJob: async (jobData) => {
      return { 
        success: true, 
        jobId: `IND_${Date.now()}`,
        url: `https://indeed.com/job/${Date.now()}`
      };
    },
    
    importCandidates: async (jobId) => {
      return { imported: 0, candidates: [] };
    }
  },
  
  // LinkedIn integration
  linkedin: {
    connect: async (credentials) => {
      return { connected: true, message: 'Connected to LinkedIn' };
    },
    
    postJob: async (jobData) => {
      return { 
        success: true, 
        jobId: `LI_${Date.now()}`,
        url: `https://linkedin.com/jobs/${Date.now()}`
      };
    },
    
    searchCandidates: async (criteria) => {
      return { results: [], total: 0 };
    }
  },
  
  // Glassdoor integration
  glassdoor: {
    connect: async (credentials) => {
      return { connected: true, message: 'Connected to Glassdoor' };
    },
    
    postJob: async (jobData) => {
      return { 
        success: true, 
        jobId: `GD_${Date.now()}`,
        url: `https://glassdoor.com/job/${Date.now()}`
      };
    }
  }
};

/**
 * Custom Fields System
 */
export const customFieldsService = {
  fields: new Map(),
  
  // Create custom field
  create: (fieldConfig) => {
    const id = `field_${Date.now()}`;
    const field = {
      id,
      ...fieldConfig,
      createdAt: new Date()
    };
    customFieldsService.fields.set(id, field);
    return field;
  },
  
  // Get all custom fields
  getAll: (entityType) => {
    return Array.from(customFieldsService.fields.values())
      .filter(f => !entityType || f.entityType === entityType);
  },
  
  // Update custom field
  update: (id, updates) => {
    const field = customFieldsService.fields.get(id);
    if (field) {
      Object.assign(field, updates);
      return field;
    }
    return null;
  },
  
  // Delete custom field
  delete: (id) => {
    return customFieldsService.fields.delete(id);
  }
};

/**
 * Import/Export System
 */
export const importExportService = {
  // Export data
  export: async (entityType, format = 'csv', filters = {}) => {
    // Simulate export
    const data = [];
    
    if (format === 'csv') {
      return {
        format: 'csv',
        data: convertToCSV(data),
        filename: `${entityType}_export_${Date.now()}.csv`
      };
    } else if (format === 'json') {
      return {
        format: 'json',
        data: JSON.stringify(data, null, 2),
        filename: `${entityType}_export_${Date.now()}.json`
      };
    } else if (format === 'excel') {
      return {
        format: 'excel',
        data: data,
        filename: `${entityType}_export_${Date.now()}.xlsx`
      };
    }
  },
  
  // Import data
  import: async (entityType, data, format = 'csv') => {
    // Simulate import
    return {
      success: true,
      imported: 0,
      failed: 0,
      errors: []
    };
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => JSON.stringify(row[header] || '')).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};

export default {
  restApiService,
  webhookService,
  integrationMarketplace,
  hrToolsIntegration,
  jobBoardIntegration,
  customFieldsService,
  importExportService,
  checkRateLimit
};
