import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Clock, 
  Send, 
  Plus, 
  Settings,
  Play,
  Pause,
  Eye,
  Save,
  Trash2,
  Users,
  Calendar,
  Target
} from 'lucide-react';

const EmailAutomation = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('sequences');
  const [sequences, setSequences] = useState([
    {
      id: 1,
      name: 'New Candidate Welcome',
      trigger: 'candidate_added',
      status: 'active',
      emails: 3,
      sent: 156,
      opened: 89,
      clicked: 23
    },
    {
      id: 2,
      name: 'Client Follow-up',
      trigger: 'shortlist_sent',
      status: 'paused',
      emails: 2,
      sent: 78,
      opened: 45,
      clicked: 12
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to our recruitment process',
      category: 'candidate',
      lastModified: '2025-01-15'
    },
    {
      id: 2,
      name: 'Interview Reminder',
      subject: 'Reminder: Interview scheduled for tomorrow',
      category: 'interview',
      lastModified: '2025-01-14'
    }
  ]);

  const triggers = [
    { id: 'candidate_added', name: 'Candidate Added', description: 'When a new candidate is added to the system' },
    { id: 'shortlist_sent', name: 'Shortlist Sent', description: 'When candidate is shortlisted for client' },
    { id: 'interview_scheduled', name: 'Interview Scheduled', description: 'When interview is scheduled' },
    { id: 'feedback_received', name: 'Feedback Received', description: 'When client provides feedback' }
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
                Email Automation
              </h1>
              <p className="text-slate-600 text-sm">Manage automated email sequences and templates</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Sequence</span>
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
                { id: 'sequences', name: 'Email Sequences', icon: Mail },
                { id: 'templates', name: 'Templates', icon: Settings },
                { id: 'triggers', name: 'Triggers', icon: Target },
                { id: 'analytics', name: 'Analytics', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            
            {/* Email Sequences Tab */}
            {activeTab === 'sequences' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Email Sequences</h2>
                    <p className="text-sm text-slate-600">Automated email campaigns triggered by candidate actions</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Sequence</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {sequences.map((sequence) => (
                    <div key={sequence.id} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{sequence.name}</h3>
                            <p className="text-sm text-slate-600">Trigger: {triggers.find(t => t.id === sequence.trigger)?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sequence.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {sequence.status}
                          </span>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            {sequence.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">{sequence.emails}</div>
                          <div className="text-sm text-slate-600">Emails</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{sequence.sent}</div>
                          <div className="text-sm text-slate-600">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{sequence.opened}</div>
                          <div className="text-sm text-slate-600">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{sequence.clicked}</div>
                          <div className="text-sm text-slate-600">Clicked</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Email Templates</h2>
                    <p className="text-sm text-slate-600">Reusable email templates for automation sequences</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Template</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <Settings className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{template.subject}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="px-2 py-1 bg-slate-200 rounded-full">{template.category}</span>
                        <span>Modified {template.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Triggers Tab */}
            {activeTab === 'triggers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Automation Triggers</h2>
                  <p className="text-sm text-slate-600">Configure when email sequences should be triggered</p>
                </div>

                <div className="grid gap-4">
                  {triggers.map((trigger) => (
                    <div key={trigger.id} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{trigger.name}</h3>
                            <p className="text-sm text-slate-600">{trigger.description}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Configure
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Email Analytics</h2>
                  <p className="text-sm text-slate-600">Performance metrics for your email automation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <Send className="w-8 h-8" />
                      <span className="text-blue-100 text-sm">This Month</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">1,234</div>
                    <div className="text-blue-100">Emails Sent</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <Mail className="w-8 h-8" />
                      <span className="text-green-100 text-sm">Open Rate</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">68%</div>
                    <div className="text-green-100">Emails Opened</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8" />
                      <span className="text-purple-100 text-sm">Click Rate</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">24%</div>
                    <div className="text-purple-100">Links Clicked</div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8" />
                      <span className="text-orange-100 text-sm">Conversion</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">12%</div>
                    <div className="text-orange-100">Responses</div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
                  <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New candidate welcome email sent', candidate: 'John Doe', time: '2 minutes ago' },
                      { action: 'Interview reminder delivered', candidate: 'Jane Smith', time: '15 minutes ago' },
                      { action: 'Client follow-up sequence started', candidate: 'Mike Johnson', time: '1 hour ago' },
                      { action: 'Feedback request email opened', candidate: 'Sarah Wilson', time: '2 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <span className="text-slate-900">{activity.action}</span>
                          <span className="text-slate-600"> - {activity.candidate}</span>
                        </div>
                        <span className="text-sm text-slate-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation;