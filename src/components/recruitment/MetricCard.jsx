import { TrendingUp, TrendingDown } from 'lucide-react';
import { MiniSparkline } from '../ui/Chart';

export default function MetricCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  sparklineData = [], 
  color = 'blue',
  description,
  loading = false
}) {
  const colorClasses = {
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-green-500 text-green-600',
    purple: 'border-l-purple-500 text-purple-600',
    amber: 'border-l-amber-500 text-amber-600',
    cyan: 'border-l-cyan-500 text-cyan-600',
    red: 'border-l-red-500 text-red-600'
  };

  const sparklineColors = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    amber: '#f59e0b',
    cyan: '#06b6d4',
    red: '#ef4444'
  };

  const trendColorClasses = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 metric-card-mobile sm:metric-card-tablet lg:p-6 animate-pulse">
        <div className={`p-4 sm:p-5 lg:p-6 border-l-4 ${colorClasses[color] || colorClasses.blue}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              
              <div className="flex flex-col space-y-2 sm:space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 space-y-2 sm:space-y-0">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-100">
            <div className="h-7 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 metric-card-mobile sm:metric-card-tablet lg:p-6">
      <div className={`p-4 sm:p-5 lg:p-6 border-l-4 ${colorClasses[color] || colorClasses.blue}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 truncate pr-2">{title}</h3>
              <Icon className={`w-5 h-5 flex-shrink-0 ${colorClasses[color] || colorClasses.blue}`} />
            </div>
            
            <div className="flex flex-col space-y-2 sm:space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 space-y-2 sm:space-y-0">
                <p className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 metric-value">
                  {typeof value === 'number' ? value.toLocaleString() : value || '0'}
                </p>
                
                {trend && (
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium self-start metric-trend ${
                    trendColorClasses[trend.direction]
                  }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap">
                      {trend.value}% {trend.period}
                    </span>
                  </div>
                )}
              </div>
              
              {description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 sm:line-clamp-1">{description}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Professional Mini Sparkline Chart */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 pt-2 border-t border-gray-100">
            <MiniSparkline 
              data={sparklineData} 
              color={sparklineColors[color] || sparklineColors.blue}
              height={28}
              className="w-full opacity-80"
            />
          </div>
        )}
      </div>
    </div>
  );
}