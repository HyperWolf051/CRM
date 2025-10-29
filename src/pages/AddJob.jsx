import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Banknote,
  Clock,
  Save,
  AlertCircle,
  Calendar,
  Users,
  FileText,
  Target,
  Gift
} from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    client: '',
    department: '',
    location: '',
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryMin: '',
    salaryMax: '',
    currency: 'INR',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    remote: false,
    urgent: false,
    priority: 'medium',
    status: 'active'
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
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
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

      // Navigate back to jobs page with success message
      navigate('/app/jobs', {
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
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const jobStatuses = ['active', 'hot-requirement', 'paused'];

  try {
    return (
      <div className="min-h-screen bg-white">
        {/* Minimal Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/jobs')}
                className="p-2 hover:bg-gray-50 rounded-md transition-colors duration-150 group"
                aria-label="Go back to jobs"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Create Job Posting
                </h1>
                <p className="text-gray-600 text-sm mt-1">Fill in the details to post a new job opening</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/app/jobs')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="job-form"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-all duration-150 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Main Content */}
        <div className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <form id="job-form" onSubmit={handleSubmit} className="space-y-10">

              {/* Job Information Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Essential details about the position</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="e.g., Senior React Developer"
                      aria-describedby={errors.title ? 'title-error' : undefined}
                    />
                    {errors.title && (
                      <p id="title-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 ${errors.client ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="Client company name"
                      aria-describedby={errors.client ? 'client-error' : undefined}
                    />
                    {errors.client && (
                      <p id="client-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.client}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                      placeholder="e.g., Engineering, Marketing, Sales"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="City, State or Remote"
                      aria-describedby={errors.location ? 'location-error' : undefined}
                    />
                    {errors.location && (
                      <p id="location-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.location}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                        placeholder="Min salary"
                      />
                      <input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                        placeholder="Max salary"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                      >
                        {currencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
                    >
                      {jobStatuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'hot-requirement' ? 'Hot Requirement' : 
                           status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="remote"
                          checked={formData.remote}
                          onChange={(e) => handleInputChange('remote', e.target.checked)}
                          className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 focus:ring-1"
                        />
                        <label htmlFor="remote" className="text-sm text-gray-700">
                          Remote work available
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="urgent"
                          checked={formData.urgent}
                          onChange={(e) => {
                            handleInputChange('urgent', e.target.checked);
                            // Auto-set priority to urgent if urgent checkbox is checked
                            if (e.target.checked) {
                              handleInputChange('priority', 'urgent');
                              handleInputChange('status', 'hot-requirement');
                            }
                          }}
                          className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 focus:ring-1"
                        />
                        <label htmlFor="urgent" className="text-sm text-gray-700">
                          Mark as urgent hiring (Hot Requirement)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-gray-900">Job Details</h2>
                    <p className="text-sm text-gray-500">Description, requirements, and benefits</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                      aria-describedby={errors.description ? 'description-error' : undefined}
                    />
                    {errors.description && (
                      <p id="description-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements *
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 resize-none ${errors.requirements ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      placeholder="List the required skills, experience, education, and qualifications..."
                      aria-describedby={errors.requirements ? 'requirements-error' : undefined}
                    />
                    {errors.requirements && (
                      <p id="requirements-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.requirements}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits & Perks
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 resize-none"
                      placeholder="Health insurance, 401k, flexible PTO, remote work, professional development..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
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
            onClick={() => navigate('/app/jobs')}
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