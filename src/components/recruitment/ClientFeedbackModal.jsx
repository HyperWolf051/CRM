import { useState } from 'react';
import { X, Star, Save, User, Briefcase } from 'lucide-react';

export default function ClientFeedbackModal({ isOpen, onClose, client, onSubmit }) {
  const [formData, setFormData] = useState({
    candidateId: '',
    jobId: '',
    feedbackType: 'interview',
    rating: 0,
    feedback: '',
    strengths: [],
    concerns: [],
    recommendation: 'maybe',
    nextSteps: '',
    interviewDate: '',
    interviewer: '',
    scheduledDate: '',
    feedbackNumber: 1,
    status: 'Pending'
  });

  const [loading, setLoading] = useState(false);
  const [newStrength, setNewStrength] = useState('');
  const [newConcern, setNewConcern] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const feedbackData = {
        ...formData,
        clientId: client.id,
        submittedAt: new Date(),
        submittedBy: 'current-user-id', // This should come from auth context
        interviewDate: formData.interviewDate ? new Date(formData.interviewDate) : null,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null
      };
      
      await onSubmit(feedbackData);
      onClose();
      
      // Reset form
      setFormData({
        candidateId: '',
        jobId: '',
        feedbackType: 'interview',
        rating: 0,
        feedback: '',
        strengths: [],
        concerns: [],
        recommendation: 'maybe',
        nextSteps: '',
        interviewDate: '',
        interviewer: '',
        scheduledDate: '',
        feedbackNumber: 1,
        status: 'Pending'
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
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

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const addStrength = () => {
    if (newStrength.trim() && !formData.strengths.includes(newStrength.trim())) {
      setFormData(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()]
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (strengthToRemove) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.filter(strength => strength !== strengthToRemove)
    }));
  };

  const addConcern = () => {
    if (newConcern.trim() && !formData.concerns.includes(newConcern.trim())) {
      setFormData(prev => ({
        ...prev,
        concerns: [...prev.concerns, newConcern.trim()]
      }));
      setNewConcern('');
    }
  };

  const removeConcern = (concernToRemove) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.filter(concern => concern !== concernToRemove)
    }));
  };

  if (!isOpen) return null;

  const feedbackTypes = [
    { value: 'interview', label: 'Interview Feedback' },
    { value: 'resume-review', label: 'Resume Review' },
    { value: 'general', label: 'General Feedback' },
    { value: 'placement', label: 'Placement Feedback' }
  ];

  const recommendations = [
    { value: 'hire', label: 'Hire', color: 'text-green-700 bg-green-100' },
    { value: 'reject', label: 'Reject', color: 'text-red-700 bg-red-100' },
    { value: 'maybe', label: 'Maybe', color: 'text-yellow-700 bg-yellow-100' },
    { value: 'hold', label: 'Hold', color: 'text-blue-700 bg-blue-100' }
  ];

  const statusOptions = [
    'Selected', 'Rejected', 'Hold', 'Joined', 'Pending'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Client Feedback</h2>
            <p className="text-sm text-gray-600">Record feedback from {client?.name}</p>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate ID
              </label>
              <input
                type="text"
                value={formData.candidateId}
                onChange={(e) => handleInputChange('candidateId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter candidate ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job ID
              </label>
              <input
                type="text"
                value={formData.jobId}
                onChange={(e) => handleInputChange('jobId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter job ID"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('feedbackType', type.value)}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    formData.feedbackType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
              </span>
            </div>
          </div>

          {/* Feedback Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Details *
            </label>
            <textarea
              required
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter detailed feedback from the client..."
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strengths
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.strengths.map((strength, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {strength}
                  <button
                    type="button"
                    onClick={() => removeStrength(strength)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a strength"
              />
              <button
                type="button"
                onClick={addStrength}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Concerns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Concerns
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.concerns.map((concern, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                >
                  {concern}
                  <button
                    type="button"
                    onClick={() => removeConcern(concern)}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newConcern}
                onChange={(e) => setNewConcern(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcern())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a concern"
              />
              <button
                type="button"
                onClick={addConcern}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendation
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recommendations.map((rec) => (
                <button
                  key={rec.value}
                  type="button"
                  onClick={() => handleInputChange('recommendation', rec.value)}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    formData.recommendation === rec.value
                      ? `border-current ${rec.color}`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer Name
              </label>
              <input
                type="text"
                value={formData.interviewer}
                onChange={(e) => handleInputChange('interviewer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name of the interviewer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Round
              </label>
              <select
                value={formData.feedbackNumber}
                onChange={(e) => handleInputChange('feedbackNumber', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Round 1</option>
                <option value={2}>Round 2</option>
                <option value={3}>Round 3</option>
              </select>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Steps
            </label>
            <textarea
              value={formData.nextSteps}
              onChange={(e) => handleInputChange('nextSteps', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What are the next steps based on this feedback?"
            />
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
                  <Save className="w-4 h-4 mr-2" />
                  Save Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}