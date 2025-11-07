import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  Edit,
  Clock,
  User,
  Settings,
  Search,
  Download
} from 'lucide-react';
import { useCommunication } from '../../hooks/useCommunication';

// ClientRelationshipManager
// - Improvements focused on Preferences loading/error UX
// - Added preferencesLoading & preferencesError states
// - Clicking Preferences opens modal immediately and shows loader / error with retry
// - Small UI/UX polish for a professional CRM theme (clean spacing, clear affordances)

const ClientRelationshipManager = ({ clientId, client }) => {
  const {
    clientInteractions = [],
    fetchClientInteractions,
    addClientInteraction,
    getClientPreferences,
    updateClientPreferences
  } = useCommunication();

  const [activeTab, setActiveTab] = useState('interactions');
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);

  // New states for preferences load feedback
  const [preferences, setPreferences] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesError, setPreferencesError] = useState(null);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newInteraction, setNewInteraction] = useState({
    type: 'email',
    subject: '',
    content: '',
    participants: [],
    scheduledAt: '',
    outcome: '',
    followUpRequired: false,
    followUpDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingInteractionId, setEditingInteractionId] = useState(null);

  useEffect(() => {
    if (clientId) {
      fetchClientInteractions(clientId);
      // load preferences once on mount - but we don't block UI
      loadClientPreferences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const loadClientPreferences = async () => {
    setPreferencesLoading(true);
    setPreferencesError(null);
    try {
      const prefs = await getClientPreferences(clientId);
      setPreferences(prefs || {});
    } catch (error) {
      console.error('Error loading client preferences:', error);
      setPreferencesError(error?.message || 'Failed to load preferences');
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Called when user clicks the Preferences button in header
  const handleOpenPreferences = () => {
    setShowPreferencesForm(true);
    // If preferences are not loaded OR previously errored, try to load again
    if (!preferences || preferencesError) {
      loadClientPreferences();
    }
  };

  const handleRetryPreferences = () => {
    loadClientPreferences();
  };

  const handleSubmitInteraction = async (e) => {
    e.preventDefault();
    try {
      await addClientInteraction({
        ...newInteraction,
        clientId,
        createdBy: 'current-user', // Replace with actual user ID
        completedAt: newInteraction.type === 'note' ? new Date() : null
      });
      setNewInteraction({
        type: 'email',
        subject: '',
        content: '',
        participants: [],
        scheduledAt: '',
        outcome: '',
        followUpRequired: false,
        followUpDate: ''
      });
      setShowInteractionForm(false);
      setIsEditing(false);
      setEditingInteractionId(null);
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const handleUpdatePreferences = async (updatedPreferences) => {
    try {
      setPreferencesLoading(true);
      await updateClientPreferences(clientId, updatedPreferences);
      setPreferences(updatedPreferences);
      setShowPreferencesForm(false);
      setPreferencesError(null);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setPreferencesError(error?.message || 'Failed to save preferences');
    } finally {
      setPreferencesLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      case 'proposal': return <FileText className="h-4 w-4" />;
      case 'contract': return <FileText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'email': return 'text-blue-600 bg-blue-50';
      case 'call': return 'text-green-600 bg-green-50';
      case 'meeting': return 'text-purple-600 bg-purple-50';
      case 'note': return 'text-gray-600 bg-gray-50';
      case 'proposal': return 'text-orange-600 bg-orange-50';
      case 'contract': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredInteractions = useMemo(() => {
    return clientInteractions.filter(interaction => {
      const matchesType = filterType === 'all' || interaction.type === filterType;
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = (interaction.subject?.toLowerCase() || '').includes(lowerSearch) ||
        (interaction.content?.toLowerCase() || '').includes(lowerSearch);
      return matchesType && matchesSearch;
    });
  }, [clientInteractions, filterType, searchTerm]);

  const interactionTypes = [
    { value: 'email', label: 'Email' },
    { value: 'call', label: 'Phone Call' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'note', label: 'Note' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'contract', label: 'Contract' }
  ];

  // Small CSV export helper
  const exportInteractions = () => {
    const headers = ['ID', 'Type', 'Subject', 'Content', 'Created At', 'Outcome'];
    const rows = filteredInteractions.map(i => [
      i.id,
      i.type,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${(i.content || '').replace(/"/g, '""')}"`,
      i.createdAt,
      `"${(i.outcome || '').replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client?.name || 'client'}-interactions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Basic Edit interaction handler (prefill + open modal)
  const handleEditInteraction = (interactionId) => {
    const interaction = clientInteractions.find(i => i.id === interactionId);
    if (!interaction) return;
    setIsEditing(true);
    setEditingInteractionId(interactionId);
    setNewInteraction({
      type: interaction.type || 'note',
      subject: interaction.subject || '',
      content: interaction.content || '',
      participants: interaction.participants || [],
      scheduledAt: interaction.scheduledAt || '',
      outcome: interaction.outcome || '',
      followUpRequired: !!interaction.followUpRequired,
      followUpDate: interaction.followUpDate || ''
    });
    setShowInteractionForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-poppins">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-sky-700" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {client?.name || 'Client Relationship'}
            </h2>
            <p className="text-sm text-gray-500">Manage interactions & preferences</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInteractionForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Interaction</span>
          </button>

          <button
            onClick={handleOpenPreferences}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 border border-gray-200 rounded-md hover:shadow-sm transition-all"
            title="Edit client preferences"
            aria-haspopup="dialog"
          >
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-100">
        <nav className="flex space-x-8 px-6 py-4">
          <button
            onClick={() => setActiveTab('interactions')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'interactions'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Interactions</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {clientInteractions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'interactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search interactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All Types</option>
                  {interactionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={exportInteractions}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:shadow-sm transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Interactions List */}
            <div className="space-y-4">
              {filteredInteractions.map((interaction) => (
                <div key={interaction.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getInteractionColor(interaction.type)}`}>
                        {getInteractionIcon(interaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{interaction.subject}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInteractionColor(interaction.type)}`}>
                            {interaction.type}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{interaction.content}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(interaction.createdAt)}
                          </span>

                          {interaction.participants?.length > 0 && (
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {interaction.participants.length} participant(s)
                            </span>
                          )}

                          {interaction.followUpRequired && (
                            <span className="flex items-center text-orange-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              Follow-up required
                            </span>
                          )}
                        </div>

                        {interaction.outcome && (
                          <div className="mt-2 p-2 bg-sky-50 rounded text-sm">
                            <strong>Outcome:</strong> {interaction.outcome}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <button
                        onClick={() => handleEditInteraction(interaction.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
                        aria-label="Edit interaction"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredInteractions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No interactions found. Add an interaction to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              {clientInteractions
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((interaction) => (
                  <div key={interaction.id} className="relative flex items-start space-x-4 pb-6">
                    <div className={`relative z-10 p-2 rounded-full ${getInteractionColor(interaction.type)}`}>
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 truncate">{interaction.subject}</h4>
                          <span className="text-xs text-gray-500">{formatDate(interaction.createdAt)}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{interaction.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-sky-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-700">Total Interactions</p>
                  <p className="text-2xl font-bold text-sky-900">{clientInteractions.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-sky-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">This Month</p>
                  <p className="text-2xl font-bold text-green-900">
                    {clientInteractions.filter(i => {
                      const d = new Date(i.createdAt);
                      const now = new Date();
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Follow-ups Due</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {clientInteractions.filter(i => i.followUpRequired && new Date(i.followUpDate) <= new Date()).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Interaction Modal */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{isEditing ? 'Edit' : 'Add'} Interaction</h3>
              <button
                onClick={() => { setShowInteractionForm(false); setIsEditing(false); setEditingInteractionId(null); }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close interaction form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitInteraction} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newInteraction.type}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {interactionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newInteraction.subject}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter subject"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newInteraction.content}
                  onChange={(e) => setNewInteraction(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={4}
                  placeholder="Enter interaction details"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                  <input
                    type="text"
                    value={newInteraction.outcome}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, outcome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter outcome (optional)"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      checked={newInteraction.followUpRequired}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700">Follow-up required</span>
                  </label>
                </div>
              </div>

              {newInteraction.followUpRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={newInteraction.followUpDate}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, followUpDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowInteractionForm(false); setIsEditing(false); setEditingInteractionId(null); }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Add Interaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Client Preferences</h3>
              <button
                onClick={() => setShowPreferencesForm(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close preferences"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Loading state */}
              {preferencesLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-700 mb-4" />
                  <p className="text-sm text-gray-600">Loading preferences...</p>
                </div>
              )}

              {/* Error state */}
              {!preferencesLoading && preferencesError && (
                <div className="p-4 border border-red-100 bg-red-50 rounded">
                  <p className="text-sm text-red-700 mb-2">{preferencesError}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRetryPreferences}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => { setShowPreferencesForm(false); }}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-md hover:shadow-sm transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences form (render only when loaded and no error) */}
              {!preferencesLoading && !preferencesError && preferences && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Communication Method</label>
                    <select
                      value={preferences.communicationMethod || 'email'}
                      onChange={(e) => setPreferences(prev => ({ ...prev, communicationMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="sms">SMS</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication Frequency</label>
                    <select
                      value={preferences.frequency || 'weekly'}
                      onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Time</label>
                      <input
                        type="time"
                        value={(preferences.preferredTime && preferences.preferredTime.start) || ''}
                        onChange={(e) => setPreferences(prev => ({ ...prev, preferredTime: { ...(prev.preferredTime || {}), start: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred End Time</label>
                      <input
                        type="time"
                        value={(preferences.preferredTime && preferences.preferredTime.end) || ''}
                        onChange={(e) => setPreferences(prev => ({ ...prev, preferredTime: { ...(prev.preferredTime || {}), end: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowPreferencesForm(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdatePreferences(preferences)}
                      className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors"
                      disabled={preferencesLoading}
                    >
                      Save Preferences
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRelationshipManager;
