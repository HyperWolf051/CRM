import { useState } from 'react';
import { Plus, Search, Filter, Download, Building2, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, Phone, Mail, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { formatCurrency } from '../utils/formatters';
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
  const totalDeals = companies.reduce((sum, company) => sum + company.dealsCount, 0);
  const avgCompanyValue = companies.length ? totalRevenue / companies.length : 0;

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
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
      status: 'lead',
      contactsCount: 0,
      dealsCount: 0,
      totalDealsValue: 0,
      logo: null,
      createdAt: new Date().toISOString()
    };

    // In a real app, this would be handled by a state management system
    // For now, we'll just show a success message
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
              onClick={() => navigate('/app/companies/add')}
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
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                               overflow-hidden group ${
                      selectedStatus === status.id
                        ? status.color + ' shadow-md border'
                        : 'bg-gray-100 text-gray-600 hover:text-white border border-gray-300'
                    }`}
                  >
                    <span className="relative z-10">{status.name} ({status.count})</span>
                    {selectedStatus !== status.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                                      transform -translate-y-full group-hover:translate-y-0 
                                      transition-transform duration-200 ease-out"></div>
                    )}
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
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                               flex items-center space-x-2 overflow-hidden group
                               ${showFilters 
                                 ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                 : 'bg-gray-100 text-gray-600 hover:text-white border border-gray-300'
                               }`}
                  >
                    <Filter className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Filters</span>
                    {!showFilters && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                                      transform -translate-x-full group-hover:translate-x-0 
                                      transition-transform duration-200 ease-out"></div>
                    )}
                  </button>
                  <button className="relative px-4 py-2 bg-gray-100 text-gray-600 hover:text-white rounded-lg 
                                     text-sm font-medium transition-all duration-200 flex items-center space-x-2
                                     overflow-hidden group border border-gray-300 hover:border-green-500">
                    <Download className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Export</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 
                                    transform -translate-x-full group-hover:translate-x-0 
                                    transition-transform duration-200 ease-out"></div>
                  </button>
                </div>
              </div>

          {/* Clients Table */}
          {isLoading ? (
            <SkeletonLoader rows={5} />
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contacts</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Deals</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
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
                            <div className="text-sm text-gray-500">{company.website}</div>
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
                        <div className="font-semibold text-green-600">
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
                        <div className="text-gray-900">
                          {company.dealsCount} ({formatCurrency(company.totalDealsValue)})
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanyClick(company);
                            }}
                            className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 
                                       overflow-hidden group hover:shadow-md hover:scale-110"
                          >
                            <Eye className="w-4 h-4 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                                            transform scale-0 group-hover:scale-100 
                                            transition-transform duration-200 ease-out rounded-lg"></div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 
                                       overflow-hidden group hover:shadow-md hover:scale-110"
                          >
                            <Edit className="w-4 h-4 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 
                                            transform scale-0 group-hover:scale-100 
                                            transition-transform duration-200 ease-out rounded-lg"></div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                            className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 
                                       overflow-hidden group hover:shadow-md hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 
                                            transform scale-0 group-hover:scale-100 
                                            transition-transform duration-200 ease-out rounded-lg"></div>
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
    </div>

    {/* Add Company Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Add New Client</h2>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry *</label>
                    <select
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client Size</label>
                    <select
                      value={newCompany.size}
                      onChange={(e) => setNewCompany({ ...newCompany, size: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="10-50">10-50 employees</option>
                      <option value="100-500">100-500 employees</option>
                      <option value="500-1000">500-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annual Revenue</label>
                    <input
                      type="number"
                      value={newCompany.revenue}
                      onChange={(e) => setNewCompany({ ...newCompany, revenue: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Annual revenue in USD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={newCompany.website}
                      onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="https://company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="contact@client.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={newCompany.address}
                      onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Full address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                    <textarea
                      value={newCompany.notes}
                      onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                      placeholder="Additional notes about the client..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewCompany({
                      name: '', industry: '', size: '', revenue: '', website: '',
                      phone: '', email: '', address: '', notes: ''
                    });
                  }}
                  className="relative px-4 py-2 text-slate-600 hover:text-white font-medium rounded-xl 
                             transition-all duration-200 overflow-hidden group border border-slate-300 hover:border-slate-500"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 
                                  transform -translate-x-full group-hover:translate-x-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
                <button
                  onClick={handleAddCompany}
                  className="relative px-6 py-2 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 
                             transition-all duration-200 overflow-hidden group hover:shadow-lg hover:scale-105"
                >
                  <span className="relative z-10">Add Client</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 
                                  transform translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Client Details"
      >
        {selectedCompany && (
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
                  Client Size
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
                  Deals
                </label>
                <p className="text-sm text-gray-900">
                  {selectedCompany.dealsCount} deals ({formatCurrency(selectedCompany.totalDealsValue)})
                </p>
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
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <p className="text-sm text-gray-900">{selectedCompany.address}</p>
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
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary">
                Edit Client
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}