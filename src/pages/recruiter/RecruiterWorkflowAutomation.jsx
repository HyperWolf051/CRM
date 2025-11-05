import { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  MapPin, 
  BarChart3, 
  Plus, 
  Settings, 
  Play, 
  Pause,
  Brain,
  Users,
  Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import WorkflowBuilder from '@/components/recruitment/WorkflowBuilder';
import LeadScoringEngine from '@/components/recruitment/LeadScoringEngine';
import TerritoryManagement from '@/components/recruitment/TerritoryManagement';
import WorkflowAnalytics from '@/components/recruitment/WorkflowAnalytics';
import { workflowAutomationService } from '@/services/workflowAutomationService';

// Workflow Summary Card
const WorkflowSummaryCard = ({ workflow, onEdit, onToggle, onDelete }) => {
  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${getStatusColor(workflow.isActive)}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
            <p className="text-sm text-gray-500">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(workflow.id, !workflow.isActive)}
            className={`p-2 rounded-lg ${getStatusColor(workflow.isActive)}`}
          >
            {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(workflow)}
            className="p-2 rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{workflow.executionCount}</div>
          <div className="text-xs text-gray-500">Executions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{Math.round(workflow.successRate)}%</div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {workflow.actions?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Actions</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Trigger: {workflow.trigger?.type?.replace('-', ' ') || 'Not set'}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {workflow.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {workflow.lastExecuted && (
        <div className="text-xs text-gray-500 mt-2">
          Last executed: {new Date(workflow.lastExecuted).toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Quick Stats Component
const QuickStats = ({ workflows, territories, leadScores }) => {
  const activeWorkflows = workflows.filter(w => w.isActive).length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executionCount, 0);
  const avgSuccessRate = workflows.length > 0 
    ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length 
    : 0;

  const stats = [
    {
      label: 'Active Workflows',
      value: activeWorkflows,
      total: workflows.length,
      icon: Zap,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Total Executions',
      value: totalExecutions,
      icon: Activity,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Success Rate',
      value: `${Math.round(avgSuccessRate)}%`,
      icon: Target,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      label: 'Territories',
      value: territories.filter(t => t.isActive).length,
      total: territories.length,
      icon: MapPin,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  {stat.total && (
                    <span className="text-sm text-gray-500 font-normal">
                      /{stat.total}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main Workflow Automation Component
const RecruiterWorkflowAutomation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [workflows, setWorkflows] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [leadScores, setLeadScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load workflows
      const workflowsData = await workflowAutomationService.getAllWorkflows();
      setWorkflows(workflowsData);

      // Load territories (mock data)
      const territoriesData = [
        {
          id: 'territory_1',
          name: 'West Coast Tech',
          type: 'geographic',
          isActive: true
        },
        {
          id: 'territory_2',
          name: 'Enterprise Sales',
          type: 'skill-based',
          isActive: true
        }
      ];
      setTerritories(territoriesData);

      // Load lead scores (mock data)
      const leadScoresData = [
        { candidateId: 'candidate_1', totalScore: 85, trend: 'increasing' },
        { candidateId: 'candidate_2', totalScore: 72, trend: 'stable' },
        { candidateId: 'candidate_3', totalScore: 91, trend: 'increasing' }
      ];
      setLeadScores(leadScoresData);

    } catch (error) {
      console.error('Error loading workflow automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow(null);
    setIsBuilderOpen(true);
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setIsBuilderOpen(true);
  };

  const handleSaveWorkflow = async (workflowData) => {
    try {
      if (editingWorkflow) {
        await workflowAutomationService.updateWorkflow(editingWorkflow.id, workflowData);
      } else {
        await workflowAutomationService.createWorkflow(workflowData);
      }
      
      await loadData();
      setIsBuilderOpen(false);
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleToggleWorkflow = async (workflowId, isActive) => {
    try {
      await workflowAutomationService.updateWorkflow(workflowId, { isActive });
      await loadData();
    } catch (error) {
      console.error('Error toggling workflow:', error);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      await workflowAutomationService.deleteWorkflow(workflowId);
      await loadData();
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'workflows', label: 'Workflows', icon: Zap },
    { id: 'scoring', label: 'Lead Scoring', icon: Target },
    { id: 'territories', label: 'Territories', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading workflow automation...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-gray-600">Automate recruitment processes and optimize candidate management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCreateWorkflow}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats 
        workflows={workflows}
        territories={territories}
        leadScores={leadScores}
      />

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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Workflows */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workflows</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.slice(0, 6).map(workflow => (
                <WorkflowSummaryCard
                  key={workflow.id}
                  workflow={workflow}
                  onEdit={handleEditWorkflow}
                  onToggle={handleToggleWorkflow}
                  onDelete={handleDeleteWorkflow}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleCreateWorkflow}
                variant="outline"
                className="justify-start"
                icon={<Zap className="w-4 h-4" />}
              >
                Create New Workflow
              </Button>
              <Button
                onClick={() => setActiveTab('scoring')}
                variant="outline"
                className="justify-start"
                icon={<Brain className="w-4 h-4" />}
              >
                Configure Lead Scoring
              </Button>
              <Button
                onClick={() => setActiveTab('territories')}
                variant="outline"
                className="justify-start"
                icon={<Users className="w-4 h-4" />}
              >
                Manage Territories
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Workflows</h3>
            <Button
              onClick={handleCreateWorkflow}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Workflow
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map(workflow => (
              <WorkflowSummaryCard
                key={workflow.id}
                workflow={workflow}
                onEdit={handleEditWorkflow}
                onToggle={handleToggleWorkflow}
                onDelete={handleDeleteWorkflow}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'scoring' && (
        <LeadScoringEngine
          candidate={selectedCandidate}
          onScoreUpdate={(candidateId, score) => {
            console.log('Score updated for candidate:', candidateId, score);
          }}
          showBreakdown={true}
        />
      )}

      {activeTab === 'territories' && (
        <TerritoryManagement />
      )}

      {activeTab === 'analytics' && (
        <WorkflowAnalytics />
      )}

      {/* Workflow Builder Modal */}
      {isBuilderOpen && (
        <Modal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          title=""
          className="max-w-full max-h-full m-0 p-0"
          showCloseButton={false}
        >
          <WorkflowBuilder
            workflow={editingWorkflow}
            onSave={handleSaveWorkflow}
            onClose={() => setIsBuilderOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default RecruiterWorkflowAutomation;