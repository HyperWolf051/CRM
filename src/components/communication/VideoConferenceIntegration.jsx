import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  Settings, 
  Link, 
  Unlink, 
  Copy, 
  ExternalLink, 
  Clock, 
  Shield, 
  Mic, 
  Camera,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCommunication } from '../../hooks/useCommunication';

const VideoConferenceIntegration = () => {
  const { 
    videoConferenceIntegrations, 
    fetchVideoConferenceIntegrations, 
    connectVideoConference, 
    createMeeting,
    loading 
  } = useCommunication();

  const [activeTab, setActiveTab] = useState('integrations');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(null);
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      provider: 'zoom',
      meetingId: '123-456-789',
      joinUrl: 'https://zoom.us/j/123456789',
      password: 'abc123',
      title: 'Interview with John Doe',
      description: 'Technical interview for Senior Developer position',
      startTime: new Date('2024-01-20T14:00:00'),
      duration: 60,
      participants: [
        { email: 'john.doe@email.com', name: 'John Doe', role: 'participant' },
        { email: 'interviewer@company.com', name: 'Sarah Smith', role: 'host' }
      ],
      candidateId: 'candidate1',
      interviewId: 'interview1',
      status: 'scheduled'
    },
    {
      id: '2',
      provider: 'teams',
      meetingId: '987-654-321',
      joinUrl: 'https://teams.microsoft.com/l/meetup-join/...',
      title: 'Client Meeting - TechCorp',
      description: 'Discuss new job requirements',
      startTime: new Date('2024-01-22T10:00:00'),
      duration: 45,
      participants: [
        { email: 'client@techcorp.com', name: 'Mike Johnson', role: 'participant' },
        { email: 'recruiter@company.com', name: 'Jane Wilson', role: 'host' }
      ],
      status: 'scheduled'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    provider: 'zoom',
    title: '',
    description: '',
    startTime: '',
    duration: 60,
    participants: [{ email: '', name: '', role: 'participant' }],
    candidateId: '',
    interviewId: '',
    settings: {
      waitingRoom: true,
      recording: false,
      password: true
    }
  });

  useEffect(() => {
    fetchVideoConferenceIntegrations();
  }, [fetchVideoConferenceIntegrations]);

  const handleConnect = async (provider) => {
    try {
      // In a real implementation, this would handle OAuth flow
      await connectVideoConference(provider, { 
        clientId: 'mock-client-id',
        clientSecret: 'mock-client-secret'
      });
      setShowConnectModal(null);
    } catch (error) {
      console.error('Error connecting video conference:', error);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const meetingData = {
        ...newMeeting,
        startTime: new Date(newMeeting.startTime)
      };
      
      const result = await createMeeting(meetingData);
      setMeetings(prev => [...prev, { ...result, status: 'scheduled' }]);
      
      setNewMeeting({
        provider: 'zoom',
        title: '',
        description: '',
        startTime: '',
        duration: 60,
        participants: [{ email: '', name: '', role: 'participant' }],
        candidateId: '',
        interviewId: '',
        settings: {
          waitingRoom: true,
          recording: false,
          password: true
        }
      });
      setShowMeetingForm(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const addParticipant = () => {
    setNewMeeting(prev => ({
      ...prev,
      participants: [...prev.participants, { email: '', name: '', role: 'participant' }]
    }));
  };

  const updateParticipant = (index, field, value) => {
    setNewMeeting(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }));
  };

  const removeParticipant = (index) => {
    setNewMeeting(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification in real implementation
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'zoom': return <Video className="h-5 w-5" />;
      case 'teams': return <Users className="h-5 w-5" />;
      case 'meet': return <Video className="h-5 w-5" />;
      case 'webex': return <Video className="h-5 w-5" />;
      default: return <Video className="h-5 w-5" />;
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'zoom': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'teams': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'meet': return 'text-green-600 bg-green-100 border-green-200';
      case 'webex': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'started': return <Video className="h-4 w-4 text-green-600" />;
      case 'ended': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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

  const providers = [
    { id: 'zoom', name: 'Zoom', description: 'Video conferencing and webinars' },
    { id: 'teams', name: 'Microsoft Teams', description: 'Collaboration and meetings' },
    { id: 'meet', name: 'Google Meet', description: 'Simple video meetings' },
    { id: 'webex', name: 'Cisco Webex', description: 'Enterprise video conferencing' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Video className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Video Conference Integration
              </h2>
              <p className="text-sm text-gray-500">
                Connect and manage video conferencing platforms
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMeetingForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Meeting</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Integrations</span>
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'meetings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Meetings</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {meetings.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoConferenceIntegrations.map((integration) => (
              <div key={integration.provider} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getProviderColor(integration.provider)}`}>
                      {getProviderIcon(integration.provider)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {providers.find(p => p.id === integration.provider)?.name || integration.provider}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {integration.isConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.isConnected ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                </div>

                {integration.isConnected ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Default Settings</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Duration: {integration.defaultSettings.duration}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Waiting Room: {integration.defaultSettings.waitingRoom ? 'On' : 'Off'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Video className="h-3 w-3" />
                          <span>Recording: {integration.defaultSettings.recording ? 'On' : 'Off'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Password: {integration.defaultSettings.password ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors text-sm">
                        <Unlink className="h-3 w-3" />
                        <span>Disconnect</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-sm">
                        <Settings className="h-3 w-3" />
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {providers.find(p => p.id === integration.provider)?.description}
                    </p>
                    <button
                      onClick={() => setShowConnectModal(integration.provider)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Link className="h-4 w-4" />
                      <span>Connect</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getProviderColor(meeting.provider)}`}>
                      {getProviderIcon(meeting.provider)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {meeting.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(meeting.status)}
                          <span className="text-sm text-gray-500 capitalize">
                            {meeting.status}
                          </span>
                        </div>
                      </div>
                      
                      {meeting.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {meeting.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(meeting.startTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{meeting.duration} minutes</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{meeting.participants.length} participants</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Meeting ID:</span>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {meeting.meetingId}
                            </code>
                            <button
                              onClick={() => copyToClipboard(meeting.meetingId)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {meeting.password && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Password:</span>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {meeting.password}
                              </code>
                              <button
                                onClick={() => copyToClipboard(meeting.password)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <a
                              href={meeting.joinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Join Meeting</span>
                            </a>
                            <button
                              onClick={() => copyToClipboard(meeting.joinUrl)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Participants</h5>
                        <div className="flex flex-wrap gap-2">
                          {meeting.participants.map((participant, index) => (
                            <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-sm">
                              <span>{participant.name}</span>
                              {participant.role === 'host' && (
                                <span className="text-blue-600">(Host)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {meetings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No meetings scheduled. Create your first meeting!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create Video Meeting</h3>
              <button
                onClick={() => setShowMeetingForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateMeeting} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={newMeeting.provider}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {videoConferenceIntegrations
                      .filter(integration => integration.isConnected)
                      .map(integration => (
                        <option key={integration.provider} value={integration.provider}>
                          {providers.find(p => p.id === integration.provider)?.name || integration.provider}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="480"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter meeting description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={newMeeting.startTime}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Participants
                  </label>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Participant
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newMeeting.participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={participant.email}
                        onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email address"
                        required
                      />
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                        required
                      />
                      <select
                        value={participant.role}
                        onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="participant">Participant</option>
                        <option value="co-host">Co-host</option>
                        <option value="host">Host</option>
                      </select>
                      {newMeeting.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="p-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Meeting Settings
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMeeting.settings.waitingRoom}
                      onChange={(e) => setNewMeeting(prev => ({
                        ...prev,
                        settings: { ...prev.settings, waitingRoom: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable waiting room</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMeeting.settings.recording}
                      onChange={(e) => setNewMeeting(prev => ({
                        ...prev,
                        settings: { ...prev.settings, recording: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto-record meeting</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMeeting.settings.password}
                      onChange={(e) => setNewMeeting(prev => ({
                        ...prev,
                        settings: { ...prev.settings, password: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require meeting password</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowMeetingForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Connect {providers.find(p => p.id === showConnectModal)?.name}
              </h3>
              <button
                onClick={() => setShowConnectModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-full ${getProviderColor(showConnectModal)} mb-4`}>
                  {getProviderIcon(showConnectModal)}
                </div>
                <p className="text-gray-600">
                  Connect your {providers.find(p => p.id === showConnectModal)?.name} account to create and manage video meetings directly from the platform.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConnectModal(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConnect(showConnectModal)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConferenceIntegration;