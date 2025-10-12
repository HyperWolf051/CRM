import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const EnhancedHeader = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-slate-200/50 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          
          {/* Enhanced Greeting */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              {getTimeBasedGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-slate-600 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Welcome to your CRM Dashboard
            </p>
          </div>
        </div>
        
        {/* Date & Time Widget */}
        <div className="text-right">
          <div className="text-lg font-semibold text-slate-900">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-sm text-slate-500">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeader;