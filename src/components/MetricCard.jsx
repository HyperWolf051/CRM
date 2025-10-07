import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './ui/Card';
import SkeletonLoader from './ui/SkeletonLoader';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SkeletonLoader width="60%" height="1rem" className="mb-2" />
            <SkeletonLoader width="80%" height="2rem" />
          </div>
          <SkeletonLoader width="3rem" height="3rem" className="rounded-full" />
        </div>
        <div className="mt-4">
          <SkeletonLoader width="40%" height="0.875rem" />
        </div>
      </Card>
    );
  }

  const isPositiveTrend = trend >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';
  const trendBg = isPositiveTrend ? 'bg-green-50' : 'bg-red-50';

  return (
    <Card className={`hover-lift cursor-pointer ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <div className={`flex items-center px-2 py-1 rounded-full ${trendBg}`}>
            <TrendIcon className={`w-4 h-4 ${trendColor} mr-1`} />
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(trend)}%
            </span>
          </div>
          <span className="text-sm text-gray-500 ml-2">
            vs last month
          </span>
        </div>
      )}
    </Card>
  );
};

export default memo(MetricCard);