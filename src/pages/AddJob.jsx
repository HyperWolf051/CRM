<<<<<<< Updated upstream
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    Building,
    MapPin,
    DollarSign,
    Clock,
    FileText,
    Calendar,
    Save,
    X
} from 'lucide-react';
import Button from '../components/ui/Button';

const AddJob = () => {
    const navigate = useNavigate();
    const titleInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        remote: false,
        salary: '',
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
        department: '',
        experienceLevel: 'Mid-level',
        workingHours: 'Standard (9-5)',
        contactEmail: '',
        applicationUrl: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-focus the first form field when page loads
    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);

    const jobTypes = [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' },
        { value: 'Freelance', label: 'Freelance' }
    ];

    const experienceLevels = [
        { value: 'Entry-level', label: 'Entry-level (0-2 years)' },
        { value: 'Mid-level', label: 'Mid-level (3-5 years)' },
        { value: 'Senior-level', label: 'Senior-level (6-10 years)' },
        { value: 'Executive', label: 'Executive (10+ years)' }
    ];

    const workingHoursOptions = [
        { value: 'Standard (9-5)', label: 'Standard (9-5)' },
        { value: 'Flexible', label: 'Flexible Hours' },
        { value: 'Shift Work', label: 'Shift Work' },
        { value: 'Remote', label: 'Remote Work' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.requirements.trim()) newErrors.requirements = 'Job requirements are required';
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
        }
        if (formData.applicationUrl && !formData.applicationUrl.startsWith('http')) {
            newErrors.applicationUrl = 'Please enter a valid URL (starting with http:// or https://)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Job data:', formData);

            // Navigate back to jobs page
            navigate('/app/deals');
        } catch (error) {
            console.error('Error posting job:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            <div className="h-full flex flex-col max-w-6xl mx-auto p-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden h-full flex flex-col">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col p-6">
                        {/* Header Section */}
                        <div className="flex-shrink-0 text-center border-b border-slate-200 pb-4">
                            <div className="flex items-center justify-center mb-2">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Post New Job</h1>
                            <p className="text-slate-600 text-sm">Create a new job posting to attract top talent</p>
                        </div>

                        {/* Form Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            {/* Basic Job Information */}
                            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-4 border border-blue-100/50">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md">
                                        <Building className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Job Details</h2>
                                        <p className="text-slate-600 text-xs">Basic information about the position</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            ref={titleInputRef}
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 bg-white/80 border-2 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md ${errors.title ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                }`}
                                            placeholder="e.g., Senior React Developer"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Company Name *
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-2 bg-white/80 border-2 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md ${errors.company ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                    }`}
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        {errors.company && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.company}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-white/80 border-2 border-slate-200/80 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                            placeholder="e.g., Engineering, Marketing, Sales"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Location *
                                        </label>
                                        <div className="relative max-w-xs">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-2 bg-white/80 border-2 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md ${errors.location ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                    }`}
                                                placeholder="City, State or Remote"
                                            />
                                        </div>
                                        {errors.location && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-white/80 border-2 border-slate-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                        >
                                            {jobTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Experience Level
                                        </label>
                                        <select
                                            name="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-white/80 border-2 border-slate-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                        >
                                            {experienceLevels.map((level) => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Working Hours
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                name="workingHours"
                                                value={formData.workingHours}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 bg-white/80 border-2 border-slate-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                            >
                                                {workingHoursOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Salary Range
                                        </label>
                                        <div className="relative max-w-xs">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="salary"
                                                value={formData.salary}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 bg-white/80 border-2 border-slate-200/80 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                                placeholder="e.g., $120,000 - $150,000"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-3">
                                        <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200/60">
                                            <input
                                                type="checkbox"
                                                name="remote"
                                                checked={formData.remote}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <label className="text-sm font-medium text-slate-700">
                                                Remote work available
                                            </label>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                            {/* Right Column - Job Description & Application Details */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-xl p-3 border border-green-100/50">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="p-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md">
                                            <FileText className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900">Job Description</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Job Description *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className={`w-full px-2 py-1.5 bg-white/80 border-2 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md resize-none ${errors.description ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                    }`}
                                                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Requirements *
                                            </label>
                                            <textarea
                                                name="requirements"
                                                value={formData.requirements}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className={`w-full px-2 py-1.5 bg-white/80 border-2 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md resize-none ${errors.requirements ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                    }`}
                                                placeholder="List the required skills, experience, education, and qualifications..."
                                            />
                                            {errors.requirements && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    {errors.requirements}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Benefits & Perks
                                            </label>
                                            <textarea
                                                name="benefits"
                                                value={formData.benefits}
                                                onChange={handleInputChange}
                                                rows={2}
                                                className="w-full px-2 py-1.5 bg-white/80 border-2 border-slate-200/80 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md resize-none"
                                                placeholder="Health insurance, 401k, flexible PTO, remote work, professional development..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-3 border border-purple-100/50">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
                                            <Calendar className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900">Application Details</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Application Deadline
                                                </label>
                                                <input
                                                    type="date"
                                                    name="deadline"
                                                    value={formData.deadline}
                                                    onChange={handleInputChange}
                                                    className="w-full px-2 py-1.5 bg-white/80 border-2 border-slate-200/80 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contactEmail"
                                                    value={formData.contactEmail}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-2 py-1.5 bg-white/80 border-2 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md ${errors.contactEmail ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                        }`}
                                                    placeholder="hr@company.com"
                                                />
                                                {errors.contactEmail && (
                                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                                        <X className="w-3 h-3 mr-1" />
                                                        {errors.contactEmail}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Application URL
                                            </label>
                                            <input
                                                type="url"
                                                name="applicationUrl"
                                                value={formData.applicationUrl}
                                                onChange={handleInputChange}
                                                className={`w-full px-2 py-1.5 bg-white/80 border-2 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm hover:shadow-md ${errors.applicationUrl ? 'border-red-300 bg-red-50/50' : 'border-slate-200/80'
                                                    }`}
                                                placeholder="https://company.com/careers/apply"
                                            />
                                            {errors.applicationUrl && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    {errors.applicationUrl}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Fixed Footer */}
                        <div className="flex-shrink-0 flex flex-row gap-3 pt-3 border-t border-slate-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/app/deals')}
                                className="px-4 py-2 text-slate-700 border-slate-300 hover:bg-slate-50 transition-all duration-200 text-xs"
                            >
                                <ArrowLeft className="w-3 h-3 mr-1" />
                                Back to Jobs
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3 h-3 mr-1 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Posting Job...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3 h-3 mr-1" />
                                        Post Job
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddJob;
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Save,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function AddJob() {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
    status: 'draft'
  });

  const handleInputChange = (field, value) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating job:', jobData);
    // Here you would typically save to your backend
    alert('Job created successfully!');
    navigate('/app/jobs');
  };

  const handleCancel = () => {
    navigate('/app/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
                <p className="text-gray-600">Add a new job posting to your recruitment pipeline</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={jobData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. TechCorp Solutions"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={jobData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={jobData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. $80,000 - $120,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={jobData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Job Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements & Qualifications
                  </label>
                  <textarea
                    value={jobData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List the required skills, experience, education, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Publication Status
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={jobData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
