import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RootRedirect from '../components/RootRedirect';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  forceLogout: vi.fn(),
  restoreLastPage: vi.fn(() => null)
};

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock the useLastPageMemory hook
const mockLastPageMemory = {
  getLastPage: vi.fn(() => null),
  clearLastPage: vi.fn()
};

vi.mock('@/hooks/useLastPageMemory', () => ({
  useLastPageMemory: () => mockLastPageMemory
}));

// Mock route permissions
vi.mock('@/utils/routePermissions', () => ({
  getDefaultDashboard: vi.fn(() => '/app/dashboard'),
  validateAndSanitizeRoute: vi.fn((path, role) => ({
    isValid: true,
    sanitizedPath: path,
    error: null,
    fallbackPath: null
  }))
}));

// Mock React Router Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>
  };
});

const renderRootRedirect = (searchParams = '') => {
  // Mock window.location.search
  Object.defineProperty(window, 'location', {
    value: {
      search: searchParams
    },
    writable: true
  });

  return render(
    <BrowserRouter>
      <RootRedirect />
    </BrowserRouter>
  );
};

describe('RootRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock context to default state
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    mockLastPageMemory.getLastPage.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when loading', () => {
    it('should show loading state', () => {
      mockAuthContext.isLoading = true;
      
      renderRootRedirect();
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthContext.user = { id: 'user123', role: 'admin' };
      mockAuthContext.isAuthenticated = true;
    });

    it('should redirect to restored last page when available', async () => {
      mockAuthContext.restoreLastPage.mockReturnValue('/app/candidates');
      
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/app/candidates');
      });
    });

    it('should redirect to default dashboard when no last page', async () => {
      mockAuthContext.restoreLastPage.mockReturnValue(null);
      
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/app/dashboard');
      });
    });

    it('should use direct storage when context returns null', async () => {
      mockAuthContext.restoreLastPage.mockReturnValue(null);
      mockLastPageMemory.getLastPage.mockReturnValue('/app/jobs');
      
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/app/jobs');
      });
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthContext.user = null;
      mockAuthContext.isAuthenticated = false;
    });

    it('should redirect to login for fresh visit', async () => {
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      });
      
      expect(mockAuthContext.forceLogout).toHaveBeenCalled();
    });

    it('should clear last page on explicit logout', async () => {
      renderRootRedirect('?logout=true');
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      });
      
      expect(mockAuthContext.forceLogout).toHaveBeenCalled();
      expect(mockLastPageMemory.clearLastPage).toHaveBeenCalled();
    });

    it('should preserve last page for fresh visit when stored page exists', async () => {
      mockLastPageMemory.getLastPage.mockReturnValue('/app/candidates');
      
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      });
      
      expect(mockAuthContext.forceLogout).toHaveBeenCalled();
      expect(mockLastPageMemory.clearLastPage).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully and redirect to login', async () => {
      mockAuthContext.restoreLastPage.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      renderRootRedirect();
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      });
      
      expect(mockAuthContext.forceLogout).toHaveBeenCalled();
    });

    it('should clear last page on explicit logout even when error occurs', async () => {
      mockAuthContext.restoreLastPage.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      renderRootRedirect('?logout=true');
      
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      });
      
      expect(mockLastPageMemory.clearLastPage).toHaveBeenCalled();
    });
  });
});