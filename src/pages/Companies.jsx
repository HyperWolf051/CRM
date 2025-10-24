import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Download, Building2, Users, DollarSign,
  MoreVertical, Eye, Edit, Trash2, Phone, Mail, Globe, ExternalLink,
  Copy, Star, Grid3X3, List, Target, ChevronDown, X, MapPin, TrendingUp
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
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Major technology company, potential for large enterprise deals.',
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
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Growing consulting firm, interested in our automation solutions.',
    rating: 4.2
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
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Fast-growing fintech startup, budget-conscious but high potential.',
    rating: 3.9
  },
  {
    id: '4',
    name: 'Global Tech',
    industry: 'Manufacturing',
    size: '1000+',
    revenue: 200000000,
    website: 'https://globaltech.com',
    phone: '+1 (555) 321-0987',
    email: 'info@globaltech.com',
    location: 'Chicago, IL',
    status: 'customer',
    contactsCount: 25,
    dealsCount: 12,
    totalDealsValue: 850000,
    logo: null,
    createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Long-term customer, excellent relationship, regular repeat business.',
    rating: 4.9
  }
];

export default function Companies() {
  const navigate = useNavigate();
  const [companies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    size: '',
    revenue: '',
    location: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
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
    { id: 'all', name: 'All Clients', count: companies.length, color: 'bg-slate-100 text-slate-700' },
    { id: 'customer', name: 'Customers', count: companies.filter(c => c.status === 'customer').length, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'active', name: 'Active', count: companies.filter(c => c.status === 'active').length, color: 'bg-blue-100 text-blue-700' },
    { id: 'prospect', name: 'Prospects', count: companies.filter(c => c.status === 'prospect').length, color: 'bg-amber-100 text-amber-700' },
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Education', name: 'Education' }
  ];

  const companySizes = [
    { id: 'all', name: 'All Sizes' },
    { id: '1-10', name: '1-10 employees' },
    { id: '10-50', name: '10-50 employees' },
    { id: '100-500', name: '100-500 employees' },
    { id: '500-1000', name: '500-1000 employees' },
    { id: '1000+', name: '1000+ employees' }
  ];

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus;
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;
    return matchesSearch && matchesStatus && matchesIndustry && matchesSize;
  });

  // Calculate metrics
  const totalRevenue = companies.reduce((sum, company) => sum + company.revenue, 0);
  const totalContacts = companies.reduce((sum, company) => sum + company.contactsCount, 0);
  const totalDealsValue = companies.reduce((sum, company) => sum + company.totalDealsValue, 0);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
  };

  const handleActionChange = (company, action) => {
    switch (action) {
      case 'view':
        handleCompanyClick(company);
        break;
      case 'edit':
        // Handle edit functionality
        console.log('Editing client:', company.name);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this client?')) {
          // Handle delete functionality
          console.log('Deleting client:', company.name);
        }
        break;
      default:
        break;
    }
  };

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      alert('Please fill in all required fields');
      return;
    }

    const company = {
      id: (Math.max(...companies.map(c => parseInt(c.id))) + 1).toString(),
      ...newCompany,
      revenue: parseInt(newCompany.revenue) || 0,
      status: 'prospect',
      contactsCount: 0,
      dealsCount: 0,
      totalDealsValue: 0,
      logo: null,
      createdAt: new Date().toISOString()
    };

    alert('Client added successfully!');
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
      address: '',
      notes: '',
      description: ''
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Client Portfolio
                </h1>
                <p className="text-gray-600 text-sm">Manage relationships and track performance</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 backdrop-blur-sm"
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add Client
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                <p className="text-green-600 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(totalRevenue)}</p>
                <p className="text-green-600 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% growth
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
                <p className="text-gray-500 text-xs mt-1">Across all clients</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(totalDealsValue)}</p>
                <p className="text-gray-500 text-xs mt-1">Active deals</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Enhanced Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients by name or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 ${showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'cards'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>{industry.name}</option>
                  ))}
                </select>

                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {companySizes.map((size) => (
                    <option key={size.id} value={size.id}>{size.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSelectedIndustry('all');
                    setSelectedSize('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            {companyStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedStatus === status.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : `${status.color} hover:shadow-md`
                  }`}
              >
                {status.name} ({status.count})
              </button>
            ))}
          </div>
        </div>

        {/* Companies Display */}
        {filteredCompanies.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-16 text-center">
            <EmptyState
              icon={<Building2 className="w-16 h-16" />}
              title="No clients found"
              description={
                searchTerm || selectedStatus !== 'all' || selectedIndustry !== 'all' || selectedSize !== 'all'
                  ? "No clients match your current filters. Try adjusting your search criteria."
                  : "You haven't added any clients yet. Start building your client database by adding your first client."
              }
              action={
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add Your First Client
                </Button>
              }
            />
          </div>
        ) : viewMode === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleCompanyClick(company)}
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={company.logo}
                        name={company.name}
                        size="md"
                        className="ring-2 ring-white shadow-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(company.rating)}
                          <span className="text-xs text-gray-500 ml-1">({company.rating})</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === company.id ? null : company.id);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === company.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanyClick(company);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-3" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                          >
                            <Edit className="w-4 h-4 mr-3" />
                            Edit Client
                          </button>
                          {company.website && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(company.website, '_blank');
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                              <ExternalLink className="w-4 h-4 mr-3" />
                              Visit Website
                            </button>
                          )}
                          <div className="border-t border-gray-100 my-2"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(company.email);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Mail className="w-4 h-4 mr-3" />
                            Copy Email
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(company.phone);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                          >
                            <Phone className="w-4 h-4 mr-3" />
                            Copy Phone
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge
                      variant={
                        company.status === 'customer' ? 'success' :
                          company.status === 'active' ? 'info' :
                            company.status === 'prospect' ? 'warning' : 'default'
                      }
                      className="text-xs"
                    >
                      {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(company.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Employees</span>
                      <span className="font-medium text-gray-900">{company.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Contacts</span>
                      <span className="font-medium text-gray-900">{company.contactsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pipeline</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(company.totalDealsValue)}</span>
                    </div>
                  </div>

                  {/* Location */}
                  {company.location && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {company.location}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contacts</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Pipeline</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                      onClick={() => handleCompanyClick(company)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={company.logo}
                            name={company.name}
                            size="sm"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500">{company.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{company.industry}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{company.size}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-emerald-600">
                          {formatCurrency(company.revenue)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            company.status === 'customer' ? 'success' :
                              company.status === 'active' ? 'info' :
                                company.status === 'prospect' ? 'warning' : 'default'
                          }
                        >
                          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{company.contactsCount}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(company.totalDealsValue)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleActionChange(company, e.target.value);
                              e.target.value = ''; // Reset select after action
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[100px]"
                          defaultValue=""
                        >
                          <option value="" disabled>Select Action</option>
                          <option value="view">View</option>
                          <option value="edit">Edit</option>
                          <option value="delete">Delete</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleAddCompany}
              >
                Add Client
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Company Details Modal */}
      {isDetailsModalOpen && selectedCompany && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title="Client Details"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar
                src={selectedCompany.logo}
                name={selectedCompany.name}
                size="lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCompany.name}
                </h3>
                <p className="text-gray-600">{selectedCompany.industry}</p>
                <div className="flex items-center space-x-1 mt-2">
                  {renderStars(selectedCompany.rating)}
                  <span className="text-sm text-gray-500 ml-1">({selectedCompany.rating})</span>
                </div>
                <Badge
                  variant={
                    selectedCompany.status === 'customer' ? 'success' :
                      selectedCompany.status === 'active' ? 'info' :
                        selectedCompany.status === 'prospect' ? 'warning' : 'default'
                  }
                  className="mt-2"
                >
                  {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <p className="text-sm text-gray-900">{selectedCompany.size} employees</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Revenue
                </label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedCompany.revenue)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacts
                </label>
                <p className="text-sm text-gray-900">{selectedCompany.contactsCount} contacts</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline Value
                </label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedCompany.totalDealsValue)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    {selectedCompany.website}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.location}</span>
                </div>
              </div>
            </div>

            {selectedCompany.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedCompany.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Edit Client
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}