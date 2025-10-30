/**
 * Test to verify the user role detection fix
 * This test specifically addresses the issue where refreshing after admin login
 * would show "Sales User" instead of "Company Admin"
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock storage
const createMockStorage = () => {
  const storage = new Map();
  return {
    getItem: vi.fn((key) => storage.get(key) || null),
    setItem: vi.fn((key, value) => storage.set(key, value)),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    key: vi.fn((index) => Array.from(storage.keys())[index] || null),
    get length() { return storage.size; }
  };
};

// Mock environment
const mockEnv = {
  NODE_ENV: 'test',
  DEV: false
};

vi.mock('import.meta', () => ({
  env: mockEnv
}));

describe('User Role Detection Fix', () => {
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = createMockStorage();
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    vi.clearAllMocks();
  });

  it('should correctly identify admin user from token on page refresh', async () => {
    // Simulate admin user token (new format with role)
    mockLocalStorage.setItem('authToken', 'demo-token-admin-1234567890');
    mockLocalStorage.setItem('isDemoMode', 'true');

    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();

      if (isLoading) return <div>Loading...</div>;

      return (
        <div>
          <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
          <div data-testid="user-name">{user ? user.name : 'No user'}</div>
          <div data-testid="user-role">{user ? user.role : 'No role'}</div>
          <div data-testid="user-email">{user ? user.email : 'No email'}</div>
        </div>
      );
    };

    const TestApp = () => (
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    render(<TestApp />);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Verify admin user details are correctly loaded
    expect(screen.getByTestId('user-name')).toHaveTextContent('Company Admin');
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@crm.com');
  });

  it('should correctly identify recruiter user from token on page refresh', async () => {
    // Simulate recruiter user token (new format with role)
    mockLocalStorage.setItem('authToken', 'demo-token-recruiter-1234567890');
    mockLocalStorage.setItem('isDemoMode', 'true');

    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();

      if (isLoading) return <div>Loading...</div>;

      return (
        <div>
          <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
          <div data-testid="user-name">{user ? user.name : 'No user'}</div>
          <div data-testid="user-role">{user ? user.role : 'No role'}</div>
          <div data-testid="user-email">{user ? user.email : 'No email'}</div>
        </div>
      );
    };

    const TestApp = () => (
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    render(<TestApp />);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Verify recruiter user details are correctly loaded
    expect(screen.getByTestId('user-name')).toHaveTextContent('Recruiter Agent');
    expect(screen.getByTestId('user-role')).toHaveTextContent('recruiter');
    expect(screen.getByTestId('user-email')).toHaveTextContent('demo@crm.com');
  });

  it('should correctly identify sales user from token on page refresh', async () => {
    // Simulate sales user token (new format with role)
    mockLocalStorage.setItem('authToken', 'demo-token-user-1234567890');
    mockLocalStorage.setItem('isDemoMode', 'true');

    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();

      if (isLoading) return <div>Loading...</div>;

      return (
        <div>
          <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
          <div data-testid="user-name">{user ? user.name : 'No user'}</div>
          <div data-testid="user-role">{user ? user.role : 'No role'}</div>
          <div data-testid="user-email">{user ? user.email : 'No email'}</div>
        </div>
      );
    };

    const TestApp = () => (
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
        </MemoryRouter>
    );

    render(<TestApp />);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Verify sales user details are correctly loaded
    expect(screen.getByTestId('user-name')).toHaveTextContent('Sales User');
    expect(screen.getByTestId('user-role')).toHaveTextContent('user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('sales@crm.com');
  });

  it('should fallback to sales user for old token format', async () => {
    // Simulate old token format (without role information)
    mockLocalStorage.setItem('authToken', 'demo-token-1234567890');
    mockLocalStorage.setItem('isDemoMode', 'true');

    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();

      if (isLoading) return <div>Loading...</div>;

      return (
        <div>
          <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
          <div data-testid="user-name">{user ? user.name : 'No user'}</div>
          <div data-testid="user-role">{user ? user.role : 'No role'}</div>
          <div data-testid="user-email">{user ? user.email : 'No email'}</div>
        </div>
      );
    };

    const TestApp = () => (
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    render(<TestApp />);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Should fallback to sales user for unknown token format
    expect(screen.getByTestId('user-name')).toHaveTextContent('Sales User');
    expect(screen.getByTestId('user-role')).toHaveTextContent('user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('sales@crm.com');
  });
});