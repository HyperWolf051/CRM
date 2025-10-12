import { TrendingUp, TrendingDown } from 'lucide-react';
import { MiniSparkline } from '../ui/Chart';

const AdvancedMetricCard = ({ 
  title, 
  value, 
  trend, 
  comparison, 
  icon: Icon, 
  color, 
  onClick,
  loading = false,
  sparklineData = []
}) => (
  <div 
    className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl 
                transition-all duration-500 transform hover:scale-105 cursor-pointer
                bg-gradient-to-br ${color}`}
    onClick={onClick}
  >
    {/* Loading State */}
    {loading && (
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    )}
    
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
    
    <div className="relative z-10">
      {/* Header with Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm ${
          trend > 0 ? 'bg-green-500/30' : 'bg-red-500/30'
        }`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      {/* Main Value */}
      <div className="text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>
      
      {/* Title and Comparison */}
      <div className="text-sm opacity-90 mb-3">{title}</div>
      <div className="text-xs opacity-75">{comparison}</div>
      
      {/* Mini Sparkline */}
      {sparklineData.length > 0 && (
        <div className="mt-4 h-8">
          <MiniSparkline data={sparklineData} color="white" />
        </div>
      )}
    </div>
    
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  </div>
);

export default AdvancedMetricCard;