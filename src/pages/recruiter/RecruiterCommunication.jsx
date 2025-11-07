import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Share2, 
  Video, 
  Settings, 
  Users, 
  BarChart3,
  Plus,
  Filter,
  Search,
  Calendar,
  Bell
} from 'lucide-react';
import EmailSequenceBuilder from '../../components/communication/EmailSequenceBuilder';
import TeamCollaboration from '../../components/communication/TeamCollaboration';
import ClientRelationshipManager from '../../components/communication/ClientRelationshipManager';
import SocialMediaIntegration from '../../components/communication/SocialMediaIntegration';
import VideoConferenceIntegration from '../../components/communication/VideoConferenceIntegration';
import CommunicationPreferencesManager from '../../components/communication/CommunicationPreferencesManager';
import { useCommunication } from '../../hooks/useCommunication';

const RecruiterCommunication = () => {
  const { 
    emailSequences, 
    fetchEmailSequences, 
    socialMediaIntegrations, 
    fetchSocialMediaIntegrations,
    videoConferenceIntegrations,
    fetchVideoConferenceIntegrations
  } = useCommunication();

  const [activeTab, setActiveTab] = useState('overview');
  const [showEmailBuilder, setShowEmailBuilder] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalEmails: 1250,
    emailOpenRate: 68.5,
    totalMeetings: 45,
    activeSequences: 8,
    teamTasks: 12,
    clientInteractions: 156
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'email_sent',
      description: 'Welcome sequence email sent to John Doe',
      timestamp: new Date('2024-01-15T10:30:00'),
      user: 'Sarah Wilson'
    },
    {
      id: '2',
      type: 'meeting_created',
      description: 'Interview meeting scheduled with TechCorp',
      timestamp: new Date('2024-01-15T09:15:00'),
      user: 'Mike Johnson'
    },
    {
      id: '3',
      type: 'task_completed',
      description: 'Follow-up task completed for candidate Jane Smith',
      timestamp: new Date('2024-01-15T08:45:00'),
      user: 'Lisa Chen'
    }
  ]);

  const currentUser = {
    id: 'user1',
    name: 'Current User',
    avatar: '/avatars/current-user.jpg'
  };

  useEffect(() => {
    fetchEmailSequences();
    fetchSocialMediaIntegrations();
    fetchVideoConferenceIntegrations();
  }, [fetchEmailSequences, fetchSocialMediaIntegrations, fetchVideoConferenceIntegrations]);

  const handleEditSequence = (sequence) => {
    setSelectedSequence(sequence);
    setShowEmailBuilder(true);
  };

  const handleNewSequence = () => {
    setSelectedSequence(null);
    setShowEmailBuilder(true);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'email_sent': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'meeting_created': return <Video className="h-4 w-4 text-green-600" />;
      case 'task_completed': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'email-sequences', label: 'Email Sequences', icon: Mail },
    { id: 'team-collaboration', label: 'Team Collaboration', icon: Users },
    { id: 'client-management', label: 'Client Management', icon: MessageCircle },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'video-conference', label: 'Video Conference', icon: Video },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Communication & Collaboration
                </h1>
                <p className="text-sm text-gray-500">
                  Manage all your communication channels and team collaboration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleNewSequence}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Sequence</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEmails.toLocaleString()}</p>
                    <p className="text-sm text-green-600">↑ 12% from last month</p>
                  </div>
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.emailOpenRate}%</p>
                    <p className="text-sm text-green-600">↑ 3.2% from last month</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Video Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
                    <p className="text-sm text-blue-600">This month</p>
                  </div>
                  <Video className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sequences</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSequences}</p>
                    <p className="text-sm text-gray-600">Email sequences running</p>
                  </div>
                  <Settings className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.teamTasks}</p>
                    <p className="text-sm text-yellow-600">Pending completion</p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client Interactions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.clientInteractions}</p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.user}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleNewSequence}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow text-left"
              >
                <Mail className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Create Email Sequence</h4>
                <p className="text-sm text-gray-500">Set up automated email campaigns</p>
              </button>

              <button
                onClick={() => setActiveTab('video-conference')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow text-left"
              >
                <Video className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Schedule Meeting</h4>
                <p className="text-sm text-gray-500">Create video conference meetings</p>
              </button>

              <button
                onClick={() => setActiveTab('social-media')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow text-left"
              >
                <Share2 className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Social Media Post</h4>
                <p className="text-sm text-gray-500">Share job opportunities online</p>
              </button>

              <button
                onClick={() => setActiveTab('team-collaboration')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow text-left"
              >
                <Users className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="font-medium text-gray-900">Team Collaboration</h4>
                <p className="text-sm text-gray-500">Manage tasks and comments</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email-sequences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Email Sequences</h2>
              <button
                onClick={handleNewSequence}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Sequence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailSequences.map((sequence) => (
                <div key={sequence.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{sequence.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sequence.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sequence.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{sequence.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Emails</p>
                      <p className="font-medium">{sequence.emails.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Open Rate</p>
                      <p className="font-medium">{((sequence.stats.opened / sequence.stats.sent) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditSequence(sequence)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Edit Sequence
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team-collaboration' && (
          <TeamCollaboration 
            entityType="general" 
            entityId="dashboard" 
            currentUser={currentUser}
          />
        )}

        {activeTab === 'client-management' && (
          <ClientRelationshipManager 
            clientId="client1" 
            client={{ name: 'TechCorp Inc.' }}
          />
        )}

        {activeTab === 'social-media' && (
          <SocialMediaIntegration />
        )}

        {activeTab === 'video-conference' && (
          <VideoConferenceIntegration />
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Communication Settings</h2>
            <p className="text-gray-600 mb-6">
              Manage global communication preferences and system settings.
            </p>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Preferences
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmailSequenceBuilder
        isOpen={showEmailBuilder}
        onClose={() => {
          setShowEmailBuilder(false);
          setSelectedSequence(null);
        }}
        sequence={selectedSequence}
      />

      <CommunicationPreferencesManager
        candidateId="candidate1"
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
};

export default RecruiterCommunication;