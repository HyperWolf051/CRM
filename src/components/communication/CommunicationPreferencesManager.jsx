import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Bell, 
  BellOff, 
  Clock, 
  Globe, 
  Shield, 
  Save, 
  X,
  Check,
  AlertTriangle,
  Settings,
  User,
  Calendar
} from 'lucide-react';
import { useCommunication } from '../../hooks/useCommunication';

const CommunicationPreferencesManager = ({ candidateId, isOpen, onClose }) => {
  const { getCommunicationPreferences, updateCommunicationPreferences, loading } = useCommunication();
  
  const [preferences, setPreferences] = useState({
    candidateId: candidateId,
    email: {
      enabled: true,
      frequency: 'weekly',
      types: ['job-updates', 'interview-reminders']
    },
    sms: {
      enabled: false,
      number: '',
      types: []
    },
    phone: {
      enabled: true,
      number: '',
      preferredTime: {
        start: '09:00',
        end: '17:00',
        timezone: 'UTC'
      }
    },
    optOut: {
      all: false,
      marketing: false,
      transactional: false,
      date: null,
      reason: ''
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (candidateId && isOpen) {
      loadPreferences();
    }
  }, [candidateId, isOpen]);

  const loadPreferences = async () => {
    try {
      const prefs = await getCommunicationPreferences(candidateId);
      setPreferences(prefs);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await updateCommunicationPreferences(candidateId, preferences);
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const updatePreference = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedPreference = (section, subsection, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const toggleCommunicationType = (section, type) => {
    const currentTypes = preferences[section].types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    updatePreference(section, 'types', newTypes);
  };

  const handleOptOut = (type, value) => {
    if (type === 'all' && value) {
      setPreferences(prev => ({
        ...prev,
        optOut: {
          ...prev.optOut,
          all: true,
          marketing: true,
          transactional: false, // Keep transactional for legal reasons
          date: new Date(),
          reason: prev.optOut.reason
        }
      }));
    } else {
      updatePreference('optOut', type, value);
      if (type !== 'all') {
        updatePreference('optOut', 'date', value ? new Date() : null);
      }
    }
    setHasChanges(true);
  };

  const communicationTypes = [
    { id: 'job-updates', label: 'Job Updates', description: 'New job opportunities matching your profile' },
    { id: 'interview-reminders', label: 'Interview Reminders', description: 'Upcoming interview notifications' },
    { id: 'application-status', label: 'Application Status', description: 'Updates on your job applications' },
    { id: 'market-insights', label: 'Market Insights', description: 'Industry trends and salary reports' },
    { id: 'company-news', label: 'Company News', description: 'Updates from companies you\'re interested in' },
    { id: 'career-tips', label: 'Career Tips', description: 'Professional development content' }
  ];

  const frequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Newsletter' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'GMT' },
    { value: 'Europe/Paris', label: 'Central European Time' },
    { value: 'Asia/Tokyo', label: 'Japan Time' },
    { value: 'Asia/Shanghai', label: 'China Time' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Communication Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Manage how and when you want to be contacted
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8">
          {/* Opt-out Section */}
          {(preferences.optOut.all || preferences.optOut.marketing) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Communication Restrictions</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {preferences.optOut.all 
                      ? 'You have opted out of all communications except essential transactional messages.'
                      : 'You have opted out of marketing communications.'
                    }
                  </p>
                  {preferences.optOut.date && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Opted out on: {new Date(preferences.optOut.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Email Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Email Communications</h3>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.email.enabled}
                  onChange={(e) => updatePreference('email', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={preferences.optOut.all}
                />
                <span className="ml-2 text-sm text-gray-700">Enable email communications</span>
              </label>
            </div>

            {preferences.email.enabled && !preferences.optOut.all && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Frequency
                  </label>
                  <select
                    value={preferences.email.frequency}
                    onChange={(e) => updatePreference('email', 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Types
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {communicationTypes.map(type => (
                      <label key={type.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email.types.includes(type.id)}
                          onChange={() => toggleCommunicationType('email', type.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={preferences.optOut.marketing && ['market-insights', 'company-news', 'career-tips'].includes(type.id)}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SMS Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">SMS Communications</h3>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.sms.enabled}
                  onChange={(e) => updatePreference('sms', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={preferences.optOut.all}
                />
                <span className="ml-2 text-sm text-gray-700">Enable SMS communications</span>
              </label>
            </div>

            {preferences.sms.enabled && !preferences.optOut.all && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={preferences.sms.number}
                    onChange={(e) => updatePreference('sms', 'number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    SMS Types (Limited to essential communications)
                  </label>
                  <div className="space-y-2">
                    {communicationTypes
                      .filter(type => ['interview-reminders', 'application-status'].includes(type.id))
                      .map(type => (
                        <label key={type.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.sms.types.includes(type.id)}
                            onChange={() => toggleCommunicationType('sms', type.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="font-medium text-gray-900">{type.label}</span>
                            <span className="text-sm text-gray-500 ml-2">{type.description}</span>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phone Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900">Phone Communications</h3>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.phone.enabled}
                  onChange={(e) => updatePreference('phone', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={preferences.optOut.all}
                />
                <span className="ml-2 text-sm text-gray-700">Allow phone calls</span>
              </label>
            </div>

            {preferences.phone.enabled && !preferences.optOut.all && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={preferences.phone.number}
                    onChange={(e) => updatePreference('phone', 'number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.phone.preferredTime.start}
                      onChange={(e) => updateNestedPreference('phone', 'preferredTime', 'start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.phone.preferredTime.end}
                      onChange={(e) => updateNestedPreference('phone', 'preferredTime', 'end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={preferences.phone.preferredTime.timezone}
                      onChange={(e) => updateNestedPreference('phone', 'preferredTime', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opt-out Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Privacy Controls</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.optOut.marketing}
                  onChange={(e) => handleOptOut('marketing', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Opt out of marketing communications</div>
                  <div className="text-sm text-gray-500">
                    Stop receiving promotional emails, career tips, and market insights
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.optOut.all}
                  onChange={(e) => handleOptOut('all', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Opt out of all communications</div>
                  <div className="text-sm text-gray-500">
                    Stop all communications except essential transactional messages (interview confirmations, application updates)
                  </div>
                </div>
              </label>

              {(preferences.optOut.marketing || preferences.optOut.all) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for opting out (optional)
                  </label>
                  <textarea
                    value={preferences.optOut.reason}
                    onChange={(e) => updatePreference('optOut', 'reason', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Help us improve by telling us why you're opting out..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Bell className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Important Notice</p>
                <p>
                  Even if you opt out of communications, we may still send you essential transactional messages 
                  related to your applications, interviews, and account security. You can update these preferences 
                  at any time. For more information, please review our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {hasChanges && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                You have unsaved changes
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    loadPreferences();
                    setHasChanges(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationPreferencesManager;