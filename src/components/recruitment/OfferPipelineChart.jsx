import { useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const statusConfig = {
  draft: {
    color: '#6B7280',
    bgColor: '#F3F4F6',
    icon: FileText,
    label: 'Draft'
  },
  sent: {
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    icon: Clock,
    label: 'Sent'
  },
  'under-review': {
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    icon: AlertCircle,
    label: 'Under Review'
  },
  negotiating: {
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    icon: MessageSquare,
    label: 'Negotiating'
  },
  accepted: {
    color: '#10B981',
    bgColor: '#ECFDF5',
    icon: CheckCircle,
    label: 'Accepted'
  },
  declined: {
    color: '#EF4444',
    bgColor: '#FEF2F2',
    icon: XCircle,
    label: 'Declined'
  },
  expired: {
    color: '#6B7280',
    bgColor: '#F9FAFB',
    icon: Clock,
    label: 'Expired'
  },
  withdrawn: {
    color: '#F97316',
    bgColor: '#FFF7ED',
    icon: AlertCircle,
    label: 'Withdrawn'
  }
};

export default function OfferPipelineChart({ data, timeRange = 'last-30-days', showTrends = true }) {
  const pipelineData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      // Mock data for demonstration
      return [
        { status: 'draft', count: 8, previousCount: 6, conversionRate: 85 },
        { status: 'sent', count: 12, previousCount: 10, conversionRate: 75 },
        { status: 'under-review', count: 6, previousCount: 8, conversionRate: 60 },
        { status: 'negotiating', count: 4, previousCount: 5, conversionRate: 80 },
        { status: 'accepted', count: 15, previousCount: 12, conversionRate: null },
        { status: 'declined', count: 3, previousCount: 4, conversionRate: null },
        { status: 'expired', count: 2, previousCount: 1, conversionRate: null },
        { status: 'withdrawn', count: 1, previousCount: 2, conversionRate: null }
      ];
    }
    return data;
  }, [data]);

  const totalOffers = pipelineData.reduce((sum, item) => sum + item.count, 0);
  const activeOffers = pipelineData
    .filter(item => ['draft', 'sent', 'under-review', 'negotiating'].includes(item.status))
    .reduce((sum, item) => sum + item.count, 0);

  const successRate = totalOffers > 0 
    ? ((pipelineData.find(item => item.status === 'accepted')?.count || 0) / totalOffers * 100).toFixed(1)
    : 0;

  const getTrendIcon = (current, previous) => {
    if (!showTrends || previous === undefined) return null;
    if (current > previous) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  const getTrendPercentage = (current, previous) => {
    if (!showTrends || previous === undefined || previous === 0) return null;
    const change = ((current - previous) / previous * 100).toFixed(1);
    return Math.abs(change);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Offers</p>
              <p className="text-2xl font-bold text-blue-900">{totalOffers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Active Offers</p>
              <p className="text-2xl font-bold text-amber-900">{activeOffers}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-900">{successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-6">Offer Pipeline Flow</h4>
        
        {/* Active Pipeline (Draft → Accepted) */}
        <div className="mb-8">
          <h5 className="text-sm font-medium text-gray-700 mb-4">Active Pipeline</h5>
          <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
            {pipelineData
              .filter(item => ['draft', 'sent', 'under-review', 'negotiating', 'accepted'].includes(item.status))
              .map((item, index, array) => {
                const config = statusConfig[item.status];
                const Icon = config.icon;
                const isLast = index === array.length - 1;
                const trendIcon = getTrendIcon(item.count, item.previousCount);
                const trendPercentage = getTrendPercentage(item.count, item.previousCount);

                return (
                  <div key={item.status} className="flex items-center flex-shrink-0">
                    {/* Stage */}
                    <div className="text-center min-w-[120px]">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                      </div>
                      
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {config.label}
                      </div>
                      
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-lg font-bold" style={{ color: config.color }}>
                          {item.count}
                        </span>
                        {trendIcon && (
                          <div className="flex items-center space-x-1">
                            {trendIcon}
                            <span className="text-xs text-gray-500">
                              {trendPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {item.conversionRate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.conversionRate}% convert
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    {!isLast && (
                      <div className="flex-shrink-0 mx-4">
                        <div className="w-8 h-0.5 bg-gray-300 relative">
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Closed Offers */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-4">Closed Offers</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pipelineData
              .filter(item => ['declined', 'expired', 'withdrawn'].includes(item.status))
              .map((item) => {
                const config = statusConfig[item.status];
                const Icon = config.icon;
                const trendIcon = getTrendIcon(item.count, item.previousCount);
                const trendPercentage = getTrendPercentage(item.count, item.previousCount);

                return (
                  <div 
                    key={item.status} 
                    className="border border-gray-200 rounded-lg p-4"
                    style={{ backgroundColor: config.bgColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'white' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {config.label}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold" style={{ color: config.color }}>
                              {item.count}
                            </span>
                            {trendIcon && (
                              <div className="flex items-center space-x-1">
                                {trendIcon}
                                <span className="text-xs text-gray-500">
                                  {trendPercentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Conversion Metrics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pipelineData.find(item => item.status === 'sent')?.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Draft → Sent</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pipelineData.find(item => item.status === 'under-review')?.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Sent → Review</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {pipelineData.find(item => item.status === 'negotiating')?.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Review → Negotiate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-sm text-gray-600">Overall Success</div>
          </div>
        </div>
      </div>
    </div>
  );
}