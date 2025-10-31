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
  FileText
} from 'lucide-react';
import { ClientAPI } from '@/services/api';

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

  const getTierColor = (tier) => {
    const colors = {
      platinum: 'bg-purple-100 text-purple-800 border-purple-200',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      silver: 'bg-gray-100 text-gray-800 border-gray-200',
      bronze: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[tier] || colors.bronze;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your client relationships and track business performance</p>
        </div>
        <Link
          to="/app/recruiter/clients/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients by name, industry, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="blacklisted">Blacklisted</option>
            </select>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredClients.length} of {clients.length} clients
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
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'}
          </p>
        </div>
      )}
    </div>
  );
}

function ClientCard({ client }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.industry}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTierColor(client.tier)}`}>
            {client.tier}
          </span>
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {client.primaryContact.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {client.primaryContact.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {client.companyDetails.location.city}, {client.companyDetails.location.state}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{client.metrics.activeJobs}</div>
          <div className="text-xs text-gray-500">Active Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{client.metrics.candidatesHired}</div>
          <div className="text-xs text-gray-500">Hired</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
          {client.status}
        </span>
        <div className="flex items-center text-sm text-gray-500">
          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
          {client.metrics.offerAcceptanceRate}%
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Link
          to={`/app/recruiter/clients/${client.id}`}
          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
        >
          View Details
        </Link>
        <button className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageSquare className="w-4 h-4" />
        </button>
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

// Helper functions
function getTierColor(tier) {
  const colors = {
    platinum: 'bg-purple-100 text-purple-800 border-purple-200',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    silver: 'bg-gray-100 text-gray-800 border-gray-200',
    bronze: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colors[tier] || colors.bronze;
}

function getStatusColor(status) {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    prospect: 'bg-blue-100 text-blue-800 border-blue-200',
    blacklisted: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || colors.active;
}