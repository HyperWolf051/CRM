import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  sparklineData = [], 
  color = 'blue',
  description 
}) {
  const colorClasses = {
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-green-500 text-green-600',
    purple: 'border-l-purple-500 text-purple-600',
    amber: 'border-l-amber-500 text-amber-600',
    cyan: 'border-l-cyan-500 text-cyan-600',
    red: 'border-l-red-500 text-red-600'
  };

  const trendColorClasses = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className={`p-6 border-l-4 ${colorClasses[color] || colorClasses.blue}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <Icon className={`w-5 h-5 ${colorClasses[color] || colorClasses.blue}`} />
            </div>
            
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              
              {trend && (
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  trendColorClasses[trend.direction]
                }`}>
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {trend.value}% {trend.period}
                </div>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        {/* Mini Sparkline Chart Placeholder */}
        {sparklineData.length > 0 && (
          <div className="mt-4 h-8 flex items-end space-x-1">
            {sparklineData.slice(-10).map((value, index) => (
              <div
                key={index}
                className={`flex-1 bg-gradient-to-t ${colorClasses[color]?.includes('blue') ? 'from-blue-200 to-blue-400' : 
                  colorClasses[color]?.includes('green') ? 'from-green-200 to-green-400' :
                  colorClasses[color]?.includes('purple') ? 'from-purple-200 to-purple-400' :
                  colorClasses[color]?.includes('amber') ? 'from-amber-200 to-amber-400' :
                  colorClasses[color]?.includes('cyan') ? 'from-cyan-200 to-cyan-400' :
                  'from-red-200 to-red-400'
                } rounded-sm opacity-70`}
                style={{ 
                  height: `${Math.max(4, (value / Math.max(...sparklineData)) * 32)}px` 
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}