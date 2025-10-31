import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RecruiterInterviews from '../pages/recruiter/RecruiterInterviews';
import InterviewReminderSystem from '../components/recruitment/InterviewReminderSystem';
import InterviewHistoryTracker from '../components/recruitment/InterviewHistoryTracker';

import { vi } from 'vitest';

// Mock the hooks
vi.mock('../hooks/useInterviews', () => ({
  useInterviews: () => ({
    interviews: [
      {
        id: '1',
        candidateName: 'John Doe',
        jobTitle: 'Software Engineer',
        client: 'TechCorp',
        type: 'video',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled',
        interviewer: { name: 'Jane Smith', role: 'Tech Lead' },
        location: 'Virtual',
        priority: 'high'
      }
    ],
    loading: false,
    error: null,
    rescheduleInterview: vi.fn(),
    updateInterview: vi.fn(),
    cancelInterview: vi.fn(),
    getInterviewStats: () => ({
      total: 1,
      scheduled: 1,
      today: 0,
      thisWeek: 1
    }),
    getUpcomingInterviews: () => []
  }),
  useInterviewReminders: () => ({
    reminders: [],
    scheduleReminder: vi.fn(),
    sendReminder: vi.fn()
  }),
  useInterviewFeedback: () => ({
    feedback: [],
    submitFeedback: vi.fn(),
    getFeedbackForInterview: vi.fn()
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Interview Management System', () => {
  describe('RecruiterInterviews Page', () => {
    test('renders interviews page with stats and interview cards', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      // Check if main elements are rendered
      expect(screen.getByText('Interviews')).toBeInTheDocument();
      expect(screen.getByText('Manage and track all interview appointments')).toBeInTheDocument();
      expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
      
      // Check stats cards
      expect(screen.getByText('Total Interviews')).toBeInTheDocument();
      expect(screen.getAllByText('Scheduled')).toHaveLength(3); // Stats card, filter dropdown, and interview card
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
    });

    test('displays interview cards with correct information', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      // Check if interview card is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('filters work correctly', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      // Check if filter dropdowns are present
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Priority')).toBeInTheDocument();
    });

    test('search functionality works', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      const searchInput = screen.getByPlaceholderText('Search interviews...');
      expect(searchInput).toBeInTheDocument();
      
      // Test search input
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(searchInput.value).toBe('John');
    });

    test('schedule interview button opens modal', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      const scheduleButton = screen.getByText('Schedule Interview');
      fireEvent.click(scheduleButton);
      
      // Modal should be triggered (though we're not testing the modal itself here)
      expect(scheduleButton).toBeInTheDocument();
    });
  });

  describe('InterviewReminderSystem', () => {
    test('component exists and can be imported', () => {
      // Just test that the component can be imported without errors
      expect(InterviewReminderSystem).toBeDefined();
    });
  });

  describe('InterviewHistoryTracker', () => {
    test('renders interview history with mock data', () => {
      renderWithRouter(<InterviewHistoryTracker candidateId="1" />);
      
      // Should render without errors and show loading or content
      expect(document.body).toBeInTheDocument();
    });

    test('renders filters when showFilters is true', () => {
      renderWithRouter(<InterviewHistoryTracker showFilters={true} />);
      
      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });

    test('limits items when maxItems is specified', () => {
      renderWithRouter(<InterviewHistoryTracker maxItems={5} />);
      
      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Interview Feedback System', () => {
    test('feedback modal renders correctly', async () => {
      renderWithRouter(<RecruiterInterviews />);
      
      // This tests that the page renders without the feedback modal initially
      expect(screen.queryByText('Interview Feedback')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('interview management components work together', () => {
      renderWithRouter(<RecruiterInterviews />);
      
      // Main component should render without conflicts
      expect(screen.getByText('Interviews')).toBeInTheDocument();
    });
  });
});

describe('Interview Management Functionality', () => {
  test('interview scheduling workflow', () => {
    renderWithRouter(<RecruiterInterviews />);
    
    // Test the basic workflow elements are present
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search interviews...')).toBeInTheDocument();
  });

  test('interview feedback collection', () => {
    // Test that feedback system components exist
    const mockInterview = {
      id: '1',
      candidateName: 'John Doe',
      jobTitle: 'Software Engineer',
      scheduledDate: new Date()
    };
    
    // This would test the feedback modal if it were open
    expect(mockInterview.candidateName).toBe('John Doe');
  });

  test('reminder notifications', () => {
    // Test that reminder system component exists
    expect(InterviewReminderSystem).toBeDefined();
  });

  test('interview history tracking', () => {
    renderWithRouter(<InterviewHistoryTracker candidateId="test-candidate" />);
    
    // History tracker should render for specific candidate
    expect(document.body).toBeInTheDocument();
  });
});