import { useState, useEffect, useCallback } from 'react';

// Mock interview data with recruitment workflow integration
const mockInterviews = [
  {
    id: '1',
    candidateId: '1',
    candidateName: 'Tanishka Negi',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    client: 'TechCorp Solutions',
    type: 'video',
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // Tomorrow 2 PM
    duration: 60,
    interviewer: {
      id: '1',
      name: 'John Doe',
      email: 'john@techcorp.com',
      role: 'Technical Lead',
      avatar: null
    },
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    location: 'Virtual',
    notes: 'Technical round focusing on React and system design',
    round: 2,
    priority: 'high',
    workflowStage: 'lineup-feedback',
    reminders: {
      sent: false,
      scheduledFor: [
        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 1 hour before
        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 13.5 * 60 * 60 * 1000) // 30 minutes before
      ]
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '2',
    candidateId: '2',
    candidateName: 'Rahul Sharma',
    jobId: '2',
    jobTitle: 'Product Manager',
    client: 'StartupXYZ',
    type: 'phone',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // Day after tomorrow 10 AM
    duration: 45,
    interviewer: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@startupxyz.com',
      role: 'VP Product',
      avatar: null
    },
    status: 'scheduled',
    location: 'Phone',
    notes: 'Product strategy and roadmap discussion',
    round: 1,
    priority: 'medium',
    workflowStage: 'shortlisting',
    reminders: {
      sent: false,
      scheduledFor: [
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000) // 1 hour before
      ]
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    candidateId: '3',
    candidateName: 'Priya Patel',
    jobId: '3',
    jobTitle: 'UI/UX Designer',
    client: 'Design Studio Pro',
    type: 'in-person',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 3 days from now 3 PM
    duration: 90,
    interviewer: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@designstudio.com',
      role: 'Design Director',
      avatar: null
    },
    status: 'scheduled',
    location: 'Design Studio Office, Koramangala',
    notes: 'Portfolio review and design challenge',
    round: 2,
    priority: 'urgent',
    workflowStage: 'lineup-feedback',
    reminders: {
      sent: false,
      scheduledFor: [
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 1 hour before
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 14.5 * 60 * 60 * 1000) // 30 minutes before
      ]
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '4',
    candidateId: '4',
    candidateName: 'Alex Wilson',
    jobId: '4',
    jobTitle: 'DevOps Engineer',
    client: 'CloudTech Inc',
    type: 'video',
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 5 days from now 11 AM
    duration: 75,
    interviewer: {
      id: '4',
      name: 'Sarah Davis',
      email: 'sarah@cloudtech.com',
      role: 'DevOps Manager',
      avatar: null
    },
    status: 'scheduled',
    meetingLink: 'https://zoom.us/j/123456789',
    location: 'Virtual',
    notes: 'Infrastructure and automation assessment',
    round: 1,
    priority: 'high',
    workflowStage: 'shortlisting',
    reminders: {
      sent: false,
      scheduledFor: [
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000) // 1 hour before
      ]
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    candidateId: '5',
    candidateName: 'Maria Garcia',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    client: 'TechCorp Solutions',
    type: 'phone',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 7 days from now 4 PM
    duration: 30,
    interviewer: {
      id: '1',
      name: 'John Doe',
      email: 'john@techcorp.com',
      role: 'Technical Lead',
      avatar: null
    },
    status: 'scheduled',
    location: 'Phone',
    notes: 'Initial screening call',
    round: 1,
    priority: 'medium',
    workflowStage: 'resume-sharing',
    reminders: {
      sent: false,
      scheduledFor: [
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000) // 1 hour before
      ]
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

// Interview management hook
export function useInterviews(filters = {}) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        // Apply filters
        let filteredInterviews = [...mockInterviews];

        if (filters.type && filters.type !== 'all') {
          filteredInterviews = filteredInterviews.filter(interview => interview.type === filters.type);
        }

        if (filters.status && filters.status !== 'all') {
          filteredInterviews = filteredInterviews.filter(interview => interview.status === filters.status);
        }

        if (filters.priority && filters.priority !== 'all') {
          filteredInterviews = filteredInterviews.filter(interview => interview.priority === filters.priority);
        }

        if (filters.interviewer && filters.interviewer !== 'all') {
          filteredInterviews = filteredInterviews.filter(interview => interview.interviewer.id === filters.interviewer);
        }

        if (filters.dateRange) {
          const { start, end } = filters.dateRange;
          filteredInterviews = filteredInterviews.filter(interview => {
            const interviewDate = interview.scheduledDate;
            return interviewDate >= start && interviewDate <= end;
          });
        }

        setInterviews(filteredInterviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [filters]);

  // Reschedule interview
  const rescheduleInterview = useCallback(async (interviewId, newDateTime) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      setInterviews(prev => prev.map(interview =>
        interview.id === interviewId
          ? {
            ...interview,
            scheduledDate: newDateTime,
            updatedAt: new Date(),
            status: 'rescheduled'
          }
          : interview
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new interview
  const createInterview = useCallback(async (interviewData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const newInterview = {
        id: crypto.randomUUID(),
        ...interviewData,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        reminders: {
          sent: false,
          scheduledFor: [
            new Date(interviewData.scheduledDate.getTime() - 60 * 60 * 1000) // 1 hour before
          ]
        }
      };
      setInterviews(prev => [...prev, newInterview]);
      return { success: true, interview: newInterview };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update interview
  const updateInterview = useCallback(async (interviewId, updates) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      setInterviews(prev => prev.map(interview =>
        interview.id === interviewId
          ? {
            ...interview,
            ...updates,
            updatedAt: new Date()
          }
          : interview
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel interview
  const cancelInterview = useCallback(async (interviewId, reason) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      setInterviews(prev => prev.map(interview =>
        interview.id === interviewId
          ? {
            ...interview,
            status: 'cancelled',
            cancellationReason: reason,
            updatedAt: new Date()
          }
          : interview
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get interviews for a specific date
  const getInterviewsForDate = useCallback((date) => {
    return interviews.filter(interview =>
      interview.scheduledDate.toDateString() === date.toDateString()
    );
  }, [interviews]);

  // Get upcoming interviews
  const getUpcomingInterviews = useCallback((limit = 5) => {
    const now = new Date();
    return interviews
      .filter(interview => interview.scheduledDate > now && interview.status === 'scheduled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, limit);
  }, [interviews]);

  // Get today's interviews
  const getTodaysInterviews = useCallback(() => {
    const today = new Date();
    return interviews.filter(interview =>
      interview.scheduledDate.toDateString() === today.toDateString()
    ).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }, [interviews]);

  // Get interview statistics
  const getInterviewStats = useCallback(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());

    return {
      total: interviews.length,
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      completed: interviews.filter(i => i.status === 'completed').length,
      cancelled: interviews.filter(i => i.status === 'cancelled').length,
      today: interviews.filter(i =>
        i.scheduledDate >= today && i.scheduledDate < tomorrow
      ).length,
      thisWeek: interviews.filter(i =>
        i.scheduledDate >= thisWeek && i.scheduledDate < new Date(thisWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ).length,
      byType: {
        phone: interviews.filter(i => i.type === 'phone').length,
        video: interviews.filter(i => i.type === 'video').length,
        'in-person': interviews.filter(i => i.type === 'in-person').length
      },
      byPriority: {
        urgent: interviews.filter(i => i.priority === 'urgent').length,
        high: interviews.filter(i => i.priority === 'high').length,
        medium: interviews.filter(i => i.priority === 'medium').length,
        low: interviews.filter(i => i.priority === 'low').length
      }
    };
  }, [interviews]);

  return {
    interviews,
    loading,
    error,
    rescheduleInterview,
    createInterview,
    updateInterview,
    cancelInterview,
    getInterviewsForDate,
    getUpcomingInterviews,
    getTodaysInterviews,
    getInterviewStats
  };
}

// Hook for managing interview reminders
export function useInterviewReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const scheduleReminder = useCallback(async (interviewId, reminderTime) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      const newReminder = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        interviewId,
        scheduledFor: reminderTime,
        sent: false,
        createdAt: new Date()
      }; setReminders(prev => [...prev, newReminder]);
      return { success: true, reminder: newReminder };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendReminder = useCallback(async (reminderId) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, sent: true, sentAt: new Date() }
          : reminder
      ));

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reminders,
    loading,
    scheduleReminder,
    sendReminder
  };
}

// Hook for interview feedback
export function useInterviewFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitFeedback = useCallback(async (interviewId, feedbackData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      const newFeedback = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        interviewId,
        ...feedbackData,
        submittedAt: new Date()
      };
      setFeedback(prev => [...prev, newFeedback]);
      return { success: true, feedback: newFeedback };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeedbackForInterview = useCallback((interviewId) => {
    return feedback.filter(f => f.interviewId === interviewId);
  }, [feedback]);

  return {
    feedback,
    loading,
    submitFeedback,
    getFeedbackForInterview
  };
}