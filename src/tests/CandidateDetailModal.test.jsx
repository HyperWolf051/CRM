import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CandidateDetailModal from '@/components/recruitment/CandidateDetailModal';
import { CandidateAPI } from '@/services/api';

// Mock the API
vi.mock('@/services/api', () => ({
  CandidateAPI: {
    getById: vi.fn(),
    update: vi.fn()
  }
}));

// Mock the tab components
vi.mock('@/components/recruitment/CandidateDetailTabs', () => ({
  ProfileTab: ({ candidate }) => <div data-testid="profile-tab">Profile: {candidate?.name}</div>,
  ApplicationTab: ({ candidate }) => <div data-testid="application-tab">Application: {candidate?.name}</div>,
  DocumentsTab: ({ candidate }) => <div data-testid="documents-tab">Documents: {candidate?.name}</div>,
  NotesTab: ({ candidate }) => <div data-testid="notes-tab">Notes: {candidate?.name}</div>
}));

const mockCandidate = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  interestedFor: 'Software Developer',
  currentStage: 'shortlisting',
  overallStatus: 'shortlisted',
  location: 'New York, NY',
  createdByName: 'Jane Smith',
  rating: 4.5,
  notes: [],
  documents: [],
  changeHistory: []
};

describe('CandidateDetailModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    candidateId: '1',
    onStatusUpdate: vi.fn(),
    onAddNote: vi.fn(),
    currentUser: { id: 'user1', name: 'Test User' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    CandidateAPI.getById.mockResolvedValue({
      success: true,
      data: mockCandidate
    });
  });

  it('renders loading state initially', () => {
    render(<CandidateDetailModal {...defaultProps} />);
    
    expect(screen.getByText('Loading candidate details...')).toBeInTheDocument();
  });

  it('loads and displays candidate data', async () => {
    render(<CandidateDetailModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - Candidate Details')).toBeInTheDocument();
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(CandidateAPI.getById).toHaveBeenCalledWith('1');
  });

  it('displays workflow progress', async () => {
    render(<CandidateDetailModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Recruitment Progress')).toBeInTheDocument();
    });
  });

  it('switches between tabs', async () => {
    render(<CandidateDetailModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - Candidate Details')).toBeInTheDocument();
    });

    // Profile tab should be active by default
    expect(screen.getByTestId('profile-tab')).toBeInTheDocument();

    // Click on Application tab
    fireEvent.click(screen.getByText('Application'));
    expect(screen.getByTestId('application-tab')).toBeInTheDocument();

    // Click on Documents tab
    fireEvent.click(screen.getByText('Documents'));
    expect(screen.getByTestId('documents-tab')).toBeInTheDocument();

    // Click on Notes tab
    fireEvent.click(screen.getByText('Notes'));
    expect(screen.getByTestId('notes-tab')).toBeInTheDocument();
  });

  it('handles status update', async () => {
    CandidateAPI.update.mockResolvedValue({ success: true });
    
    render(<CandidateDetailModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - Candidate Details')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'selected' } });

    await waitFor(() => {
      expect(CandidateAPI.update).toHaveBeenCalledWith('1', {
        overallStatus: 'selected',
        lastModifiedBy: 'user1',
        lastModifiedByName: 'Test User'
      });
    });
  });

  it('handles error state', async () => {
    CandidateAPI.getById.mockRejectedValue(new Error('API Error'));
    
    render(<CandidateDetailModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load candidate details')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CandidateDetailModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Loading candidate details...')).not.toBeInTheDocument();
  });

  it('calls onClose when modal is closed', async () => {
    const onClose = vi.fn();
    render(<CandidateDetailModal {...defaultProps} onClose={onClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - Candidate Details')).toBeInTheDocument();
    });

    // Find and click the close button
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });
});