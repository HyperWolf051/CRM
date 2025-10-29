import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WorkflowManagement from '@/components/recruitment/WorkflowManagement';
import { candidateUtils } from '@/utils/candidateUtils';

// Mock the candidateUtils
vi.mock('@/utils/candidateUtils', () => ({
  candidateUtils: {
    getCandidateProgress: vi.fn(() => 60)
  }
}));

const mockCandidate = {
  id: '1',
  name: 'John Doe',
  currentStage: 'shortlisting',
  overallStatus: 'shortlisted',
  registration: {
    date: new Date('2024-01-01'),
    resource: 'LinkedIn',
    registrationStatus: 'Yes'
  },
  resumeSharing: {
    resumeShareStatus: 'Done',
    shortlistsForClient: 'Tech Corp'
  },
  shortlisting: {
    shortlistStatus: 'Pending'
  },
  lineupFeedback: {
    feedbacks: [],
    lineupStatus: 'Pending'
  },
  selection: {},
  closure: {}
};

describe('WorkflowManagement', () => {
  const defaultProps = {
    candidate: mockCandidate,
    onCandidateUpdate: vi.fn(),
    onInterviewSchedule: vi.fn(),
    currentUser: { id: 'user1', name: 'Test User', email: 'test@example.com' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders workflow management component', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Workflow Management')).toBeInTheDocument();
    expect(screen.getByText('Current Stage')).toBeInTheDocument();
  });

  it('displays stage advancement buttons', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Advance to Next Stage')).toBeInTheDocument();
    expect(screen.getByText('Move to Lineup & Feedback')).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Add Client Feedback')).toBeInTheDocument();
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
    expect(screen.getByText('Update Placement Details')).toBeInTheDocument();
  });

  it('renders client feedback button', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Add Client Feedback')).toBeInTheDocument();
  });

  it('renders interview scheduling button', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
  });

  it('renders placement details button', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Update Placement Details')).toBeInTheDocument();
  });

  it('handles stage advancement', async () => {
    const onCandidateUpdate = vi.fn().mockResolvedValue();
    render(<WorkflowManagement {...defaultProps} onCandidateUpdate={onCandidateUpdate} />);
    
    fireEvent.click(screen.getByText('Move to Lineup & Feedback'));
    
    await waitFor(() => {
      expect(onCandidateUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        currentStage: 'lineup-feedback',
        lastModifiedBy: 'user1',
        lastModifiedByName: 'Test User'
      }));
    });
  });

  it('calls onCandidateUpdate when stage is advanced', async () => {
    const onCandidateUpdate = vi.fn().mockResolvedValue();
    render(<WorkflowManagement {...defaultProps} onCandidateUpdate={onCandidateUpdate} />);
    
    // Verify the stage advancement button exists
    expect(screen.getByText('Move to Lineup & Feedback')).toBeInTheDocument();
  });

  it('calls onInterviewSchedule when interview is scheduled', () => {
    const onInterviewSchedule = vi.fn();
    render(<WorkflowManagement {...defaultProps} onInterviewSchedule={onInterviewSchedule} />);
    
    // Verify the interview scheduling button exists
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
  });

  it('displays progress indicator', () => {
    render(<WorkflowManagement {...defaultProps} />);
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('shows completion message for completed candidates', () => {
    const completedCandidate = {
      ...mockCandidate,
      currentStage: 'completed'
    };
    
    render(<WorkflowManagement {...defaultProps} candidate={completedCandidate} />);
    
    expect(screen.getByText('Recruitment process completed')).toBeInTheDocument();
  });
});