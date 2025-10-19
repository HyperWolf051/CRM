import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Save,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    department: '',
    location: '',
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    remote: false,
    urgent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate back to deals page with success message
      navigate('/app/deals', {
        state: {
          message: 'Job posted successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error posting job:', error);
      setErrors({ submit: 'Failed to post job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, navigate]);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/deals')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
                aria-label="Go back to jobs"
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
                type="button"
                onClick={() => navigate('/app/deals')}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="job-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Post Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Single Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl overflow-hidden">
            <form id="job-form" onSubmit={handleSubmit} className="p-8 space-y-8">

              {/* Job Information Section */}
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
                      className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.title ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                        }`}
                      placeholder="e.g., Senior React Developer"
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
                      Company *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.company ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                          }`}
                        placeholder="Company name"
                        aria-describedby={errors.company ? 'company-error' : undefined}
                      />
                    </div>
                    {errors.company && (
                      <p id="company-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.company}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                      placeholder="e.g., Engineering, Marketing"
                    />
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
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.location ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                          }`}
                        placeholder="City, State or Remote"
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Experience Level
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                      >
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Salary Range
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          value={formData.salaryMin}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                          placeholder="Min salary"
                        />
                      </div>
                      <input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                        placeholder="Max salary"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                      >
                        {currencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Application Deadline
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="remote"
                        checked={formData.remote}
                        onChange={(e) => handleInputChange('remote', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="remote" className="text-sm font-medium text-slate-700">
                        Remote work available
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="urgent"
                        checked={formData.urgent}
                        onChange={(e) => handleInputChange('urgent', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-slate-50 border-slate-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="urgent" className="text-sm font-medium text-slate-700">
                        Urgent hiring
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Job Details</h2>
                    <p className="text-sm text-slate-600">Description, requirements, and benefits</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                        }`}
                      placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                      aria-describedby={errors.description ? 'description-error' : undefined}
                    />
                    {errors.description && (
                      <p id="description-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Requirements *
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 resize-none ${errors.requirements ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                        }`}
                      placeholder="List the required skills, experience, education, and qualifications..."
                      aria-describedby={errors.requirements ? 'requirements-error' : undefined}
                    />
                    {errors.requirements && (
                      <p id="requirements-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.requirements}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Benefits & Perks
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 resize-none"
                      placeholder="Health insurance, 401k, flexible PTO, remote work, professional development..."
                    />
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
  } catch (error) {
    console.error('Error rendering AddJob component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">There was an error loading the Add Job page.</p>
          <button
            onClick={() => navigate('/app/deals')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }
};

export default AddJob;