import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

// Mock the API module
vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('throws error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('initializes with default state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loads existing token from localStorage on mount', async () => {
    const mockToken = 'existing-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockResolvedValue({ data: mockUser });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears invalid token from localStorage', async () => {
    const mockToken = 'invalid-token';
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockRejectedValue(new Error('Unauthorized'));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('successfully logs in user', async () => {
    const mockToken = 'new-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const loginResponse = { data: { token: mockToken, user: mockUser } };
    
    api.post.mockResolvedValue(loginResponse);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('john@example.com', 'password');
    });
    
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'john@example.com',
      password: 'password'
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', mockToken);
    expect(loginResult).toEqual({ success: true });
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValue({
      response: { data: { message: errorMessage } }
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('john@example.com', 'wrong-password');
    });
    
    expect(loginResult).toEqual({ success: false, error: errorMessage });
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('successfully registers user', async () => {
    const mockToken = 'new-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const registerResponse = { data: { token: mockToken, user: mockUser } };
    
    api.post.mockResolvedValue(registerResponse);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    let registerResult;
    await act(async () => {
      registerResult = await result.current.register('John Doe', 'john@example.com', 'password');
    });
    
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password'
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', mockToken);
    expect(registerResult).toEqual({ success: true });
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles registration failure', async () => {
    const errorMessage = 'Email already exists';
    api.post.mockRejectedValue({
      response: { data: { message: errorMessage } }
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    let registerResult;
    await act(async () => {
      registerResult = await result.current.register('John Doe', 'john@example.com', 'password');
    });
    
    expect(registerResult).toEqual({ success: false, error: errorMessage });
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('successfully logs out user', async () => {
    // First set up authenticated state
    const mockToken = 'existing-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockResolvedValue({ data: mockUser });
    api.post.mockResolvedValue({}); // logout endpoint
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out even if API call fails', async () => {
    // First set up authenticated state
    const mockToken = 'existing-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockResolvedValue({ data: mockUser });
    api.post.mockRejectedValue(new Error('Network error')); // logout endpoint fails
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    
    consoleSpy.mockRestore();
  });

  it('successfully updates user', async () => {
    // First set up authenticated state
    const mockToken = 'existing-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const updatedUser = { id: '1', name: 'John Smith', email: 'john.smith@example.com' };
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockResolvedValue({ data: mockUser });
    api.put.mockResolvedValue({ data: updatedUser });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateUser({ name: 'John Smith' });
    });
    
    expect(api.put).toHaveBeenCalledWith('/users/me', { name: 'John Smith' });
    expect(updateResult).toEqual({ success: true });
    expect(result.current.user).toEqual(updatedUser);
  });

  it('handles update user failure', async () => {
    // First set up authenticated state
    const mockToken = 'existing-token';
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const errorMessage = 'Update failed';
    
    localStorageMock.getItem.mockReturnValue(mockToken);
    api.get.mockResolvedValue({ data: mockUser });
    api.put.mockRejectedValue({
      response: { data: { message: errorMessage } }
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateUser({ name: 'John Smith' });
    });
    
    expect(updateResult).toEqual({ success: false, error: errorMessage });
    expect(result.current.user).toEqual(mockUser); // unchanged
  });

  it('uses default error messages when API does not provide them', async () => {
    api.post.mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('john@example.com', 'password');
    });
    
    expect(loginResult).toEqual({ 
      success: false, 
      error: 'Login failed. Please try again.' 
    });
  });
});