import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Building2,
    Users,
    Calendar,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Download,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';

// Mock jobs data
const mockJobs = [
    {
        id: '1',
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        remote: true,
        status: 'active',
        applicants: 24,
        postedDate: '2024-01-15',
        deadline: '2024-02-15',
        department: 'Engineering',
        experienceLevel: 'Senior-level',
        description: 'We are looking for a Senior React Developer to join our dynamic team...',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years React experience...'
    },
    {
        id: '2',
        title: 'Product Manager',
        company: 'Innovate Solutions',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$100,000 - $130,000',
        remote: false,
        status: 'active',
        applicants: 18,
        postedDate: '2024-01-12',
        deadline: '2024-02-12',
        department: 'Product',
        experienceLevel: 'Mid-level',
        description: 'Join our product team to drive innovation and growth...',
        requirements: 'MBA preferred, 3+ years product management experience...'
    },
    {
        id: '3',
        title: 'UX Designer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Contract',
        salary: '$80,000 - $100,000',
        remote: true,
        status: 'draft',
        applicants: 0,
        postedDate: '2024-01-10',
        deadline: '2024-02-10',
        department: 'Design',
        experienceLevel: 'Mid-level',
        description: 'Create beautiful and intuitive user experiences...',
        requirements: 'Portfolio required, 3+ years UX design experience...'
    },
    {
        id: '4',
        title: 'DevOps Engineer',
        company: 'Global Tech',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$110,000 - $140,000',
        remote: true,
        status: 'closed',
        applicants: 45,
        postedDate: '2024-01-05',
        deadline: '2024-01-30',
        department: 'Engineering',
        experienceLevel: 'Senior-level',
        description: 'Manage and optimize our cloud infrastructure...',
        requirements: 'AWS certification preferred, 4+ years DevOps experience...'
    }
];

export default function Jobs() {
    const navigate = useNavigate();
    const [jobs] = useState(mockJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [sortField, setSortField] = useState('postedDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
        };

        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    // Job statuses
    const jobStatuses = [
        { id: 'all', name: 'All', count: jobs.length, color: 'bg-gray-100 text-gray-800' },
        { id: 'active', name: 'Active', count: jobs.filter(j => j.status === 'active').length, color: 'bg-green-100 text-green-800' },
        { id: 'draft', name: 'Draft', count: jobs.filter(j => j.status === 'draft').length, color: 'bg-yellow-100 text-yellow-800' },
        { id: 'closed', name: 'Closed', count: jobs.filter(j => j.status === 'closed').length, color: 'bg-red-100 text-red-800' },
    ];

    const jobTypes = [
        { id: 'all', name: 'All Types' },
        { id: 'Full-time', name: 'Full-time' },
        { id: 'Part-time', name: 'Part-time' },
        { id: 'Contract', name: 'Contract' },
        { id: 'Internship', name: 'Internship' },
        { id: 'Freelance', name: 'Freelance' }
    ];

    // Filter and sort jobs
    const filteredJobs = jobs
        .filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
            const matchesType = selectedType === 'all' || job.type === selectedType;
            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle different data types
            if (sortField === 'applicants') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortField === 'postedDate' || sortField === 'deadline') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Calculate metrics
    const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const avgApplicants = jobs.length ? Math.round(totalApplicants / jobs.length) : 0;

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setIsDetailsModalOpen(true);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
        }
        return sortDirection === 'asc'
            ? <ArrowUp className="w-4 h-4 text-blue-600" />
            : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            draft: 'warning',
            closed: 'default'
        };
        return variants[status] || 'default';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="space-y-6 animate-fade-in">
                {/* Header with Metrics */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Jobs
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your job postings and track applications</p>
                        </div>
                        <Button
                            variant="primary"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => navigate('/app/jobs/new')}
                        >
                            Post New Job
                        </Button>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                                    <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-purple-600" />
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
                                    <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Applicants</p>
                                    <p className="text-2xl font-bold text-gray-900">{avgApplicants}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-orange-600" />
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

                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setSelectedType('all');
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

                        {/* Jobs List */}
                        {filteredJobs.length === 0 ? (
                            <EmptyState
                                icon={<Briefcase className="w-16 h-16" />}
                                title="No jobs found"
                                description={
                                    searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
                                        ? "No jobs match your current filters. Try adjusting your search criteria."
                                        : "You haven't posted any jobs yet. Start by creating your first job posting."
                                }
                                action={
                                    <Button
                                        variant="primary"
                                        icon={<Plus className="w-4 h-4" />}
                                        onClick={() => navigate('/app/jobs/new')}
                                    >
                                        Post Your First Job
                                    </Button>
                                }
                            />
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                                {/* Results Counter */}
                                <div className="px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">
                                            Showing <span className="font-semibold text-slate-900">{filteredJobs.length}</span> of <span className="font-semibold text-slate-900">{jobs.length}</span> jobs
                                        </div>
                                        <div className="text-xs text-slate-500 hidden sm:block">
                                            Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Card View - Hidden on larger screens */}
                                <div className="block sm:hidden">
                                    {filteredJobs.map((job, index) => (
                                        <div
                                            key={job.id}
                                            className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                                                } hover:bg-blue-50/50 active:bg-blue-100/50`}
                                            onClick={() => handleJobClick(job)}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="relative flex-shrink-0">
                                                    <Avatar
                                                        src={null}
                                                        name={job.company}
                                                        size="md"
                                                    />
                                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${job.status === 'active' ? 'bg-green-400' :
                                                        job.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400'
                                                        }`}></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-slate-900 text-base truncate">{job.title}</h3>
                                                        <Badge variant={getStatusBadge(job.status)} size="sm">
                                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-1 space-y-1">
                                                        <div className="text-sm text-slate-600">{job.company} • {job.location}</div>
                                                        <div className="text-sm font-semibold text-emerald-600">{job.salary}</div>
                                                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                            <span className="flex items-center space-x-1">
                                                                <Users className="w-3 h-3" />
                                                                <span>{job.applicants} applicants</span>
                                                            </span>
                                                            <span className="flex items-center space-x-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{job.type}</span>
                                                            </span>
                                                            {job.remote && (
                                                                <Badge variant="info" size="sm">Remote</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View - Hidden on mobile */}
                                <div className="hidden sm:block w-full">
                                    <table className="w-full table-fixed">
                                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                            <tr>
                                                <th className="text-left py-4 px-3 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/3">
                                                    <button
                                                        onClick={() => handleSort('title')}
                                                        className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                                                    >
                                                        <Briefcase className="w-4 h-4 text-slate-600" />
                                                        <span>Job Title</span>
                                                        {getSortIcon('title')}
                                                    </button>
                                                </th>
                                                <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/6 hidden md:table-cell">
                                                    <button
                                                        onClick={() => handleSort('company')}
                                                        className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                                                    >
                                                        <Building2 className="w-4 h-4 text-slate-600" />
                                                        <span>Company</span>
                                                        {getSortIcon('company')}
                                                    </button>
                                                </th>
                                                <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/8 hidden lg:table-cell">
                                                    <button
                                                        onClick={() => handleSort('location')}
                                                        className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                                                    >
                                                        <MapPin className="w-4 h-4 text-slate-600" />
                                                        <span>Location</span>
                                                        {getSortIcon('location')}
                                                    </button>
                                                </th>
                                                <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/8">
                                                    <button
                                                        onClick={() => handleSort('status')}
                                                        className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                                                    >
                                                        <span>Status</span>
                                                        {getSortIcon('status')}
                                                    </button>
                                                </th>
                                                <th className="text-center py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/12 hidden sm:table-cell">
                                                    <button
                                                        onClick={() => handleSort('applicants')}
                                                        className="flex items-center justify-center space-x-1 hover:text-blue-600 transition-colors group w-full"
                                                    >
                                                        <Users className="w-4 h-4 text-slate-600" />
                                                        {getSortIcon('applicants')}
                                                    </button>
                                                </th>
                                                <th className="text-center py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/12 hidden sm:table-cell">
                                                    <button
                                                        onClick={() => handleSort('postedDate')}
                                                        className="flex items-center justify-center space-x-1 hover:text-blue-600 transition-colors group w-full"
                                                    >
                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                        {getSortIcon('postedDate')}
                                                    </button>
                                                </th>
                                                <th className="text-center py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/12">
                                                    <MoreHorizontal className="w-4 h-4 mx-auto text-slate-600" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredJobs.map((job, index) => (
                                                <tr
                                                    key={job.id}
                                                    className={`cursor-pointer transition-all duration-300 group ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                                                        } hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:shadow-md hover:scale-[1.01] hover:border-blue-200 border border-transparent`}
                                                    onClick={() => handleJobClick(job)}
                                                >
                                                    <td className="py-4 px-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative flex-shrink-0">
                                                                <Avatar
                                                                    src={null}
                                                                    name={job.company}
                                                                    size="sm"
                                                                />
                                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${job.status === 'active' ? 'bg-green-400' :
                                                                    job.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400'
                                                                    }`}></div>
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                                                                    {job.title}
                                                                </div>
                                                                <div className="text-xs text-slate-500 truncate sm:hidden">
                                                                    {job.company}
                                                                </div>
                                                                <div className="text-xs text-slate-500 truncate hidden sm:block">
                                                                    <DollarSign className="w-3 h-3 inline mr-1" />
                                                                    {job.salary}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 hidden md:table-cell">
                                                        <div className="text-slate-700 font-medium text-sm">{job.company}</div>
                                                        <div className="text-xs text-slate-500">{job.department}</div>
                                                    </td>
                                                    <td className="py-4 px-2 hidden lg:table-cell">
                                                        <div className="text-slate-700 font-medium text-sm">{job.location}</div>
                                                        <div className="text-xs text-slate-500">{job.type}</div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center space-x-1">
                                                            <div className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-green-400' :
                                                                job.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400'
                                                                } animate-pulse`}></div>
                                                            <Badge variant={getStatusBadge(job.status)} size="sm">
                                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-center hidden sm:table-cell">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <Users className="w-3 h-3 text-blue-600" />
                                                            </div>
                                                            <span className="font-semibold text-slate-900 text-sm">{job.applicants}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-center hidden sm:table-cell">
                                                        <div className="space-y-1">
                                                            <div className="font-semibold text-slate-900 text-xs">{formatDate(job.postedDate)}</div>
                                                            <div className="text-xs text-slate-500">Deadline: {formatDate(job.deadline)}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-center">
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDropdown(openDropdown === job.id ? null : job.id);
                                                                }}
                                                                className="inline-flex items-center justify-center w-8 h-8 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 group"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                            </button>

                                                            {openDropdown === job.id && (
                                                                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 z-30 overflow-hidden">
                                                                    <div className="py-3">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleJobClick(job);
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 group"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-3 transition-all duration-200">
                                                                                <Eye className="w-4 h-4 text-blue-600" />
                                                                            </div>
                                                                            <div className="flex-1 text-left">
                                                                                <div className="font-semibold text-slate-900 group-hover:text-blue-700">View Details</div>
                                                                                <div className="text-xs text-slate-500 group-hover:text-blue-600">See complete information</div>
                                                                            </div>
                                                                        </button>

                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // Handle edit
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 transition-all duration-200 group"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mr-3 transition-colors duration-200">
                                                                                <Edit className="w-4 h-4 text-emerald-600" />
                                                                            </div>
                                                                            <div className="flex-1 text-left">
                                                                                <div className="font-medium">Edit Job</div>
                                                                                <div className="text-xs text-slate-500 group-hover:text-emerald-600">Modify posting</div>
                                                                            </div>
                                                                        </button>

                                                                        <div className="border-t border-slate-200 my-2"></div>

                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // Handle delete
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 transition-all duration-200 group"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors duration-200">
                                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                                            </div>
                                                                            <div className="flex-1 text-left">
                                                                                <div className="font-medium">Delete Job</div>
                                                                                <div className="text-xs text-slate-500 group-hover:text-red-600">Remove permanently</div>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Table Footer with Summary */}
                                <div className="px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center space-x-6 text-sm text-slate-600">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span>Active Jobs: <span className="font-semibold text-green-600">{filteredJobs.filter(j => j.status === 'active').length}</span></span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <span>Total Applicants: <span className="font-semibold text-blue-600">{filteredJobs.reduce((sum, j) => sum + j.applicants, 0)}</span></span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                <span>Draft Jobs: <span className="font-semibold text-yellow-600">{filteredJobs.filter(j => j.status === 'draft').length}</span></span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Last updated: {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Details Modal */}
            {isDetailsModalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        src={null}
                                        name={selectedJob.company}
                                        size="lg"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                                        <p className="text-slate-600">{selectedJob.company} • {selectedJob.location}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                >
                                    <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Job Description</h3>
                                        <p className="text-slate-700 leading-relaxed">{selectedJob.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h3>
                                        <p className="text-slate-700 leading-relaxed">{selectedJob.requirements}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Type:</span>
                                                <Badge variant="info">{selectedJob.type}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Status:</span>
                                                <Badge variant={getStatusBadge(selectedJob.status)}>
                                                    {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Salary:</span>
                                                <span className="font-semibold text-slate-900">{selectedJob.salary}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Department:</span>
                                                <span className="font-semibold text-slate-900">{selectedJob.department}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Experience:</span>
                                                <span className="font-semibold text-slate-900">{selectedJob.experienceLevel}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Applicants:</span>
                                                <span className="font-semibold text-slate-900">{selectedJob.applicants}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Posted:</span>
                                                <span className="font-semibold text-slate-900">{formatDate(selectedJob.postedDate)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Deadline:</span>
                                                <span className="font-semibold text-slate-900">{formatDate(selectedJob.deadline)}</span>
                                            </div>
                                            {selectedJob.remote && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Remote:</span>
                                                    <Badge variant="success">Available</Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button variant="outline" className="flex-1">
                                            Edit Job
                                        </Button>
                                        <Button variant="primary" className="flex-1">
                                            View Applicants
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}