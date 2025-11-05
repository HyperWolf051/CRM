import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { workflowAutomationService } from '@/services/workflowAutomationService';

// Territory Performance Card
const TerritoryPerformanceCard = ({ territory }) => {
  const { performance } = territory;
  const conversionRate = performance.totalCandidates > 0 
    ? (performance.placedCandidates / performance.totalCandidates) * 100 
    : 0;

  const getPerformanceColor = (rate) => {
    if (rate >= 30) return 'text-green-600 bg-green-50';
    if (rate >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${getPerformanceColor(conversionRate)}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{territory.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{territory.type.replace('-', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {territory.isActive ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-xs text-gray-500">
            {territory.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{performance.totalCandidates}</div>
          <div className="text-sm text-gray-500">Total Candidates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{performance.placedCandidates}</div>
          <div className="text-sm text-gray-500">Placed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{Math.round(conversionRate)}%</div>
          <div className="text-sm text-gray-500">Conversion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{performance.averageTimeToHire}d</div>
          <div className="text-sm text-gray-500">Avg. Time to Hire</div>
        </div>
      </div>

      {/* Revenue */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Revenue</span>
        </div>
        <span className="font-semibold text-gray-900">
          ${performance.revenue.toLocaleString()}
        </span>
      </div>

      {/* Assigned Recruiters */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Assigned Recruiters</span>
          <span className="text-xs text-gray-500">{territory.assignedRecruiters.length}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {territory.assignedRecruiters.map((recruiterId, index) => (
            <span 
              key={recruiterId}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              Recruiter {index + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Territory Criteria */}
      <div className="border-t border-gray-100 pt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Criteria</div>
        <div className="space-y-1">
          {territory.criteria.locations && (
            <div className="flex items-center text-xs text-gray-600">
              <Globe className="w-3 h-3 mr-1" />
              <span>Locations: {territory.criteria.locations.join(', ')}</span>
            </div>
          )}
          {territory.criteria.skills && (
            <div className="flex items-center text-xs text-gray-600">
              <Target className="w-3 h-3 mr-1" />
              <span>Skills: {territory.criteria.skills.join(', ')}</span>
            </div>
          )}
          {territory.criteria.experienceLevels && (
            <div className="flex items-center text-xs text-gray-600">
              <Award className="w-3 h-3 mr-1" />
              <span>Experience: {territory.criteria.experienceLevels.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Territory Form Modal
const TerritoryFormModal = ({ territory, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'geographic',
    criteria: {
      locations: [],
      skills: [],
      industries: [],
      experienceLevels: [],
      salaryRanges: []
    },
    assignedRecruiters: [],
    isActive: true
  });
  const [locationInput, setLocationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');

  useEffect(() => {
    if (territory) {
      setFormData({
        name: territory.name,
        type: territory.type,
        criteria: territory.criteria,
        assignedRecruiters: territory.assignedRecruiters,
        isActive: territory.isActive
      });
    } else {
      setFormData({
        name: '',
        type: 'geographic',
        criteria: {
          locations: [],
          skills: [],
          industries: [],
          experienceLevels: [],
          salaryRanges: []
        },
        assignedRecruiters: [],
        isActive: true
      });
    }
  }, [territory, isOpen]);

  const territoryTypes = [
    { value: 'geographic', label: 'Geographic' },
    { value: 'skill-based', label: 'Skill Based' },
    { value: 'industry', label: 'Industry' },
    { value: 'experience-level', label: 'Experience Level' },
    { value: 'custom', label: 'Custom' }
  ];

  const experienceLevels = ['junior', 'mid', 'senior', 'lead', 'executive'];

  const addToArray = (field, value, inputSetter) => {
    if (value.trim() && !formData.criteria[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [field]: [...prev.criteria[field], value.trim()]
        }
      }));
      inputSetter('');
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: prev.criteria[field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={territory ? 'Edit Territory' : 'Create Territory'}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Territory Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., West Coast Tech"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Territory Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {territoryTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locations
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('locations', locationInput, setLocationInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add location (e.g., San Francisco)"
            />
            <Button
              onClick={() => addToArray('locations', locationInput, setLocationInput)}
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.criteria.locations.map((location, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {location}
                <button
                  onClick={() => removeFromArray('locations', index)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('skills', skillInput, setSkillInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add skill (e.g., React)"
            />
            <Button
              onClick={() => addToArray('skills', skillInput, setSkillInput)}
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.criteria.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {skill}
                <button
                  onClick={() => removeFromArray('skills', index)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industries
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('industries', industryInput, setIndustryInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add industry (e.g., SaaS)"
            />
            <Button
              onClick={() => addToArray('industries', industryInput, setIndustryInput)}
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.criteria.industries.map((industry, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                {industry}
                <button
                  onClick={() => removeFromArray('industries', index)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience Levels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Levels
          </label>
          <div className="grid grid-cols-3 gap-2">
            {experienceLevels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.criteria.experienceLevels.includes(level)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          experienceLevels: [...prev.criteria.experienceLevels, level]
                        }
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          experienceLevels: prev.criteria.experienceLevels.filter(l => l !== level)
                        }
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active Territory
          </label>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1"
            disabled={!formData.name}
          >
            {territory ? 'Update Territory' : 'Create Territory'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Assignment Rules Component
const AssignmentRules = ({ territories, onRuleCreate, onRuleUpdate, onRuleDelete }) => {
  const [rules, setRules] = useState([
    {
      id: 'rule_1',
      name: 'West Coast Tech Assignment',
      priority: 1,
      conditions: [
        { field: 'location', operator: 'contains', value: 'San Francisco' },
        { field: 'skills', operator: 'contains', value: 'React' }
      ],
      territoryId: 'territory_1',
      isActive: true,
      description: 'Assign SF-based React developers to West Coast Tech territory'
    }
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Assignment Rules</h3>
        <Button
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{rule.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Priority {rule.priority}
                </span>
                {!rule.isActive && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">{rule.description}</div>
            <div className="text-xs text-gray-500">
              Conditions: {rule.conditions.length} | 
              Territory: {territories.find(t => t.id === rule.territoryId)?.name || 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Territory Management Component
const TerritoryManagement = () => {
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);
  const [activeTab, setActiveTab] = useState('territories');

  useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    try {
      // Mock data - in real implementation, this would fetch from the service
      const mockTerritories = [
        {
          id: 'territory_1',
          name: 'West Coast Tech',
          type: 'geographic',
          criteria: {
            locations: ['San Francisco', 'Los Angeles', 'Seattle'],
            skills: ['React', 'Node.js', 'Python']
          },
          assignedRecruiters: ['recruiter_1', 'recruiter_2'],
          isActive: true,
          performance: {
            totalCandidates: 156,
            placedCandidates: 42,
            averageTimeToHire: 18,
            conversionRate: 26.9,
            revenue: 420000,
            lastUpdated: new Date()
          },
          createdBy: 'admin',
          createdAt: new Date('2024-01-01')
        },
        {
          id: 'territory_2',
          name: 'Enterprise Sales',
          type: 'skill-based',
          criteria: {
            skills: ['Sales', 'Account Management', 'CRM'],
            experienceLevels: ['senior', 'lead']
          },
          assignedRecruiters: ['recruiter_3'],
          isActive: true,
          performance: {
            totalCandidates: 89,
            placedCandidates: 28,
            averageTimeToHire: 22,
            conversionRate: 31.5,
            revenue: 280000,
            lastUpdated: new Date()
          },
          createdBy: 'admin',
          createdAt: new Date('2024-01-01')
        }
      ];
      setTerritories(mockTerritories);
    } catch (error) {
      console.error('Error loading territories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTerritory = () => {
    setEditingTerritory(null);
    setIsModalOpen(true);
  };

  const handleEditTerritory = (territory) => {
    setEditingTerritory(territory);
    setIsModalOpen(true);
  };

  const handleSaveTerritory = async (territoryData) => {
    try {
      if (editingTerritory) {
        // Update existing territory
        setTerritories(prev => prev.map(t => 
          t.id === editingTerritory.id 
            ? { ...t, ...territoryData }
            : t
        ));
      } else {
        // Create new territory
        const newTerritory = {
          id: `territory_${Date.now()}`,
          ...territoryData,
          performance: {
            totalCandidates: 0,
            placedCandidates: 0,
            averageTimeToHire: 0,
            conversionRate: 0,
            revenue: 0,
            lastUpdated: new Date()
          },
          createdBy: 'current-user',
          createdAt: new Date()
        };
        setTerritories(prev => [...prev, newTerritory]);
      }
    } catch (error) {
      console.error('Error saving territory:', error);
    }
  };

  const handleDeleteTerritory = async (territoryId) => {
    try {
      setTerritories(prev => prev.filter(t => t.id !== territoryId));
    } catch (error) {
      console.error('Error deleting territory:', error);
    }
  };

  const tabs = [
    { id: 'territories', label: 'Territories', icon: MapPin },
    { id: 'rules', label: 'Assignment Rules', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading territories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Territory Management</h2>
          <p className="text-gray-600">Manage territories and automatic candidate assignment</p>
        </div>
        <Button
          onClick={handleCreateTerritory}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Territory
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'territories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {territories.map(territory => (
            <div key={territory.id} className="relative">
              <TerritoryPerformanceCard territory={territory} />
              <div className="absolute top-4 right-4 flex space-x-1">
                <button
                  onClick={() => handleEditTerritory(territory)}
                  className="p-1 bg-white rounded shadow hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteTerritory(territory.id)}
                  className="p-1 bg-white rounded shadow hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <AssignmentRules
          territories={territories}
          onRuleCreate={() => {}}
          onRuleUpdate={() => {}}
          onRuleDelete={() => {}}
        />
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Territory Analytics</h3>
          <div className="text-center text-gray-500 py-8">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Territory analytics coming soon</p>
          </div>
        </div>
      )}

      {/* Territory Form Modal */}
      <TerritoryFormModal
        territory={editingTerritory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTerritory}
      />
    </div>
  );
};

export default TerritoryManagement;