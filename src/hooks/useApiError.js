import { useToast } from '@/context/ToastContext';
import { withRetry, waitForOnline } from '@/utils/api';

export const useApiError = () => {
  const { showToast } = useToast();

  const handleError = (error, options = {}) => {
    const { defaultMessage = 'An error occurred', showRetry = false, onRetry = null } = options;
    const message = error.userMessage || error.message || defaultMessage;
    
    showToast('error', message);
    console.error('API Error:', error);

    if (showRetry && error.canRetry && onRetry) {
      console.log('Retry available for this error');
    }
  };

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
      if (loadingMessage) showToast('info', loadingMessage);

      if (!navigator.onLine) {
        showToast('info', 'Waiting for internet connection...');
        await waitForOnline();
        showToast('success', 'Connection restored!');
      }

      const result = enableRetry ? await withRetry(apiCall, maxRetries) : await apiCall();
      if (successMessage) showToast('success', successMessage);
      return result;
    } catch (error) {
      handleError(error, {
        defaultMessage: errorMessage,
        showRetry,
        onRetry: enableRetry ? () => executeWithErrorHandling(apiCall, options) : null
      });
      throw error;
    }
  };

  const showOfflineNotification = () => {
    showToast('error', 'You are currently offline. Some features may not work properly.');
  };

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