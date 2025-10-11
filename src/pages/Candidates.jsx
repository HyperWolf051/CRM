import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MapPin,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Demo candidates data
  const [candidates] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior React Developer',
      experience: '5 years',
      location: 'San Francisco, CA',
      status: 'active',
      appliedDate: '2024-12-10',
      salary: '$120,000',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      avatar: null,
      rating: 4.8,
      interviews: 2
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      position: 'UX/UI Designer',
      experience: '3 years',
      location: 'New York, NY',
      status: 'interviewing',
      appliedDate: '2024-12-08',
      salary: '$95,000',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      avatar: null,
      rating: 4.6,
      interviews: 1
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 (555) 345-6789',
      position: 'Backend Engineer',
      experience: '4 years',
      location: 'Austin, TX',
      status: 'hired',
      appliedDate: '2024-12-05',
      salary: '$135,000',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      avatar: null,
      rating: 4.9,
      interviews: 3
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '+1 (555) 456-7890',
      position: 'DevOps Engineer',
      experience: '6 years',
      location: 'Seattle, WA',
      status: 'active',
      appliedDate: '2024-12-12',
      salary: '$140,000',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
      avatar: null,
      rating: 4.7,
      interviews: 0
    },
    {
      id: 5,
      name: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '+1 (555) 567-8901',
      position: 'Product Manager',
      experience: '7 years',
      location: 'Los Angeles, CA',
      status: 'rejected',
      appliedDate: '2024-12-01',
      salary: '$110,000',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
      avatar: null,
      rating: 4.3,
      interviews: 2
    },
    {
      id: 6,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '+1 (555) 678-9012',
      position: 'Data Scientist',
      experience: '4 years',
      location: 'Boston, MA',
      status: 'active',
      appliedDate: '2024-12-14',
      salary: '$125,000',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      avatar: null,
      rating: 4.5,
      interviews: 1
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Candidates', count: candidates.length },
    { value: 'active', label: 'Active', count: candidates.filter(c => c.status === 'active').length },
    { value: 'interviewing', label: 'Interviewing', count: candidates.filter(c => c.status === 'interviewing').length },
    { value: 'hired', label: 'Hired', count: candidates.filter(c => c.status === 'hired').length },
    { value: 'rejected', label: 'Rejected', count: candidates.filter(c => c.status === 'rejected').length }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hired':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Candidates
          </h1>
          <p className="text-slate-600 mt-1">Manage your talent pipeline and candidate relationships</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-white text-sm font-medium 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       btn-primary-slide">
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => (
          <div key={status.value} className="rounded-2xl shadow-xl p-6 business-card-hover metric-card-professional">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{status.label}</p>
                <p className="text-2xl font-bold text-slate-900 metric-number">{status.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(status.value)}`}>
                <div className="w-6 h-6 bg-current rounded opacity-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                         text-sm placeholder-slate-400 smart-search-bar
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                         hover:bg-white/80 hover:border-slate-300/50
                         transition-all duration-300"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  filterStatus === status.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {status.label} ({status.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Candidate</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Position</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Experience</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="business-table-row">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {getInitials(candidate.name)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{candidate.name}</div>
                        <div className="text-sm text-slate-500 flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{candidate.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{candidate.phone}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-slate-900">{candidate.position}</div>
                      <div className="text-sm text-slate-500 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-900">{candidate.experience}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                        <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                        <Edit className="w-4 h-4 text-slate-400 hover:text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                        <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No candidates found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;