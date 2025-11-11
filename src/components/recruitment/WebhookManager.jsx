import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Activity, 
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { webhookService } from '../../services/integrationService';

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = () => {
    const allWebhooks = webhookService.list();
    setWebhooks(allWebhooks);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      webhookService.delete(id);
      loadWebhooks();
    }
  };

  const eventTypes = [
    { value: 'candidate.created', label: 'Candidate Created' },
    { value: 'candidate.updated', label: 'Candidate Updated' },
    { value: 'candidate.deleted', label: 'Candidate Deleted' },
    { value: 'interview.scheduled', label: 'Interview Scheduled' },
    { value: 'interview.completed', label: 'Interview Completed' },
    { value: 'offer.sent', label: 'Offer Sent' },
    { value: 'offer.accepted', label: 'Offer Accepted' },
    { value: 'offer.declined', label: 'Offer Declined' }
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Webhook Management</h1>
          <p className="text-gray-600">Configure webhooks for real-time event notifications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-gray-700" />
            <div>
              <p className="text-sm text-gray-600">Total Webhooks</p>
              <p className="text-2xl font-semibold text-gray-900">{webhooks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Check className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {webhooks.filter(w => w.active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-gray-900">
                {webhooks.filter(w => !w.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {webhooks.map(webhook => (
              <tr key={webhook.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{webhook.event}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 truncate max-w-xs block">
                    {webhook.url}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {webhook.active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      <X className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(webhook.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingWebhook(webhook)}
                    className="text-gray-600 hover:text-gray-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {webhooks.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first webhook</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Webhook
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingWebhook) && (
        <WebhookModal
          webhook={editingWebhook}
          eventTypes={eventTypes}
          onClose={() => {
            setShowAddModal(false);
            setEditingWebhook(null);
          }}
          onSave={() => {
            loadWebhooks();
            setShowAddModal(false);
            setEditingWebhook(null);
          }}
        />
      )}
    </div>
  );
};

const WebhookModal = ({ webhook, eventTypes, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    event: webhook?.event || '',
    url: webhook?.url || '',
    secret: webhook?.secret || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (webhook) {
      // Update existing webhook
      // Implementation would go here
    } else {
      // Create new webhook
      webhookService.register(formData.event, formData.url, formData.secret);
    }
    
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {webhook ? 'Edit Webhook' : 'Add Webhook'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select an event</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://your-domain.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key
              </label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="Your secret key for signature verification"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used to sign webhook payloads
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {webhook ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebhookManager;
