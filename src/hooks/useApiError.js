import { useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

/**
 * Custom hook for handling API errors and network status
 * Provides utilities for showing network-related notifications
 */
export const useApiError = () => {
  const { showToast } = useToast();

  /**
   * Show notification when user goes offline
   */
  const showOfflineNotification = useCallback(() => {
    showToast({
      type: 'warning',
      title: 'Connection Lost',
      message: 'You are currently offline. Some features may not work properly.',
      duration: 5000
    });
  }, [showToast]);

  /**
   * Show notification when user comes back online
   */
  const showOnlineNotification = useCallback(() => {
    showToast({
      type: 'success',
      title: 'Connection Restored',
      message: 'You are back online. All features are now available.',
      duration: 3000
    });
  }, [showToast]);

  /**
   * Handle API errors with appropriate notifications
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   */
  const handleApiError = useCallback((error, context = 'API') => {
    console.error(`${context} Error:`, error);
    
    // Check if it's a network error
    if (!navigator.onLine) {
      showOfflineNotification();
      return;
    }

    // Handle different types of errors
    let message = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 401:
          message = 'Authentication required. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.response.data?.message || message;
      }
    } else if (error.request) {
      // Network error
      message = 'Network error. Please check your connection and try again.';
    }

    showToast({
      type: 'error',
      title: `${context} Error`,
      message,
      duration: 5000
    });
  }, [showToast, showOfflineNotification]);

  return {
    showOfflineNotification,
    showOnlineNotification,
    handleApiError
  };
};