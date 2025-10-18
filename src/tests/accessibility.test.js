import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { BrowserRouter } from 'react-router-dom';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import { AuthContext } from '../context/AuthContext';

// Mock auth context
const mockAuthContext = {
  user: { name: 'Test User', email: 'test@example.com' },
  logout: () => {},
  isAuthenticated: true,
  isLoading: false,
};

const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

describe('Accessibility Features', () => {
  describe('Button Component', () => {
    it('should have aria-label for icon-only buttons', () => {
      render(
        <Button icon={<span>🔍</span>} aria-label="Search" />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Search');
    });

    it('should have proper focus indicators', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should warn when icon-only button lacks aria-label', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<Button icon={<span>🔍</span>} />);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Button with icon but no text should have an aria-label')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Input Component', () => {
    it('should have aria-describedby when error is present', () => {
      render(
        <Input 
          label="Email" 
          name="email" 
          error="Email is required" 
        />
      );
      
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      
      expect(errorId).toBeTruthy();
      expect(screen.getByRole('alert')).toHaveAttribute('id', errorId);
    });

    it('should have aria-invalid when error is present', () => {
      render(
        <Input 
          label="Email" 
          name="email" 
          error="Email is required" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not have aria-invalid when no error', () => {
      render(<Input label="Email" name="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Modal Component', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should have close button with aria-label', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation', () => {
    it('should have aria-current for active navigation items', () => {
      // Mock useLocation to return dashboard path
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useLocation: () => ({ pathname: '/app/dashboard' }),
        };
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <CollapsibleSidebar />
          </AuthProvider>
        </BrowserRouter>
      );
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have navigation landmark with label', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <CollapsibleSidebar />
          </AuthProvider>
        </BrowserRouter>
      );
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should have proper focus indicators on navigation items', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <CollapsibleSidebar />
          </AuthProvider>
        </BrowserRouter>
      );
      
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key on interactive elements', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });
  });
});