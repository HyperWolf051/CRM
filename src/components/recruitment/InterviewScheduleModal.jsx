import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Video, 
  Users,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const INTERVIEW_TYPES = {
  phone: {
    name: 'Phone Interview',
    icon: Phone,
    color: 'bg-blue-500',
    description: 'Audio call interview'
  },
  video: {
    name: 'Video Interview',
    icon: Video,
    color: 'bg-green-500',
    description: 'Video conference interview'
  },
  'in-person': {
    name: 'In-Person Interview',
    icon: Users,
    color: 'bg-purple-500',
    description: 'Face-to-face interview'
  }
};

const PRIORITY_LEVELS = {
  low: { name: 'Low', color: 'bg-gray-100 text-gray-700' },
  medium: { name: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { name: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { name: 'Urgent', color: 'bg-red-100 text-red-700' }
};

const InterviewScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSchedule, 
  selectedDate,
  candidateId,
  jobId,
  existingInterview 
}) => {
  const [formData, setFormData] = useState({
    candidateId: candidateId || '',
    candidateName: '',
    jobId: jobId || '',
    jobTitle: '',
    client: '',
    type: 'video',
    scheduledDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    scheduledTime: '10:00',
    duration: 60,
    interviewer: {
      id: '',
      name: '',
      email: '',
      role: ''
    },
    location: '',
    meetingLink: '',
    notes: '',
    round: 1,
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const mockCandidates = [
    { id: '1', name: 'Tanishka Negi', jobTitle: 'Senior React Developer' },
    { id: '2', name: 'Rahul Sharma', jobTitle: 'Product Manager' },
    { id: '3', name: 'Priya Patel', jobTitle: 'UI/UX Designer' },
    { id: '4', name: 'Alex Wilson', jobTitle: 'DevOps Engineer' },
    { id: '5', name: 'Maria Garcia', jobTitle: 'Senior React Developer' }
  ];

  const mockJobs = [
    { id: '1', title: 'Senior React Developer', client: 'TechCorp Solutions' },
    { id: '2', title: 'Product Manager', client: 'StartupXYZ' },
    { id: '3', title: 'UI/UX Designer', client: 'Design Studio Pro' },
    { id: '4', title: 'DevOps Engineer', client: 'CloudTech Inc' }
  ];

  const mockInterviewers = [
    { id: '1', name: 'John Doe', email: 'john@techcorp.com', role: 'Technical Lead' },
    { id: '2', name: 'Jane Smith', email: 'jane@startupxyz.com', role: 'VP Product' },
    { id: '3', name: 'Mike Johnson', email: 'mike@designstudio.com', role: 'Design Director' },
    { id: '4', name: 'Sarah Davis', email: 'sarah@cloudtech.com', role: 'DevOps Manager' }
  ];

  useEffect(() => {
    if (existingInterview) {
      setFormData({
        candidateId: existingInterview.candidateId,
        candidateName: existingInterview.candidateName,
        jobId: existingInterview.jobId,
        jobTitle: existingInterview.jobTitle,
        client: existingInterview.client,
        type: existingInterview.type,
        scheduledDate: existingInterview.scheduledDate.toISOString().split('T')[0],
        scheduledTime: existingInterview.scheduledDate.toTimeString().slice(0, 5),
        duration: existingInterview.duration,
        interviewer: existingInterview.interviewer,
        location: existingInterview.location || '',
        meetingLink: existingInterview.meetingLink || '',
        notes: existingInterview.notes || '',
        round: existingInterview.round,
        priority: existingInterview.priority
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        scheduledDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [existingInterview, selectedDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Auto-populate related fields
    if (field === 'candidateId') {
      const candidate = mockCandidates.find(c => c.id === value);
      if (candidate) {
        setFormData(prev => ({
          ...prev,
          candidateName: candidate.name
        }));
      }
    }

    if (field === 'jobId') {
      const job = mockJobs.find(j => j.id === value);
      if (job) {
        setFormData(prev => ({
          ...prev,
          jobTitle: job.title,
          client: job.client
        }));
      }
    }

    if (field === 'interviewerId') {
      const interviewer = mockInterviewers.find(i => i.id === value);
      if (interviewer) {
        setFormData(prev => ({
          ...prev,
          interviewer: interviewer
        }));
      }
    }

    // Auto-set location based on interview type
    if (field === 'type') {
      let location = '';
      let meetingLink = '';
      
      switch (value) {
        case 'phone':
          location = 'Phone';
          break;
        case 'video':
          location = 'Virtual';
          meetingLink = 'https://meet.google.com/new';
          break;
        case 'in-person':
          location = 'Office';
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        location,
        meetingLink
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.candidateId) newErrors.candidateId = 'Please select a candidate';
    if (!formData.jobId) newErrors.jobId = 'Please select a job';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';
    if (!formData.interviewer.id) newErrors.interviewer = 'Please select an interviewer';
    if (!formData.location) newErrors.location = 'Please enter a location';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const interviewData = {
        ...formData,
        scheduledDate: scheduledDateTime
      };

      await onSchedule(interviewData);
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {existingInterview ? 'Edit Interview' : 'Schedule Interview'}
            </h2>
            <button
              onClick={onClose}
              className="touch-target p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <Plus className="w-5 h-5 text-slate-500 rotate-45" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Candidate and Job Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Candidate *
                </label>
                <select
                  value={formData.candidateId}
                  onChange={(e) => handleInputChange('candidateId', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                    errors.candidateId ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select candidate...</option>
                  {mockCandidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
                {errors.candidateId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.candidateId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Position *
                </label>
                <select
                  value={formData.jobId}
                  onChange={(e) => handleInputChange('jobId', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                    errors.jobId ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select job...</option>
                  {mockJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.client}
                    </option>
                  ))}
                </select>
                {errors.jobId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.jobId}
                  </p>
                )}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Interview Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(INTERVIEW_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {React.createElement(config.icon, { 
                      className: `w-6 h-6 mx-auto mb-2 ${
                        formData.type === type ? 'text-blue-600' : 'text-slate-600'
                      }`
                    })}
                    <div className={`text-sm font-medium ${
                      formData.type === type ? 'text-blue-900' : 'text-slate-900'
                    }`}>
                      {config.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {config.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                    errors.scheduledDate ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.scheduledDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.scheduledDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                    errors.scheduledTime ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.scheduledTime && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.scheduledTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="75">1.5 hours</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>

            {/* Interviewer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Interviewer *
              </label>
              <select
                value={formData.interviewer.id}
                onChange={(e) => handleInputChange('interviewerId', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                  errors.interviewer ? 'border-red-300' : 'border-slate-200'
                }`}
              >
                <option value="">Select interviewer...</option>
                {mockInterviewers.map(interviewer => (
                  <option key={interviewer.id} value={interviewer.id}>
                    {interviewer.name} - {interviewer.role}
                  </option>
                ))}
              </select>
              {errors.interviewer && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.interviewer}
                </p>
              )}
            </div>

            {/* Location and Meeting Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Conference Room A, Virtual, Phone, etc."
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                    errors.location ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Round and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Interview Round
                </label>
                <select
                  value={formData.round}
                  onChange={(e) => handleInputChange('round', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                >
                  <option value="1">Round 1 - Screening</option>
                  <option value="2">Round 2 - Technical</option>
                  <option value="3">Round 3 - Manager</option>
                  <option value="4">Round 4 - Final</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                >
                  {Object.entries(PRIORITY_LEVELS).map(([level, config]) => (
                    <option key={level} value={level}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Interview agenda, focus areas, special instructions..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{existingInterview ? 'Update Interview' : 'Schedule Interview'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;