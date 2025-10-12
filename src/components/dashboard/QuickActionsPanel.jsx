import { useState } from 'react';
import { 
  Zap, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Mail, 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Phone, 
  Video, 
  Clock 
} from 'lucide-react';

const QuickActionsPanel = ({ onActionClick }) => {
  const [activeCategory, setActiveCategory] = useState('common');
  
  const actionCategories = {
    common: {
      label: 'Common Actions',
      icon: Zap,
      actions: [
        { 
          id: 'add-candidate', 
          label: 'Add Candidate', 
          icon: UserPlus, 
          color: 'from-blue-500 to-blue-600',
          shortcut: 'C',
          description: 'Add a new candidate to your pipeline'
        },
        { 
          id: 'post-job', 
          label: 'Post Job', 
          icon: Briefcase, 
          color: 'from-green-500 to-green-600',
          shortcut: 'J',
          description: 'Create a new job posting'
        },
        { 
          id: 'schedule-meeting', 
          label: 'Schedule', 
          icon: Calendar, 
          color: 'from-purple-500 to-purple-600',
          shortcut: 'S',
          description: 'Schedule a meeting or interview'
        },
        { 
          id: 'send-email', 
          label: 'Send Email', 
          icon: Mail, 
          color: 'from-orange-500 to-orange-600',
          shortcut: 'E',
          description: 'Send email to candidates or clients'
        }
      ]
    },
    reports: {
      label: 'Reports & Analytics',
      icon: BarChart3,
      actions: [
        { 
          id: 'generate-report', 
          label: 'Generate Report', 
          icon: FileText, 
          color: 'from-indigo-500 to-indigo-600',
          shortcut: 'R',
          description: 'Generate performance reports'
        },
        { 
          id: 'export-data', 
          label: 'Export Data', 
          icon: Download, 
          color: 'from-teal-500 to-teal-600',
          shortcut: 'X',
          description: 'Export candidate or job data'
        },
        { 
          id: 'view-analytics', 
          label: 'Analytics', 
          icon: TrendingUp, 
          color: 'from-pink-500 to-pink-600',
          shortcut: 'A',
          description: 'View detailed analytics'
        },
        { 
          id: 'pipeline-review', 
          label: 'Pipeline Review', 
          icon: Target, 
          color: 'from-cyan-500 to-cyan-600',
          shortcut: 'P',
          description: 'Review recruitment pipeline'
        }
      ]
    },
    communication: {
      label: 'Communication',
      icon: MessageSquare,
      actions: [
        { 
          id: 'bulk-email', 
          label: 'Bulk Email', 
          icon: Mail, 
          color: 'from-red-500 to-red-600',
          shortcut: 'B',
          description: 'Send emails to multiple recipients'
        },
        { 
          id: 'sms-campaign', 
          label: 'SMS Campaign', 
          icon: Phone, 
          color: 'from-yellow-500 to-yellow-600',
          shortcut: 'M',
          description: 'Send SMS to candidates'
        },
        { 
          id: 'video-call', 
          label: 'Video Call', 
          icon: Video, 
          color: 'from-emerald-500 to-emerald-600',
          shortcut: 'V',
          description: 'Start a video interview'
        },
        { 
          id: 'follow-up', 
          label: 'Follow Up', 
          icon: Clock, 
          color: 'from-violet-500 to-violet-600',
          shortcut: 'F',
          description: 'Set follow-up reminders'
        }
      ]
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h3>
        <div className="text-xs text-gray-500">
          Press Alt + key to trigger
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {Object.entries(actionCategories).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeCategory === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actionCategories[activeCategory].actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick && onActionClick(action)}
              className={`group relative p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden`}
              title={action.description}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-sm font-medium mb-1">{action.label}</div>
                
                {/* Keyboard Shortcut */}
                <div className="text-xs bg-white/20 px-2 py-1 rounded text-center">
                  Alt + {action.shortcut}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          );
        })}
      </div>
      
      {/* Recent Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">Recent Actions</div>
        <div className="space-y-2">
          {[
            { action: 'Added candidate Sarah Johnson', time: '2 min ago' },
            { action: 'Scheduled interview with Mike', time: '1 hour ago' },
            { action: 'Posted Senior Developer role', time: '3 hours ago' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span>{item.action}</span>
              <span className="text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;