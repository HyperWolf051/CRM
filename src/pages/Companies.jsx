import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Download, Building2, Users, DollarSign, TrendingUp,
  Phone, Mail, Globe, MapPin, Grid3X3, List, ArrowUpRight, Target, Star,
  MoreVertical, Eye, Edit, Trash2, Calendar, Briefcase
} from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

// Mock companies data
const mockCompanies = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    size: '100-500',
    revenue: 2500000,
    status: 'customer',
    contactsCount: 12,
    totalDealsValue: 450000,
    location: 'San Francisco, CA',
    website: 'https://techcorp.com',
    phone: '+1 (555) 123-4567',
    email: 'contact@techcorp.com',
    logo: null,
    description: 'Leading technology solutions provider specializing in enterprise software development.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Key client with high growth potential. Regular monthly meetings scheduled.',
    growth: '+24%',
    priority: 'high',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Global Manufacturing Inc',
    industry: 'Manufacturing',
    size: '1000+',
    revenue: 15000000,
    status: 'active',
    contactsCount: 8,
    totalDealsValue: 1200000,
    location: 'Detroit, MI',
    website: 'https://globalmanufacturing.com',
    phone: '+1 (555) 987-6543',
    email: 'info@globalmanufacturing.com',
    logo: null,
    description: 'Large-scale manufacturing company with operations across North America.',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Established partnership, looking to expand services.',
    growth: '+12%',
    priority: 'medium',
    rating: 4.5
  },
  {
    id: '3',
    name: 'StartupXYZ',
    industry: 'Technology',
    size: '10-50',
    revenue: 500000,
    status: 'prospect',
    contactsCount: 3,
    totalDealsValue: 75000,
    location: 'Austin, TX',
    website: 'https://startupxyz.com',
    phone: '+1 (555) 456-7890',
    email: 'hello@startupxyz.com',
    logo: null,
    description: 'Innovative startup focused on AI-powered business solutions.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'High potential prospect, currently in negotiation phase.',
    growth: '+45%',
    priority: 'high',
    rating: 4.2
  }
];

export default function Companies() {
  const [companies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    size: '',
    revenue: '',
    location: '',
    website: '',
    phone: '',
    email: '',
    description: ''
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Company statuses
  const companyStatuses = [
    { id: 'all', name: 'All', count: companies.length, color: 'bg-gray-100 text-gray-800' },
    { id: 'customer', name: 'Customers', count: companies.filter(c => c.status === 'customer').length, color: 'bg-green-100 text-green-800' },
    { id: 'active', name: 'Active', count: companies.filter(c => c.status === 'active').length, color: 'bg-blue-100 text-blue-800' },
    { id: 'prospect', name: 'Prospects', count: companies.filter(c => c.status === 'prospect').length, color: 'bg-yellow-100 text-yellow-800' },
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Education', name: 'Education' }
  ];

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus;
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  // Calculate metrics
  const totalRevenue = companies.reduce((sum, company) => sum + company.revenue, 0);
  const totalContacts = companies.reduce((sum, company) => sum + company.contactsCount, 0);
  const totalDealsValue = companies.reduce((sum, company) => sum + company.totalDealsValue, 0);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      customer: 'success',
      active: 'info',
      prospect: 'warning'
    };
    return variants[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const handleCreateCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Creating company:', newCompany);
    setIsCreateModalOpen(false);
    setNewCompany({
      name: '',
      industry: '',
      size: '',
      revenue: '',
      location: '',
      website: '',
      phone: '',
      email: '',
      description: ''
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
              <p className="text-gray-600">Manage your business relationships and track performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add Client
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Clients</p>
                  <p className="text-3xl font-bold text-blue-900">{companies.length}</p>
                  <p className="text-blue-600 text-sm">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900">{formatCompactCurrency(totalRevenue)}</p>
                  <p className="text-green-600 text-sm">+18% growth</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Active Contacts</p>
                  <p className="text-3xl font-bold text-purple-900">{totalContacts}</p>
                  <p className="text-purple-600 text-sm">Across all clients</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Pipeline Value</p>
                  <p className="text-3xl font-bold text-orange-900">{formatCompactCurrency(totalDealsValue)}</p>
                  <p className="text-orange-600 text-sm">Active deals</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>{industry.name}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
            {companyStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStatus === status.id
                    ? 'bg-blue-600 text-white'
                    : `${status.color} hover:bg-opacity-80`
                  }`}
              >
                {status.name} ({status.count})
              </button>
            ))}
          </div>
        </div>

        {/* Companies Display */}
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <EmptyState
              icon={<Building2 className="w-16 h-16" />}
              title="No clients found"
              description="No clients match your current filters. Try adjusting your search criteria."
              action={
                <Button
                  variant="primary"
                  className="bg-blue-600 hover:bg-blue-700"
                  icon={<Plus className="w-5 h-5" />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add Your First Client
                </Button>
              }
            />
          </div>
        ) : (
          <div className={`${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }`}>
            {filteredCompanies.map((company) => (
              viewMode === 'grid' ? (
                // Grid Card View
                <div
                  key={company.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCompanyClick(company)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={company.logo}
                        name={company.name}
                        size="md"
                        className="ring-2 ring-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === company.id ? null : company.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeDropdown === company.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompanyClick(company);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-3" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(null);
                                // Add edit functionality here
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4 mr-3" />
                              Edit Client
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(null);
                                if (confirm('Are you sure you want to delete this client?')) {
                                  // Add delete functionality here
                                  console.log('Deleting client:', company.name);
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={getStatusBadge(company.status)}>
                      {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </Badge>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(company.priority)}`}>
                      {company.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {company.contactsCount} contacts
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {company.size} employees
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(company.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{company.rating}</span>
                  </div>

                  {/* Revenue and Growth */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCompactCurrency(company.revenue)}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{company.growth}</span>
                        </div>
                        <p className="text-xs text-gray-500">growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={company.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => handleCompanyClick(company)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={company.logo}
                        name={company.name}
                        size="sm"
                        className="ring-2 ring-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry} • {company.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <Badge variant={getStatusBadge(company.status)}>
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </Badge>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCompactCurrency(company.revenue)}</p>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          <span className="text-sm">{company.growth}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {renderStars(company.rating)}
                        <span className="ml-2 text-sm text-gray-600">{company.rating}</span>
                      </div>

                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Company Details Modal */}
      {isDetailsModalOpen && selectedCompany && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={selectedCompany.name}
        >
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Avatar
                src={selectedCompany.logo}
                name={selectedCompany.name}
                size="lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedCompany.name}</h2>
                <p className="text-gray-600">{selectedCompany.industry}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={getStatusBadge(selectedCompany.status)}>
                    {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                  </Badge>
                  <div className="flex items-center">
                    {renderStars(selectedCompany.rating)}
                    <span className="ml-2 text-sm text-gray-600">{selectedCompany.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedCompany.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedCompany.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                      {selectedCompany.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedCompany.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Business Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Annual Revenue:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(selectedCompany.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Contacts:</span>
                    <span className="font-semibold text-gray-900">{selectedCompany.contactsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deal Value:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(selectedCompany.totalDealsValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <span className="font-semibold text-green-600">{selectedCompany.growth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Client Since:</span>
                    <span className="font-semibold text-gray-900">{new Date(selectedCompany.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedCompany.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedCompany.description}</p>
              </div>
            )}

            {/* Notes */}
            {selectedCompany.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600">{selectedCompany.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
                Edit Client
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Add New Client"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.slice(1).map((industry) => (
                    <option key={industry.id} value={industry.id}>{industry.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={newCompany.website}
                  onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the company..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCompany}>
                Add Client
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}