import { useEffect } from 'react';
import { useApiError } from '@/hooks/useApiError';

/**
 * Component that monitors network status and shows notifications
 * when the user goes online/offline
 */
const NetworkStatus = () => {
  const { showOfflineNotification, showOnlineNotification } = useApiError();

  useEffect(() => {
    const handleOnline = () => {
      showOnlineNotification();
    };

    const handleOffline = () => {
      showOfflineNotification();
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show initial offline notification if already offline
    if (!navigator.onLine) {
      showOfflineNotification();
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOfflineNotification, showOnlineNotification]);

  // This component doesn't render anything
  return null;
};

export default NetworkStatus;