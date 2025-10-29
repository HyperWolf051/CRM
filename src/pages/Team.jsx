import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Download, Upload, Users, Mail, Phone, Eye, Edit, Trash2,
  Shield, Building, Activity, TrendingUp, FileText, Calendar, MapPin,
  Clock, Award, Briefcase, CheckCircle, XCircle, Settings, MoreVertical,
  Loader2, Send, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  UserPlus, UserCheck, UserX, Copy, ExternalLink, RefreshCw, X,
  ChevronDown, AlertCircle, Zap, Target, DollarSign, LineChart
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';

const Team = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Enhanced team data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Rahul Gupta',
      email: 'rahul.gupta@company.co.in',
      phone: '+91 98765 43210',
      role: 'Administrator',
      department: 'Management',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-15T10:30:00Z',
      employeeId: 'EMP001',
      manager: 'N/A',
      location: 'Mumbai, Maharashtra',
      timezone: 'Asia/Kolkata',
      contractType: 'Full-time',
      dealsCount: 45,
      revenue: 12500000,
      tasksCompleted: 234,
      activeDeals: 8,
      conversionRate: 28.5
    },
    {
      id: 2,
      name: 'Anjali Mehta',
      email: 'anjali.mehta@company.co.in',
      phone: '+91 87654 32109',
      role: 'Sales Manager',
      department: 'Sales',
      status: 'active',
      joinDate: '2024-02-01',
      lastLogin: '2024-03-14T16:45:00Z',
      employeeId: 'EMP002',
      manager: 'Rahul Gupta',
      location: 'Bengaluru, Karnataka',
      timezone: 'Asia/Kolkata',
      contractType: 'Full-time',
      dealsCount: 32,
      revenue: 8900000,
      tasksCompleted: 189,
      activeDeals: 12,
      conversionRate: 32.1
    },
    {
      id: 3,
      name: 'Vikram Singh',
      email: 'vikram.singh@company.co.in',
      phone: '+91 76543 21098',
      role: 'Sales Executive',
      department: 'Sales',
      status: 'active',
      joinDate: '2024-02-15',
      lastLogin: '2024-03-15T09:15:00Z',
      employeeId: 'EMP003',
      manager: 'Anjali Mehta',
      location: 'Delhi, NCR',
      timezone: 'Asia/Kolkata',
      contractType: 'Full-time',
      dealsCount: 28,
      revenue: 5600000,
      tasksCompleted: 156,
      activeDeals: 7,
      conversionRate: 25.0
    },
    {
      id: 4,
      name: 'Kavya Nair',
      email: 'kavya.nair@company.co.in',
      phone: '+91 65432 10987',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'active',
      joinDate: '2024-01-20',
      lastLogin: '2024-03-14T14:20:00Z',
      employeeId: 'EMP004',
      manager: 'Rahul Gupta',
      location: 'Chennai, Tamil Nadu',
      timezone: 'Asia/Kolkata',
      contractType: 'Full-time',
      dealsCount: 0,
      revenue: 0,
      tasksCompleted: 203,
      activeDeals: 0,
      conversionRate: 0
    },
    {
      id: 5,
      name: 'Neha Agarwal',
      email: 'neha.agarwal@company.co.in',
      phone: '+91 54321 09876',
      role: 'Finance Analyst',
      department: 'Finance',
      status: 'active',
      joinDate: '2024-03-01',
      lastLogin: '2024-03-15T11:30:00Z',
      employeeId: 'EMP005',
      manager: 'Rahul Gupta',
      location: 'Pune, Maharashtra',
      timezone: 'Asia/Kolkata',
      contractType: 'Full-time',
      dealsCount: 12,
      revenue: 2100000,
      tasksCompleted: 178,
      activeDeals: 2,
      conversionRate: 18.5
    }
  ]);

  // State management
  const [activeView, setActiveView] = useState('list');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [filters, setFilters] = useState({
    role: 'all',
    department: 'all',
    status: 'all',
    location: 'all'
  });

  // Role configuration
  const roleConfig = {
    'Administrator': { icon: Shield, color: '#7c3aed', bgColor: '#ede9fe', label: 'Administrator' },
    'Sales Manager': { icon: Target, color: '#2563eb', bgColor: '#dbeafe', label: 'Sales Manager' },
    'Sales Executive': { icon: TrendingUp, color: '#059669', bgColor: '#d1fae5', label: 'Sales Executive' },
    'HR Manager': { icon: Users, color: '#db2777', bgColor: '#fce7f3', label: 'HR Manager' },
    'Finance Analyst': { icon: DollarSign, color: '#d97706', bgColor: '#fef3c7', label: 'Finance Analyst' }
  };

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'Sales', name: 'Sales' },
    { id: 'Management', name: 'Management' },
    { id: 'Human Resources', name: 'Human Resources' },
    { id: 'Finance', name: 'Finance' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'on_leave', name: 'On Leave' }
  ];

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500', dot: 'bg-emerald-500' },
      inactive: { bg: 'bg-slate-50', text: 'text-slate-700', icon: 'text-slate-500', dot: 'bg-slate-400' },
      on_leave: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-500', dot: 'bg-yellow-500' }
    };
    return statusConfig[status] || statusConfig.inactive;
  };

  // Filtering
  const filteredMembers = useCallback(() => {
    return teamMembers.filter(member => {
      const matchesSearch = !searchQuery ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filters.role === 'all' || member.role === filters.role;
      const matchesDepartment = filters.department === 'all' || member.department === filters.department;
      const matchesStatus = filters.status === 'all' || member.status === filters.status;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [teamMembers, searchQuery, filters]);

  // Handlers
  const handleMemberSelect = (memberId, selected) => {
    if (selected) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowUserProfile(true);
  };

  const handleBulkAction = async (action) => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'activate':
          setTeamMembers(prev => prev.map(member =>
            selectedMembers.includes(member.id) ? { ...member, status: 'active' } : member
          ));
          showToast('success', `Activated ${selectedMembers.length} users`);
          break;
        case 'deactivate':
          setTeamMembers(prev => prev.map(member =>
            selectedMembers.includes(member.id) ? { ...member, status: 'inactive' } : member
          ));
          showToast('success', `Deactivated ${selectedMembers.length} users`);
          break;
        case 'delete':
          if (window.confirm(`Remove ${selectedMembers.length} users? This action cannot be undone.`)) {
            setTeamMembers(prev => prev.filter(member => !selectedMembers.includes(member.id)));
            showToast('success', `Deleted ${selectedMembers.length} users`);
            setSelectedMembers([]);
          }
          break;
      }
      setBulkActionMode(false);
      setShowBulkActions(false);
    } catch (error) {
      showToast('error', 'Failed to perform action');
    } finally {
      setIsLoading(false);
    }
  };

  // Analytics
  const analytics = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    totalRevenue: teamMembers.reduce((sum, m) => sum + (m.revenue || 0), 0),
    totalDeals: teamMembers.reduce((sum, m) => sum + (m.dealsCount || 0), 0),
    totalTasks: teamMembers.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0),
    avgConversion: (teamMembers.reduce((sum, m) => sum + (m.conversionRate || 0), 0) / teamMembers.filter(m => m.conversionRate > 0).length).toFixed(1)
  };

  const filtered = filteredMembers();
  const statusColor = getStatusBadge('active');

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="w-full px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
                  <p className="text-sm text-slate-500">Manage and monitor your sales team</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedMembers.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                  <CheckCircle className="w-4 h-4" />
                  {selectedMembers.length} selected
                </div>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowImportModal(true)}
                className="border-slate-300 hover:bg-slate-100"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={() => navigate('/app/team/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KPICard
            label="Total Members"
            value={analytics.totalMembers}
            icon={Users}
            color="blue"
            trend="+3 this month"
          />
          <KPICard
            label="Active Users"
            value={analytics.activeMembers}
            icon={UserCheck}
            color="emerald"
            trend={`${Math.round((analytics.activeMembers / analytics.totalMembers) * 100)}% online`}
          />
          <KPICard
            label="Total Deals"
            value={analytics.totalDeals}
            icon={Target}
            color="violet"
            trend="+8 this week"
          />
          <KPICard
            label="Total Revenue"
            value={formatCurrency(analytics.totalRevenue)}
            icon={DollarSign}
            color="emerald"
            trend="+12% vs last month"
            isLarge
          />
          <KPICard
            label="Avg Conversion"
            value={`${analytics.avgConversion}%`}
            icon={TrendingUp}
            color="amber"
            trend="Sales Performance"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-300 bg-white text-sm"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="border-slate-300 hover:bg-slate-100"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {selectedMembers.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Actions ({selectedMembers.length})
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedMembers.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkAction('activate')}
                className="border-blue-300 hover:bg-white"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Activate
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkAction('deactivate')}
                className="border-blue-300 hover:bg-white"
              >
                <UserX className="w-4 h-4 mr-2" />
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkAction('delete')}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Team Table */}
        <Card className="border border-slate-200 shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-16">
              <EmptyState
                icon={<Users className="w-16 h-16 text-slate-300" />}
                title="No team members found"
                description="No team members match your filters. Try adjusting your search criteria."
                action={
                  <Button onClick={() => navigate('/app/team/add')} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 w-12">
                      <input
                        type="checkbox"
                        checked={selectedMembers.length === filtered.length && filtered.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers(filtered.map(m => m.id));
                          } else {
                            setSelectedMembers([]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Member</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Role</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Department</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Deals</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Revenue</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Last Active</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filtered.map((member) => {
                    const config = roleConfig[member.role];
                    const isSelected = selectedMembers.includes(member.id);
                    const statusBadge = getStatusBadge(member.status);
                    const RoleIcon = config.icon;

                    return (
                      <tr
                        key={member.id}
                        className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleMemberSelect(member.id, e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                                style={{ backgroundColor: config.color }}
                              >
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              {member.status === 'active' && (
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 text-sm truncate">{member.name}</div>
                              <div className="text-xs text-slate-500 truncate">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <RoleIcon className="w-4 h-4" style={{ color: config.color }} />
                            <span className="text-sm font-medium text-slate-900">{member.role}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-slate-600">{member.department}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-semibold text-slate-900">{member.dealsCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-semibold text-emerald-600">{formatCurrency(member.revenue)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-semibold ${statusBadge.bg} ${statusBadge.text} border`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadge.dot}`}></span>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {formatLastLogin(member.lastLogin)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMemberClick(member)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => window.location.href = `mailto:${member.email}`}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
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
        </Card>

        {/* Member Detail Modal */}
        {showUserProfile && selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            config={roleConfig[selectedMember.role]}
            onClose={() => setShowUserProfile(false)}
            formatCurrency={formatCurrency}
            formatLastLogin={formatLastLogin}
          />
        )}

        {/* Import Modal */}
        {showImportModal && (
          <ImportModal
            onClose={() => setShowImportModal(false)}
          />
        )}
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, icon: Icon, color, trend, isLarge }) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', border: 'border-emerald-100' },
    violet: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', icon: 'text-violet-600', border: 'border-violet-100' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', icon: 'text-amber-600', border: 'border-amber-100' }
  };

  const config = colorConfig[color];

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">{label}</p>
          <p className={`${isLarge ? 'text-2xl' : 'text-3xl'} font-bold text-slate-900 mb-1`}>{value}</p>
          <p className="text-xs text-slate-500">{trend}</p>
        </div>
        <div className={`${config.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.icon}`} />
        </div>
      </div>
    </div>
  );
};

// Member Detail Modal Component
const MemberDetailModal = ({ member, config, onClose, formatCurrency, formatLastLogin }) => {
  const RoleIcon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
                style={{ backgroundColor: config.color }}
              >
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                <p className="text-slate-200 text-sm">{member.email}</p>
                <p className="text-slate-300 text-xs font-mono mt-1">{member.employeeId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Active Deals</div>
              <div className="text-2xl font-bold text-slate-900">{member.activeDeals}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Total Revenue</div>
              <div className="text-xl font-bold text-emerald-600">{formatCurrency(member.revenue)}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Conversion Rate</div>
              <div className="text-2xl font-bold text-slate-900">{member.conversionRate}%</div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-3">
                <InfoRow icon={Phone} label="Phone" value={member.phone} />
                <InfoRow icon={MapPin} label="Location" value={member.location} />
                <InfoRow icon={User} label="Manager" value={member.manager} />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Work Details</h3>
              <div className="space-y-3">
                <InfoRow icon={Briefcase} label="Contract Type" value={member.contractType} />
                <InfoRow icon={Clock} label="Last Active" value={formatLastLogin(member.lastLogin)} />
                <InfoRow icon={Calendar} label="Join Date" value={new Date(member.joinDate).toLocaleDateString()} />
              </div>
            </div>
          </div>

          {/* Role and Department */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-center gap-3">
              <RoleIcon className="w-5 h-5" style={{ color: config.color }} />
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</p>
                <p className="text-sm font-medium text-slate-900">{member.role}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="secondary" className="border-slate-300">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 truncate">{value}</p>
    </div>
  </div>
);

// Import Modal Component
const ImportModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Import Team Members</h3>
            <button onClick={onClose} className="ml-auto p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Upload CSV File</label>
              <input
                type="file"
                accept=".csv"
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Required CSV Columns:</p>
              <p className="text-xs text-slate-600 font-mono">Name, Email, Role, Department, Phone, Join Date</p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;