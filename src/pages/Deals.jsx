import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Download, Eye, Edit, Trash2, TrendingUp, Users, Banknote, Target, MapPin, Briefcase } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { JobAPI, EmployerAPI } from '../services/api';

export default function Deals() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load jobs and employers from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load both jobs and employers
      const [jobsResponse, employersResponse] = await Promise.all([
        JobAPI.getAll(),
        EmployerAPI.getAll()
      ]);
      
      setJobs(jobsResponse.data || []);
      setEmployers(employersResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
      // Fallback to mock data if API fails
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data as fallback
  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      employerId: 1,
      location: 'Bengaluru, Karnataka',
      employmentType: 'Full-time',
      minSalary: 1800000,
      maxSalary: 2500000,
      description: 'We are looking for a Senior React Developer to join our growing team...',
      qualification: '5+ years React experience, TypeScript, Node.js, AWS',
      closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    employerId: '',
    title: '',
    description: '',
    location: '',
    employmentType: 'Full-time',
    minExperienceYears: '',
    maxExperienceYears: '',
    minSalary: '',
    maxSalary: '',
    qualification: '',
    closingDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Job statuses and filters
  const jobStatuses = [
    { id: 'all', name: 'All Jobs', count: jobs.length, color: 'bg-gray-100 text-gray-800' },
    { id: 'active', name: 'Active', count: jobs.filter(j => j.status === 'active').length, color: 'bg-green-100 text-green-800' },
    { id: 'paused', name: 'Paused', count: jobs.filter(j => j.status === 'paused').length, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'closed', name: 'Closed', count: jobs.filter(j => j.status === 'closed').length, color: 'bg-red-100 text-red-800' },
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'Full-time', name: 'Full-time' },
    { id: 'Part-time', name: 'Part-time' },
    { id: 'Contract', name: 'Contract' },
    { id: 'Internship', name: 'Internship' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'Bengaluru, Karnataka', name: 'Bengaluru, Karnataka' },
    { id: 'Mumbai, Maharashtra', name: 'Mumbai, Maharashtra' },
    { id: 'Delhi, NCR', name: 'Delhi, NCR' },
    { id: 'Hyderabad, Telangana', name: 'Hyderabad, Telangana' },
    { id: 'Chennai, Tamil Nadu', name: 'Chennai, Tamil Nadu' },
    { id: 'Pune, Maharashtra', name: 'Pune, Maharashtra' }
  ];

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const employer = employers.find(e => e.id === job.employerId);
    const companyName = employer?.name || 'Unknown Company';
    
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.employmentType === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  // Calculate metrics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
  const avgApplicants = jobs.length ? totalApplicants / jobs.length : 0;

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleCreateJob = () => {
    setFormData({
      employerId: '',
      title: '',
      description: '',
      location: '',
      employmentType: 'Full-time',
      minExperienceYears: '',
      maxExperienceYears: '',
      minSalary: '',
      maxSalary: '',
      qualification: '',
      closingDate: ''
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleAddJob = async () => {
    if (!formData.title || !formData.employerId) {
      alert('Please fill in the required fields (Title and Employer)');
      return;
    }

    try {
      setIsSubmitting(true);
      await JobAPI.create({
        ...formData,
        minExperienceYears: formData.minExperienceYears ? parseInt(formData.minExperienceYears) : null,
        maxExperienceYears: formData.maxExperienceYears ? parseInt(formData.maxExperienceYears) : null,
        minSalary: formData.minSalary ? parseInt(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : null
      });
      
      // Reload jobs list
      await loadData();
      
      // Reset form and close modal
      setFormData({
        employerId: '',
        title: '',
        description: '',
        location: '',
        employmentType: 'Full-time',
        minExperienceYears: '',
        maxExperienceYears: '',
        minSalary: '',
        maxSalary: '',
        qualification: '',
        closingDate: ''
      });
      setIsCreateModalOpen(false);
      alert('Job posted successfully!');
    } catch (err) {
      console.error('Error adding job:', err);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      setIsLoading(true);
      await JobAPI.delete(jobId);
      await loadData();
      alert('Job deleted successfully!');
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-6 animate-fade-in">
        {/* Header with Metrics */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jobs CRM
              </h1>
              <p className="text-gray-600 mt-1">Manage job postings, track applicants, and streamline hiring</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Table
              </button>
              <button
                onClick={handleCreateJob}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(avgApplicants)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col gap-4 mb-6">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {jobStatuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedStatus === status.id
                      ? status.color + ' shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {status.name} ({status.count})
                  </button>
                ))}
              </div>

              {/* Search and Advanced Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 w-full"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {jobTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedType('all');
                        setSelectedLocation('all');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Content Area */}
            {filteredJobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="w-16 h-16" />}
                title="No jobs found"
                description={
                  searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedLocation !== 'all'
                    ? "No jobs match your current filters. Try adjusting your search criteria."
                    : "You haven't posted any jobs yet. Start building your talent pipeline by posting your first job opening."
                }
                action={
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={handleCreateJob}
                  >
                    Post Your First Job
                  </Button>
                }
              />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => {
                  const employer = employers.find(e => e.id === job.employerId);
                  const companyName = employer?.name || 'Unknown Company';
                  const salaryRange = job.minSalary && job.maxSalary 
                    ? `₹${(job.minSalary / 100000).toFixed(1)}L - ₹${(job.maxSalary / 100000).toFixed(1)}L`
                    : 'Salary not specified';
                  
                  return (
                    <div
                      key={job.id}
                      onClick={() => handleJobClick(job)}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 text-sm">{companyName}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Banknote className="w-4 h-4 mr-2" />
                          {salaryRange}
                        </div>
                        {job.minExperienceYears && job.maxExperienceYears && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {job.minExperienceYears}-{job.maxExperienceYears} years experience
                          </div>
                        )}
                      </div>

                      {job.closingDate && (
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Deadline: {new Date(job.closingDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{job.employmentType}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteJob(job.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobClick(job);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Job Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Salary</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => {
                      const employer = employers.find(e => e.id === job.employerId);
                      const companyName = employer?.name || 'Unknown Company';
                      const salaryRange = job.minSalary && job.maxSalary 
                        ? `₹${(job.minSalary / 100000).toFixed(1)}L - ₹${(job.maxSalary / 100000).toFixed(1)}L`
                        : 'Not specified';
                      
                      return (
                        <tr
                          key={job.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleJobClick(job)}
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              {job.closingDate && (
                                <div className="text-sm text-gray-500">Deadline: {new Date(job.closingDate).toLocaleDateString()}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900">{companyName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900">{job.location || 'Not specified'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900">{job.employmentType}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900">{salaryRange}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobClick(job);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteJob(job.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Post New Job</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., Senior React Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Employer *</label>
                    <select
                      value={formData.employerId}
                      onChange={(e) => setFormData({ ...formData, employerId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      required
                    >
                      <option value="">Select employer</option>
                      {employers.map(employer => (
                        <option key={employer.id} value={employer.id}>{employer.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="City, State or Remote"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Min Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.minExperienceYears}
                      onChange={(e) => setFormData({ ...formData, minExperienceYears: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., 2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.maxExperienceYears}
                      onChange={(e) => setFormData({ ...formData, maxExperienceYears: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., 5"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Min Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.minSalary}
                      onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., 1800000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.maxSalary}
                      onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., 2500000"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Required qualifications and skills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Closing Date</label>
                    <input
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddJob}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}