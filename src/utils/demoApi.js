import { mockContacts, mockDeals, mockDashboardStats, simulateApiDelay } from '@/data/mockData';

// Demo API responses
const demoApiHandlers = {
  // Auth endpoints
  'POST /auth/login': async (data) => {
    await simulateApiDelay(500);
    const { email, password } = data;
    
    const demoCredentials = [
      { email: 'admin@crm.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { email: 'sales@crm.com', password: 'sales123', name: 'Sales User', role: 'user' },
      { email: 'demo@crm.com', password: 'demo123', name: 'Demo User', role: 'user' }
    ];

    const user = demoCredentials.find(cred => cred.email === email && cred.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      data: {
        token: 'demo-token-' + Date.now(),
        user: {
          id: 'demo-user-' + user.role,
          name: user.name,
          email: user.email,
          avatar: null,
          role: user.role,
          isDemo: true
        }
      }
    };
  },

  'GET /auth/me': async () => {
    await simulateApiDelay(300);
    return {
      data: {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@crm.com',
        avatar: null,
        role: 'user',
        isDemo: true
      }
    };
  },

  // Contacts endpoints
  'GET /contacts': async () => {
    await simulateApiDelay(500);
    return {
      data: mockContacts
    };
  },

  'GET /contacts/:id': async (id) => {
    await simulateApiDelay(300);
    const contact = mockContacts.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return {
      data: contact
    };
  },

  'POST /contacts': async (data) => {
    await simulateApiDelay(400);
    const newContact = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockContacts.push(newContact);
    return {
      data: newContact
    };
  },

  'PUT /contacts/:id': async (id, data) => {
    await simulateApiDelay(400);
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    mockContacts[index] = {
      ...mockContacts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return {
      data: mockContacts[index]
    };
  },

  'DELETE /contacts/:id': async (id) => {
    await simulateApiDelay(300);
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    mockContacts.splice(index, 1);
    return {
      data: { message: 'Contact deleted successfully' }
    };
  },

  // Deals endpoints
  'GET /deals': async () => {
    await simulateApiDelay(500);
    return {
      data: mockDeals
    };
  },

  'GET /deals/:id': async (id) => {
    await simulateApiDelay(300);
    const deal = mockDeals.find(d => d.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return {
      data: deal
    };
  },

  'POST /deals': async (data) => {
    await simulateApiDelay(400);
    const newDeal = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockDeals.push(newDeal);
    return {
      data: newDeal
    };
  },

  'PUT /deals/:id': async (id, data) => {
    await simulateApiDelay(400);
    const index = mockDeals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    mockDeals[index] = {
      ...mockDeals[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return {
      data: mockDeals[index]
    };
  },

  'DELETE /deals/:id': async (id) => {
    await simulateApiDelay(300);
    const index = mockDeals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    mockDeals.splice(index, 1);
    return {
      data: { message: 'Deal deleted successfully' }
    };
  },

  // Dashboard endpoints
  'GET /dashboard/stats': async () => {
    await simulateApiDelay(400);
    return {
      data: mockDashboardStats
    };
  },

  'GET /dashboard/metrics': async () => {
    await simulateApiDelay(400);
    return {
      data: {
        ...mockDashboardStats,
        // Additional metrics for enhanced dashboard
        pipelineValue: mockDeals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
          .reduce((sum, deal) => sum + deal.value, 0),
        avgDealSize: mockDeals.length ? mockDeals.reduce((sum, deal) => sum + deal.value, 0) / mockDeals.length : 0,
        conversionRate: mockDeals.length ? 
          (mockDeals.filter(d => d.stage === 'closed_won').length / mockDeals.length) * 100 : 0,
        activitiesThisWeek: 24,
        upcomingTasks: 8,
        overdueItems: 3
      }
    };
  },

  // User endpoints
  'PUT /users/me': async (data) => {
    await simulateApiDelay(400);
    return {
      data: {
        id: 'demo-user',
        name: data.name || 'Demo User',
        email: data.email || 'demo@crm.com',
        avatar: data.avatar || null,
        role: 'user',
        isDemo: true,
        ...data
      }
    };
  },

  // Calendar endpoints
  'GET /calendar/events': async () => {
    await simulateApiDelay(400);
    return {
      data: [
        {
          id: '1',
          title: 'Sales Call with TechCorp',
          type: 'call',
          date: '2024-02-15',
          time: '10:00',
          duration: 60,
          attendees: ['John Smith'],
          companyName: 'TechCorp Inc.',
          dealName: 'Enterprise Software License',
          location: 'Phone Call',
          description: 'Discuss pricing and implementation timeline',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Product Demo - Cloud Migration',
          type: 'meeting',
          date: '2024-02-16',
          time: '14:30',
          duration: 90,
          attendees: ['Sarah Johnson', 'Mike Wilson'],
          companyName: 'Innovate Solutions',
          dealName: 'Cloud Migration Project',
          location: 'Conference Room A',
          description: 'Demonstrate our cloud migration capabilities',
          status: 'scheduled',
          priority: 'high'
        }
      ]
    };
  },

  'POST /calendar/events': async (data) => {
    await simulateApiDelay(400);
    return {
      data: {
        id: Date.now().toString(),
        ...data,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }
    };
  },

  // Additional endpoints that might be called
  'POST /auth/logout': async () => {
    await simulateApiDelay(200);
    return {
      data: { message: 'Logged out successfully' }
    };
  },

  'POST /auth/register': async (data) => {
    await simulateApiDelay(500);
    const { name, email, password } = data;
    
    // Check if email already exists
    const existingUser = mockContacts.find(c => c.email === email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    return {
      data: {
        token: 'demo-token-' + Date.now(),
        user: {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email,
          avatar: null,
          role: 'user',
          isDemo: true
        }
      }
    };
  },

  'PATCH /deals/:id/stage': async (id, data) => {
    await simulateApiDelay(300);
    const index = mockDeals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    mockDeals[index] = {
      ...mockDeals[index],
      stage: data.stage,
      updatedAt: new Date().toISOString()
    };
    return {
      data: mockDeals[index]
    };
  },

  'PUT /users/me/password': async (data) => {
    await simulateApiDelay(400);
    // In demo mode, just simulate success
    return {
      data: { message: 'Password updated successfully' }
    };
  },

  'PUT /users/me/preferences': async (data) => {
    await simulateApiDelay(400);
    return {
      data: { message: 'Preferences updated successfully' }
    };
  },

  'GET /': async () => {
    await simulateApiDelay(200);
    return {
      data: { message: 'Demo API is working' }
    };
  },

  'GET /health': async () => {
    await simulateApiDelay(100);
    return {
      data: { status: 'ok', mode: 'demo' }
    };
  }
};

// Helper function to match route patterns
const matchRoute = (pattern, path) => {
  // Remove leading/trailing slashes and split
  const normalizePattern = pattern.replace(/^\/|\/$/g, '');
  const normalizePath = path.replace(/^\/|\/$/g, '');
  
  const patternParts = normalizePattern ? normalizePattern.split('/') : [];
  const pathParts = normalizePath ? normalizePath.split('/') : [];
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  const params = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  
  return params;
};

// Main demo API handler
export const handleDemoApiCall = async (method, url, data) => {
  const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
  
  if (!isDemoMode) {
    return null; // Let the real API handle it
  }
  
  console.log('Demo API call:', method, url, data);
  
  // Find matching handler
  for (const [handlerKey, handler] of Object.entries(demoApiHandlers)) {
    const [handlerMethod, handlerPath] = handlerKey.split(' ');
    
    if (handlerMethod === method) {
      const params = matchRoute(handlerPath, url);
      if (params !== null) {
        try {
          // Extract path parameters
          const paramValues = Object.values(params);
          console.log('Matched handler:', handlerKey, 'params:', params);
          const result = await handler(...paramValues, data);
          console.log('Demo API result:', result);
          return result;
        } catch (error) {
          console.error('Demo API handler error:', error);
          throw {
            response: {
              status: 400,
              data: { message: error.message }
            }
          };
        }
      }
    }
  }
  
  // If no handler found, return 404
  console.warn('No demo API handler found for:', method, url);
  throw {
    response: {
      status: 404,
      data: { message: `Demo API endpoint not found: ${method} ${url}` }
    }
  };
};

export const isDemoMode = () => {
  return localStorage.getItem('isDemoMode') === 'true';
};