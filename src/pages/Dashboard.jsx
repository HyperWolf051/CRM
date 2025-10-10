import { Users, TrendingUp, DollarSign, Target, Activity, Calendar, Mail, Phone, BarChart3, Clock } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const { metrics, loading, error } = useDashboard();

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading dashboard
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format currency value
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0%';
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Contacts */}
        <div className="animate-stagger-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : (metrics?.totalContacts?.toLocaleString() || '0')}
                </div>
                <div className="text-sm text-slate-500">Total Contacts</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{metrics?.contactsTrend || 0}%
                </span>
              </div>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Active Deals */}
        <div className="animate-stagger-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : (metrics?.activeDeals?.toLocaleString() || '0')}
                </div>
                <div className="text-sm text-slate-500">Active Deals</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{metrics?.dealsTrend || 0}%
                </span>
              </div>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="animate-stagger-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : formatCurrency(metrics?.revenue)}
                </div>
                <div className="text-sm text-slate-500">Total Revenue</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{metrics?.revenueTrend || 0}%
                </span>
              </div>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="animate-stagger-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : formatPercentage(metrics?.conversionRate)}
                </div>
                <div className="text-sm text-slate-500">Conversion Rate</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{metrics?.conversionTrend || 0}%
                </span>
              </div>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: Mail, color: 'from-blue-500 to-blue-600', title: 'New email from John Smith', time: '2 minutes ago', type: 'email' },
              { icon: Phone, color: 'from-green-500 to-green-600', title: 'Call scheduled with Sarah Johnson', time: '15 minutes ago', type: 'call' },
              { icon: TrendingUp, color: 'from-purple-500 to-purple-600', title: 'Deal "Enterprise Software" moved to negotiation', time: '1 hour ago', type: 'deal' },
              { icon: Users, color: 'from-orange-500 to-orange-600', title: 'New contact added: Michael Chen', time: '2 hours ago', type: 'contact' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className={`w-10 h-10 bg-gradient-to-r ${activity.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            {[
              { icon: Users, label: 'Add Contact', color: 'from-blue-500 to-blue-600' },
              { icon: TrendingUp, label: 'Create Deal', color: 'from-purple-500 to-purple-600' },
              { icon: Calendar, label: 'Schedule Meeting', color: 'from-green-500 to-green-600' },
              { icon: BarChart3, label: 'View Reports', color: 'from-orange-500 to-orange-600' },
            ].map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;