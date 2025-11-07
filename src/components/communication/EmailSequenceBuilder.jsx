import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Trash2, 
  Clock, 
  Settings, 
  Play, 
  Pause, 
  Eye,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCommunication } from '../../hooks/useCommunication';

const EmailSequenceBuilder = ({ isOpen, onClose, sequence = null }) => {
  const { createEmailSequence, updateEmailSequence, loading } = useCommunication();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    trigger: {
      type: 'candidate-added',
      conditions: {},
      delay: 0
    },
    emails: []
  });

  const [expandedEmails, setExpandedEmails] = useState(new Set());
  const [previewEmail, setPreviewEmail] = useState(null);

  useEffect(() => {
    if (sequence) {
      setFormData(sequence);
      setExpandedEmails(new Set(sequence.emails.map((_, index) => index)));
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
        trigger: {
          type: 'candidate-added',
          conditions: {},
          delay: 0
        },
        emails: []
      });
      setExpandedEmails(new Set());
    }
  }, [sequence]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sequence) {
        await updateEmailSequence(sequence.id, formData);
      } else {
        await createEmailSequence(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving email sequence:', error);
    }
  };

  const addEmail = () => {
    const newEmail = {
      id: Date.now().toString(),
      subject: '',
      content: '',
      variables: [],
      delay: formData.emails.length === 0 ? 0 : 24,
      conditions: {}
    };
    
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, newEmail]
    }));
    
    setExpandedEmails(prev => new Set([...prev, formData.emails.length]));
  };

  const removeEmail = (index) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
    
    setExpandedEmails(prev => {
      const newSet = new Set();
      prev.forEach(i => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  };

  const updateEmail = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => 
        i === index ? { ...email, [field]: value } : email
      )
    }));
  };

  const toggleEmailExpansion = (index) => {
    setExpandedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const addVariable = (emailIndex) => {
    const newVariable = {
      name: '',
      description: '',
      defaultValue: '',
      required: false
    };
    
    updateEmail(emailIndex, 'variables', [
      ...formData.emails[emailIndex].variables,
      newVariable
    ]);
  };

  const updateVariable = (emailIndex, variableIndex, field, value) => {
    const updatedVariables = formData.emails[emailIndex].variables.map((variable, i) =>
      i === variableIndex ? { ...variable, [field]: value } : variable
    );
    updateEmail(emailIndex, 'variables', updatedVariables);
  };

  const removeVariable = (emailIndex, variableIndex) => {
    const updatedVariables = formData.emails[emailIndex].variables.filter((_, i) => i !== variableIndex);
    updateEmail(emailIndex, 'variables', updatedVariables);
  };

  const triggerTypes = [
    { value: 'candidate-added', label: 'Candidate Added' },
    { value: 'status-changed', label: 'Status Changed' },
    { value: 'interview-scheduled', label: 'Interview Scheduled' },
    { value: 'offer-sent', label: 'Offer Sent' },
    { value: 'manual', label: 'Manual Trigger' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {sequence ? 'Edit Email Sequence' : 'Create Email Sequence'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sequence Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter sequence name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      formData.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {formData.isActive ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the purpose of this email sequence"
              />
            </div>

            {/* Trigger Configuration */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trigger Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Type
                  </label>
                  <select
                    value={formData.trigger.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger, type: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {triggerTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Delay (hours)
                  </label>
                  <input
                    type="number"
                    value={formData.trigger.delay || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger, delay: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Email Templates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
                <button
                  type="button"
                  onClick={addEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Email</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.emails.map((email, index) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleEmailExpansion(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {email.subject || `Email ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Delay: {email.delay} hours after {index === 0 ? 'trigger' : 'previous email'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewEmail(email);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEmail(index);
                          }}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {expandedEmails.has(index) ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedEmails.has(index) && (
                      <div className="p-4 border-t border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subject Line
                            </label>
                            <input
                              type="text"
                              value={email.subject}
                              onChange={(e) => updateEmail(index, 'subject', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter email subject"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delay (hours)
                            </label>
                            <input
                              type="number"
                              value={email.delay}
                              onChange={(e) => updateEmail(index, 'delay', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Content
                          </label>
                          <textarea
                            value={email.content}
                            onChange={(e) => updateEmail(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={6}
                            placeholder="Enter email content. Use {{variableName}} for dynamic content."
                          />
                        </div>

                        {/* Variables */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Variables
                            </label>
                            <button
                              type="button"
                              onClick={() => addVariable(index)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Variable
                            </button>
                          </div>
                          
                          {email.variables.map((variable, varIndex) => (
                            <div key={varIndex} className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                value={variable.name}
                                onChange={(e) => updateVariable(index, varIndex, 'name', e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Variable name"
                              />
                              <input
                                type="text"
                                value={variable.description}
                                onChange={(e) => updateVariable(index, varIndex, 'description', e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Description"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariable(index, varIndex)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {formData.emails.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No emails added yet. Click "Add Email" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Sequence'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Preview</h3>
              <button
                onClick={() => setPreviewEmail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="mb-4">
                <strong>Subject:</strong> {previewEmail.subject}
              </div>
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded border">
                {previewEmail.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSequenceBuilder;