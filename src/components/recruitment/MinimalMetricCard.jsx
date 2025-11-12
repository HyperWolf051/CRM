import { TrendingUp, TrendingDown } from 'lucide-react';
import { MiniSparkline } from '../ui/Chart';

/**
 * MinimalMetricCard Component
 * 
 * A deliberately understated metric card that follows human-crafted design principles:
 * - No colorful borders or gradients
 * - Subtle shadows with imperfect spacing
 * - Monochromatic color scheme
 * - Simple hover effects without transforms
 */
export default function MinimalMetricCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  sparklineData = [], 
  description,
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card p-17 animate-pulse">
        <div className="flex items-start justify-between mb-13">
          <div className="h-4 bg-minimal-light-gray rounded w-24"></div>
          <div className="w-5 h-5 bg-minimal-light-gray rounded"></div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="h-8 bg-minimal-light-gray rounded w-20"></div>
          <div className="h-6 bg-minimal-light-gray rounded w-16"></div>
          <div className="h-3 bg-minimal-light-gray rounded w-32"></div>
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-17 pt-13 border-t border-minimal-border-gray">
            <div className="h-7 bg-minimal-light-gray rounded w-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card hover:shadow-minimal-elevated transition-shadow duration-150 p-17">
      <div className="flex items-start justify-between mb-13">
        <h3 className="text-sm font-medium text-minimal-text-medium truncate pr-2">
          {title}
        </h3>
        <Icon className="w-5 h-5 flex-shrink-0 text-minimal-text-medium" />
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-baseline space-x-3">
          <p className="text-2xl font-bold text-minimal-text-dark">
            {typeof value === 'number' ? value.toLocaleString() : value || '0'}
          </p>
          
          {trend && (
            <div className="flex items-center px-2 py-1 bg-minimal-light-gray rounded text-xs font-medium text-minimal-text-dark">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0 text-minimal-text-medium" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 flex-shrink-0 text-minimal-text-medium" />
              )}
              <span className="whitespace-nowrap">
                {trend.value}% {trend.period}
              </span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-minimal-text-light italic">{description}</p>
        )}
      </div>
      
      {/* Minimal Sparkline Chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-17 pt-13 border-t border-minimal-border-gray">
          <MiniSparkline 
            data={sparklineData} 
            color="#718096"
            height={28}
            className="w-full opacity-60"
          />
        </div>
      )}
    </div>
  );
}
