import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Users, 
  Mail, 
  Phone, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  ShieldCheck,
  Crown,
  User,
  Settings,
  MoreVertical
} from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import PasswordDisplayModal from '../components/ui/PasswordDisplayModal';

const Team = () => {
  // Mock team data - in real app this would come from API
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      department: 'Management',
      status: 'active',
      avatar: null,
      joinDate: '2024-01-15',
      lastLogin: '2024-03-15T10:30:00Z',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      department: 'Sales',
      status: 'active',
      avatar: null,
      joinDate: '2024-02-01',
      lastLogin: '2024-03-14T16:45:00Z',
      permissions: ['candidates', 'deals', 'companies', 'reports']
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1 (555) 345-6789',
      role: 'Agent',
      department: 'Sales',
      status: 'active',
      avatar: null,
      joinDate: '2024-02-15',
      lastLogin: '2024-03-14T14:20:00Z',
      permissions: ['candidates', 'deals']
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      phone: '+1 (555) 456-7890',
      role: 'Finance',
      department: 'Finance',
      status: 'inactive',
      avatar: null,
      joinDate: '2024-01-20',
      lastLogin: '2024-03-10T09:15:00Z',
      permissions: ['reports', 'companies']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newMemberCredentials, setNewMemberCredentials] = useState(null);

  // Form state for creating new team member
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Agent',
    department: 'Sales',
    permissions: []
  });

  const [formErrors, setFormErrors] = useState({});

  // Role and department options
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

  const permissionOptions = [
    { id: 'candidates', name: 'Candidates', description: 'View and manage candidates' },
    { id: 'deals', name: 'Jobs & Deals', description: 'Manage job postings and deals' },
    { id: 'companies', name: 'Companies', description: 'Manage client companies' },
    { id: 'reports', name: 'Reports', description: 'View analytics and reports' },
    { id: 'calendar', name: 'Calendar', description: 'Manage schedules and events' },
    { id: 'settings', name: 'Settings', description: 'System configuration' }
  ];

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Calculate metrics
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const adminCount = teamMembers.filter(m => m.role === 'Admin').length;
  const agentCount = teamMembers.filter(m => m.role === 'Agent').length;

  const getRoleIcon = (role) => {
    const roleData = roles.find(r => r.id === role);
    return roleData ? roleData.icon : User;
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.id === role);
    return roleData ? roleData.color : 'text-gray-600';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleCreateMember = () => {
    // Validate form
    const errors = {};
    if (!newMember.name.trim()) errors.name = 'Name is required';
    if (!newMember.email.trim()) errors.email = 'Email is required';
    if (!newMember.email.includes('@')) errors.email = 'Valid email is required';
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const member = {
        id: Math.max(...teamMembers.map(m => m.id)) + 1,
        ...newMember,
        status: 'active',
        avatar: null,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        tempPassword // In real app, this would be sent via email
      };
      
      setTeamMembers([...teamMembers, member]);
      setShowCreateModal(false);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: 'Agent',
        department: 'Sales',
        permissions: []
      });
      setFormErrors({});
      
      // Show professional password modal instead of ugly alert
      setNewMemberCredentials({
        name: member.name,
        email: member.email,
        password: tempPassword
      });
      setShowPasswordModal(true);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
  };

  const handleDeleteMember = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    }
  };

  const handleToggleStatus = (memberId) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your team members, roles, and permissions</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add Team Member
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agentCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col gap-4 mb-6">
            {/* Role Filters */}
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedRole === role.id
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role.icon && <role.icon className="w-4 h-4" />}
                  <span>{role.name}</span>
                </button>
              ))}
            </div>

            {/* Search and Advanced Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedRole('all');
                      setSelectedDepartment('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Team Members Table */}
          {filteredMembers.length === 0 ? (
            <EmptyState
              icon={<Users className="w-16 h-16" />}
              title="No team members found"
              description={
                searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all'
                  ? "No team members match your current filters. Try adjusting your search criteria."
                  : "You haven't added any team members yet. Start building your team by adding your first member."
              }
              action={
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Add Your First Team Member
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Member</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    return (
                      <tr
                        key={member.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleMemberClick(member)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <RoleIcon className={`w-4 h-4 ${getRoleColor(member.role)}`} />
                            <span className="text-gray-900">{member.role}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{member.department}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600 text-sm">
                            {member.lastLogin ? formatLastLogin(member.lastLogin) : 'Never'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMemberClick(member);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                              className="p-1 text-gray-400 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(member.id);
                              }}
                              className="p-1 text-gray-400 hover:text-yellow-600"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMember(member.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Create Team Member Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 600 }}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Add New Team Member</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormErrors({});
                    setNewMember({
                      name: '',
                      email: '',
                      phone: '',
                      role: 'Agent',
                      department: 'Sales',
                      permissions: []
                    });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      className={`w-full px-3 py-2.5 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 ${
                        formErrors.name ? 'border-red-300' : 'border-slate-200/50'
                      }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      className={`w-full px-3 py-2.5 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 ${
                        formErrors.email ? 'border-red-300' : 'border-slate-200/50'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    >
                      <option value="Agent">Agent</option>
                      <option value="Manager">Manager</option>
                      <option value="Finance">Finance</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                    <select
                      value={newMember.department}
                      onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Management">Management</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">Human Resources</option>
                      <option value="IT">Information Technology</option>
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissionOptions.map((permission) => (
                      <label key={permission.id} className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newMember.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewMember({
                                ...newMember,
                                permissions: [...newMember.permissions, permission.id]
                              });
                            } else {
                              setNewMember({
                                ...newMember,
                                permissions: newMember.permissions.filter(p => p !== permission.id)
                              });
                            }
                          }}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{permission.name}</div>
                          <div className="text-xs text-slate-500">{permission.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormErrors({});
                    setNewMember({
                      name: '',
                      email: '',
                      phone: '',
                      role: 'Agent',
                      department: 'Sales',
                      permissions: []
                    });
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMember}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 600 }}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Team Member Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 text-slate-500 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {selectedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{selectedMember.name}</h3>
                    <p className="text-slate-600">{selectedMember.role} • {selectedMember.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <p className="text-slate-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <p className="text-slate-900">{selectedMember.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Join Date</label>
                    <p className="text-slate-900">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Last Login</label>
                    <p className="text-slate-900">
                      {selectedMember.lastLogin ? formatLastLogin(selectedMember.lastLogin) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Permissions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedMember.permissions.includes('all') ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg">All Permissions</span>
                      ) : selectedMember.permissions.length > 0 ? (
                        selectedMember.permissions.map(permission => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg capitalize">
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">No specific permissions</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit functionality
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Edit Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Password Display Modal */}
      <PasswordDisplayModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setNewMemberCredentials(null);
        }}
        memberName={newMemberCredentials?.name}
        memberEmail={newMemberCredentials?.email}
        temporaryPassword={newMemberCredentials?.password}
        onEmailSent={() => {
          console.log('Email sent to new team member');
        }}
      />
    </div>
  );
};

export default Team;