import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Download, Eye, Edit, Trash2, TrendingUp, Users, DollarSign, Target, MapPin, Briefcase } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function Deals() {
  const navigate = useNavigate();
  
  // Mock jobs data for CRM
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: true,
      salary: '$120,000 - $150,000',
      status: 'active',
      applicants: 45,
      posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      description: 'We are looking for a Senior React Developer to join our growing team...',
      requirements: ['5+ years React experience', 'TypeScript', 'Node.js', 'AWS'],
      benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options']
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Full-time',
      remote: false,
      salary: '$90,000 - $110,000',
      status: 'active',
      applicants: 32,
      posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days from now
      description: 'Join our creative team as a UX/UI Designer...',
      requirements: ['3+ years UX/UI experience', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
      benefits: ['Health Insurance', 'Flexible Hours', 'Professional Development']
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      remote: true,
      salary: '$130,000 - $160,000',
      status: 'paused',
      applicants: 28,
      posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
      description: 'We need a DevOps Engineer to manage our cloud infrastructure...',
      requirements: ['AWS/Azure experience', 'Kubernetes', 'Docker', 'CI/CD'],
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Learning Budget']
    },
    {
      id: 4,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      remote: true,
      salary: '$100,000 - $130,000',
      status: 'closed',
      applicants: 67,
      posted: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 18 days ago
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago (expired)
      description: 'Lead product strategy and development for our fintech platform...',
      requirements: ['5+ years product management', 'Agile/Scrum', 'Analytics', 'Leadership'],
      benefits: ['Health Insurance', 'Remote Work', 'Equity', 'Unlimited PTO']
    }
  ]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
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
    deadline: ''
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
    { id: 'San Francisco, CA', name: 'San Francisco, CA' },
    { id: 'New York, NY', name: 'New York, NY' },
    { id: 'Austin, TX', name: 'Austin, TX' }
  ];

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' ||
      (selectedLocation === 'remote' && job.remote) ||
      job.location === selectedLocation;
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  // Calculate metrics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
  const avgApplicants = jobs.length ? totalApplicants / jobs.length : 0;

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleCreateJob = () => {
    navigate('/app/jobs/new');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <DollarSign className="w-6 h-6 text-orange-600" />
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
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 text-sm">{job.company}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location} {job.remote && '(Remote)'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {job.applicants} applicants
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Posted: {new Date(job.posted).toLocaleDateString()}</span>
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{job.type}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
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
              ))}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Applicants</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleJobClick(job)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">Posted: {new Date(job.posted).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{job.company}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">
                          {job.location}
                          {job.remote && <span className="ml-1 text-xs text-blue-600">(Remote)</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{job.type}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{job.salary}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{job.applicants}</div>
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
                              // Handle edit
                            }}
                            className="p-1 text-gray-400 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="City, State or Remote"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="e.g., $120,000 - $150,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Application Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.remote}
                      onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Remote work available</span>
                  </label>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                    placeholder="List required skills, experience, qualifications (one per line)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Benefits</label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                    placeholder="List benefits and perks (one per line)"
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
                  onClick={() => {
                    if (!formData.title || !formData.company || !formData.location) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    const newJob = {
                      id: Math.max(...jobs.map(j => j.id)) + 1,
                      ...formData,
                      status: 'active',
                      applicants: 0,
                      posted: new Date().toISOString().split('T')[0],
                      requirements: formData.requirements.split('\n').filter(r => r.trim()),
                      benefits: formData.benefits.split('\n').filter(b => b.trim())
                    };

                    setJobs([...jobs, newJob]);
                    setIsCreateModalOpen(false);
                    setFormData({
                      title: '', company: '', location: '', type: 'Full-time', remote: false,
                      salary: '', description: '', requirements: '', benefits: '', deadline: ''
                    });
                  }}
                  className="px-6 py-2 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Post Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {isDetailsModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedJob.title}</h3>
                    <p className="text-lg text-slate-600 mb-3">{selectedJob.company}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                        {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                      </span>
                      <span className="text-sm text-slate-500">Posted: {new Date(selectedJob.posted).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Job Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{selectedJob.location}</span>
                        {selectedJob.remote && <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Remote</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{selectedJob.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{selectedJob.applicants} applicants</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700">Type:</span>
                        <span className="ml-2 text-slate-600">{selectedJob.type}</span>
                      </div>
                      {selectedJob.deadline && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Deadline:</span>
                          <span className="ml-2 text-slate-600">{new Date(selectedJob.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{selectedJob.applicants}</div>
                        <div className="text-sm text-blue-600">Applicants</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.floor((new Date() - new Date(selectedJob.posted)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-sm text-green-600">Days Active</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedJob.description && (
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Job Description</h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedJob.description}</p>
                  </div>
                )}

                {/* Requirements */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h4>
                    <div className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Benefits & Perks</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit job
                    setFormData({
                      title: selectedJob.title,
                      company: selectedJob.company,
                      location: selectedJob.location,
                      type: selectedJob.type,
                      remote: selectedJob.remote,
                      salary: selectedJob.salary,
                      description: selectedJob.description,
                      requirements: selectedJob.requirements.join('\n'),
                      benefits: selectedJob.benefits.join('\n'),
                      deadline: selectedJob.deadline
                    });
                    setIsDetailsModalOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="px-6 py-2 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}