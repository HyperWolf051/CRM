import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  Mail, 
  Clock, 
  Bell, 
  Settings,
  Play,
  Pause,
  TrendingUp,
  Users,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AutomationDashboard = () => {
  const navigate = useNavigate();
  
  const [automations] = useState([
    {
      id: 1,
      name: 'New Candidate Welcome',
      type: 'email',
      status: 'active',
      triggered: 156,
      success: 142,
      lastRun: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Interview Reminders',
      type: 'notification',
      status: 'active',
      triggered: 89,
      success: 87,
      lastRun: '15 minutes ago'
    },
    {
      id: 3,
      name: 'Client Follow-up',
      type: 'email',
      status: 'paused',
      triggered: 45,
      success: 38,
      lastRun: '2 hours ago'
    }
  ]);

  const stats = {
    totalAutomations: 12,
    activeAutomations: 8,
    totalTriggers: 1247,
    successRate: 91.2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Automation Dashboard
              </h1>
              <p className="text-slate-600 text-sm">Central hub for managing all automated processes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/email-automation')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Automation</span>
            </button>
            <button 
              onClick={() => navigate('/app/reminders')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Reminders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
                <span className="text-blue-100 bg-blue-600 px-2 py-1 rounded-full text-xs">Total</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stats.totalAutomations}</div>
              <div className="text-slate-600">Automations</div>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Play className="w-8 h-8 text-green-600" />
                <span className="text-green-100 bg-green-600 px-2 py-1 rounded-full text-xs">Active</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stats.activeAutomations}</div>
              <div className="text-slate-600">Running</div>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-purple-600" />
                <span className="text-purple-100 bg-purple-600 px-2 py-1 rounded-full text-xs">Today</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stats.totalTriggers}</div>
              <div className="text-slate-600">Triggers</div>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <span className="text-orange-100 bg-orange-600 px-2 py-1 rounded-full text-xs">Rate</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stats.successRate}%</div>
              <div className="text-slate-600">Success</div>
            </div>
          </div>

          {/* Active Automations */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200/50">
              <h2 className="text-lg font-semibold text-slate-900">Active Automations</h2>
              <p className="text-sm text-slate-600">Monitor and manage your automated workflows</p>
            </div>
            
            <div className="p-8 space-y-4">
              {automations.map((automation) => (
                <div key={automation.id} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        automation.type === 'email' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}>
                        {automation.type === 'email' ? (
                          <Mail className="w-6 h-6 text-white" />
                        ) : (
                          <Bell className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{automation.name}</h3>
                        <p className="text-sm text-slate-600">Last run: {automation.lastRun}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">{automation.triggered}</div>
                        <div className="text-xs text-slate-600">Triggered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{automation.success}</div>
                        <div className="text-xs text-slate-600">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.round((automation.success / automation.triggered) * 100)}%
                        </div>
                        <div className="text-xs text-slate-600">Rate</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          automation.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {automation.status}
                        </span>
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                          {automation.status === 'active' ? (
                            <Pause className="w-4 h-4 text-slate-600" />
                          ) : (
                            <Play className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/app/email-automation')}
              className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6 hover:shadow-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <Mail className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Email Automation</h3>
              <p className="text-sm text-slate-600">Create and manage automated email sequences</p>
            </button>

            <button 
              onClick={() => navigate('/app/reminders')}
              className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6 hover:shadow-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Reminder System</h3>
              <p className="text-sm text-slate-600">Schedule and manage follow-up reminders</p>
            </button>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">System Health</h3>
              <p className="text-sm text-slate-600">All automation systems running smoothly</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;