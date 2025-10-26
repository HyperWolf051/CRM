import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecentCandidatesWidget from '../components/recruitment/RecentCandidatesWidget';
import UpcomingInterviewsWidget from '../components/recruitment/UpcomingInterviewsWidget';
import ActivityTimelineWidget from '../components/recruitment/ActivityTimelineWidget';

// Mock data
const mockCandidates = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Software Engineer',
    status: 'new',
    appliedDate: '2024-01-15',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'Product Manager',
    status: 'shortlisted',
    appliedDate: '2024-01-14',
    rating: 4.2
  }
];

const mockInterviews = [
  {
    id: '1',
    candidateName: 'John Doe',
    position: 'Software Engineer',
    dateTime: '2024-01-16T10:00:00',
    type: 'video',
    interviewer: 'Alice Johnson'
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    position: 'Product Manager',
    dateTime: '2024-01-16T14:30:00',
    type: 'phone',
    interviewer: 'Bob Wilson'
  }
];

const mockActivities = [
  {
    id: '1',
    type: 'candidate-added',
    title: 'New candidate added',
    description: 'John Doe applied for Software Engineer position',
    user: 'Alice Johnson',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: '2',
    type: 'interview-scheduled',
    title: 'Interview scheduled',
    description: 'Video interview with Jane Smith for Product Manager',
    user: 'Bob Wilson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

describe('RecentCandidatesWidget', () => {
  it('renders candidates correctly', () => {
    render(<RecentCandidatesWidget candidates={mockCandidates} />);
    
    expect(screen.getByText('Recent Candidates')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<RecentCandidatesWidget candidates={[]} loading={true} />);
    
    expect(screen.getByText('Recent Candidates')).toBeInTheDocument();
    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows empty state when no candidates', () => {
    render(<RecentCandidatesWidget candidates={[]} />);
    
    expect(screen.getByText('No recent candidates')).toBeInTheDocument();
  });

  it('calls action handlers when buttons are clicked', async () => {
    const mockViewCandidate = vi.fn();
    const mockScheduleInterview = vi.fn();
    const mockSendEmail = vi.fn();

    render(
      <RecentCandidatesWidget 
        candidates={mockCandidates}
        onViewCandidate={mockViewCandidate}
        onScheduleInterview={mockScheduleInterview}
        onSendEmail={mockSendEmail}
      />
    );

    // Hover over first candidate to show action buttons
    const firstCandidate = screen.getByText('John Doe').closest('.group');
    fireEvent.mouseEnter(firstCandidate);

    await waitFor(() => {
      const viewButton = screen.getByTitle('View Profile');
      const scheduleButton = screen.getByTitle('Schedule Interview');
      const emailButton = screen.getByTitle('Send Email');

      fireEvent.click(viewButton);
      fireEvent.click(scheduleButton);
      fireEvent.click(emailButton);

      expect(mockViewCandidate).toHaveBeenCalledWith('1');
      expect(mockScheduleInterview).toHaveBeenCalledWith('1');
      expect(mockSendEmail).toHaveBeenCalledWith('1');
    });
  });
});

describe('UpcomingInterviewsWidget', () => {
  it('renders interviews correctly', () => {
    render(<UpcomingInterviewsWidget interviews={mockInterviews} />);
    
    expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('video')).toBeInTheDocument();
    expect(screen.getByText('phone')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UpcomingInterviewsWidget interviews={[]} loading={true} />);
    
    expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows empty state when no interviews', () => {
    render(<UpcomingInterviewsWidget interviews={[]} />);
    
    expect(screen.getByText('No upcoming interviews')).toBeInTheDocument();
  });

  it('calls action handlers when buttons are clicked', async () => {
    const mockJoinInterview = vi.fn();
    const mockRescheduleInterview = vi.fn();

    render(
      <UpcomingInterviewsWidget 
        interviews={[mockInterviews[0]]} // Use only one interview to avoid multiple elements
        onJoinInterview={mockJoinInterview}
        onRescheduleInterview={mockRescheduleInterview}
      />
    );

    // Hover over first interview to show action buttons
    const firstInterview = screen.getByText('John Doe').closest('.group');
    fireEvent.mouseEnter(firstInterview);

    await waitFor(() => {
      const joinButton = screen.getByText('Join');
      const rescheduleButton = screen.getByText('Reschedule');

      fireEvent.click(joinButton);
      fireEvent.click(rescheduleButton);

      expect(mockJoinInterview).toHaveBeenCalledWith('1');
      expect(mockRescheduleInterview).toHaveBeenCalledWith('1');
    });
  });
});

describe('ActivityTimelineWidget', () => {
  it('renders activities correctly', () => {
    render(<ActivityTimelineWidget activities={mockActivities} />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('New candidate added')).toBeInTheDocument();
    expect(screen.getByText('Interview scheduled')).toBeInTheDocument();
    expect(screen.getByText('by Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('by Bob Wilson')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ActivityTimelineWidget activities={[]} loading={true} />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows empty state when no activities', () => {
    render(<ActivityTimelineWidget activities={[]} />);
    
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });

  it('shows more activities when button is clicked', async () => {
    const manyActivities = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'candidate-added',
      title: `Activity ${i + 1}`,
      description: `Description ${i + 1}`,
      user: 'Test User',
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
    }));

    render(<ActivityTimelineWidget activities={manyActivities} maxItems={5} />);
    
    // Should show "Show More" button
    const showMoreButton = screen.getByText(/Show \d+ More Activities/);
    expect(showMoreButton).toBeInTheDocument();

    fireEvent.click(showMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Show Less')).toBeInTheDocument();
    });
  });
});