import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  MessageSquare,
  FileText,
  Download,
  X,
  ChevronDown,
  Trophy,
  Award,
  Medal,
  Target,
  Activity,
  Grid3X3,
  List,
  ExternalLink
} from 'lucide-react';
import { ClientAPI } from '@/services/api';

// Helper functions - moved outside component for ClientCard access
const getTierColor = (tier) => {
  const colors = {
    platinum: 'bg-purple-100 text-purple-800 border-purple-200',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    silver: 'bg-gray-100 text-gray-800 border-gray-200',
    bronze: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colors[tier] || colors.bronze;
};

const getTierGradient = (tier) => {
  const gradients = {
    platinum: 'from-purple-400 to-purple-600',
    gold: 'from-yellow-400 to-yellow-600',
    silver: 'from-gray-400 to-gray-600',
    bronze: 'from-orange-400 to-orange-600'
  };
  return gradients[tier] || gradients.bronze;
};

const getTierIcon = (tier) => {
  const icons = {
    platinum: Trophy,
    gold: Award,
    silver: Medal,
    bronze: Medal
  };
  return icons[tier] || Medal;
};

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    prospect: 'bg-blue-100 text-blue-800 border-blue-200',
    blacklisted: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || colors.active;
};

export default function RecruiterClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      // For demo purposes, using mock data since API might not be fully implemented
      const mockClients = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          industry: 'Information Technology',
          website: 'https://techcorp.com',
          primaryContact: {
            name: 'Sarah Johnson',
            designation: 'HR Director',
            email: 'sarah.johnson@techcorp.com',
            phone: '+91 98765 43210'
          },
          companyDetails: {
            size: 'large',
            location: {
              city: 'Bangalore',
              state: 'Karnataka',
              country: 'India'
            }
          },
          status: 'active',
          tier: 'platinum',
          metrics: {
            totalJobsPosted: 45,
            activeJobs: 8,
            candidatesHired: 32,
            averageTimeToHire: 21,
            offerAcceptanceRate: 85
          },
          lastContactDate: new Date('2024-01-15'),
          nextFollowUpDate: new Date('2024-02-01')
        },
        {
          id: '2',
          name: 'InnovateLabs Pvt Ltd',
          industry: 'Software Development',
          website: 'https://innovatelabs.in',
          primaryContact: {
            name: 'Rajesh Kumar',
            designation: 'Talent Acquisition Manager',
            email: 'rajesh.kumar@innovatelabs.in',
            phone: '+91 87654 32109'
          },
          companyDetails: {
            size: 'medium',
            location: {
              city: 'Pune',
              state: 'Maharashtra',
              country: 'India'
            }
          },
          status: 'active',
          tier: 'gold',
          metrics: {
            totalJobsPosted: 28,
            activeJobs: 5,
            candidatesHired: 19,
            averageTimeToHire: 18,
            offerAcceptanceRate: 78
          },
          lastContactDate: new Date('2024-01-20'),
          nextFollowUpDate: new Date('2024-01-28')
        },
        {
          id: '3',
          name: 'Global Finance Corp',
          industry: 'Financial Services',
          website: 'https://globalfinance.com',
          primaryContact: {
            name: 'Priya Sharma',
            designation: 'Head of Recruitment',
            email: 'priya.sharma@globalfinance.com',
            phone: '+91 76543 21098'
          },
          companyDetails: {
            size: 'enterprise',
            location: {
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India'
            }
          },
          status: 'active',
          tier: 'silver',
          metrics: {
            totalJobsPosted: 67,
            activeJobs: 12,
            candidatesHired: 48,
            averageTimeToHire: 25,
            offerAcceptanceRate: 72
          },
          lastContactDate: new Date('2024-01-10'),
          nextFollowUpDate: new Date('2024-02-05')
        }
      ];

      setClients(mockClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesTier = filterTier === 'all' || client.tier === filterTier;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const totalActiveJobs = clients.reduce((sum, client) => sum + client.metrics.activeJobs, 0);
  const totalHired = clients.reduce((sum, client) => sum + client.metrics.candidatesHired, 0);
  const avgAcceptanceRate = clients.length > 0 
    ? Math.round(clients.reduce((sum, client) => sum + client.metrics.offerAcceptanceRate, 0) / clients.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  Client Management
                </h1>
                <p className="text-gray-600 text-base font-medium">Manage relationships and track recruitment performance</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 backdrop-blur-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-5 py-3 rounded-xl flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <Link
                to="/app/recruiter/clients/add"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-semibold px-6 py-3 rounded-xl text-white flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Client</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-700 text-sm font-bold uppercase tracking-wide">Total Clients</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-gray-900 mb-2">{clients.length}</p>
                <p className="text-green-600 text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Active partnerships
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-emerald-700 text-sm font-bold uppercase tracking-wide">Active Jobs</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-gray-900 mb-2">{totalActiveJobs}</p>
                <p className="text-gray-600 text-sm font-semibold">Open positions</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-700 text-sm font-bold uppercase tracking-wide">Total Hired</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-gray-900 mb-2">{totalHired}</p>
                <p className="text-gray-600 text-sm font-semibold">Successful placements</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-orange-700 text-sm font-bold uppercase tracking-wide">Acceptance Rate</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-gray-900 mb-2">{avgAcceptanceRate}%</p>
                <p className="text-gray-600 text-sm font-semibold">Average offer rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">{/* Content continues below */}

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Enhanced Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 w-5 h-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Search clients by name, industry, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <label className="sr-only">Status Filter</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer pr-10"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="sr-only">Tier Filter</label>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer pr-10"
                >
                  <option value="all">All Tiers</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Enhanced View Toggle */}
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-semibold text-gray-700">
            Showing <span className="text-blue-600">{filteredClients.length}</span> of <span className="text-gray-900">{clients.length}</span> clients
          </div>
          {(searchTerm || filterStatus !== 'all' || filterTier !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterTier('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

      {/* Clients Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <ClientRow key={client.id} client={client} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {filteredClients.length === 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No clients found</h3>
            <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first client to begin managing recruitment relationships.'}
            </p>
            {!(searchTerm || filterStatus !== 'all' || filterTier !== 'all') && (
              <Link
                to="/app/recruiter/clients/add"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Client
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ClientCard({ client }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const TierIconComponent = getTierIcon(client.tier);
  
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-transparent hover:border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden">
      {/* Tier Indicator Bar */}
      <div className={`h-1.5 bg-gradient-to-r ${getTierGradient(client.tier)}`} />
      
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              {/* Tier Badge on Avatar */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${getTierGradient(client.tier)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                <TierIconComponent className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {client.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Briefcase className="w-3 h-3 mr-1" />
                {client.industry}
              </p>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20 animate-scale-in">
                <Link
                  to={`/app/recruiter/clients/${client.id}`}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View Details
                </Link>
                <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Client
                </button>
                <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Send Message
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button 
                  onClick={() => window.location.href = `mailto:${client.primaryContact.email}`}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Email Contact
                </button>
                <button 
                  onClick={() => window.location.href = `tel:${client.primaryContact.phone}`}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-3" />
                  Call Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status & Tier Badges */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 ${getStatusColor(client.status)} flex items-center space-x-1`}>
            <Activity className="w-3 h-3" />
            <span>{client.status}</span>
          </span>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 ${getTierColor(client.tier)} flex items-center space-x-1`}>
            <TierIconComponent className="w-3 h-3" />
            <span>{client.tier}</span>
          </span>
        </div>

        {/* Contact Info with Icons */}
        <div className="space-y-2.5 mb-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center text-sm text-gray-700">
            <Phone className="w-4 h-4 mr-2.5 text-green-500" />
            <span className="truncate">{client.primaryContact.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Mail className="w-4 h-4 mr-2.5 text-blue-500" />
            <span className="truncate">{client.primaryContact.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2.5 text-red-500" />
            <span className="truncate">{client.companyDetails.location.city}, {client.companyDetails.location.state}</span>
          </div>
        </div>

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200">
            <div className="text-2xl font-extrabold text-blue-600">{client.metrics.activeJobs}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">Active Jobs</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center border border-emerald-200">
            <div className="text-2xl font-extrabold text-emerald-600">{client.metrics.candidatesHired}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">Hired</div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="flex items-center justify-between mb-4 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
          <span className="text-xs font-semibold text-gray-700">Offer Acceptance</span>
          <div className="flex items-center text-sm font-bold text-yellow-700">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
            {client.metrics.offerAcceptanceRate}%
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.href = `mailto:${client.primaryContact.email}`}
            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.location.href = `tel:${client.primaryContact.phone}`}
            className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110" title="Schedule Meeting">
            <Calendar className="w-4 h-4" />
          </button>
          <Link
            to={`/app/recruiter/clients/${client.id}`}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ClientRow({ client }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{client.name}</div>
            <div className="text-sm text-gray-500">{client.industry}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{client.primaryContact.name}</div>
        <div className="text-sm text-gray-500">{client.primaryContact.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTierColor(client.tier)}`}>
            {client.tier}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4 text-sm text-gray-900">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
            {client.metrics.activeJobs}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            {client.metrics.candidatesHired}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            {client.metrics.offerAcceptanceRate}%
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Link
            to={`/app/recruiter/clients/${client.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button className="text-gray-400 hover:text-gray-600">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
