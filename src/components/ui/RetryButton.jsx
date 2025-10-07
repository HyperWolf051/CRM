import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * A button component that provides retry functionality with loading state
 */
const RetryButton = ({ 
  onRetry, 
  children = 'Retry', 
  variant = 'secondary',
  size = 'sm',
  className = '',
  ...props 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying || !onRetry) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      // Error handling is done by the onRetry function
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRetry}
      loading={isRetrying}
      disabled={isRetrying}
      icon={<RefreshCw className="w-4 h-4" />}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default RetryButton;