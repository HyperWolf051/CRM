import { 
  UserPlus, 
  Calendar, 
  Mail, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  Phone,
  Upload
} from 'lucide-react';
import { useState } from 'react';

export default function ActivityTimelineWidget({ 
  activities = [], 
  loading = false,
  maxItems = 10 
}) {
  const [showAll, setShowAll] = useState(false);

  const getActivityIcon = (type) => {
    const icons = {
      'candidate-added': UserPlus,
      'interview-scheduled': Calendar,
      'email-sent': Mail,
      'note-added': MessageSquare,
      'status-updated': CheckCircle,
      'interview-completed': CheckCircle,
      'interview-cancelled': XCircle,
      'call-made': Phone,
      'document-uploaded': Upload,
      'offer-sent': FileText,
      'offer-accepted': CheckCircle,
      'offer-declined': XCircle
    };
    return icons[type] || Clock;
  };

  const getActivityColor = (type) => {
    const colors = {
      'candidate-added': 'bg-blue-100 text-blue-600 border-blue-200',
      'interview-scheduled': 'bg-green-100 text-green-600 border-green-200',
      'email-sent': 'bg-purple-100 text-purple-600 border-purple-200',
      'note-added': 'bg-amber-100 text-amber-600 border-amber-200',
      'status-updated': 'bg-cyan-100 text-cyan-600 border-cyan-200',
      'interview-completed': 'bg-green-100 text-green-600 border-green-200',
      'interview-cancelled': 'bg-red-100 text-red-600 border-red-200',
      'call-made': 'bg-indigo-100 text-indigo-600 border-indigo-200',
      'document-uploaded': 'bg-gray-100 text-gray-600 border-gray-200',
      'offer-sent': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'offer-accepted': 'bg-green-100 text-green-600 border-green-200',
      'offer-declined': 'bg-red-100 text-red-600 border-red-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffTime = Math.abs(now - time);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d ago`;
    
    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock activity data if none provided
  const mockActivities = [
    {
      id: '1',
      type: 'candidate-added',
      title: 'New candidate added',
      description: 'Tanishka Negi applied for Software Engineer position',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      candidateId: '1',
      jobId: '1'
    },
    {
      id: '2',
      type: 'interview-scheduled',
      title: 'Interview scheduled',
      description: 'Video interview with Rahul Sharma for Product Manager',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      candidateId: '2',
      jobId: '2'
    },
    {
      id: '3',
      type: 'email-sent',
      title: 'Email sent',
      description: 'Follow-up email sent to Priya Patel',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      candidateId: '3'
    },
    {
      id: '4',
      type: 'status-updated',
      title: 'Status updated',
      description: 'Sarah Johnson moved to Interview stage',
      user: 'Lisa Chen',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      candidateId: '4'
    },
    {
      id: '5',
      type: 'note-added',
      title: 'Note added',
      description: 'Added interview feedback for Alex Wilson',
      user: 'David Brown',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      candidateId: '5'
    },
    {
      id: '6',
      type: 'offer-sent',
      title: 'Offer sent',
      description: 'Job offer sent to Maria Garcia for Senior Developer',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      candidateId: '6',
      jobId: '3'
    }
  ];

  // Only show mock activities if no activities provided and not loading
  const displayActivities = activities.length > 0 ? activities : (loading ? [] : mockActivities);
  const visibleActivities = showAll ? displayActivities : displayActivities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      {activities.length === 0 && !loading ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : displayActivities.length > 0 ? (
        <>
          <div className="space-y-4">
            {visibleActivities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const isLast = index === visibleActivities.length - 1;
              
              return (
                <div key={activity.id} className="relative group">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200 group-hover:bg-blue-200 transition-colors"></div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    {/* Activity icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${getActivityColor(activity.type)}`}>
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                    
                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              by {activity.user}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quick action button */}
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-600 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Show more/less button */}
          {displayActivities.length > maxItems && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAll ? 'Show Less' : `Show ${displayActivities.length - maxItems} More Activities`}
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}