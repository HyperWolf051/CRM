import { useState } from 'react';
import { X, Mail, Phone, MessageSquare, Video, Calendar, Send } from 'lucide-react';

export default function ClientCommunicationModal({ isOpen, onClose, client, onSubmit }) {
  const [formData, setFormData] = useState({
    type: 'email',
    subject: '',
    content: '',
    direction: 'outbound',
    followUpRequired: false,
    followUpDate: '',
    participants: []
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const communicationData = {
        ...formData,
        clientId: client.id,
        createdAt: new Date(),
        createdBy: 'current-user-id', // This should come from auth context
        status: 'completed'
      };
      
      await onSubmit(communicationData);
      onClose();
      
      // Reset form
      setFormData({
        type: 'email',
        subject: '',
        content: '',
        direction: 'outbound',
        followUpRequired: false,
        followUpDate: '',
        participants: []
      });
    } catch (error) {
      console.error('Error saving communication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  const communicationTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone Call', icon: Phone },
    { value: 'meeting', label: 'Meeting', icon: Calendar },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'video-call', label: 'Video Call', icon: Video }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Log Communication</h2>
            <p className="text-sm text-gray-600">Record communication with {client?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Communication Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Communication Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {communicationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-3 border rounded-lg flex items-center space-x-2 transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direction
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="direction"
                  value="outbound"
                  checked={formData.direction === 'outbound'}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Outbound (We contacted them)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="direction"
                  value="inbound"
                  checked={formData.direction === 'inbound'}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Inbound (They contacted us)</span>
              </label>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter communication subject"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the communication details, key points discussed, outcomes, etc."
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.followUpRequired}
                onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Follow-up required</span>
            </label>

            {formData.followUpRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Save Communication
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}