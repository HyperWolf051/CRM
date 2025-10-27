import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Mail, Phone, Eye, Edit, Trash2, Users, X, Filter, Grid3X3, List, MapPin, Calendar, Star, User } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CandidateAPI } from '../services/api';
import BulkActionsPanel from '../components/recruitment/BulkActionsPanel';
import CSVService from '../services/csvService';

// Helper function to get stage display info
const getStageInfo = (stage) => {
  const stageMap = {
    'registration': { label: 'Registration', color: 'bg-blue-100 text-blue-800', progress: 1 },
    'resume-sharing': { label: 'Resume Sharing', color: 'bg-purple-100 text-purple-800', progress: 2 },
    'shortlisting': { label: 'Shortlisting', color: 'bg-amber-100 text-amber-800', progress: 3 },
    'lineup-feedback': { label: 'Lineup & Feedback', color: 'bg-cyan-100 text-cyan-800', progress: 4 },
    'selection': { label: 'Selection', color: 'bg-green-100 text-green-800', progress: 5 },
    'closure': { label: 'Closure', color: 'bg-emerald-100 text-emerald-800', progress: 6 },
    'completed': { label: 'Completed', color: 'bg-gray-100 text-gray-800', progress: 7 }
  };
  return stageMap[stage] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', progress: 0 };
};

// Helper function to get status display info
const getStatusInfo = (status) => {
  const statusMap = {
    'new': { label: 'New', color: 'bg-blue-100 text-blue-800' },
    'in-process': { label: 'In Process', color: 'bg-yellow-100 text-yellow-800' },
    'shortlisted': { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
    'interviewed': { label: 'Interviewed', color: 'bg-cyan-100 text-cyan-800' },
    'selected': { label: 'Selected', color: 'bg-green-100 text-green-800' },
    'placed': { label: 'Placed', color: 'bg-emerald-100 text-emerald-800' },
    'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800' }
  };
  return statusMap[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    status: 'all',
    stage: 'all',
    allocation: 'all'
  });

  // Load candidates from API
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await CandidateAPI.getAll();
      
      if (result.success) {
        setCandidates(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('API Error:', result.message);
        setError(result.message || 'Failed to load candidates. Please try again.');
        // Fallback to mock data if API fails
        setCandidates(mockCandidates);
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates. Please try again.');
      // Fallback to mock data if API fails
      setCandidates(mockCandidates);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data as fallback with workflow stages
  const mockCandidates = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 98765 43210',
      position: 'Senior React Developer',
      experience: '5 years',
      location: 'Bengaluru, Karnataka',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      currentStage: 'shortlisting',
      overallStatus: 'shortlisted',
      allocation: 'Sheet-1',
      createdByName: 'Rahul Kumar',
      rating: 4.5,
      appliedDate: '2024-01-15',
      interestedFor: 'Senior React Developer',
      totalExperience: '5 years',
      lastSalary: '12L',
      salaryExpectation: '18L'
    },
    {
      id: 2,
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+91 87654 32109',
      position: 'Full Stack Developer',
      experience: '3 years',
      location: 'Mumbai, Maharashtra',
      skills: ['JavaScript', 'Python', 'Django', 'React'],
      currentStage: 'lineup-feedback',
      overallStatus: 'interviewed',
      allocation: 'Sheet-2',
      createdByName: 'Sneha Gupta',
      rating: 4.2,
      appliedDate: '2024-01-18',
      interestedFor: 'Full Stack Developer',
      totalExperience: '3 years',
      lastSalary: '8L',
      salaryExpectation: '12L'
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      email: 'kavya.reddy@gmail.com',
      phone: '+91 76543 21098',
      position: 'UI/UX Designer',
      experience: '4 years',
      location: 'Hyderabad, Telangana',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      currentStage: 'selection',
      overallStatus: 'selected',
      allocation: 'Team Alpha',
      createdByName: 'Vikram Singh',
      rating: 4.8,
      appliedDate: '2024-01-12',
      interestedFor: 'Senior UI/UX Designer',
      totalExperience: '4 years',
      lastSalary: '10L',
      salaryExpectation: '15L'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    location: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    education: '',
    linkedIn: '',
    portfolio: '',
    salary: '',
    skills: '',
    notes: ''
  });

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) {
      alert('Please fill in the required fields (Name and Email)');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare candidate data for API
      const candidateData = {
        ...newCandidate,
        skills: newCandidate.skills ? newCandidate.skills.split(',').map(s => s.trim()) : []
      };
      
      await CandidateAPI.create(candidateData);
      
      // Reload candidates list
      await loadCandidates();
      
      // Reset form and close modal
      setNewCandidate({
        name: '', email: '', phone: '', position: '', experience: '', location: '',
        address: '', dateOfBirth: '', nationality: '', education: '', linkedIn: '',
        portfolio: '', salary: '', skills: '', notes: ''
      });
      setShowAddModal(false);
      alert('Candidate added successfully!');
    } catch (err) {
      console.error('Error adding candidate:', err);
      alert('Failed to add candidate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      setIsLoading(true);
      await CandidateAPI.delete(candidateId);
      await loadCandidates();
      alert('Candidate deleted successfully!');
    } catch (err) {
      console.error('Error deleting candidate:', err);
      alert('Failed to delete candidate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle CSV import
  const handleCSVImport = async (processedData, fieldMapping, importType) => {
    try {
      const result = await CSVService.importCandidates(processedData, fieldMapping, importType);
      
      // Reload candidates list
      await loadCandidates();
      
      // Show results
      if (result.successful > 0) {
        alert(`Successfully imported ${result.successful} candidates!`);
      }
      
      if (result.failed > 0) {
        console.error('Import errors:', result.errors);
        alert(`${result.failed} candidates failed to import. Check console for details.`);
      }
      
      return result;
    } catch (error) {
      console.error('CSV import error:', error);
      throw error;
    }
  };

  // Handle CSV export
  const handleCSVExport = async (exportConfig) => {
    try {
      const result = await CSVService.exportCandidates(candidates, exportConfig);
      if (result.success) {
        console.log(`Exported ${result.count} candidates`);
      } else {
        alert('Export failed: ' + result.message);
      }
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Export failed: ' + error.message);
    }
  };

  // Handle bulk edit
  const handleBulkEdit = async (selectedIds, updates) => {
    try {
      setIsLoading(true);
      
      // Update each selected candidate
      const updatePromises = selectedIds.map(id => 
        CandidateAPI.update(id, updates)
      );
      
      await Promise.all(updatePromises);
      await loadCandidates();
      setSelectedCandidates([]);
      
      alert(`Successfully updated ${selectedIds.length} candidates!`);
    } catch (error) {
      console.error('Bulk edit error:', error);
      alert('Bulk edit failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds) => {
    try {
      setIsLoading(true);
      
      // Delete each selected candidate
      const deletePromises = selectedIds.map(id => 
        CandidateAPI.delete(id)
      );
      
      await Promise.all(deletePromises);
      await loadCandidates();
      setSelectedCandidates([]);
      
      alert(`Successfully deleted ${selectedIds.length} candidates!`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Bulk delete failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle candidate selection
  const handleCandidateSelect = (candidateId, isSelected) => {
    setSelectedCandidates(prev => 
      isSelected 
        ? [...prev, candidateId]
        : prev.filter(id => id !== candidateId)
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    setSelectedCandidates(isSelected ? candidates.map(c => c.id) : []);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    // Status filter
    if (filters.status !== 'all' && candidate.overallStatus !== filters.status) return false;
    
    // Stage filter
    if (filters.stage !== 'all' && candidate.currentStage !== filters.stage) return false;
    
    // Allocation filter
    if (filters.allocation !== 'all' && candidate.allocation !== filters.allocation) return false;
    
    // Name filter
    if (filters.name && !candidate.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
    
    // Phone filter
    if (filters.phone && !candidate.phone?.includes(filters.phone)) return false;
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        candidate.name?.toLowerCase().includes(query) ||
        candidate.email?.toLowerCase().includes(query) ||
        candidate.phone?.includes(query) ||
        candidate.position?.toLowerCase().includes(query) ||
        candidate.interestedFor?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Candidates
            </h1>
            <p className="text-slate-600 mt-1">Manage your talent pipeline and candidate relationships</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/app/candidates/add')}
            >
              Add Candidate
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-6 px-6">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
              />
            </div>

            {/* Filters */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
              >
                <span>Filters</span>
                <Filter className="w-4 h-4" />
              </button>
              
              {showFilters && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Filter by name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={filters.phone}
                      onChange={(e) => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Filter by phone..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-process">In Process</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="selected">Selected</option>
                      <option value="placed">Placed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={filters.stage}
                      onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Stages</option>
                      <option value="registration">Registration</option>
                      <option value="resume-sharing">Resume Sharing</option>
                      <option value="shortlisting">Shortlisting</option>
                      <option value="lineup-feedback">Lineup & Feedback</option>
                      <option value="selection">Selection</option>
                      <option value="closure">Closure</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allocation</label>
                    <select
                      value={filters.allocation}
                      onChange={(e) => setFilters(prev => ({ ...prev, allocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Allocations</option>
                      <option value="Sheet-1">Sheet-1</option>
                      <option value="Sheet-2">Sheet-2</option>
                      <option value="Sheet-3">Sheet-3</option>
                      <option value="Sheet-4">Sheet-4</option>
                      <option value="Sheet-5">Sheet-5</option>
                      <option value="Sheet-6">Sheet-6</option>
                      <option value="Team Alpha">Team Alpha</option>
                      <option value="Team Beta">Team Beta</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setFilters({ name: '', phone: '', status: 'all', stage: 'all', allocation: 'all' })}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Bulk Actions Panel */}
          <BulkActionsPanel
            selectedItems={selectedCandidates}
            onBulkEdit={handleBulkEdit}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleCSVExport}
            onImport={handleCSVImport}
            totalSelected={selectedCandidates.length}
            data={candidates}
            onClearSelection={() => setSelectedCandidates([])}
          />

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
            {/* View Controls */}
            {filteredCandidates.length > 0 && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Select All</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {selectedCandidates.length} of {filteredCandidates.length} selected
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Showing {filteredCandidates.length} of {candidates.length} candidates
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>List</span>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span>Grid</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredCandidates.length === 0 ? (
              <EmptyState
                icon={<Users className="w-16 h-16" />}
                title="No candidates found"
                description="No candidates match your current filters. Try adjusting your search criteria or add new candidates to your database."
                action={
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => navigate('/app/candidates/add')}
                  >
                    Add New Candidate
                  </Button>
                }
              />
            ) : viewMode === 'list' ? (
              // List View
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => {
                  const stageInfo = getStageInfo(candidate.currentStage);
                  const statusInfo = getStatusInfo(candidate.overallStatus);
                  
                  return (
                    <div key={candidate.id} className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6 hover:shadow-2xl transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={(e) => handleCandidateSelect(candidate.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-xl font-bold text-white">
                              {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                                {candidate.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{candidate.rating}</span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-slate-600 font-medium mb-1">{candidate.interestedFor || candidate.position}</p>
                              
                              <div className="flex items-center space-x-4 mb-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                                  {stageInfo.label}
                                </span>
                                {candidate.allocation && (
                                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    {candidate.allocation}
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4" />
                                  <span className="truncate">{candidate.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{candidate.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">{candidate.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span className="truncate">Added by {candidate.createdByName}</span>
                                </div>
                              </div>
                              
                              {candidate.skills && candidate.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 4).map((skill, index) => (
                                    <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                  {candidate.skills.length > 4 && (
                                    <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                                      +{candidate.skills.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                title="View Profile"
                                className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                                <Eye className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                              </button>
                              <button 
                                title="Schedule Interview"
                                className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                              </button>
                              <button 
                                title="Send Email"
                                className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                                <Mail className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                              </button>
                              <button 
                                title="Delete Candidate"
                                onClick={() => handleDeleteCandidate(candidate.id)}
                                className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                                <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => {
                  const stageInfo = getStageInfo(candidate.currentStage);
                  const statusInfo = getStatusInfo(candidate.overallStatus);
                  
                  return (
                    <div key={candidate.id} className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6 hover:shadow-2xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={(e) => handleCandidateSelect(candidate.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        {candidate.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{candidate.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                          <span className="text-2xl font-bold text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{candidate.name}</h3>
                        <p className="text-slate-600 text-sm mb-2">{candidate.interestedFor || candidate.position}</p>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                            {stageInfo.label}
                          </span>
                        </div>
                        
                        {candidate.allocation && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
                            {candidate.allocation}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{candidate.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Added by {candidate.createdByName}</span>
                        </div>
                      </div>
                      
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 3 && (
                              <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                                +{candidate.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100">
                        <button 
                          title="View Profile"
                          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                          <Eye className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                        </button>
                        <button 
                          title="Schedule Interview"
                          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                        </button>
                        <button 
                          title="Send Email"
                          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                          <Mail className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                        </button>
                        <button 
                          title="Delete Candidate"
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Add New Candidate
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="relative p-2 rounded-lg transition-all duration-200 overflow-hidden group hover:shadow-md"
                >
                  <X className="w-5 h-5 text-slate-500 group-hover:text-white relative z-10 transition-colors duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 
                                  transform scale-0 group-hover:scale-100 
                                  transition-transform duration-200 ease-out rounded-lg"></div>
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={newCandidate.email}
                        onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="candidate@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newCandidate.phone}
                        onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={newCandidate.dateOfBirth}
                        onChange={(e) => setNewCandidate({...newCandidate, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={newCandidate.location}
                        onChange={(e) => setNewCandidate({...newCandidate, location: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="City, State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        value={newCandidate.nationality}
                        onChange={(e) => setNewCandidate({...newCandidate, nationality: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Nationality"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={newCandidate.address}
                        onChange={(e) => setNewCandidate({...newCandidate, address: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Position *</label>
                      <input
                        type="text"
                        value={newCandidate.position}
                        onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Job title or position"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                      <input
                        type="text"
                        value={newCandidate.experience}
                        onChange={(e) => setNewCandidate({...newCandidate, experience: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary</label>
                      <input
                        type="text"
                        value={newCandidate.salary}
                        onChange={(e) => setNewCandidate({...newCandidate, salary: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="₹18,00,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                      <input
                        type="text"
                        value={newCandidate.education}
                        onChange={(e) => setNewCandidate({...newCandidate, education: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Degree - University"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={newCandidate.linkedIn}
                        onChange={(e) => setNewCandidate({...newCandidate, linkedIn: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio/Website</label>
                      <input
                        type="url"
                        value={newCandidate.portfolio}
                        onChange={(e) => setNewCandidate({...newCandidate, portfolio: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="https://portfolio.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                      <input
                        type="text"
                        value={newCandidate.skills}
                        onChange={(e) => setNewCandidate({...newCandidate, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="React, TypeScript, Node.js, AWS (comma separated)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                      <textarea
                        value={newCandidate.notes}
                        onChange={(e) => setNewCandidate({...newCandidate, notes: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                        placeholder="Additional notes about the candidate..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCandidate({
                      name: '', email: '', phone: '', position: '', experience: '', location: '',
                      address: '', dateOfBirth: '', nationality: '', education: '', linkedIn: '',
                      portfolio: '', salary: '', skills: '', notes: ''
                    });
                  }}
                  className="relative px-6 py-3 text-slate-600 hover:text-white font-medium rounded-xl 
                             transition-all duration-200 overflow-hidden group border border-slate-300 hover:border-slate-500"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 
                                  transform -translate-x-full group-hover:translate-x-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
                <button
                  onClick={handleAddCandidate}
                  className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium 
                             rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 
                             overflow-hidden group"
                >
                  <span className="relative z-10">Add Candidate</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 
                                  transform translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;