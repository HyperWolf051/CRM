import { useState } from 'react';
import { 
  Activity, 
  UserPlus, 
  Calendar, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  CheckSquare,
  MapPin,
  Users
} from 'lucide-react';

const ActivityTimeline = ({ activities = [], onActivityClick, onFilterChange }) => {
  const [filter, setFilter] = useState('all');
  
  const activityIcons = {
    candidate: { icon: UserPlus, color: 'bg-green-500' },
    meeting: { icon: Calendar, color: 'bg-blue-500' },
    interview: { icon: MessageSquare, color: 'bg-purple-500' },
    job: { icon: Briefcase, color: 'bg-orange-500' },
    deal: { icon: DollarSign, color: 'bg-emerald-500' },
    task: { icon: CheckSquare, color: 'bg-indigo-500' }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onFilterChange && onFilterChange(newFilter);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Activity Feed
        </h3>
        
        {/* Activity Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'today', 'week'].map(period => (
            <button
              key={period}
              onClick={() => handleFilterChange(period)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 capitalize ${
                filter === period 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const { icon: Icon, color } = activityIcons[activity.type] || activityIcons.task;
            
            return (
              <div
                key={activity.id}
                onClick={() => onActivityClick && onActivityClick(activity)}
                className="relative flex items-start space-x-4 cursor-pointer group"
              >
                {/* Timeline Node */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                    {/* Activity Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {/* User Avatar */}
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {activity.user?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {activity.user || 'System'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    
                    {/* Activity Message */}
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {activity.message}
                    </p>
                    
                    {/* Activity Metadata */}
                    {activity.metadata && (
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        {activity.metadata.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {activity.metadata.location}
                          </span>
                        )}
                        {activity.metadata.participants && (
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {activity.metadata.participants} participants
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Load More */}
      <div className="text-center pt-4 border-t border-gray-200 mt-6">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;