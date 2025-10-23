import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Download, Upload, Users, Mail, Phone, Eye, Edit, Trash2,
  Shield, ShieldCheck, Crown, User, Settings, MoreVertical, CheckCircle,
  XCircle, Building, Activity, TrendingUp, FileText, Calendar, MapPin,
  Clock, Star, Award, Briefcase, GraduationCap, Heart, AlertTriangle,
  Save, X, ChevronDown, ChevronRight, Loader2, Bell, MessageSquare,
  Video, Send, Paperclip, BarChart3, PieChart, LineChart, Target,
  Zap, Globe, Wifi, WifiOff, Lock, Unlock, Copy, ExternalLink, RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import EmptyState from '../components/ui/EmptyState';
import PasswordDisplayModal from '../components/ui/PasswordDisplayModal';
import { useToast } from '../context/ToastContext';

const Team = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Enhanced team data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1, name: 'Rahul Gupta', email: 'rahul.gupta@company.co.in', phone: '+91 98765 43210',
      role: 'Admin', department: 'Management', status: 'active', avatar: null,
      joinDate: '2024-01-15', lastLogin: '2024-03-15T10:30:00Z', permissions: ['all'],
      employeeId: 'EMP001', manager: 'Anjali Mehta', location: 'Mumbai, Maharashtra',
      timezone: 'Asia/Kolkata', workingHours: { start: '09:00', end: '18:00' },
      skills: ['Leadership', 'Management', 'Strategy'], certifications: ['PMP', 'Salesforce Admin'],
      performanceRating: 4.8, salary: 2500000, contractType: 'Full-time'
    },
    {
      id: 2, name: 'Anjali Mehta', email: 'anjali.mehta@company.co.in', phone: '+91 87654 32109',
      role: 'Manager', department: 'Sales', status: 'active', avatar: null,
      joinDate: '2024-02-01', lastLogin: '2024-03-14T16:45:00Z',
      permissions: ['candidates', 'deals', 'companies', 'reports'],
      employeeId: 'EMP002', manager: 'Rahul Gupta', location: 'Bengaluru, Karnataka',
      timezone: 'Asia/Kolkata', workingHours: { start: '09:30', end: '18:30' },
      skills: ['Sales', 'Customer Relations', 'Team Management'],
      certifications: ['Salesforce Sales Cloud', 'HubSpot Sales'],
      performanceRating: 4.6, salary: 1800000, contractType: 'Full-time'
    },
    {
      id: 3, name: 'Vikram Singh', email: 'vikram.singh@company.co.in', phone: '+91 76543 21098',
      role: 'Agent', department: 'Sales', status: 'active', avatar: null,
      joinDate: '2024-02-15', lastLogin: '2024-03-15T09:15:00Z',
      permissions: ['candidates', 'deals'],
      employeeId: 'EMP003', manager: 'Anjali Mehta', location: 'Delhi, NCR',
      timezone: 'Asia/Kolkata', workingHours: { start: '10:00', end: '19:00' },
      skills: ['Communication', 'Client Relations', 'Sales'],
      certifications: ['Google Analytics', 'Digital Marketing'],
      performanceRating: 4.4, salary: 1200000, contractType: 'Full-time'
    },
    {
      id: 4, name: 'Kavya Nair', email: 'kavya.nair@company.co.in', phone: '+91 65432 10987',
      role: 'Manager', department: 'HR', status: 'active', avatar: null,
      joinDate: '2024-01-20', lastLogin: '2024-03-14T14:20:00Z',
      permissions: ['team', 'reports'],
      employeeId: 'EMP004', manager: 'Rahul Gupta', location: 'Chennai, Tamil Nadu',
      timezone: 'Asia/Kolkata', workingHours: { start: '09:00', end: '18:00' },
      skills: ['HR Management', 'Recruitment', 'Training'],
      certifications: ['SHRM-CP', 'PHR'],
      performanceRating: 4.7, salary: 1600000, contractType: 'Full-time'
    },
    {
      id: 5, name: 'Neha Agarwal', email: 'neha.agarwal@company.co.in', phone: '+91 54321 09876',
      role: 'Agent', department: 'Finance', status: 'active', avatar: null,
      joinDate: '2024-03-01', lastLogin: '2024-03-15T11:30:00Z',
      permissions: ['reports'],
      employeeId: 'EMP005', manager: 'Rahul Gupta', location: 'Pune, Maharashtra',
      timezone: 'Asia/Kolkata', workingHours: { start: '09:30', end: '18:30' },
      skills: ['Accounting', 'Financial Analysis', 'Excel'],
      certifications: ['CA', 'CFA Level 1'],
      performanceRating: 4.2, salary: 1000000, contractType: 'Full-time'
    }
  ]);

  // State management
  const [activeView, setActiveView] = useState('list');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Enhanced filters
  const [filters, setFilters] = useState({
    role: 'all', department: 'all', status: 'all', location: 'all',
    skills: [], performanceRating: { min: 0, max: 5 },
    contractType: 'all', joinDateRange: { start: null, end: null }
  });

  // Bulk operations configuration
  const bulkActions = [
    { id: 'activate', label: 'Activate Users', icon: CheckCircle, color: 'green', description: 'Enable selected user accounts' },
    { id: 'deactivate', label: 'Deactivate Users', icon: XCircle, color: 'red', description: 'Disable selected user accounts' },
    { id: 'change-role', label: 'Change Role', icon: Shield, color: 'blue', description: 'Update role for selected users' },
    { id: 'change-department', label: 'Change Department', icon: Building, color: 'purple', description: 'Move users to different department' },
    { id: 'send-email', label: 'Send Email', icon: Mail, color: 'indigo', description: 'Send message to selected users' },
    { id: 'export', label: 'Export Selected', icon: Download, color: 'gray', description: 'Download user data as CSV' },
    { id: 'delete', label: 'Delete Users', icon: Trash2, color: 'red', description: 'Permanently remove selected users' }
  ];

  // Team analytics data
  const [analyticsData, setAnalyticsData] = useState({
    teamGrowth: [
      { month: 'Jan', count: 15, new: 3, left: 1 },
      { month: 'Feb', count: 18, new: 4, left: 1 },
      { month: 'Mar', count: 22, new: 5, left: 1 },
      { month: 'Apr', count: 25, new: 4, left: 1 },
      { month: 'May', count: 28, new: 4, left: 1 },
      { month: 'Jun', count: 30, new: 3, left: 1 }
    ],
    departmentDistribution: [
      { department: 'Sales', count: 12, percentage: 40.0, avgRating: 4.2 },
      { department: 'Marketing', count: 8, percentage: 26.7, avgRating: 4.0 },
      { department: 'Finance', count: 6, percentage: 20.0, avgRating: 4.3 },
      { department: 'Management', count: 4, percentage: 13.3, avgRating: 4.5 }
    ],
    performanceMetrics: {
      averageRating: 4.2,
      topPerformers: 8,
      improvementNeeded: 3,
      totalReviews: 28
    },
    activityStats: {
      activeToday: 25,
      activeThisWeek: 28,
      averageLoginTime: '09:15 AM',
      totalLogins: 156
    }
  });

  // Configuration
  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'Admin', name: 'Admin', icon: Crown, color: 'text-purple-600' },
    { id: 'Manager', name: 'Manager', icon: ShieldCheck, color: 'text-blue-600' },
    { id: 'Agent', name: 'Agent', icon: User, color: 'text-green-600' },
    { id: 'Finance', name: 'Finance', icon: Shield, color: 'text-orange-600' }
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'Management', name: 'Management' },
    { id: 'Sales', name: 'Sales' },
    { id: 'Finance', name: 'Finance' },
    { id: 'HR', name: 'Human Resources' },
    { id: 'IT', name: 'Information Technology' }
  ];

  // Utility functions
  const getRoleIcon = (role) => roles.find(r => r.id === role)?.icon || User;
  const getRoleColor = (role) => roles.find(r => r.id === role)?.color || 'text-gray-600';
  const getStatusColor = (status) => status === 'active' 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200';

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Advanced filtering
  const filteredMembers = useCallback(() => {
    return teamMembers.filter(member => {
      const matchesSearch = !searchQuery || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filters.role === 'all' || member.role === filters.role;
      const matchesDepartment = filters.department === 'all' || member.department === filters.department;
      const matchesStatus = filters.status === 'all' || member.status === filters.status;
      const matchesLocation = filters.location === 'all' || member.location === filters.location;
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesLocation;
    });
  }, [teamMembers, searchQuery, filters]);

  // Event handlers
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

  const handleBulkAction = async (action, data = null) => {
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
        case 'change-role':
          if (data?.newRole) {
            setTeamMembers(prev => prev.map(member => 
              selectedMembers.includes(member.id) ? { ...member, role: data.newRole } : member
            ));
            showToast('success', `Updated role for ${selectedMembers.length} users`);
          }
          break;
        case 'change-department':
          if (data?.newDepartment) {
            setTeamMembers(prev => prev.map(member => 
              selectedMembers.includes(member.id) ? { ...member, department: data.newDepartment } : member
            ));
            showToast('success', `Moved ${selectedMembers.length} users to ${data.newDepartment}`);
          }
          break;
        case 'send-email':
          setShowEmailComposer(true);
          return; // Don't clear selection for email composer
        case 'export':
          const csvContent = generateCSV(teamMembers.filter(m => selectedMembers.includes(m.id)));
          downloadCSV(csvContent, 'team-members.csv');
          showToast('success', `Exported ${selectedMembers.length} users`);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedMembers.length} users? This action cannot be undone.`)) {
            setTeamMembers(prev => prev.filter(member => !selectedMembers.includes(member.id)));
            showToast('success', `Deleted ${selectedMembers.length} users`);
          } else {
            return; // Don't clear selection if cancelled
          }
          break;
      }
      setSelectedMembers([]);
      setBulkActionMode(false);
      setShowBulkActions(false);
    } catch (error) {
      showToast('error', 'Failed to perform bulk action');
    } finally {
      setIsLoading(false);
    }
  };

  // Import users from CSV
  const handleImportUsers = (csvData) => {
    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');
      const newUsers = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        return {
          id: teamMembers.length + index + 1,
          name: values[0] || '',
          email: values[1] || '',
          role: values[2] || 'User',
          department: values[3] || 'General',
          status: values[4] || 'active',
          employeeId: values[5] || `EMP${String(teamMembers.length + index + 1).padStart(3, '0')}`,
          location: values[6] || 'Remote',
          phone: values[7] || '',
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: null,
          performanceRating: 3.0,
          skills: [],
          certifications: [],
          contractType: 'Full-time'
        };
      }).filter(user => user.name && user.email);

      setTeamMembers(prev => [...prev, ...newUsers]);
      showToast('success', `Imported ${newUsers.length} users successfully`);
      setShowImportModal(false);
    } catch (error) {
      showToast('error', 'Failed to import users. Please check the CSV format.');
    }
  };

  const generateCSV = (data) => {
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Employee ID', 'Location'];
    const rows = data.map(member => [
      member.name, member.email, member.role, member.department, 
      member.status, member.employeeId, member.location
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Analytics
  const analytics = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    averagePerformance: teamMembers.reduce((sum, m) => sum + m.performanceRating, 0) / teamMembers.length
  };

  const filtered = filteredMembers();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 mt-2">Manage team members, roles, permissions, and performance</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedMembers.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {selectedMembers.length} selected
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              )}
              <Button variant="secondary" onClick={() => setShowImportModal(true)} size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="secondary" onClick={() => setActiveView(activeView === 'analytics' ? 'list' : 'analytics')} size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                {activeView === 'analytics' ? 'List View' : 'Analytics'}
              </Button>
              <Button onClick={() => navigate('/app/team/add')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalMembers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-green-600">{analytics.averagePerformance.toFixed(1)}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* View Toggle and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                List
              </button>
              <button
                onClick={() => setActiveView('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                Grid
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Analytics
              </button>
            </div>
            
            {/* Bulk Action Controls */}
            <div className="flex items-center gap-3">
              {selectedMembers.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="border-blue-300 text-blue-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Bulk Actions ({selectedMembers.length})
                </Button>
              )}
              
              <Button
                variant={bulkActionMode ? 'primary' : 'secondary'}
                onClick={() => {
                  setBulkActionMode(!bulkActionMode);
                  setSelectedMembers([]);
                }}
                className={bulkActionMode ? 'bg-blue-600' : 'border-gray-300'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {bulkActionMode ? 'Exit Select' : 'Select Mode'}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or employee ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                  {Object.values(filters).some(v => v !== 'all' && v !== '' && (Array.isArray(v) ? v.length > 0 : true)) && (
                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </Button>
                {selectedMembers.length > 0 && (
                  <Button variant="secondary" onClick={() => handleBulkAction('export')} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {roles.slice(1).map((role) => (
                <button
                  key={role.id}
                  onClick={() => setFilters(prev => ({ ...prev, role: role.id }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    filters.role === role.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <role.icon className="w-3 h-3" />
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      role: 'all', department: 'all', status: 'all', location: 'all',
                      skills: [], performanceRating: { min: 0, max: 5 },
                      contractType: 'all', joinDateRange: { start: null, end: null }
                    });
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                  <select
                    value={filters.contractType}
                    onChange={(e) => setFilters({ ...filters, contractType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.performanceRating.min}
                      onChange={(e) => setFilters({
                        ...filters,
                        performanceRating: { ...filters.performanceRating, min: parseFloat(e.target.value) }
                      })}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12">
                      {filters.performanceRating.min}+
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={filters.location === 'all' ? '' : filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value || 'all' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedMembers.length > 0 && (
          <div className="mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bulk Actions ({selectedMembers.length} selected)
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowBulkActions(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {bulkActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id)}
                    className={`p-3 rounded-lg border-2 border-dashed transition-colors hover:border-solid ${
                      action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                      action.color === 'red' ? 'border-red-300 hover:border-red-500 hover:bg-red-50' :
                      action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                      action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                      action.color === 'indigo' ? 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50' :
                      'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                    }`}
                    title={action.description}
                  >
                    <action.icon className={`w-5 h-5 mx-auto mb-2 ${
                      action.color === 'green' ? 'text-green-600' :
                      action.color === 'red' ? 'text-red-600' :
                      action.color === 'blue' ? 'text-blue-600' :
                      action.color === 'purple' ? 'text-purple-600' :
                      action.color === 'indigo' ? 'text-indigo-600' :
                      'text-gray-600'
                    }`} />
                    <div className="text-xs font-medium text-gray-900">{action.label}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* List View */}
          {activeView === 'list' && (
            <Card className="shadow-sm">
              <div className="p-6">
                {filtered.length === 0 ? (
                  <EmptyState
                    icon={<Users className="w-16 h-16" />}
                    title="No team members found"
                    description="No team members match your current filters."
                    action={
                      <Button onClick={() => navigate('/app/team/add')} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Button>
                    }
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
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
                              className="rounded border-gray-300 text-blue-600"
                            />
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Member</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((member) => {
                          const RoleIcon = getRoleIcon(member.role);
                          const isSelected = selectedMembers.includes(member.id);
                          
                          return (
                            <tr key={member.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                              <td className="py-4 px-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => handleMemberSelect(member.id, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{member.name}</div>
                                    <div className="text-sm text-gray-500">{member.email}</div>
                                    <div className="text-xs text-gray-400">{member.employeeId}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <RoleIcon className={`w-4 h-4 ${getRoleColor(member.role)}`} />
                                  <span className="text-gray-900">{member.role}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-gray-900">{member.department}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="font-medium text-gray-900">{member.performanceRating}/5</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(member.status)}`}>
                                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleMemberClick(member)}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => window.location.href = `mailto:${member.email}`}
                                    className="p-1 text-gray-400 hover:text-green-600"
                                    title="Send Email"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => window.location.href = `tel:${member.phone}`}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                    title="Call"
                                  >
                                    <Phone className="w-4 h-4" />
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
              </div>
            </Card>
          )}

          {/* Grid View */}
          {activeView === 'grid' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  Showing {filtered.length} of {teamMembers.length} team members
                </div>
                {bulkActionMode && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedMembers(filtered.map(m => m.id))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedMembers([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(member => (
                  <Card key={member.id} className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedMembers.includes(member.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {bulkActionMode && (
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={(e) => handleMemberSelect(member.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          )}
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.employeeId}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(member.performanceRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">{member.performanceRating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                          <p className="text-sm font-medium text-gray-900">{member.role}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                          <p className="text-sm font-medium text-gray-900">{member.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                          <p className="text-sm font-medium text-gray-900">{member.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : member.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills?.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                              {skill}
                            </span>
                          ))}
                          {member.skills?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{member.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMemberClick(member)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`mailto:${member.email}`)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`tel:${member.phone}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
                  <Button onClick={() => navigate('/app/team/add')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Member
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                  <div className="space-y-4">
                    {analyticsData.departmentDistribution.map(dept => (
                      <div key={dept.department} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="font-medium text-gray-900">{dept.department}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{dept.count} members</div>
                          <div className="text-sm text-gray-500">{dept.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Performance Overview */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{analyticsData.performanceMetrics.averageRating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Top Performers</span>
                      <span className="font-semibold text-green-600">{analyticsData.performanceMetrics.topPerformers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Need Improvement</span>
                      <span className="font-semibold text-orange-600">{analyticsData.performanceMetrics.improvementNeeded}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Activity Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analyticsData.activityStats.activeToday}</div>
                    <div className="text-sm text-gray-600">Active Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analyticsData.activityStats.activeThisWeek}</div>
                    <div className="text-sm text-gray-600">Active This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analyticsData.activityStats.averageLoginTime}</div>
                    <div className="text-sm text-gray-600">Avg Login Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analyticsData.activityStats.totalLogins}</div>
                    <div className="text-sm text-gray-600">Total Logins</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced User Profile Modal */}
        {showUserProfile && selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                      <p className="text-blue-100">{selectedMember.role} • {selectedMember.department}</p>
                      <p className="text-blue-200 text-sm">{selectedMember.email}</p>
                      <p className="text-blue-200 text-sm">ID: {selectedMember.employeeId}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowUserProfile(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-3">
                      <div><strong>Location:</strong> {selectedMember.location}</div>
                      <div><strong>Phone:</strong> {selectedMember.phone}</div>
                      <div><strong>Manager:</strong> {selectedMember.manager}</div>
                      <div><strong>Join Date:</strong> {new Date(selectedMember.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
                    <div className="space-y-3">
                      <div><strong>Performance:</strong> {selectedMember.performanceRating}/5 ⭐</div>
                      <div><strong>Contract:</strong> {selectedMember.contractType}</div>
                      <div><strong>Working Hours:</strong> {selectedMember.workingHours?.start} - {selectedMember.workingHours?.end}</div>
                      <div><strong>Last Login:</strong> {formatLastLogin(selectedMember.lastLogin)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Certifications</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMember.skills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {selectedMember.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import CSV Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Import Team Members</h3>
                  <Button variant="secondary" size="sm" onClick={() => setShowImportModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleImportUsers(event.target.result);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">CSV Format:</p>
                    <p>Name, Email, Role, Department, Status, Employee ID, Location, Phone</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const csvTemplate = "Name,Email,Role,Department,Status,Employee ID,Location,Phone\nRahul Sharma,rahul@company.co.in,User,Sales,active,EMP001,Mumbai,+919876543210";
                        downloadCSV(csvTemplate, 'team-import-template.csv');
                      }}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Composer Modal */}
        {showEmailComposer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Send Email to {selectedMembers.length} Members
                  </h3>
                  <Button variant="secondary" size="sm" onClick={() => setShowEmailComposer(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Input placeholder="Enter email subject..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={6}
                      placeholder="Enter your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        showToast('success', `Email sent to ${selectedMembers.length} members`);
                        setShowEmailComposer(false);
                        setSelectedMembers([]);
                      }}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="secondary" onClick={() => setShowEmailComposer(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;