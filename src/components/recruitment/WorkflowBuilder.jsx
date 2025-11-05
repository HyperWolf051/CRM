import { useState, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Settings, 
  Zap, 
  Filter, 
  Mail, 
  UserPlus, 
  CheckSquare, 
  Clock, 
  Target,
  GitBranch,
  ArrowRight,
  Grip
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

// Node Templates
const NODE_TEMPLATES = {
  triggers: [
    {
      type: 'trigger',
      subType: 'candidate-added',
      label: 'Candidate Added',
      icon: 'UserPlus',
      description: 'Triggers when a new candidate is added',
      defaultData: {
        type: 'candidate-added',
        conditions: {},
        description: 'When a new candidate is added'
      }
    },
    {
      type: 'trigger',
      subType: 'status-changed',
      label: 'Status Changed',
      icon: 'GitBranch',
      description: 'Triggers when candidate status changes',
      defaultData: {
        type: 'status-changed',
        conditions: { fromStatus: '', toStatus: '' },
        description: 'When candidate status changes'
      }
    },
    {
      type: 'trigger',
      subType: 'score-threshold',
      label: 'Score Threshold',
      icon: 'Target',
      description: 'Triggers when lead score reaches threshold',
      defaultData: {
        type: 'score-threshold',
        conditions: { threshold: 80, operator: 'greater-than' },
        description: 'When lead score exceeds threshold'
      }
    },
    {
      type: 'trigger',
      subType: 'time-based',
      label: 'Time Based',
      icon: 'Clock',
      description: 'Triggers on schedule',
      defaultData: {
        type: 'time-based',
        conditions: {},
        schedule: { expression: '0 9 * * *' },
        description: 'Scheduled trigger'
      }
    }
  ],
  conditions: [
    {
      type: 'condition',
      subType: 'field-equals',
      label: 'Field Equals',
      icon: 'Filter',
      description: 'Check if field equals value',
      defaultData: {
        type: 'field-equals',
        field: '',
        operator: 'equals',
        value: '',
        logicalOperator: 'AND'
      }
    },
    {
      type: 'condition',
      subType: 'score-greater-than',
      label: 'Score Greater Than',
      icon: 'Target',
      description: 'Check if score is above threshold',
      defaultData: {
        type: 'score-greater-than',
        field: 'leadScore',
        operator: 'greater-than',
        value: 70,
        logicalOperator: 'AND'
      }
    }
  ],
  actions: [
    {
      type: 'action',
      subType: 'send-email',
      label: 'Send Email',
      icon: 'Mail',
      description: 'Send email to candidate or recruiter',
      defaultData: {
        type: 'send-email',
        parameters: {
          template: '',
          subject: '',
          recipient: 'candidate'
        },
        delay: 0,
        description: 'Send email'
      }
    },
    {
      type: 'action',
      subType: 'update-status',
      label: 'Update Status',
      icon: 'GitBranch',
      description: 'Update candidate status',
      defaultData: {
        type: 'update-status',
        parameters: { status: '' },
        delay: 0,
        description: 'Update candidate status'
      }
    },
    {
      type: 'action',
      subType: 'create-task',
      label: 'Create Task',
      icon: 'CheckSquare',
      description: 'Create task for recruiter',
      defaultData: {
        type: 'create-task',
        parameters: {
          title: '',
          priority: 'medium',
          assignedTo: ''
        },
        delay: 0,
        description: 'Create task'
      }
    },
    {
      type: 'action',
      subType: 'calculate-score',
      label: 'Calculate Score',
      icon: 'Target',
      description: 'Recalculate lead score',
      defaultData: {
        type: 'calculate-score',
        parameters: {},
        delay: 0,
        description: 'Calculate lead score'
      }
    },
    {
      type: 'action',
      subType: 'assign-territory',
      label: 'Assign Territory',
      icon: 'UserPlus',
      description: 'Auto-assign to territory',
      defaultData: {
        type: 'assign-territory',
        parameters: {},
        delay: 0,
        description: 'Auto-assign to territory'
      }
    }
  ]
};

// Icon mapping
const ICON_MAP = {
  UserPlus,
  GitBranch,
  Target,
  Clock,
  Filter,
  Mail,
  CheckSquare,
  Zap
};

// Draggable Node Template
const DraggableNodeTemplate = ({ template, onDragStart }) => {
  const IconComponent = ICON_MAP[template.icon] || Zap;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
      <div>
        <div className="font-medium text-sm text-gray-900">{template.label}</div>
        <div className="text-xs text-gray-500">{template.description}</div>
      </div>
    </div>
  );
};

// Workflow Node Component
const WorkflowNode = ({ node, isSelected, onSelect, onDelete, onEdit }) => {
  const IconComponent = ICON_MAP[node.data.icon] || Zap;
  
  const getNodeColor = (type) => {
    switch (type) {
      case 'trigger': return 'bg-green-50 border-green-200 text-green-800';
      case 'condition': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'action': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`absolute p-4 rounded-lg border-2 cursor-pointer transition-all min-w-[200px] ${
        getNodeColor(node.type)
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ left: node.position.x, top: node.position.y }}
      onClick={() => onSelect(node.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <IconComponent className="w-4 h-4 mr-2" />
          <span className="font-medium text-sm">{node.type.toUpperCase()}</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1 hover:bg-white rounded"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1 hover:bg-white rounded text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-sm font-medium">{node.data.description || 'Untitled'}</div>
      {node.data.parameters && (
        <div className="text-xs mt-1 opacity-75">
          {Object.keys(node.data.parameters).length} parameters
        </div>
      )}
    </div>
  );
};

// Node Configuration Modal
const NodeConfigModal = ({ node, isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState(node?.data || {});

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  if (!node) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure ${node.type}`} className="max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={config.description || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {node.type === 'trigger' && config.type === 'score-threshold' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Threshold
            </label>
            <input
              type="number"
              value={config.conditions?.threshold || 80}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                conditions: { ...prev.conditions, threshold: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {node.type === 'condition' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field
              </label>
              <input
                type="text"
                value={config.field || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, field: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={config.value || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {node.type === 'action' && config.type === 'send-email' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Template
              </label>
              <select
                value={config.parameters?.template || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, template: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select template</option>
                <option value="welcome-email">Welcome Email</option>
                <option value="interview-reminder">Interview Reminder</option>
                <option value="status-update">Status Update</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={config.parameters?.subject || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, subject: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {node.type === 'action' && config.type === 'create-task' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={config.parameters?.title || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, title: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={config.parameters?.priority || 'medium'}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, priority: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </>
        )}

        {node.type === 'action' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delay (minutes)
            </label>
            <input
              type="number"
              value={config.delay || 0}
              onChange={(e) => setConfig(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Configuration
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Main Workflow Builder Component
const WorkflowBuilder = ({ workflow, onSave, onClose }) => {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [connections, setConnections] = useState(workflow?.connections || []);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configNode, setConfigNode] = useState(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [isActive, setIsActive] = useState(workflow?.isActive ?? true);
  const canvasRef = useRef(null);

  const handleDragStart = (e, template) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const template = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = canvasRef.current.getBoundingClientRect();
    
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      position: {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 50
      },
      data: { ...template.defaultData, icon: template.icon },
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNodeSelect = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const handleNodeEdit = (node) => {
    setConfigNode(node);
    setConfigModalOpen(true);
  };

  const handleNodeConfigSave = (nodeId, config) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, data: config } : node
    ));
  };

  const handleSaveWorkflow = () => {
    const workflowData = {
      id: workflow?.id || `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: workflowName,
      description: workflowDescription,
      isActive,
      nodes,
      connections,
      trigger: nodes.find(n => n.type === 'trigger')?.data || {},
      conditions: nodes.filter(n => n.type === 'condition').map(n => n.data),
      actions: nodes.filter(n => n.type === 'action').map(n => n.data)
    };

    onSave(workflowData);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Node Templates */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Builder</h3>
          <p className="text-sm text-gray-600">Drag components to canvas</p>
        </div>

        {/* Workflow Settings */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Workflow Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Describe this workflow"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Triggers</h4>
          <div className="space-y-2">
            {NODE_TEMPLATES.triggers.map(template => (
              <DraggableNodeTemplate
                key={template.subType}
                template={template}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Conditions</h4>
          <div className="space-y-2">
            {NODE_TEMPLATES.conditions.map(template => (
              <DraggableNodeTemplate
                key={template.subType}
                template={template}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
          <div className="space-y-2">
            {NODE_TEMPLATES.actions.map(template => (
              <DraggableNodeTemplate
                key={template.subType}
                template={template}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSaveWorkflow}
                icon={<Save className="w-4 h-4" />}
                disabled={!workflowName || nodes.length === 0}
              >
                Save Workflow
              </Button>
              <Button
                variant="outline"
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
              <Button
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
              >
                Import
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {nodes.length} nodes
              </span>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-50 relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Drop Zone Message */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Grip className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Drag components here to build your workflow</p>
                  <p className="text-sm">Start with a trigger, add conditions, then actions</p>
                </div>
              </div>
            )}

            {/* Workflow Nodes */}
            {nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={handleNodeSelect}
                onDelete={handleNodeDelete}
                onEdit={handleNodeEdit}
              />
            ))}

            {/* Connection Lines */}
            {connections.map(connection => {
              const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
              const targetNode = nodes.find(n => n.id === connection.targetNodeId);
              
              if (!sourceNode || !targetNode) return null;

              return (
                <svg
                  key={connection.id}
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <line
                    x1={sourceNode.position.x + 100}
                    y1={sourceNode.position.y + 50}
                    x2={targetNode.position.x + 100}
                    y2={targetNode.position.y + 50}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#3B82F6"
                      />
                    </marker>
                  </defs>
                </svg>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Configuration Modal */}
      <NodeConfigModal
        node={configNode}
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onSave={handleNodeConfigSave}
      />
    </div>
  );
};

export default WorkflowBuilder;