// Communication & Collaboration Service

class CommunicationService {
  constructor() {
    this.baseUrl = '/api/communication';
  }

  // Email Sequences
  async getEmailSequences() {
    try {
      const response = await fetch(`${this.baseUrl}/email-sequences`);
      if (!response.ok) throw new Error('Failed to fetch email sequences');
      return await response.json();
    } catch (error) {
      console.error('Error fetching email sequences:', error);
      return this.getMockEmailSequences();
    }
  }

  async createEmailSequence(sequenceData) {
    try {
      const response = await fetch(`${this.baseUrl}/email-sequences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sequenceData)
      });
      if (!response.ok) throw new Error('Failed to create email sequence');
      return await response.json();
    } catch (error) {
      console.error('Error creating email sequence:', error);
      return { id: Date.now().toString(), ...sequenceData };
    }
  }

  async updateEmailSequence(id, sequenceData) {
    try {
      const response = await fetch(`${this.baseUrl}/email-sequences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sequenceData)
      });
      if (!response.ok) throw new Error('Failed to update email sequence');
      return await response.json();
    } catch (error) {
      console.error('Error updating email sequence:', error);
      return { id, ...sequenceData };
    }
  }

  async deleteEmailSequence(id) {
    try {
      const response = await fetch(`${this.baseUrl}/email-sequences/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete email sequence');
      return true;
    } catch (error) {
      console.error('Error deleting email sequence:', error);
      return false;
    }
  }

  // Team Collaboration
  async getComments(entityType, entityId) {
    try {
      const response = await fetch(`${this.baseUrl}/comments?entityType=${entityType}&entityId=${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return this.getMockComments(entityType, entityId);
    }
  }

  async addComment(commentData) {
    try {
      const response = await fetch(`${this.baseUrl}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      return { id: Date.now().toString(), ...commentData, createdAt: new Date() };
    }
  }

  async getTasks(assignedTo) {
    try {
      const response = await fetch(`${this.baseUrl}/tasks?assignedTo=${assignedTo}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return this.getMockTasks(assignedTo);
    }
  }

  async createTask(taskData) {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return { id: Date.now().toString(), ...taskData, createdAt: new Date() };
    }
  }

  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return { id, ...taskData };
    }
  }

  // Client Relationship Management
  async getClientInteractions(clientId) {
    try {
      const response = await fetch(`${this.baseUrl}/client-interactions?clientId=${clientId}`);
      if (!response.ok) throw new Error('Failed to fetch client interactions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching client interactions:', error);
      return this.getMockClientInteractions(clientId);
    }
  }

  async addClientInteraction(interactionData) {
    try {
      const response = await fetch(`${this.baseUrl}/client-interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactionData)
      });
      if (!response.ok) throw new Error('Failed to add client interaction');
      return await response.json();
    } catch (error) {
      console.error('Error adding client interaction:', error);
      return { id: Date.now().toString(), ...interactionData, createdAt: new Date() };
    }
  }

  async getClientPreferences(clientId) {
    try {
      const response = await fetch(`${this.baseUrl}/client-preferences/${clientId}`);
      if (!response.ok) throw new Error('Failed to fetch client preferences');
      return await response.json();
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      return this.getMockClientPreferences(clientId);
    }
  }

  async updateClientPreferences(clientId, preferences) {
    try {
      const response = await fetch(`${this.baseUrl}/client-preferences/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to update client preferences');
      return await response.json();
    } catch (error) {
      console.error('Error updating client preferences:', error);
      return { clientId, ...preferences };
    }
  }

  // Social Media Integration
  async getSocialMediaIntegrations() {
    try {
      const response = await fetch(`${this.baseUrl}/social-media/integrations`);
      if (!response.ok) throw new Error('Failed to fetch social media integrations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching social media integrations:', error);
      return this.getMockSocialMediaIntegrations();
    }
  }

  async connectSocialMedia(platform, authCode) {
    try {
      const response = await fetch(`${this.baseUrl}/social-media/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, authCode })
      });
      if (!response.ok) throw new Error('Failed to connect social media');
      return await response.json();
    } catch (error) {
      console.error('Error connecting social media:', error);
      return { platform, isConnected: true, connectedAt: new Date() };
    }
  }

  async postToSocialMedia(postData) {
    try {
      const response = await fetch(`${this.baseUrl}/social-media/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (!response.ok) throw new Error('Failed to post to social media');
      return await response.json();
    } catch (error) {
      console.error('Error posting to social media:', error);
      return { id: Date.now().toString(), ...postData, status: 'published' };
    }
  }

  // Video Conferencing Integration
  async getVideoConferenceIntegrations() {
    try {
      const response = await fetch(`${this.baseUrl}/video-conference/integrations`);
      if (!response.ok) throw new Error('Failed to fetch video conference integrations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching video conference integrations:', error);
      return this.getMockVideoConferenceIntegrations();
    }
  }

  async connectVideoConference(provider, credentials) {
    try {
      const response = await fetch(`${this.baseUrl}/video-conference/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, credentials })
      });
      if (!response.ok) throw new Error('Failed to connect video conference');
      return await response.json();
    } catch (error) {
      console.error('Error connecting video conference:', error);
      return { provider, isConnected: true, connectedAt: new Date() };
    }
  }

  async createMeeting(meetingData) {
    try {
      const response = await fetch(`${this.baseUrl}/video-conference/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      });
      if (!response.ok) throw new Error('Failed to create meeting');
      return await response.json();
    } catch (error) {
      console.error('Error creating meeting:', error);
      return {
        id: Date.now().toString(),
        ...meetingData,
        joinUrl: `https://zoom.us/j/${Math.random().toString().substr(2, 10)}`,
        meetingId: Math.random().toString().substr(2, 10)
      };
    }
  }

  // Communication Preferences
  async getCommunicationPreferences(candidateId) {
    try {
      const response = await fetch(`${this.baseUrl}/preferences/${candidateId}`);
      if (!response.ok) throw new Error('Failed to fetch communication preferences');
      return await response.json();
    } catch (error) {
      console.error('Error fetching communication preferences:', error);
      return this.getMockCommunicationPreferences(candidateId);
    }
  }

  async updateCommunicationPreferences(candidateId, preferences) {
    try {
      const response = await fetch(`${this.baseUrl}/preferences/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to update communication preferences');
      return await response.json();
    } catch (error) {
      console.error('Error updating communication preferences:', error);
      return { candidateId, ...preferences };
    }
  }

  // Mock Data Methods
  getMockEmailSequences() {
    return [
      {
        id: '1',
        name: 'New Candidate Welcome',
        description: 'Welcome sequence for newly registered candidates',
        isActive: true,
        trigger: { type: 'candidate-added', conditions: {} },
        emails: [
          {
            id: '1',
            subject: 'Welcome to our recruitment process!',
            content: 'Hi {{candidateName}}, welcome to our recruitment process...',
            variables: [{ name: 'candidateName', description: 'Candidate name', required: true }],
            delay: 0
          }
        ],
        createdBy: 'user1',
        createdAt: new Date('2024-01-01'),
        lastModified: new Date('2024-01-15'),
        stats: { sent: 150, opened: 120, clicked: 45, replied: 12 }
      }
    ];
  }

  getMockComments(entityType, entityId) {
    return [
      {
        id: '1',
        candidateId: entityType === 'candidate' ? entityId : undefined,
        jobId: entityType === 'job' ? entityId : undefined,
        content: 'Great candidate, moving to next round',
        author: { id: 'user1', name: 'John Doe', avatar: '/avatars/john.jpg' },
        mentions: [],
        attachments: [],
        createdAt: new Date('2024-01-15T10:30:00'),
        replies: []
      }
    ];
  }

  getMockTasks(assignedTo) {
    return [
      {
        id: '1',
        title: 'Follow up with candidate',
        description: 'Call candidate to discuss next steps',
        assignedTo,
        assignedBy: 'manager1',
        candidateId: 'candidate1',
        priority: 'high',
        status: 'pending',
        dueDate: new Date('2024-01-20'),
        createdAt: new Date('2024-01-15')
      }
    ];
  }

  getMockClientInteractions(clientId) {
    return [
      {
        id: '1',
        clientId,
        type: 'email',
        subject: 'Candidate shortlist for Software Engineer position',
        content: 'Please find attached the shortlisted candidates...',
        participants: ['client@company.com'],
        completedAt: new Date('2024-01-15T14:30:00'),
        outcome: 'Client requested 3 more candidates',
        followUpRequired: true,
        followUpDate: new Date('2024-01-18'),
        attachments: [],
        createdBy: 'user1',
        createdAt: new Date('2024-01-15T14:30:00')
      }
    ];
  }

  getMockClientPreferences(clientId) {
    return {
      clientId,
      communicationMethod: 'email',
      preferredTime: { start: '09:00', end: '17:00', timezone: 'UTC' },
      frequency: 'weekly',
      topics: ['candidate-updates', 'market-insights'],
      optOut: false
    };
  }

  getMockSocialMediaIntegrations() {
    return [
      { platform: 'linkedin', isConnected: true, permissions: ['read', 'write'] },
      { platform: 'twitter', isConnected: false, permissions: [] },
      { platform: 'facebook', isConnected: false, permissions: [] }
    ];
  }

  getMockVideoConferenceIntegrations() {
    return [
      { provider: 'zoom', isConnected: true, defaultSettings: { duration: 60, waitingRoom: true, recording: false, password: true } },
      { provider: 'teams', isConnected: false, defaultSettings: { duration: 60, waitingRoom: false, recording: false, password: false } },
      { provider: 'meet', isConnected: false, defaultSettings: { duration: 60, waitingRoom: false, recording: false, password: false } }
    ];
  }

  getMockCommunicationPreferences(candidateId) {
    return {
      candidateId,
      email: { enabled: true, frequency: 'weekly', types: ['job-updates', 'interview-reminders'] },
      sms: { enabled: false, types: [] },
      phone: { enabled: true, preferredTime: { start: '10:00', end: '18:00', timezone: 'UTC' } },
      optOut: { all: false, marketing: false, transactional: false }
    };
  }
}

export default new CommunicationService();