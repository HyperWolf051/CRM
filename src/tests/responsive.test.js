import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Contacts from '../pages/Contacts';
import Deals from '../pages/Deals';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import ContactTable from '../components/ContactTable';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

// Mock hooks
vi.mock('../hooks/useDashboard', () => ({
  default: () => ({
    metrics: {
      totalContacts: 150,
      activeDeals: 25,
      revenue: 125000,
      conversionRate: 15.5,
      contactsTrend: 12,
      dealsTrend: -5,
      revenueTrend: 8,
      conversionTrend: 3
    },
    loading: false,
    error: null
  })
}));

vi.mock('../hooks/useContacts', () => ({
  default: () => ({
    contacts: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
        status: 'active'
      }
    ],
    loading: false,
    error: null,
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
    refetch: vi.fn()
  })
}));

vi.mock('../hooks/useDeals', () => ({
  useDeals: () => ({
    deals: [
      {
        id: '1',
        name: 'Big Deal',
        value: 50000,
        stage: 'qualified',
        contactId: '1',
        contactName: 'John Doe'
      }
    ],
    loading: false,
    error: null,
    updateDealStage: vi.fn(),
    createDeal: vi.fn()
  })
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Responsive Design Tests', () => {
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  const setViewportWidth = (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };

  describe('Sidebar Responsiveness', () => {
    it('should have correct width classes for different screen sizes', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const sidebar = screen.getByRole('navigation', { name: /main navigation/i });
      expect(sidebar.parentElement).toHaveClass('w-52', 'lg:w-56', 'xl:w-60');
    });
  });

  describe('Dashboard Responsiveness', () => {
    it('should have responsive grid layout for metric cards', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const metricsGrid = screen.getByText('Total Contacts').closest('.grid');
      expect(metricsGrid).toHaveClass(
        'grid-cols-1',
        'lg:grid-cols-2', 
        'xl:grid-cols-4',
        '2xl:grid-cols-4',
        '3xl:grid-cols-4'
      );
    });

    it('should have responsive gap spacing', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const metricsGrid = screen.getByText('Total Contacts').closest('.grid');
      expect(metricsGrid).toHaveClass('gap-4', 'lg:gap-6');
    });
  });

  describe('ContactTable Responsiveness', () => {
    it('should have horizontal scrolling with custom scrollbar', () => {
      const contacts = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Corp',
          status: 'active'
        }
      ];

      render(
        <TestWrapper>
          <ContactTable contacts={contacts} />
        </TestWrapper>
      );

      const scrollContainer = screen.getByRole('table').parentElement;
      expect(scrollContainer).toHaveClass(
        'overflow-x-auto',
        'scrollbar-thin',
        'scrollbar-thumb-gray-300',
        'scrollbar-track-gray-100'
      );
    });

    it('should have responsive minimum width for table', () => {
      const contacts = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Corp',
          status: 'active'
        }
      ];

      render(
        <TestWrapper>
          <ContactTable contacts={contacts} />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass(
        'min-w-full',
        'lg:min-w-[800px]',
        'xl:min-w-[1000px]'
      );
    });
  });

  describe('KanbanBoard Responsiveness', () => {
    it('should have responsive column widths', () => {
      const deals = [
        {
          id: '1',
          name: 'Big Deal',
          value: 50000,
          stage: 'qualified',
          contactId: '1',
          contactName: 'John Doe'
        }
      ];

      render(
        <TestWrapper>
          <KanbanBoard deals={deals} />
        </TestWrapper>
      );

      // Check if the board container has responsive classes
      const boardContainer = screen.getByRole('application');
      expect(boardContainer).toHaveClass(
        'flex',
        'gap-4',
        'lg:gap-6',
        'overflow-x-auto',
        'scrollbar-thin',
        'scroll-smooth'
      );
    });

    it('should have smooth horizontal scrolling', () => {
      const deals = [
        {
          id: '1',
          name: 'Big Deal',
          value: 50000,
          stage: 'qualified',
          contactId: '1',
          contactName: 'John Doe'
        }
      ];

      render(
        <TestWrapper>
          <KanbanBoard deals={deals} />
        </TestWrapper>
      );

      const boardContainer = screen.getByRole('application');
      expect(boardContainer).toHaveClass('scroll-smooth');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should have responsive padding in main content area', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // The main content should be wrapped in a container with responsive max-width
      const pageContent = screen.getByText('Dashboard').closest('div');
      // Check if parent containers have responsive classes
      expect(document.querySelector('main')).toHaveClass('p-4', 'lg:p-6');
    });
  });

  describe('Breakpoint Coverage', () => {
    const breakpoints = [
      { name: 'lg', width: 1024 },
      { name: 'xl', width: 1280 },
      { name: '2xl', width: 1536 },
      { name: '3xl', width: 1920 },
      { name: '4xl', width: 2560 }
    ];

    breakpoints.forEach(({ name, width }) => {
      it(`should handle ${name} breakpoint (${width}px) correctly`, () => {
        setViewportWidth(width);
        
        render(
          <TestWrapper>
            <Dashboard />
          </TestWrapper>
        );

        // Verify the page renders without errors at this breakpoint
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Total Contacts')).toBeInTheDocument();
      });
    });
  });
});