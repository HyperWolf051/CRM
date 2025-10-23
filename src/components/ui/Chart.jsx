import { memo, useState, useEffect } from 'react';

// Enhanced Interactive Bar Chart with Day 2 Animations
const BarChart = memo(({ 
  data, 
  height = 300, 
  onBarClick, 
  showTooltip = true,
  animate = true,
  className = '' 
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  useEffect(() => {
    if (animate) {
      // Ultra smooth staggered animation for growth effect
      let progress = 0;
      const duration = 4000; // 4 seconds total for slow, relaxed animation
      const interval = 16; // ~60fps for smooth but relaxed animation
      const increment = interval / duration;
      
      const timer = setInterval(() => {
        progress += increment;
        // Linear easing for constant speed - matches line chart
        const clampedProgress = Math.min(progress, 1);
        setAnimationProgress(clampedProgress);
        
        if (progress >= 1) {
          clearInterval(timer);
          setAnimationProgress(1);
        }
      }, interval);
      
      return () => clearInterval(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate, data]); // Re-animate when data changes

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  if (!data || data.length === 0) return null;

  // Use same padding and sizing as LineChart for consistency
  const chartPadding = { top: 15, right: 20, bottom: 25, left: 40 };
  const chartHeight = height - chartPadding.top - chartPadding.bottom;
  
  // Calculate dynamic Y-axis range based on data
  const dataValues = data.map(d => d.value);
  const minDataValue = Math.min(...dataValues);
  const maxDataValue = Math.max(...dataValues);
  const dataRange = maxDataValue - minDataValue;
  
  // Add 10% padding to the range for better visualization
  const padding = Math.max(dataRange * 0.1, 5);
  const minDisplayValue = Math.max(0, minDataValue - padding);
  const maxDisplayValue = maxDataValue + padding;
  const displayRange = maxDisplayValue - minDisplayValue;

  // Calculate bar dimensions once for reuse
  const chartWidth = 600 - chartPadding.left - chartPadding.right;
  const barWidth = Math.min(chartWidth / (data.length * 2), 40);
  const totalBarsWidth = data.length * barWidth;
  const totalSpacing = chartWidth - totalBarsWidth;
  const spaceBetweenBars = totalSpacing / (data.length + 1);

  // Helper function to format Y-axis labels
  const formatYAxisLabel = (value) => {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return Math.round(value).toString();
  };

  return (
    <div className={`relative ${className}`} style={{ height, width: '100%' }}>
      <svg width="100%" height="100%" className="overflow-visible relative z-10" viewBox={`0 0 600 ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Y-axis labels and grid lines to match LineChart */}
        {(() => {
          const yAxisLabels = [];
          for (let i = 0; i <= 4; i++) {
            const value = minDisplayValue + (displayRange * i / 4);
            const y = chartPadding.top + (chartHeight * (4 - i) / 4);
            yAxisLabels.push({ value: Math.round(value), y });
          }
          return yAxisLabels.map((label, index) => (
            <g key={index}>
              <line
                x1={chartPadding.left}
                y1={label.y}
                x2={600 - chartPadding.right}
                y2={label.y}
                stroke="currentColor"
                className="text-gray-100"
                strokeWidth="0.5"
                strokeDasharray="1,3"
                opacity="0.3"
              />
              <text
                x={chartPadding.left - 5}
                y={label.y + 3}
                textAnchor="end"
                className="text-xs font-medium fill-current text-gray-400"
              >
                {formatYAxisLabel(label.value)}
              </text>
            </g>
          ));
        })()}
        
        {/* Axes */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={height - chartPadding.bottom}
          stroke="currentColor"
          className="text-gray-200"
          strokeWidth="0.5"
          opacity="0.5"
        />
        
        <line
          x1={chartPadding.left}
          y1={height - chartPadding.bottom}
          x2={600 - chartPadding.right}
          y2={height - chartPadding.bottom}
          stroke="currentColor"
          className="text-gray-200"
          strokeWidth="0.5"
          opacity="0.5"
        />
        
        {/* Modern Gradient Fill for bars */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" />
          </linearGradient>
        </defs>

        {/* Bars */}
        {data.map((item, index) => {
          // Use pre-calculated bar dimensions
          const x = chartPadding.left + spaceBetweenBars + (index * (barWidth + spaceBetweenBars));
          
          // Map value to chart height using same scale as LineChart
          const normalizedValue = Math.max(0, (item.value - minDisplayValue) / displayRange);
          const barHeight = Math.max(2, normalizedValue * chartHeight); // Minimum height of 2px to avoid axis collision
          const y = height - chartPadding.bottom - barHeight;
          
          // Staggered animation delay for each bar (cascading effect)
          const staggerDelay = index * 0.2; // 200ms delay between bars for smoother effect
          const staggeredProgress = Math.max(0, Math.min(1, (animationProgress - staggerDelay) / 0.8));
          const animatedHeight = Math.max(1, barHeight * staggeredProgress); // Ensure minimum animated height
          const animatedY = height - chartPadding.bottom - animatedHeight;
          
          return (
            <g key={index}>
              {/* Glow Effect Behind Bar (prevents flickering) */}
              {hoveredBar === index && (
                <rect
                  x={x - 2}
                  y={animatedY - 2}
                  width={barWidth + 4}
                  height={animatedHeight + 4}
                  className="fill-blue-400/15"
                  rx="8"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              
              {/* Bar Shadow for depth */}
              <rect
                x={x + 2}
                y={animatedY + 2}
                width={barWidth}
                height={animatedHeight}
                className="fill-black/10"
                rx="6"
                style={{ pointerEvents: 'none' }}
              />
              
              {/* Invisible Hover Area (larger for better UX) */}
              <rect
                x={x - 10}
                y={animatedY - 10}
                width={barWidth + 20}
                height={animatedHeight + 20}
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setHoveredBar(index);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setHoveredBar(null), 50);
                  setHoverTimeout(timeout);
                }}
                onClick={() => onBarClick?.(item, index)}
              />
              
              {/* Main Bar with gradient */}
              <rect
                x={x}
                y={animatedY}
                width={barWidth}
                height={animatedHeight}
                fill="url(#barGradient)"
                className="transition-all duration-300"
                rx="6"
                style={{
                  filter: hoveredBar === index ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))' : 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.1))',
                  transformOrigin: 'bottom center',
                  transform: hoveredBar === index ? 'scale(1.02)' : 'scale(1)',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Animated Value Label */}
              <text
                x={x + barWidth / 2}
                y={animatedY - 8}
                textAnchor="middle"
                className={`text-xs font-semibold transition-all duration-300 ${
                  hoveredBar === index 
                    ? 'fill-indigo-600' 
                    : 'fill-gray-600'
                }`}
                style={{
                  opacity: staggeredProgress,
                  transform: hoveredBar === index ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: 'center'
                }}
              >
                {formatYAxisLabel(Math.round(item.value * staggeredProgress))}
              </text>
              
              {/* Category Label */}
              <text
                x={x + barWidth / 2}
                y={height - chartPadding.bottom + 15}
                textAnchor="middle"
                className="text-xs font-medium fill-current text-gray-400"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Enhanced Interactive Tooltip */}
      {showTooltip && hoveredBar !== null && (
        <div 
          className="absolute bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white text-sm px-4 py-3 rounded-xl pointer-events-none z-50 shadow-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            left: `${((chartPadding.left + spaceBetweenBars + (hoveredBar * (barWidth + spaceBetweenBars)) + barWidth / 2) / 600) * 100}%`,
            top: `${Math.max(10, height - chartPadding.bottom - ((data[hoveredBar].value - minDisplayValue) / displayRange) * chartHeight - 60)}px`,
            transform: 'translateX(-50%)',
            minWidth: '150px'
          }}
        >
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          
          <div className="space-y-2">
            <div className="font-bold text-blue-300 text-center border-b border-white/20 pb-1">
              {data[hoveredBar].label}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Revenue:</span>
                <span className="font-semibold text-green-400">{formatYAxisLabel(data[hoveredBar].value)}</span>
              </div>
              
              {data[hoveredBar].details && (
                <div className="text-xs text-gray-400 pt-1 border-t border-white/10">
                  {data[hoveredBar].details}
                </div>
              )}
              
              {/* Show change from previous month */}
              {data[hoveredBar].change !== null && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-gray-400">Change:</span>
                  <span className={`font-medium ${
                    data[hoveredBar].change > 0 
                      ? data[hoveredBar].change > 50 ? 'text-orange-400' : 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {data[hoveredBar].change > 0 ? '+' : ''}{data[hoveredBar].change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Enhanced Interactive Line Chart with Professional UI
const LineChart = memo(({ 
  data, 
  height = 300, 
  onPointClick,
  showTooltip = true,
  animate = true,
  className = '' 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  useEffect(() => {
    if (animate) {
      // Ultra smooth animation for line drawing with delay
      setAnimationProgress(0);
      const timer = setTimeout(() => {
        const startTime = performance.now();
        const duration = 4000; // 4 seconds for moderate, constant speed line drawing
        
        const animationFrame = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Perfectly linear progress - no easing at all
          setAnimationProgress(progress);
          
          if (progress < 1) {
            requestAnimationFrame(animationFrame);
          } else {
            setAnimationProgress(1);
          }
        };
        
        requestAnimationFrame(animationFrame);
      }, 400); // Slightly longer delay for dramatic effect
      
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate, data]); // Re-animate when data changes

  // Cleanup hover timeout
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // Optimized padding for wide rectangular chart - minimal empty space
  const chartPadding = { top: 15, right: 20, bottom: 25, left: 40 };
  const chartHeight = height - chartPadding.top - chartPadding.bottom;
  
  // Calculate dynamic Y-axis range based on data
  const dataValues = data.map(d => d.value);
  const minDataValue = Math.min(...dataValues);
  const maxDataValue = Math.max(...dataValues);
  const dataRange = maxDataValue - minDataValue;
  
  // Add 10% padding to the range for better visualization
  const padding = Math.max(dataRange * 0.1, 5);
  const minDisplayValue = Math.max(0, minDataValue - padding);
  const maxDisplayValue = maxDataValue + padding;
  const displayRange = maxDisplayValue - minDisplayValue;
  
  const points = data.map((item, index) => {
    // Calculate x position for wide chart (600px viewBox width for wider appearance)
    const chartWidth = 600 - chartPadding.left - chartPadding.right;
    const x = chartPadding.left + (index / (data.length - 1)) * chartWidth;
    const y = chartPadding.top + ((maxDisplayValue - item.value) / displayRange) * chartHeight;
    return { x, y, ...item };
  });

  // Calculate path data for smooth line drawing animation
  const totalLength = points.reduce((acc, point, index) => {
    if (index === 0) return 0;
    const prevPoint = points[index - 1];
    return acc + Math.sqrt(Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2));
  }, 0);

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Generate Y-axis labels with dynamic range
  const yAxisLabels = [];
  for (let i = 0; i <= 4; i++) {
    const value = minDisplayValue + (displayRange * i / 4);
    const y = chartPadding.top + (chartHeight * (4 - i) / 4);
    yAxisLabels.push({ value: Math.round(value), y });
  }

  // Helper function to format Y-axis labels
  const formatYAxisLabel = (value) => {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return Math.round(value).toString();
  };

  // Detect significant changes for highlighting
  const getChangePercentage = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className={`relative ${className}`} style={{ height, width: '100%' }}>

      <svg width="100%" height="100%" className="overflow-visible relative z-10" viewBox={`0 0 600 ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Minimal Grid Lines */}
        {yAxisLabels.map((label, index) => (
          <line
            key={index}
            x1={chartPadding.left}
            y1={label.y}
            x2={600 - chartPadding.right}
            y2={label.y}
            stroke="currentColor"
            className="text-gray-100"
            strokeWidth="0.5"
            strokeDasharray="1,3"
            opacity="0.3"
          />
        ))}
        
        {/* Minimal Axes */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={height - chartPadding.bottom}
          stroke="currentColor"
          className="text-gray-200"
          strokeWidth="0.5"
          opacity="0.5"
        />
        
        <line
          x1={chartPadding.left}
          y1={height - chartPadding.bottom}
          x2={600 - chartPadding.right}
          y2={height - chartPadding.bottom}
          stroke="currentColor"
          className="text-gray-200"
          strokeWidth="0.5"
          opacity="0.5"
        />
        
        {/* Y-Axis Labels */}
        {yAxisLabels.map((label, index) => (
          <text
            key={index}
            x={chartPadding.left - 5}
            y={label.y + 3}
            textAnchor="end"
            className="text-xs font-medium fill-current text-gray-400"
          >
            {formatYAxisLabel(label.value)}
          </text>
        ))}
        

        
        {/* Modern Gradient Fill */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0" />
          </linearGradient>
          
          {/* Gradient for the line itself */}
          <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" />
          </linearGradient>
        </defs>
        
        {/* Area under line with animation */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - chartPadding.bottom} L ${points[0].x} ${height - chartPadding.bottom} Z`}
          fill="url(#lineGradient)"
          opacity={animationProgress * 0.8}
          className="transition-opacity duration-500"
        />
        
        {/* Modern Gradient Line with smooth drawing animation */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - animationProgress)}
          style={{ 
            filter: hoveredPoint !== null ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' : 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.1))'
          }}
        />
        
        {/* Modern Data Points with Change Labels */}
        {points.map((point, index) => {
          const changePercent = point.change;
          const hasChange = changePercent !== null;
          
          return (
            <g key={index}>
              {/* Invisible hover area for better UX */}
              <circle
                cx={point.x}
                cy={point.y}
                r="15"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setHoveredPoint(index);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setHoveredPoint(null), 100);
                  setHoverTimeout(timeout);
                }}
                onClick={() => onPointClick?.(point, index)}
              />
              
              {/* Modern data point with gradient */}
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? "5" : "4"}
                fill="url(#lineStroke)"
                className="cursor-pointer transition-all duration-300"
                opacity={animationProgress}
                style={{
                  filter: hoveredPoint === index ? 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.6))' : 'drop-shadow(0 1px 2px rgba(139, 92, 246, 0.2))',
                  transform: hoveredPoint === index ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: 'center'
                }}
              />
              
              {/* White center dot for modern look */}
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? "2" : "1.5"}
                className="fill-white cursor-pointer transition-all duration-300"
                opacity={animationProgress}
              />
              
              {/* Percentage Change Labels */}
              {hasChange && (
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  className={`text-xs font-bold transition-all duration-500 ${
                    changePercent > 0 
                      ? changePercent > 50 ? 'fill-orange-600' : 'fill-green-600'
                      : 'fill-red-500'
                  }`}
                  opacity={animationProgress}
                >
                  {changePercent > 0 ? '+' : ''}{changePercent}%
                </text>
              )}
              
              {/* Value labels on hover */}
              {hoveredPoint === index && (
                <text
                  x={point.x}
                  y={point.y - (hasChange ? 35 : 25)}
                  textAnchor="middle"
                  className="text-xs font-bold fill-indigo-600 animate-in fade-in duration-200"
                >
                  {formatYAxisLabel(point.value)}
                </text>
              )}
            </g>
          );
        })}
        
        {/* X-Axis Labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - chartPadding.bottom + 15}
            textAnchor="middle"
            className="text-xs font-medium fill-current text-gray-400"
          >
            {point.label}
          </text>
        ))}

      </svg>
      
      {/* Enhanced Interactive Tooltip */}
      {showTooltip && hoveredPoint !== null && (
        <div 
          className="absolute bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white text-sm px-4 py-3 rounded-xl pointer-events-none z-50 shadow-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            left: `${(points[hoveredPoint].x / 600) * 100}%`,
            top: `${points[hoveredPoint].y - 50}px`,
            transform: 'translateX(-50%)',
            minWidth: '150px'
          }}
        >
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          
          <div className="space-y-2">
            <div className="font-bold text-blue-300 text-center border-b border-white/20 pb-1">
              {points[hoveredPoint].label}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Revenue:</span>
                <span className="font-semibold text-green-400">{formatYAxisLabel(points[hoveredPoint].value)}</span>
              </div>
              
              {points[hoveredPoint].details && (
                <div className="text-xs text-gray-400 pt-1 border-t border-white/10">
                  {points[hoveredPoint].details}
                </div>
              )}
              
              {/* Show change from previous month */}
              {points[hoveredPoint].change !== null && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-gray-400">Change:</span>
                  <span className={`font-medium ${
                    points[hoveredPoint].change > 0 
                      ? points[hoveredPoint].change > 50 ? 'text-orange-400' : 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {points[hoveredPoint].change > 0 ? '+' : ''}{points[hoveredPoint].change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const PieChart = memo(({ data, size = 200, className = '' }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  
  let currentAngle = -90; // Start from top
  
  const colors = [
    'text-blue-500',
    'text-green-500',
    'text-purple-500',
    'text-orange-500',
    'text-red-500',
    'text-indigo-500'
  ];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          
          const startAngle = (currentAngle * Math.PI) / 180;
          const endAngle = ((currentAngle + angle) * Math.PI) / 180;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={pathData}
              className={`fill-current transition-all duration-300 hover:opacity-80 ${
                item.color || colors[index % colors.length]
              }`}
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-full left-0 right-0 mt-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  item.color || colors[index % colors.length]
                }`}
              />
              <span className="text-gray-600 truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

BarChart.displayName = 'BarChart';
LineChart.displayName = 'LineChart';
PieChart.displayName = 'PieChart';

// Mini Sparkline Component
const MiniSparkline = memo(({ data, color = "white", height = 32, className = "" }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - value) / range) * (height - 4) + 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="opacity-60"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

// Chart Controls Component
const ChartControls = memo(({ 
  timeRange, 
  onTimeRangeChange,
  onExport,
  onRefresh,
  chartType,
  onChartTypeChange
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-4">
      {/* Time Range Selector */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {['7D', '30D', '90D', '1Y'].map(range => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
              timeRange === range 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart Type Toggle */}
      {onChartTypeChange && (
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onChartTypeChange('line')}
            className={`p-2 rounded-md transition-all duration-300 transform hover:scale-110 ${
              chartType === 'line' 
                ? 'bg-white text-blue-600 shadow-lg scale-105 ring-2 ring-blue-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
            }`}
            title="Line Chart"
          >
            <svg className={`w-4 h-4 transition-all duration-300 ${chartType === 'line' ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            </svg>
          </button>
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`p-2 rounded-md transition-all duration-300 transform hover:scale-110 ${
              chartType === 'bar' 
                ? 'bg-white text-blue-600 shadow-lg scale-105 ring-2 ring-blue-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
            }`}
            title="Bar Chart"
          >
            <svg className={`w-4 h-4 transition-all duration-300 ${chartType === 'bar' ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
    
    {/* Action Buttons */}
    <div className="flex items-center space-x-2">
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="relative p-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 
                     overflow-hidden group hover:shadow-md hover:scale-110"
        >
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                          transform scale-0 group-hover:scale-100 
                          transition-transform duration-200 ease-out rounded-lg"></div>
        </button>
      )}
      {onExport && (
        <button
          onClick={onExport}
          className="relative px-3 py-2 bg-blue-600 text-white rounded-lg text-sm transition-all duration-200 
                     flex items-center space-x-2 overflow-hidden group hover:shadow-lg hover:scale-105"
        >
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="relative z-10">Export</span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 
                          transform translate-x-full group-hover:translate-x-0 
                          transition-transform duration-200 ease-out"></div>
        </button>
      )}
    </div>
  </div>
));

// Chart Container Component with smooth transitions
const ChartContainer = memo(({ 
  data, 
  height = 300, 
  onPointClick,
  onBarClick,
  showTooltip = true,
  animate = true,
  className = '',
  chartType = 'line',
  onChartTypeChange
}) => {
  const [currentChartType, setCurrentChartType] = useState(String(chartType));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ensure data is valid
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>;
  }

  // Sync with external chartType prop
  useEffect(() => {
    const newChartType = String(chartType);
    if (newChartType !== currentChartType) {
      setCurrentChartType(newChartType);
    }
  }, [chartType, currentChartType]);

  const handleChartTypeChange = (newType) => {
    const safeNewType = String(newType);
    if (safeNewType !== currentChartType && !isTransitioning) {
      setIsTransitioning(true);
      
      // Smooth transition effect
      setTimeout(() => {
        setCurrentChartType(safeNewType);
        if (onChartTypeChange && typeof onChartTypeChange === 'function') {
          onChartTypeChange(safeNewType);
        }
        
        // End transition after chart animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 200);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Transition overlay for smooth effect */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Switching chart...</span>
          </div>
        </div>
      )}
      
      {/* Chart Content */}
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {currentChartType === 'line' ? (
          <LineChart
            data={data}
            height={height}
            onPointClick={onPointClick}
            showTooltip={showTooltip}
            animate={animate && !isTransitioning}
            className={className}
          />
        ) : (
          <BarChart
            data={data}
            height={height}
            onBarClick={onBarClick}
            showTooltip={showTooltip}
            animate={animate && !isTransitioning}
            className={className}
          />
        )}
      </div>
    </div>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
ChartControls.displayName = 'ChartControls';
ChartContainer.displayName = 'ChartContainer';
export 
{ BarChart, LineChart, PieChart, MiniSparkline, ChartControls, ChartContainer };