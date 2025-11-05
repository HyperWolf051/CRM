import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { workflowAutomationService } from '@/services/workflowAutomationService';

// Execution Status Badge
const ExecutionStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' };
      case 'running':
        return { icon: Play, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
      default:
        return { icon: AlertTriangle, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Workflow Performance Card
const WorkflowPerformanceCard = ({ workflow, analytics }) => {
  const successRate = analytics ? 
    (analytics.successfulExecutions / analytics.totalExecutions) * 100 : 0;
  
  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
          <p className="text-sm text-gray-500">{workflow.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {workflow.isActive ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-800 bg-green-100">
              <Play className="w-3 h-3 mr-1" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
              <Pause className="w-3 h-3 mr-1" />
              Inactive
            </span>
          )}
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalExecutions}</div>
            <div className="text-sm text-gray-500">Total Executions</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(successRate)}`}>
              {Math.round(successRate)}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.successfulExecutions}</div>
            <div className="text-sm text-gray-500">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{analytics.failedExecutions}</div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Avg. Execution Time</span>
        <span>{analytics ? Math.round(analytics.averageExecutionTime / 1000) : 0}s</span>
      </div>
      
      {workflow.lastExecuted && (
        <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
          <span>Last Executed</span>
          <span>{new Date(workflow.lastExecuted).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

// Execution History Table
const ExecutionHistoryTable = ({ executions, onRefresh }) => {
  const [filteredExecutions, setFilteredExecutions] = useState(executions);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    let filtered = executions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exec => exec.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(exec => new Date(exec.startedAt) >= filterDate);
    }

    setFilteredExecutions(filtered);
  }, [executions, statusFilter, dateFilter]);

  const formatDuration = (startedAt, completedAt) => {
    if (!completedAt) return 'Running...';
    const duration = new Date(completedAt) - new Date(startedAt);
    return `${Math.round(duration / 1000)}s`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredExecutions.length} of {executions.length} executions
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Execution ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workflow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExecutions.map(execution => (
              <tr key={execution.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {execution.id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Workflow {execution.workflowId.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExecutionStatusBadge status={execution.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(execution.startedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(execution.startedAt, execution.completedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">
                      {execution.executedActions.length} actions
                    </span>
                    {execution.error && (
                      <span className="text-xs text-red-600" title={execution.error}>
                        Error
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExecutions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No executions found</p>
        </div>
      )}
    </div>
  );
};

// Action Performance Chart
const ActionPerformanceChart = ({ actionPerformance }) => {
  if (!actionPerformance || actionPerformance.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Performance</h3>
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No action performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Performance</h3>
      
      <div className="space-y-4">
        {actionPerformance.map((action, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {action.actionType.replace('-', ' ')}
                </div>
                <div className="text-sm text-gray-500">
                  {action.totalExecutions} executions
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    action.successRate >= 90 ? 'text-green-600' :
                    action.successRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(action.successRate)}%
                  </div>
                  <div className="text-xs text-gray-500">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(action.averageExecutionTime)}ms
                  </div>
                  <div className="text-xs text-gray-500">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {Math.round(action.errorRate)}%
                  </div>
                  <div className="text-xs text-gray-500">Error Rate</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Execution Timeline Chart
const ExecutionTimelineChart = ({ executionsByDay }) => {
  if (!executionsByDay || executionsByDay.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Timeline</h3>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No timeline data available</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...executionsByDay.map(d => d.count));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Timeline</h3>
      
      <div className="space-y-2">
        {executionsByDay.slice(-14).map((day, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">
              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(day.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm text-gray-900 text-right">
              {day.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Workflow Analytics Component
const WorkflowAnalytics = () => {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load workflows
      const workflowsData = await workflowAutomationService.getAllWorkflows();
      setWorkflows(workflowsData);

      // Load executions (mock data)
      const mockExecutions = [
        {
          id: 'exec_1',
          workflowId: 'workflow_1',
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000),
          completedAt: new Date(Date.now() - 3500000),
          executedActions: [
            { actionId: 'action_1', actionType: 'send-email', status: 'completed' },
            { actionId: 'action_2', actionType: 'calculate-score', status: 'completed' }
          ]
        },
        {
          id: 'exec_2',
          workflowId: 'workflow_1',
          status: 'failed',
          startedAt: new Date(Date.now() - 7200000),
          completedAt: new Date(Date.now() - 7100000),
          executedActions: [
            { actionId: 'action_1', actionType: 'send-email', status: 'failed' }
          ],
          error: 'Email service unavailable'
        },
        {
          id: 'exec_3',
          workflowId: 'workflow_2',
          status: 'completed',
          startedAt: new Date(Date.now() - 1800000),
          completedAt: new Date(Date.now() - 1700000),
          executedActions: [
            { actionId: 'action_4', actionType: 'create-task', status: 'completed' },
            { actionId: 'action_5', actionType: 'send-email', status: 'completed' }
          ]
        }
      ];
      setExecutions(mockExecutions);

      // Load analytics for each workflow
      const analyticsData = {};
      for (const workflow of workflowsData) {
        const workflowAnalytics = await workflowAutomationService.getWorkflowAnalytics(workflow.id);
        analyticsData[workflow.id] = workflowAnalytics;
      }
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading workflow analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExecutions = selectedWorkflowId === 'all' 
    ? executions 
    : executions.filter(exec => exec.workflowId === selectedWorkflowId);

  const selectedAnalytics = selectedWorkflowId === 'all' 
    ? null 
    : analytics[selectedWorkflowId];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Analytics</h2>
          <p className="text-gray-600">Monitor workflow performance and execution history</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedWorkflowId}
            onChange={(e) => setSelectedWorkflowId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Workflows</option>
            {workflows.map(workflow => (
              <option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </select>
          <Button
            onClick={loadData}
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Workflow Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map(workflow => (
          <WorkflowPerformanceCard
            key={workflow.id}
            workflow={workflow}
            analytics={analytics[workflow.id]}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExecutionTimelineChart 
          executionsByDay={selectedAnalytics?.executionsByDay || []} 
        />
        <ActionPerformanceChart 
          actionPerformance={selectedAnalytics?.actionPerformance || []} 
        />
      </div>

      {/* Execution History */}
      <ExecutionHistoryTable 
        executions={filteredExecutions}
        onRefresh={loadData}
      />
    </div>
  );
};

export default WorkflowAnalytics;