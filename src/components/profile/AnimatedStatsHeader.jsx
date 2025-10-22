import React, { useState, useEffect } from 'react';

const AnimatedStatsHeader = () => {
  const [animatedStats, setAnimatedStats] = useState({
    deals: 0,
    team: 0,
    revenue: 0,
    success: 0
  });

  const targetStats = {
    deals: 127,
    team: 15,
    revenue: 2.4,
    success: 94
  };

  useEffect(() => {
    const animateStats = () => {
      const duration = 2500; // 2.5 seconds
      const steps = 60; // 60fps
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setAnimatedStats({
          deals: Math.round(targetStats.deals * easeOutQuart),
          team: Math.round(targetStats.team * easeOutQuart),
          revenue: Math.round(targetStats.revenue * easeOutQuart * 10) / 10,
          success: Math.round(targetStats.success * easeOutQuart)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const timeout = setTimeout(animateStats, 800); // Start animation after 800ms
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
      <div className="text-center lg:text-left">
        <div className="text-2xl font-bold text-white transition-all duration-300">
          {animatedStats.deals}
        </div>
        <div className="text-blue-200 text-sm">Deals Closed</div>
      </div>
      <div className="text-center lg:text-left">
        <div className="text-2xl font-bold text-white transition-all duration-300">
          {animatedStats.team}
        </div>
        <div className="text-blue-200 text-sm">Team Members</div>
      </div>
      <div className="text-center lg:text-left">
        <div className="text-2xl font-bold text-white transition-all duration-300">
          ${animatedStats.revenue}M
        </div>
        <div className="text-blue-200 text-sm">Revenue</div>
      </div>
      <div className="text-center lg:text-left">
        <div className="text-2xl font-bold text-white transition-all duration-300">
          {animatedStats.success}%
        </div>
        <div className="text-blue-200 text-sm">Success Rate</div>
      </div>
    </div>
  );
};

export default AnimatedStatsHeader;