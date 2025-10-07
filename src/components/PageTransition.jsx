import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'fade-out') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-in');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <div
      className={`
        transition-all duration-150 ease-out
        ${transitionStage === 'fade-out' 
          ? 'opacity-0 transform translate-y-2' 
          : 'opacity-100 transform translate-y-0'
        }
      `}
      key={displayLocation.pathname}
    >
      {children}
    </div>
  );
};

export default PageTransition;