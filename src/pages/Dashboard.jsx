import { 
  Users, TrendingUp, DollarSign, Target, Calendar, BarChart3, Clock,
  Bell, Settings, FileText, UserPlus, Briefcase, ChevronRight,
  MoreHorizontal, Star, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const { metrics, loading, error } = useDashboard();
  const navigate = useNavigate();

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
    <div className="space-y-6 animate-fade-in p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Hello, {metrics?.user?.name || 'User'} 👋
          </h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sales Overview</h2>
                <p className="text-sm text-slate-500">Monthly performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1">
                  <option>2024</option>
                  <option>2023</option>
                </select>
                <button className="p-2 hover:bg-slate-50 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-end justify-center p-4 space-x-2">
              {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 85].map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                  style={{ height: `${height}%`, width: '20px' }}
                ></div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: UserPlus, color: 'from-green-500 to-green-600', title: 'New candidate: Sarah Johnson', time: '2 minutes ago', type: 'candidate' },
                { icon: Briefcase, color: 'from-blue-500 to-blue-600', title: 'Job posted: Senior Developer', time: '15 minutes ago', type: 'job' },
                { icon: Star, color: 'from-yellow-500 to-yellow-600', title: 'Candidate shortlisted: Mike Chen', time: '1 hour ago', type: 'shortlist' },
                { icon: Calendar, color: 'from-purple-500 to-purple-600', title: 'Interview scheduled with Alex Brown', time: '2 hours ago', type: 'interview' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
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
        </div>

        {/* Right Column - Quick Actions and Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: UserPlus, label: 'Add Candidate', color: 'from-green-500 to-green-600', href: '/app/candidates' },
                { icon: Briefcase, label: 'Post Job', color: 'from-blue-500 to-blue-600', href: '/app/jobs' },
                { icon: Calendar, label: 'Schedule Interview', color: 'from-purple-500 to-purple-600', href: '/app/calendar' },
                { icon: BarChart3, label: 'View Reports', color: 'from-orange-500 to-orange-600', href: '/app/analytics' },
                { icon: Building2, label: 'Add Client', color: 'from-cyan-500 to-cyan-600', href: '/app/companies' },
                { icon: FileText, label: 'Generate Report', color: 'from-pink-500 to-pink-600', href: '/app/reports' },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 transform hover:scale-[1.02] group border border-slate-100 cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Calendar</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Full
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-xs font-medium text-slate-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Start from previous month
                  const isCurrentMonth = day > 0 && day <= 31;
                  const isToday = day === new Date().getDate() && isCurrentMonth;
                  const hasEvent = [5, 12, 18, 25].includes(day);
                  
                  return (
                    <div
                      key={i}
                      className={`
                        h-8 w-8 flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all duration-200
                        ${isCurrentMonth 
                          ? isToday 
                            ? 'bg-blue-500 text-white font-bold' 
                            : hasEvent
                              ? 'bg-blue-50 text-blue-600 font-medium hover:bg-blue-100'
                              : 'text-slate-700 hover:bg-slate-50'
                          : 'text-slate-300'
                        }
                      `}
                    >
                      {day > 0 ? day : ''}
                      {hasEvent && isCurrentMonth && !isToday && (
                        <div className="absolute w-1 h-1 bg-blue-500 rounded-full mt-4"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Upcoming</h3>
              <div className="space-y-2">
                {[
                  { title: 'Interview with John Doe', time: '10:00 AM', color: 'bg-blue-100 text-blue-700' },
                  { title: 'Team Meeting', time: '2:00 PM', color: 'bg-green-100 text-green-700' },
                  { title: 'Client Call', time: '4:30 PM', color: 'bg-purple-100 text-purple-700' },
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className={`w-2 h-2 rounded-full ${event.color.split(' ')[0]}`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;