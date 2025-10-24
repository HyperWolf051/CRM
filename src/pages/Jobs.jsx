import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Download, Eye, Trash2, TrendingUp, Users, Banknote, Target, MapPin, Briefcase } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { JobAPI, EmployerAPI } from '../services/api';

export default function Jobs() {
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
      const [jobsResult, employersResult] = await Promise.all([
        JobAPI.getAll(),
        EmployerAPI.getAll()
      ]);

      // Handle jobs response
      if (jobsResult.success) {
        setJobs(Array.isArray(jobsResult.data) ? jobsResult.data : []);
      } else {
        console.error('Jobs API Error:', jobsResult.message);
        setJobs(mockJobs); // Fallback to mock data
      }

      // Handle employers response
      if (employersResult.success) {
        setEmployers(Array.isArray(employersResult.data) ? employersResult.data : []);
      } else {
        console.error('Employers API Error:', employersResult.message);
        setEmployers([]); // Empty array as fallback
      }

      // Set error if both failed
      if (!jobsResult.success && !employersResult.success) {
        setError('Failed to load data. Please try again.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load jobs. Please try again.');
      // Fallback to mock data if API fails
      setJobs(mockJobs);
      setEmployers([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const handleCreateJob = () => {
    navigate('/app/jobs/add');
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
                Jobs Management
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
                <span>Add Job</span>
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
                                // Navigate to job details or edit
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
                                  // Navigate to job details
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
    </div>
  );
}