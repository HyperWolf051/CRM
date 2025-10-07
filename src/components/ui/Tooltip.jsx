import { useState } from 'react';

const Tooltip = ({ 
  content, 
  position = 'top', 
  children,
  className = '',
  delay = 200,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-gray-900',
  };
  
  const positionClass = positions[position] || positions.top;
  const arrowClass = arrowPositions[position] || arrowPositions.top;
  
  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };
  
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };
  
  const handleFocus = () => {
    setIsVisible(true);
  };
  
  const handleBlur = () => {
    setIsVisible(false);
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby={isVisible ? tooltipId : undefined}
      {...props}
    >
      {children}
      
      {isVisible && content && (
        <div 
          id={tooltipId}
          className={`
            absolute z-50 px-3 py-2 
            text-sm text-white bg-gray-900 rounded-md 
            whitespace-nowrap pointer-events-none
            transition-all duration-150 transform
            animate-fade-in
            ${positionClass}
          `}
          role="tooltip"
        >
          {content}
          <div 
            className={`
              absolute w-0 h-0 
              border-4 border-transparent
              ${arrowClass}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
