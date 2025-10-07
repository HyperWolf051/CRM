import { memo, useState, useEffect } from 'react';
import { isDemoMode } from '@/utils/demoApi';

const DemoModeIndicator = memo(() => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isDemoMode()) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // Hide after 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isDemoMode() || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 px-4 z-50 shadow-lg animate-slide-down">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🚀</span>
        <span className="font-medium">Demo Mode Active</span>
        <span className="text-sm opacity-90">- All data is simulated for demonstration</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-yellow-200 transition-colors"
          aria-label="Close demo mode indicator"
        >
          ✕
        </button>
      </div>
    </div>
  );
});

export default DemoModeIndicator;