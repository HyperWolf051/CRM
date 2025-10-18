import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock,
  FileText,
  Target,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Zap
} from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Basic Job Information
    title: '',
    department: '',
    location: '',
    workType: 'full-time',
    remote: false,
    
    // Compensation
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    salaryType: 'annual',
    
    // Job Details
    description: '',
    responsibilities: '',
    requirements: '',
    preferredQualifications: '',
    
    // Experience & Education
    experienceLevel: '',
    educationLevel: '',
    
    // Application Details
    applicationDeadline: '',
    startDate: '',
    urgency: 'normal',
    
    // Company Information
    hiringManager: '',
    reportingTo: '',
    teamSize: '',
    
    // Skills & Benefits
    requiredSkills: [],
    preferredSkills: [],
    benefits: [],
    
    // Status & Visibility
    status: 'draft',
    visibility: 'public',
    
    // Additional Information
    tags: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillType, setSkillType] = useState('required'); // 'required' or 'preferred'
  const [benefitInput, setBenefitInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle skill addition
  const addSkill = () => {
    if (skillInput.trim()) {
      const skillField = skillType === 'required' ? 'requiredSkills' : 'preferredSkills';
      if (!formData[skillField].includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          [skillField]: [...prev[skillField], skillInput.trim()]
        }));
        setSkillInput('');
      }
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove, skillField) => {
    setFormData(prev => ({
      ...prev,
      [skillField]: prev[skillField].filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle benefit addition
  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  // Remove benefit
  const removeBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  // Handle tag addition
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle key press for inputs
  const handleKeyPress = (e, addFunction) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    
    if (formData.salaryMin && formData.salaryMax) {
      if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
      }
    }
    
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      const today = new Date();
      if (deadline <= today) {
        newErrors.applicationDeadline = 'Application deadline must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate back with success message
      navigate('/app/deals', { 
        state: { 
          message: 'Job posted successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      setErrors({ submit: 'Failed to post job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Customer Success',
    'Human Resources', 'Finance', 'Operations', 'Legal', 'Data Science', 'Security'
  ];

  const workTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5-8 years)', 
    'Lead Level (8-12 years)', 'Executive Level (12+ years)'
  ];

  const educationLevels = [
    'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 
    'PhD', 'Professional Certification', 'No Formal Education Required'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];  r
eturn (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/deals')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Post New Job
              </h1>
              <p className="text-slate-600 text-sm">Create a comprehensive job posting to attract top talent</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/app/deals')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'draft' }));
                handleSubmit();
              }}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, status: 'published' }));
                handleSubmit();
              }}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Single Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">      
      {/* Basic Job Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Job Information</h2>
                  <p className="text-sm text-slate-600">Basic details about the position</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${
                      errors.title ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                    aria-describedby={errors.title ? 'title-error' : undefined}
                  />
                  {errors.title && (
                    <p id="title-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${
                      errors.department ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                    }`}
                    aria-describedby={errors.department ? 'department-error' : undefined}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p id="department-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.department}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Work Type
                  </label>
                  <select
                    value={formData.workType}
                    onChange={(e) => handleInputChange('workType', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                  >
                    {workTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${
                        errors.location ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                      }`}
                      placeholder="e.g., San Francisco, CA"
                      aria-describedby={errors.location ? 'location-error' : undefined}
                    />
                  </div>
                  {errors.location && (
                    <p id="location-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.location}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.remote}
                      onChange={(e) => handleInputChange('remote', e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remote work available</span>
                  </label>
                </div>
              </div>
            </div>      
      {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;