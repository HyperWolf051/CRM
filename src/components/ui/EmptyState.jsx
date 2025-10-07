import { memo } from 'react';
import emptyStateIllustration from '@/assets/illustrations/empty-state.svg';

const EmptyState = memo(({ 
  icon, 
  title, 
  description, 
  action,
  className = '',
  useDefaultIllustration = false,
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      {...props}
    >
      {useDefaultIllustration ? (
        <div className="mb-6">
          <img 
            src={emptyStateIllustration} 
            alt="No data found" 
            className="w-48 h-auto opacity-75"
            loading="lazy"
          />
        </div>
      ) : icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
});

export default EmptyState;
