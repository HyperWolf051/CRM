import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Bell, 
  Calendar, 
  Plus, 
  Settings,
  CheckCircle,
  AlertCircle,
  Users,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';

const ReminderSystem = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('active');
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Follow up with John Doe',
      type: 'candidate_followup',
      candidate: 'John Doe',
      dueDate: '2025-01-16',
      dueTime: '10:00',
      priority: 'high',
      status: 'pending',
      method: 'phone'
    },
    {
      id: 2,
      title: 'Send interview feedback to client',
      type: 'client_feedback',
      candidate: 'Jane Smith',
      dueDate: '2025-01-16',
      dueTime: '14:30',
      priority: 'medium',
      status: 'pending',
      method: 'email'
    }
  ]);

  const reminderTypes = [
    { id: 'candidate_followup', name: 'Candidate Follow-up', icon: Users, color: 'blue' },
    { id: 'client_feedback', name: 'Client Feedback', icon: MessageSquare, color: 'green' },
    { id: 'interview_reminder', name: 'Interview Reminder', icon: Calendar, color: 'purple' },
    { id: 'document_request', name: 'Document Request', icon: Mail, color: 'orange' }
  ];

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
                Reminder System
              </h1>
              <p className="text-slate-600 text-sm">Manage follow-ups and scheduled notifications</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="border-b border-slate-200/50 px-8 pt-8">
            <div className="flex space-x-8">
              {[
                { id: 'active', name: 'Active Reminders', count: 8 },
                { id: 'completed', name: 'Completed', count: 24 },
                { id: 'settings', name: 'Settings', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.count && (
                    <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            
            {/* Active Reminders Tab */}
            {activeTab === 'active' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {reminders.filter(r => r.status === 'pending').map((reminder) => {
                    const reminderType = reminderTypes.find(t => t.id === reminder.type);
                    const Icon = reminderType?.icon || Bell;
                    
                    return (
                      <div key={reminder.id} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r from-${reminderType?.color || 'blue'}-500 to-${reminderType?.color || 'blue'}-600 rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{reminder.title}</h3>
                              <p className="text-sm text-slate-600">Candidate: {reminder.candidate}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1 text-sm text-slate-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{reminder.dueDate} at {reminder.dueTime}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-600">
                                  {reminder.method === 'phone' && <Phone className="w-4 h-4" />}
                                  {reminder.method === 'email' && <Mail className="w-4 h-4" />}
                                  <span className="capitalize">{reminder.method}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reminder.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : reminder.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {reminder.priority} priority
                            </span>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Complete</span>
                            </button>
                            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                              <Settings className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderSystem;