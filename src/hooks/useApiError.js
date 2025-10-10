import { useToast } from '@/context/ToastContext';
import { withRetry, waitForOnline } from '@/utils/api';

/**
 * Custom hook for handling API errors with user-friendly toast notifications
 */
export const useApiError = () => {
  const { showToast } = useToast();

  /**
   * Handle API error and show appropriate toast
   * @param {Error} error - The error object from API call
   * @param {Object} options - Configuration options
   * @param {string} options.defaultMessage - Default message if no specific message available
   * @param {boolean} options.showRetry - Whether to show retry option
   * @param {Function} options.onRetry - Callback function for retry action
   */
  const handleError = (error, options = {}) => {
    const {
      defaultMessage = 'An error occurred',
      showRetry = false,
      onRetry = null
    } = options;

    // Use enhanced error message from API interceptor or fallback to default
    const message = error.userMessage || error.message || defaultMessage;
    
    // Show error toast
    showToast('error', message);

    // Log error for debugging
    console.error('API Error:', error);

    // Show retry option for retryable errors
    if (showRetry && error.canRetry && onRetry) {
      // You could implement a retry button in the toast here
      // For now, we'll just log that retry is available
      console.log('Retry available for this error');
    }
  };

  /**
   * Execute an API call with automatic error handling and toast notifications
   * @param {Function} apiCall - The API call function
   * @param {Object} options - Configuration options
   * @param {string} options.loadingMessage - Message to show while loading
   * @param {string} options.successMessage - Message to show on success
   * @param {string} options.errorMessage - Custom error message
   * @param {boolean} options.showRetry - Whether to show retry option
   * @param {boolean} options.enableRetry - Whether to automatically retry failed requests
   * @param {number} options.maxRetries - Maximum number of retry attempts
   */
  const executeWithErrorHandling = async (apiCall, options = {}) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showRetry = false,
      enableRetry = false,
      maxRetries = 2
    } = options;

    try {
      // Show loading message if provided
      if (loadingMessage) {
        showToast('info', loadingMessage);
      }

      // Wait for online status if offline
      if (!navigator.onLine) {
        showToast('info', 'Waiting for internet connection...');
        await waitForOnline();
        showToast('success', 'Connection restored!');
      }

      // Execute API call with or without retry
      const result = enableRetry 
        ? await withRetry(apiCall, maxRetries)
        : await apiCall();

      // Show success message if provided
      if (successMessage) {
        showToast('success', successMessage);
      }

      return result;
    } catch (error) {
      handleError(error, {
        defaultMessage: errorMessage,
        showRetry,
        onRetry: enableRetry ? () => executeWithErrorHandling(apiCall, options) : null
      });
      throw error; // Re-throw so calling code can handle it if needed
    }
  };

  /**
   * Show offline notification
   */
  const showOfflineNotification = () => {
    showToast('error', 'You are currently offline. Some features may not work properly.');
  };

  /**
   * Show online notification
   */
  const showOnlineNotification = () => {
    showToast('success', 'Connection restored! You are back online.');
  };

  return {
    handleError,
    executeWithErrorHandling,
    showOfflineNotification,
    showOnlineNotification
  };
};

export default useApiError;