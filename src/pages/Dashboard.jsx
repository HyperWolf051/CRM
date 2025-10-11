import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Briefcase,
  Phone,
  ChevronLeft,
  ChevronRight,
  Zap,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  Edit,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const daysOfWeek = [
    { short: 'S', full: 'Sunday' },
    { short: 'M', full: 'Monday' },
    { short: 'T', full: 'Tuesday' },
    { short: 'W', full: 'Wednesday' },
    { short: 'T', full: 'Thursday' },
    { short: 'F', full: 'Friday' },
    { short: 'S', full: 'Saturday' }
  ];

  // Sample candidate data for the candidate details section
  const candidateDetails = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'Senior React Developer',
      address: 'San Francisco, CA',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      role: 'UX/UI Designer',
      address: 'New York, NY',
      status: 'Interviewed'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      role: 'Backend Engineer',
      address: 'Austin, TX',
      status: 'Hired'
    }
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      message: 'Sarah Johnson was added as a candidate',
      time: '2 hours ago',
      type: 'candidate'
    },
    {
      id: 2,
      message: 'Client call scheduled by Uroos',
      time: '4 hours ago',
      type: 'meeting'
    },
    {
      id: 3,
      message: 'Interview completed for Michael Chen',
      time: '1 day ago',
      type: 'interview'
    },
    {
      id: 4,
      message: 'New job posting published',
      time: '2 days ago',
      type: 'job'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Interviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hired':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const quickActions = [
    {
      icon: UserPlus,
      label: 'Add Candidate',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/app/candidates')
    },
    {
      icon: Briefcase,
      label: 'Post Job',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/app/deals')
    },
    {
      icon: CalendarIcon,
      label: 'Schedule',
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/app/calendar')
    },
    {
      icon: Phone,
      label: 'Call Client',
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Call client')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Hello, Uroos</h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Top Row - Metric Cards */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          
          {/* Weekly Balance Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium opacity-90 mb-2">Weekly Balance</h3>
              <p className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">$20k</p>
              <button className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-105 font-medium">
                View entire list
              </button>
            </div>
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
            </div>
          </div>

          {/* Orders In Line Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium opacity-90 mb-2">Orders In Line</h3>
              <p className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">750</p>
              <button className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-105 font-medium">
                View entire list
              </button>
            </div>
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl transform rotate-12"></div>
            </div>
          </div>

          {/* New Clients Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium opacity-90 mb-2">New Clients</h3>
              <p className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">150</p>
              <button className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-105 font-medium">
                View entire list
              </button>
            </div>
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          
          {/* Sales Analytics Chart */}
          <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Sales</h2>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:scale-105">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="relative h-56 bg-gray-50 rounded-xl p-4">
              <div className="flex items-end justify-between h-40 mb-4">
                {[
                  { height: 80, color: 'bg-blue-500', label: 'Jan', revenue: '$45k', profit: '$12k', expenses: '$33k' },
                  { height: 110, color: 'bg-blue-600', label: 'Feb', revenue: '$58k', profit: '$18k', expenses: '$40k' },
                  { height: 60, color: 'bg-blue-400', label: 'Mar', revenue: '$38k', profit: '$8k', expenses: '$30k' },
                  { height: 130, color: 'bg-blue-700', label: 'Apr', revenue: '$72k', profit: '$22k', expenses: '$50k' },
                  { height: 95, color: 'bg-blue-500', label: 'May', revenue: '$52k', profit: '$15k', expenses: '$37k' },
                  { height: 75, color: 'bg-blue-400', label: 'Jun', revenue: '$41k', profit: '$11k', expenses: '$30k' }
                ].map((bar, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="relative group">
                      <div 
                        className={`w-12 rounded-t-lg transition-all duration-700 delay-${index * 100} ${bar.color} hover:opacity-80 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105`}
                        style={{ height: `${bar.height}px` }}
                      ></div>
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-10">
                        <div className="text-center">
                          <div className="font-semibold text-blue-300 mb-1">Revenue: {bar.revenue}</div>
                          <div className="text-green-300 mb-1">Profit: {bar.profit}</div>
                          <div className="text-red-300">Expenses: {bar.expenses}</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 font-semibold">{bar.label}</span>
                  </div>
                ))}
              </div>
              
              {/* Chart Labels */}
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Monthly Revenue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Profit Margin</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Operating Expenses</span>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">$306k</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">$86k</div>
                    <div className="text-xs text-gray-500">Total Profit</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">$220k</div>
                    <div className="text-xs text-gray-500">Total Expenses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Calendar</h2>
              <button 
                onClick={() => navigate('/app/calendar')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                View
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group">
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              </button>
              <span className="text-sm font-semibold text-gray-900 px-3 py-1 bg-gray-100 rounded-lg">
                Feb 2023
              </span>
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group">
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day, index) => (
                  <div key={`${day.full}-${index}`} className="p-1 text-center text-xs font-medium text-gray-500">
                    {day.short}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, index) => {
                  const dayNumber = index - 6; // Adjust for Feb 2023 starting on Wednesday
                  const isValidDay = dayNumber > 0 && dayNumber <= 28;
                  const isHighlighted = [4, 5, 6, 7].includes(dayNumber);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        aspect-square flex items-center justify-center text-xs rounded cursor-pointer
                        transition-all duration-300
                        ${!isValidDay ? 'text-transparent cursor-default' : ''}
                        ${isHighlighted ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600 hover:bg-gray-100'}
                        ${dayNumber === 15 ? 'bg-blue-500 text-white font-bold' : ''}
                      `}
                    >
                      {isValidDay ? dayNumber : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform ${
                    activity.type === 'candidate' ? 'bg-green-500' :
                    activity.type === 'meeting' ? 'bg-blue-500' :
                    activity.type === 'interview' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Bottom Row */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          
          {/* Candidate Details */}
          <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Candidate Details</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 group">
                  <Filter className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:scale-105">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
            
            {/* Candidate Cards */}
            <div className="space-y-4">
              {candidateDetails.map((candidate) => (
                <div key={candidate.id} className="group bg-gray-50 rounded-xl p-5 hover:bg-white transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:shadow-md transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{candidate.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 font-medium">{candidate.role}</p>
                      <p className="text-xs text-gray-500 mb-1">{candidate.email}</p>
                      <p className="text-xs text-gray-500">{candidate.address}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => navigate(`/app/candidates/${candidate.id}`)}
                        className="p-3 hover:bg-blue-100 rounded-xl transition-all duration-200 group/btn hover:scale-110 shadow-sm hover:shadow-md"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600 transition-colors" />
                      </button>
                      <button 
                        onClick={() => navigate(`/app/candidates/${candidate.id}/edit`)}
                        className="p-3 hover:bg-green-100 rounded-xl transition-all duration-200 group/btn hover:scale-110 shadow-sm hover:shadow-md"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-500 group-hover/btn:text-green-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-600" />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      group relative p-3 rounded-xl bg-gradient-to-r ${action.color}
                      text-white shadow-md hover:shadow-lg transition-all duration-300
                      transform hover:scale-105 hover:-translate-y-0.5
                      overflow-hidden
                    `}
                  >
                    <div className="relative z-10">
                      <Icon className="w-5 h-5 mx-auto" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;