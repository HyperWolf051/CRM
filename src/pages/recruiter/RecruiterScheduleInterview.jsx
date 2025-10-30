import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Building,
  Mail,
  FileText,
  Star
} from 'lucide-react';

const INTERVIEW_TYPES = {
  phone: {
    name: 'Phone Interview',
    icon: Phone,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: 'Audio call interview - Perfect for initial screening'
  },
  video: {
    name: 'Video Interview',
    icon: Video,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    description: 'Video conference interview - Ideal for technical rounds'
  },
  'in-person': {
    name: 'In-Person Interview',
    icon: Users,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    description: 'Face-to-face interview - Best for final rounds'
  }
};

const PRIORITY_LEVELS = {
  low: { name: 'Low Priority', color: 'bg-gray-100 text-gray-700', badge: 'bg-gray-500' },
  medium: { name: 'Medium Priority', color: 'bg-blue-100 text-blue-700', badge: 'bg-blue-500' },
  high: { name: 'High Priority', color: 'bg-orange-100 text-orange-700', badge: 'bg-orange-500' },
  urgent: { name: 'Urgent Priority', color: 'bg-red-100 text-red-700', badge: 'bg-red-500' }
};

const RecruiterScheduleInterview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidateId');
  const jobId = searchParams.get('jobId');
  const selectedDate = searchParams.get('date');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    candidateId: candidateId || '',
    candidateName: '',
    jobId: jobId || '',
    jobTitle: '',
    client: '',
    type: 'video',
    scheduledDate: selectedDate || new Date().toISOString().split('T')[0],
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
    priority: 'medium',
    agenda: '',
    requirements: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockCandidates = [
    { 
      id: '1', 
      name: 'Tanishka Negi', 
      email: 'tanishka@email.com',
      phone: '+91 98765 43210',
      position: 'Senior React Developer',
      experience: '5 years',
      location: 'Bangalore, India',
      rating: 4.5
    },
    { 
      id: '2', 
      name: 'Rahul Sharma', 
      email: 'rahul@email.com',
      phone: '+91 98765 43211',
      position: 'Product Manager',
      experience: '7 years',
      location: 'Mumbai, India',
      rating: 4.2
    },
    { 
      id: '3', 
      name: 'Priya Patel', 
      email: 'priya@email.com',
      phone: '+91 98765 43212',
      position: 'UI/UX Designer',
      experience: '4 years',
      location: 'Pune, India',
      rating: 4.8
    }
  ];

  const mockJobs = [
    { 
      id: '1', 
      title: 'Senior React Developer', 
      client: 'TechCorp Solutions',
      department: 'Engineering',
      location: 'Bangalore',
      salary: '₹18-25 LPA',
      type: 'Full-time'
    },
    { 
      id: '2', 
      title: 'Product Manager', 
      client: 'StartupXYZ',
      department: 'Product',
      location: 'Mumbai',
      salary: '₹15-22 LPA',
      type: 'Full-time'
    },
    { 
      id: '3', 
      title: 'UI/UX Designer', 
      client: 'Design Studio Pro',
      department: 'Design',
      location: 'Remote',
      salary: '₹8-12 LPA',
      type: 'Contract'
    }
  ];

  const mockInterviewers = [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@techcorp.com', 
      role: 'Technical Lead',
      department: 'Engineering',
      avatar: null
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@startupxyz.com', 
      role: 'VP Product',
      department: 'Product',
      avatar: null
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      email: 'mike@designstudio.com', 
      role: 'Design Director',
      department: 'Design',
      avatar: null
    }
  ];

  useEffect(() => {
    // Auto-populate candidate data if candidateId is provided
    if (candidateId) {
      const candidate = mockCandidates.find(c => c.id === candidateId);
      if (candidate) {
        setFormData(prev => ({
          ...prev,
          candidateName: candidate.name
        }));
      }
    }

    // Auto-populate job data if jobId is provided
    if (jobId) {
      const job = mockJobs.find(j => j.id === jobId);
      if (job) {
        setFormData(prev => ({
          ...prev,
          jobTitle: job.title,
          client: job.client
        }));
      }
    }
  }, [candidateId, jobId]);

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

    // Auto-set location and meeting link based on interview type
    if (field === 'type') {
      let location = '';
      let meetingLink = '';
      
      switch (value) {
        case 'phone':
          location = 'Phone Call';
          break;
        case 'video':
          location = 'Virtual Meeting';
          meetingLink = 'https://meet.google.com/new';
          break;
        case 'in-person':
          location = 'Office - Conference Room';
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        location,
        meetingLink
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.candidateId) newErrors.candidateId = 'Please select a candidate';
      if (!formData.jobId) newErrors.jobId = 'Please select a job position';
    }

    if (step === 2) {
      if (!formData.type) newErrors.type = 'Please select interview type';
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';
      if (!formData.interviewer.id) newErrors.interviewer = 'Please select an interviewer';
    }

    if (step === 3) {
      if (!formData.location) newErrors.location = 'Please enter a location';
      if (formData.type === 'video' && !formData.meetingLink) {
        newErrors.meetingLink = 'Please provide a meeting link for video interviews';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const interviewData = {
        ...formData,
        scheduledDate: scheduledDateTime
      };

      console.log('Interview scheduled:', interviewData);
      
      // Navigate to success step
      setCurrentStep(4);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCandidate = mockCandidates.find(c => c.id === formData.candidateId);
  const selectedJob = mockJobs.find(j => j.id === formData.jobId);
  const selectedInterviewer = mockInterviewers.find(i => i.id === formData.interviewer.id);

  const steps = [
    { number: 1, title: 'Select Candidate & Job', description: 'Choose who to interview and for which position' },
    { number: 2, title: 'Interview Details', description: 'Set date, time, and interview type' },
    { number: 3, title: 'Additional Information', description: 'Location, agenda, and special requirements' },
    { number: 4, title: 'Confirmation', description: 'Review and confirm interview details' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/recruiter/calendar')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Schedule Interview
              </h1>
              <p className="text-slate-600 mt-1">Create a new interview appointment</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                    ${currentStep >= step.number 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-200 text-slate-500'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 max-w-32">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-slate-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl">
          {/* Step 1: Select Candidate & Job */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Select Candidate & Job Position</h2>
                <p className="text-slate-600">Choose the candidate you want to interview and the job position they're applying for.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Candidate Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Candidate *
                  </label>
                  <div className="space-y-3">
                    {mockCandidates.map(candidate => (
                      <div
                        key={candidate.id}
                        onClick={() => handleInputChange('candidateId', candidate.id)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.candidateId === candidate.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                            <p className="text-sm text-slate-600">{candidate.position}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{candidate.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{candidate.location}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(candidate.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">{candidate.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.candidateId && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.candidateId}
                    </p>
                  )}
                </div>

                {/* Job Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Job Position *
                  </label>
                  <div className="space-y-3">
                    {mockJobs.map(job => (
                      <div
                        key={job.id}
                        onClick={() => handleInputChange('jobId', job.id)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.jobId === job.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{job.title}</h3>
                            <p className="text-sm text-slate-600 flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{job.client}</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                              <span>{job.department}</span>
                              <span>{job.location}</span>
                              <span>{job.type}</span>
                            </div>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.jobId && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.jobId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interview Details */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Interview Details</h2>
                <p className="text-slate-600">Set the interview type, date, time, and select an interviewer.</p>
              </div>

              <div className="space-y-8">
                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Interview Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(INTERVIEW_TYPES).map(([type, config]) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('type', type)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.type === type
                            ? `${config.borderColor} ${config.bgColor}`
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          {React.createElement(config.icon, { 
                            className: `w-6 h-6 ${
                              formData.type === type ? config.textColor : 'text-slate-600'
                            }`
                          })}
                          <h3 className={`font-semibold ${
                            formData.type === type ? config.textColor : 'text-slate-900'
                          }`}>
                            {config.name}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600">
                          {config.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date, Time, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                          errors.scheduledDate ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
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
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                          errors.scheduledTime ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                      <Clock className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.scheduledTime && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.scheduledTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="75">1.25 hours</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                {/* Interviewer Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Interviewer *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockInterviewers.map(interviewer => (
                      <div
                        key={interviewer.id}
                        onClick={() => handleInputChange('interviewerId', interviewer.id)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.interviewer.id === interviewer.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {interviewer.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{interviewer.name}</h3>
                            <p className="text-sm text-slate-600">{interviewer.role}</p>
                            <p className="text-xs text-slate-500">{interviewer.department}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.interviewer && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.interviewer}
                    </p>
                  )}
                </div>

                {/* Round and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interview Round
                    </label>
                    <select
                      value={formData.round}
                      onChange={(e) => handleInputChange('round', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                    >
                      <option value="1">Round 1 - Initial Screening</option>
                      <option value="2">Round 2 - Technical Assessment</option>
                      <option value="3">Round 3 - Manager Interview</option>
                      <option value="4">Round 4 - Final Interview</option>
                      <option value="5">Round 5 - HR Discussion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors"
                    >
                      {Object.entries(PRIORITY_LEVELS).map(([level, config]) => (
                        <option key={level} value={level}>
                          {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Additional Information</h2>
                <p className="text-slate-600">Provide location details, interview agenda, and any special requirements.</p>
              </div>

              <div className="space-y-6">
                {/* Location and Meeting Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Conference Room A, Virtual, Phone, etc."
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors pl-12 ${
                          errors.location ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    </div>
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
                        Meeting Link {formData.type === 'video' && '*'}
                      </label>
                      <input
                        type="url"
                        value={formData.meetingLink}
                        onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors ${
                          errors.meetingLink ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                      {errors.meetingLink && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.meetingLink}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Interview Agenda */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interview Agenda
                  </label>
                  <textarea
                    value={formData.agenda}
                    onChange={(e) => handleInputChange('agenda', e.target.value)}
                    rows={4}
                    placeholder="• Technical discussion on React and system design&#10;• Code review and problem-solving&#10;• Questions about previous experience&#10;• Company culture fit assessment"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors resize-none"
                  />
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Requirements & Notes
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows={3}
                    placeholder="Any special accommodations, preparation materials, or important notes for the interviewer..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors resize-none"
                  />
                </div>

                {/* General Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Any additional information about this interview..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Interview Scheduled Successfully!</h2>
                <p className="text-slate-600">The interview has been scheduled and all participants will be notified.</p>
              </div>

              {/* Interview Summary */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Interview Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Candidate</label>
                      <p className="text-slate-900 font-medium">{selectedCandidate?.name}</p>
                      <p className="text-sm text-slate-600">{selectedCandidate?.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-500">Job Position</label>
                      <p className="text-slate-900 font-medium">{selectedJob?.title}</p>
                      <p className="text-sm text-slate-600">{selectedJob?.client}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-500">Interview Type</label>
                      <div className="flex items-center space-x-2">
                        {React.createElement(INTERVIEW_TYPES[formData.type].icon, { 
                          className: "w-4 h-4 text-slate-600"
                        })}
                        <span className="text-slate-900">{INTERVIEW_TYPES[formData.type].name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Date & Time</label>
                      <p className="text-slate-900 font-medium">
                        {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })} ({formData.duration} minutes)
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-500">Interviewer</label>
                      <p className="text-slate-900 font-medium">{selectedInterviewer?.name}</p>
                      <p className="text-sm text-slate-600">{selectedInterviewer?.role}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-500">Location</label>
                      <p className="text-slate-900">{formData.location}</p>
                      {formData.meetingLink && (
                        <a 
                          href={formData.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigate('/app/recruiter/calendar')}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  Back to Calendar
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFormData({
                      candidateId: '',
                      candidateName: '',
                      jobId: '',
                      jobTitle: '',
                      client: '',
                      type: 'video',
                      scheduledDate: new Date().toISOString().split('T')[0],
                      scheduledTime: '10:00',
                      duration: 60,
                      interviewer: { id: '', name: '', email: '', role: '' },
                      location: '',
                      meetingLink: '',
                      notes: '',
                      round: 1,
                      priority: 'medium',
                      agenda: '',
                      requirements: ''
                    });
                  }}
                  className="px-6 py-3 bg-slate-600 text-white font-medium rounded-xl hover:bg-slate-700 transition-all duration-200"
                >
                  Schedule Another
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between p-6 border-t border-slate-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>Schedule Interview</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterScheduleInterview;