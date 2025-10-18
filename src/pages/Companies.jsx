import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Building2, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, Phone, Mail, Globe, MoreHorizontal, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';

import { formatCurrency } from '../utils/formatters';

// Mock companies data
const mockCompanies = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    industry: 'Technology',
    size: '500-1000',
    revenue: 50000000,
    website: 'https://techcorp.com',
    phone: '+1 (555) 123-4567',
    email: 'contact@techcorp.com',
    address: '123 Tech Street, San Francisco, CA 94105',
    status: 'active',
    contactsCount: 15,
    dealsCount: 8,
    totalDealsValue: 450000,
    logo: null,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Major technology company, potential for large enterprise deals.'
  },
  {
    id: '2',
    name: 'Innovate Solutions',
    industry: 'Consulting',
    size: '100-500',
    revenue: 15000000,
    website: 'https://innovatesolutions.com',
    phone: '+1 (555) 987-6543',
    email: 'hello@innovatesolutions.com',
    address: '456 Innovation Ave, Austin, TX 78701',
    status: 'prospect',
    contactsCount: 8,
    dealsCount: 3,
    totalDealsValue: 125000,
    logo: null,
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Growing consulting firm, interested in our automation solutions.'
  },
  {
    id: '3',
    name: 'StartupXYZ',
    industry: 'Fintech',
    size: '10-50',
    revenue: 2000000,
    website: 'https://startupxyz.com',
    phone: '+1 (555) 456-7890',
    email: 'team@startupxyz.com',
    address: '789 Startup Blvd, New York, NY 10001',
    status: 'lead',
    contactsCount: 5,
    dealsCount: 2,
    totalDealsValue: 75000,
    logo: null,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Fast-growing fintech startup, budget-conscious but high potential.'
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
    address: '321 Global Way, Chicago, IL 60601',
    status: 'customer',
    contactsCount: 25,
    dealsCount: 12,
    totalDealsValue: 850000,
    logo: null,
    createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Long-term customer, excellent relationship, regular repeat business.'
  }
];

export default function Companies() {
  const [companies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    size: '',
    revenue: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Company statuses and filters
  const companyStatuses = [
    { id: 'all', name: 'All', count: companies.length, color: 'bg-gray-100 text-gray-800' },
    { id: 'lead', name: 'Lead', count: companies.filter(c => c.status === 'lead').length, color: 'bg-blue-100 text-blue-800' },
    { id: 'prospect', name: 'Prospect', count: companies.filter(c => c.status === 'prospect').length, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'customer', name: 'Customer', count: companies.filter(c => c.status === 'customer').length, color: 'bg-green-100 text-green-800' },
    { id: 'active', name: 'Active', count: companies.filter(c => c.status === 'active').length, color: 'bg-purple-100 text-purple-800' },
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Consulting', name: 'Consulting' },
    { id: 'Fintech', name: 'Fintech' },
    { id: 'Manufacturing', name: 'Manufacturing' },
    { id: 'Healthcare', name: 'Healthcare' },
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

  // Filter and sort companies
  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus;
      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'all' || company.size === selectedSize;
      return matchesSearch && matchesStatus && matchesIndustry && matchesSize;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle different data types
      if (sortField === 'revenue' || sortField === 'contactsCount' || sortField === 'dealsCount' || sortField === 'totalDealsValue') {
        aValue = Number(aValue);
        bValue = Number(bValue);
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
  const totalRevenue = companies.reduce((sum, company) => sum + company.revenue, 0);
  const totalContacts = companies.reduce((sum, company) => sum + company.contactsCount, 0);
  const totalDeals = companies.reduce((sum, company) => sum + company.dealsCount, 0);
  const avgCompanyValue = companies.length ? totalRevenue / companies.length : 0;

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
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

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      alert('Please fill in all required fields');
      return;
    }

    const company = {
      id: (Math.max(...companies.map(c => parseInt(c.id))) + 1).toString(),
      ...newCompany,
      revenue: parseInt(newCompany.revenue) || 0,
      status: 'lead',
      contactsCount: 0,
      dealsCount: 0,
      totalDealsValue: 0,
      logo: null,
      createdAt: new Date().toISOString()
    };

    alert('Client added successfully!');

    setNewCompany({
      name: '', industry: '', size: '', revenue: '', website: '',
      phone: '', email: '', address: '', notes: ''
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-6 animate-fade-in">
        {/* Header with Metrics */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Clients
              </h1>
              <p className="text-gray-600 mt-1">Manage your client relationships and accounts</p>
            </div>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Client
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Company Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgCompanyValue)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col gap-4 mb-6">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {companyStatuses.map((status) => (
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
                    placeholder="Search clients, industries..."
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {industries.map((industry) => (
                        <option key={industry.id} value={industry.id}>{industry.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {companySizes.map((size) => (
                        <option key={size.id} value={size.id}>{size.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedIndustry('all');
                        setSelectedSize('all');
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

            {/* Clients Table */}
            {isLoading ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-slate-300 rounded w-20"></div>
                      <div className="h-4 bg-slate-300 rounded w-24"></div>
                      <div className="h-4 bg-slate-300 rounded w-16"></div>
                      <div className="h-4 bg-slate-300 rounded w-20"></div>
                      <div className="h-4 bg-slate-300 rounded w-16"></div>
                      <div className="h-4 bg-slate-300 rounded w-20"></div>
                      <div className="h-4 bg-slate-300 rounded w-16"></div>
                    </div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-slate-100 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-300 rounded w-32"></div>
                          <div className="h-3 bg-slate-200 rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-slate-300 rounded-full w-20"></div>
                        <div className="h-4 bg-slate-300 rounded w-16"></div>
                        <div className="h-6 bg-slate-300 rounded w-24"></div>
                        <div className="h-6 bg-slate-300 rounded-full w-16"></div>
                        <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredCompanies.length === 0 ? (
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
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Add Your First Client
                  </Button>
                }
              />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Results Counter */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Showing <span className="font-semibold text-slate-900">{filteredCompanies.length}</span> of <span className="font-semibold text-slate-900">{companies.length}</span> clients
                    </div>
                    <div className="text-xs text-slate-500 hidden sm:block">
                      Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                    </div>
                  </div>
                </div>
                
                {/* Mobile Card View - Hidden on larger screens */}
                <div className="block sm:hidden">
                  {filteredCompanies.map((company, index) => (
                    <div
                      key={company.id}
                      className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      } hover:bg-blue-50/50 active:bg-blue-100/50`}
                      onClick={() => handleCompanyClick(company)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <Avatar
                            src={company.logo}
                            name={company.name}
                            size="md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 text-base truncate">{company.name}</h3>
                            <div className="flex items-center space-x-1 ml-2">
                              <div className={`w-2 h-2 rounded-full ${
                                company.status === 'customer' ? 'bg-green-400' :
                                company.status === 'active' ? 'bg-blue-400' :
                                company.status === 'prospect' ? 'bg-yellow-400' : 'bg-gray-400'
                              }`}></div>
                              <Badge
                                variant={
                                  company.status === 'customer' ? 'success' :
                                  company.status === 'active' ? 'info' :
                                  company.status === 'prospect' ? 'warning' : 'default'
                                }
                                size="sm"
                              >
                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="text-sm text-slate-600">{company.industry} • {company.size}</div>
                            <div className="text-sm font-semibold text-emerald-600">{formatCurrency(company.revenue)}</div>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <span className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{company.contactsCount} contacts</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <DollarSign className="w-3 h-3" />
                                <span>{company.dealsCount} deals</span>
                              </span>
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
                        <th className="text-left py-4 px-3 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/4">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                          >
                            <Building2 className="w-4 h-4 text-slate-600" />
                            <span>Client</span>
                            {getSortIcon('name')}
                          </button>
                        </th>
                        <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/6 hidden md:table-cell">
                          <button
                            onClick={() => handleSort('industry')}
                            className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                          >
                            <Users className="w-4 h-4 text-slate-600" />
                            <span>Industry</span>
                            {getSortIcon('industry')}
                          </button>
                        </th>
                        <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/8 hidden lg:table-cell">
                          <button
                            onClick={() => handleSort('size')}
                            className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                          >
                            <span>Size</span>
                            {getSortIcon('size')}
                          </button>
                        </th>
                        <th className="text-left py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/6">
                          <button
                            onClick={() => handleSort('revenue')}
                            className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                          >
                            <DollarSign className="w-4 h-4 text-slate-600" />
                            <span>Revenue</span>
                            {getSortIcon('revenue')}
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
                            onClick={() => handleSort('contactsCount')}
                            className="flex items-center justify-center space-x-1 hover:text-blue-600 transition-colors group w-full"
                          >
                            <Users className="w-4 h-4 text-slate-600" />
                            {getSortIcon('contactsCount')}
                          </button>
                        </th>
                        <th className="text-center py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/12 hidden sm:table-cell">
                          <button
                            onClick={() => handleSort('totalDealsValue')}
                            className="flex items-center justify-center space-x-1 hover:text-blue-600 transition-colors group w-full"
                          >
                            <DollarSign className="w-4 h-4 text-slate-600" />
                            {getSortIcon('totalDealsValue')}
                          </button>
                        </th>
                        <th className="text-center py-4 px-2 font-semibold text-slate-800 text-sm uppercase tracking-wide w-1/12">
                          <MoreHorizontal className="w-4 h-4 mx-auto text-slate-600" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCompanies.map((company, index) => (
                        <tr
                          key={company.id}
                          className={`cursor-pointer transition-all duration-300 group ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                          } hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:shadow-md hover:scale-[1.01] hover:border-blue-200 border border-transparent`}
                          onClick={() => handleCompanyClick(company)}
                        >
                          <td className="py-4 px-3">
                            <div className="flex items-center space-x-3">
                              <div className="relative flex-shrink-0">
                                <Avatar
                                  src={company.logo}
                                  name={company.name}
                                  size="sm"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                                  {company.name}
                                </div>
                                <div className="text-xs text-slate-500 truncate sm:hidden">
                                  {company.industry}
                                </div>
                                <div className="text-xs text-slate-500 truncate hidden sm:block">
                                  <Globe className="w-3 h-3 inline mr-1" />
                                  {company.website}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 hidden md:table-cell">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                              {company.industry}
                            </div>
                          </td>
                          <td className="py-4 px-2 hidden lg:table-cell">
                            <div className="text-slate-700 font-medium text-sm">{company.size}</div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="font-bold text-emerald-600 text-sm">
                              {formatCurrency(company.revenue)}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                company.status === 'customer' ? 'bg-green-400' :
                                company.status === 'active' ? 'bg-blue-400' :
                                company.status === 'prospect' ? 'bg-yellow-400' : 'bg-gray-400'
                              } animate-pulse`}></div>
                              <Badge
                                variant={
                                  company.status === 'customer' ? 'success' :
                                  company.status === 'active' ? 'info' :
                                  company.status === 'prospect' ? 'warning' : 'default'
                                }
                                size="sm"
                              >
                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center hidden sm:table-cell">
                            <div className="flex items-center justify-center space-x-1">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-blue-600" />
                              </div>
                              <span className="font-semibold text-slate-900 text-sm">{company.contactsCount}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-semibold text-slate-900 text-xs">{company.dealsCount}</div>
                              <div className="text-xs text-emerald-600 font-medium">{formatCurrency(company.totalDealsValue)}</div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === company.id ? null : company.id);
                                }}
                                className="inline-flex items-center justify-center w-8 h-8 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 group"
                              >
                                <MoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              </button>

                              {openDropdown === company.id && (
                                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 z-30 overflow-hidden">
                                  <div className="py-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCompanyClick(company);
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
                                        <div className="font-medium">Edit Client</div>
                                        <div className="text-xs text-slate-500 group-hover:text-emerald-600">Modify information</div>
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
                                        <div className="font-medium">Delete Client</div>
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
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Total Revenue: <span className="font-semibold text-emerald-600">{formatCurrency(filteredCompanies.reduce((sum, c) => sum + c.revenue, 0))}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Total Contacts: <span className="font-semibold text-blue-600">{filteredCompanies.reduce((sum, c) => sum + c.contactsCount, 0)}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Total Deals: <span className="font-semibold text-purple-600">{filteredCompanies.reduce((sum, c) => sum + c.dealsCount, 0)}</span></span>
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
    </div>
  );
}