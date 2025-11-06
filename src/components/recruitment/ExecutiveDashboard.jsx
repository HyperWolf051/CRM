import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Users,
  DollarSign,
  Clock,
  Briefcase,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  Filter,
  Calendar,
  Globe,
  Zap
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BarChart, LineChart } from '@/components/ui/Chart';
import { formatCurrency, formatPercentage, formatIndianCurrency } from '@/utils/formatters';

const ExecutiveDashboard = ({ 
  kpis = [], 
  goals = [], 
  forecasts = [], 
  benchmarks = [],
  timeRange = '1y',
  onExport = () => {} 
}) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Default executive KPIs if none provided
  const defaultKPIs = [
    {
      id: 'total-placements',
      title: 'Total Placements',
      value: 156,
      change: 12.5,
      target: 180,
      unit: 'placements',
      icon: Users,
      color: 'blue',
      priority: 'high'
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: 2850000,
      change: 15.2,
      target: 3500000,
      unit: 'currency',
      icon: DollarSign,
      color: 'green',
      priority: 'high'
    },
    {
      id: 'time-to-hire',
      title: 'Avg Time to Hire',
      value: 18.5,
      change: -8.3,
      target: 15,
      unit: 'days',
      icon: Clock,
      color: 'orange',
      priority: 'medium'
    },
    {
      id: 'success-rate',
      title: 'Placement Success Rate',
      value: 68.2,
      change: 5.7,
      target: 75,
      unit: 'percentage',
      icon: Target,
      color: 'purple',
      priority: 'high'
    },
    {
      id: 'client-satisfaction',
      title: 'Client Satisfaction',
      value: 4.6,
      change: 0.3,
      target: 4.8,
      unit: 'rating',
      icon: Star,
      color: 'yellow',
      priority: 'medium'
    },
    {
      id: 'cost-per-hire',
      title: 'Cost per Hire',
      value: 18500,
      change: -12.1,
      target: 15000,
      unit: 'currency',
      icon: Briefcase,
      color: 'red',
      priority: 'medium'
    }
  ];

  // Default goals if none provided
  const defaultGoals = [
    {
      id: 'q4-placements',
      title: 'Q4 Placement Target',
      current: 78,
      target: 100,
      deadline: '2024-12-31',
      progress: 78,
      status: 'on-track'
    },
    {
      id: 'annual-revenue',
      title: 'Annual Revenue Goal',
      current: 8200000,
      target: 10000000,
      deadline: '2024-12-31',
      progress: 82,
      status: 'on-track'
    },
    {
      id: 'client-retention',
      title: 'Client Retention Rate',
      current: 89.3,
      target: 95,
      deadline: '2024-12-31',
      progress: 94,
      status: 'ahead'
    }
  ];

  // Default forecasts if none provided
  const defaultForecasts = [
    {
      period: 'Q4 2024',
      metric: 'Placements',
      predicted: 32,
      confidence: 85,
      trend: 'up'
    },
    {
      period: 'Q1 2025',
      metric: 'Revenue',
      predicted: 3200000,
      confidence: 78,
      trend: 'up'
    },
    {
      period: '2025',
      metric: 'Market Share',
      predicted: 12.5,
      confidence: 72,
      trend: 'up'
    }
  ];

  const activeKPIs = kpis.length > 0 ? kpis : defaultKPIs;
  const activeGoals = goals.length > 0 ? goals : defaultGoals;
  const activeForecasts = forecasts.length > 0 ? forecasts : defaultForecasts;

  const getKPIColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  const formatKPIValue = (value, unit) => {
    switch (unit) {
      case 'currency':
        return formatIndianCurrency(value);
      case 'percentage':
        return `${value}%`;
      case 'rating':
        return `${value}/5`;
      case 'days':
        return `${value} days`;
      default:
        return value.toLocaleString();
    }
  };

  const getGoalStatus = (status) => {
    const statuses = {
      'ahead': { color: 'bg-green-50 text-green-700', label: 'Ahead of Target' },
      'on-track': { color: 'bg-blue-50 text-blue-700', label: 'On Track' },
      'behind': { color: 'bg-red-50 text-red-700', label: 'Behind Target' },
      'at-risk': { color: 'bg-yellow-50 text-yellow-700', label: 'At Risk' }
    };
    return statuses[status] || statuses['on-track'];
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Dashboard</h2>
          <p className="text-gray-600 mt-1">Strategic insights and performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'goals', 'forecasts'].map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  selectedView === view
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <Button onClick={onExport} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {selectedView === 'overview' && (
        <>
          {/* Executive KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {activeKPIs.map((kpi) => {
              const IconComponent = kpi.icon;
              const progressPercentage = (kpi.value / kpi.target) * 100;
              
              return (
                <Card key={kpi.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getKPIColor(kpi.color)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                          <p className="text-2xl font-bold text-gray-900 truncate">
                            {formatKPIValue(kpi.value, kpi.unit)}
                          </p>
                        </div>
                      </div>
                      {kpi.change !== 0 && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                          kpi.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {getTrendIcon(kpi.change)}
                          {formatPercentage(Math.abs(kpi.change))}
                        </div>
                      )}
                    </div>
                    
                    {/* Progress to Target */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Target: {formatKPIValue(kpi.target, kpi.unit)}</span>
                        <span className={`font-medium ${
                          progressPercentage >= 100 ? 'text-green-600' :
                          progressPercentage >= 80 ? 'text-blue-600' :
                          progressPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className={`h-2 rounded ${
                            progressPercentage >= 100 ? 'bg-green-500' :
                            progressPercentage >= 80 ? 'bg-blue-500' :
                            progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Performance Trends */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                  <p className="text-sm text-gray-600 mt-1">Key metrics over time</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending Up
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Revenue Growth</h4>
                  <LineChart
                    data={[
                      { label: 'Q1', value: 2200000 },
                      { label: 'Q2', value: 2650000 },
                      { label: 'Q3', value: 2850000 },
                      { label: 'Q4', value: 3200000 }
                    ]}
                    height={200}
                    showTooltip={true}
                    animate={true}
                  />
                </div>

                {/* Placement Trend */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Placement Volume</h4>
                  <BarChart
                    data={[
                      { label: 'Q1', value: 35 },
                      { label: 'Q2', value: 42 },
                      { label: 'Q3', value: 38 },
                      { label: 'Q4', value: 45 }
                    ]}
                    height={200}
                    showTooltip={true}
                    animate={true}
                  />
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'goals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeGoals.map((goal) => {
            const statusInfo = getGoalStatus(goal.status);
            const progressPercentage = (goal.current / goal.target) * 100;
            
            return (
              <Card key={goal.id} className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {typeof goal.current === 'number' && goal.current > 1000000 
                          ? formatIndianCurrency(goal.current)
                          : goal.current
                        } / {typeof goal.target === 'number' && goal.target > 1000000 
                          ? formatIndianCurrency(goal.target)
                          : goal.target
                        }
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded h-3">
                        <div
                          className={`h-3 rounded ${
                            goal.status === 'ahead' ? 'bg-green-500' :
                            goal.status === 'on-track' ? 'bg-blue-500' :
                            goal.status === 'behind' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{Math.round(progressPercentage)}% complete</span>
                        <span className={`font-medium ${
                          goal.status === 'ahead' ? 'text-green-600' :
                          goal.status === 'on-track' ? 'text-blue-600' :
                          goal.status === 'behind' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {goal.status === 'ahead' ? 'Exceeding target' :
                           goal.status === 'on-track' ? 'On track' :
                           goal.status === 'behind' ? 'Behind schedule' : 'Needs attention'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedView === 'forecasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeForecasts.map((forecast, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{forecast.metric}</h4>
                    <p className="text-sm text-gray-600 mt-1">{forecast.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {forecast.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <Badge variant="secondary" className={`${
                      forecast.confidence >= 80 ? 'bg-green-50 text-green-700' :
                      forecast.confidence >= 70 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {forecast.confidence}% confidence
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {typeof forecast.predicted === 'number' && forecast.predicted > 1000000 
                        ? formatIndianCurrency(forecast.predicted)
                        : forecast.predicted
                      }
                    </div>
                    <div className="text-sm text-gray-600">Predicted Value</div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">AI-powered forecast</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;