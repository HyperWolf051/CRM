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