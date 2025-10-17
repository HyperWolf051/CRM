import { memo, useState, useEffect } from 'react';

// Enhanced Interactive Bar Chart
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

  useEffect(() => {
    if (animate) {
      // Smooth staggered animation for growth effect
      let progress = 0;
      const duration = 1500; // 1.5 seconds total
      const interval = 16; // ~60fps
      const increment = interval / duration;
      
      const timer = setInterval(() => {
        progress += increment;
        // Easing function for smooth growth (ease-out-cubic)
        const easedProgress = 1 - Math.pow(1 - Math.min(progress, 1), 3);
        setAnimationProgress(easedProgress);
        
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

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="10%"
            y1={`${y}%`}
            x2="90%"
            y2={`${y}%`}
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 60);
          // Staggered animation delay for each bar (cascading effect)
          const staggerDelay = index * 0.15; // 150ms delay between bars
          const staggeredProgress = Math.max(0, Math.min(1, (animationProgress - staggerDelay) / 0.7));
          const animatedHeight = barHeight * staggeredProgress;
          const x = 15 + (index * (70 / data.length));
          const y = height - animatedHeight - 40;
          
          return (
            <g key={index}>
              {/* Bar Shadow for depth */}
              <rect
                x={`${x + 0.5}%`}
                y={y + 2}
                width={`${60 / data.length}%`}
                height={animatedHeight}
                className="fill-black/10"
                rx="4"
              />
              
              {/* Main Bar */}
              <rect
                x={`${x}%`}
                y={y}
                width={`${60 / data.length}%`}
                height={animatedHeight}
                className={`transition-all duration-500 cursor-pointer transform-gpu ${
                  hoveredBar === index 
                    ? 'opacity-90 scale-105 drop-shadow-lg' 
                    : 'opacity-100 scale-100'
                } ${item.color || 'fill-blue-500'}`}
                rx="4"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => onBarClick?.(item, index)}
                style={{
                  filter: hoveredBar === index ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
                  transformOrigin: 'bottom center'
                }}
              />
              
              {/* Animated Glow Effect on Hover */}
              {hoveredBar === index && (
                <rect
                  x={`${x - 0.5}%`}
                  y={y - 2}
                  width={`${60 / data.length + 1}%`}
                  height={animatedHeight + 4}
                  className="fill-blue-400/20 animate-pulse"
                  rx="6"
                />
              )}
              
              {/* Animated Value Label */}
              <text
                x={`${x + (30 / data.length)}%`}
                y={y - 8}
                textAnchor="middle"
                className={`text-xs font-semibold transition-all duration-300 ${
                  hoveredBar === index 
                    ? 'fill-blue-600 text-sm' 
                    : 'fill-gray-600'
                }`}
                style={{
                  opacity: staggeredProgress,
                  transform: hoveredBar === index ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: 'center'
                }}
              >
                {Math.round(item.value * staggeredProgress)}
              </text>
              
              {/* Category Label */}
              <text
                x={`${x + (30 / data.length)}%`}
                y={height - 20}
                textAnchor="middle"
                className="text-xs font-medium fill-current text-gray-500"
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
          className="absolute bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm px-4 py-3 rounded-xl pointer-events-none z-50 shadow-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            left: `${15 + (hoveredBar * (70 / data.length)) + (30 / data.length)}%`,
            top: `${height - (data[hoveredBar].value / maxValue) * (height - 60) - 80}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          
          <div className="space-y-1">
            <div className="font-bold text-blue-300">{data[hoveredBar].label}</div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Value:</span>
              <span className="font-semibold text-green-400">{data[hoveredBar].value}</span>
            </div>
            {data[hoveredBar].details && (
              <div className="text-xs text-gray-400 pt-1 border-t border-white/10">
                {data[hoveredBar].details}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// Enhanced Interactive Line Chart
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

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 80 + 10; // 10% padding on each side
    const y = ((maxValue - item.value) / range) * (height - 80) + 40;
    return { x, y, ...item };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="10%"
            y1={`${y}%`}
            x2="90%"
            y2={`${y}%`}
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Gradient Fill */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area under line */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - 40} L ${points[0].x} ${height - 40} Z`}
          fill="url(#lineGradient)"
          opacity={animationProgress}
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={animate ? `${animationProgress * 1000} 1000` : 'none'}
          className="transition-all duration-1000"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === index ? "6" : "4"}
              className="fill-blue-500 cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={() => onPointClick?.(point, index)}
              opacity={animationProgress}
            />
            
            {/* Label */}
            <text
              x={point.x}
              y={height - 20}
              textAnchor="middle"
              className="text-xs font-medium fill-current text-gray-500"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Interactive Tooltip */}
      {showTooltip && hoveredPoint !== null && (
        <div 
          className="absolute bg-black/80 text-white text-xs px-3 py-2 rounded-lg pointer-events-none z-50"
          style={{
            left: `${points[hoveredPoint].x}px`,
            top: `${points[hoveredPoint].y - 40}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold">{points[hoveredPoint].label}</div>
          <div>Value: {points[hoveredPoint].value}</div>
          {points[hoveredPoint].details && <div>{points[hoveredPoint].details}</div>}
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
  onRefresh 
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
    </div>
    
    {/* Action Buttons */}
    <div className="flex items-center space-x-2">
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
      {onExport && (
        <button
          onClick={onExport}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export</span>
        </button>
      )}
    </div>
  </div>
));

MiniSparkline.displayName = 'MiniSparkline';
ChartControls.displayName = 'ChartControls';
export 
{ BarChart, LineChart, PieChart, MiniSparkline, ChartControls };