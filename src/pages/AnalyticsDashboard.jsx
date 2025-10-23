import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Banknote,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Share2,
  Settings,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PieChart,
  LineChart,
  Activity,
  Clock,
  MapPin,
  Briefcase,
  Star,
  Zap,
  Phone,
  Mail,
  FileText,
  Award,
  Globe,
  Percent,
  Timer,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

const AnalyticsDashboard = () => {
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 18500000, // ₹1.85 Cr
      revenueChange: 12.5,
      totalDeals: 156,
      dealsChange: 8.3,
      conversionRate: 24.8,
      conversionChange: -2.1,
      avgDealSize: 118590, // ₹1.18L
      avgDealChange: 5.7
    },
    revenueChart: [
      { month: 'Jan', revenue: 1350000, deals: 12, target: 1500000 }, // ₹13.5L
      { month: 'Feb', revenue: 1650000, deals: 15, target: 1500000 }, // ₹16.5L
      { month: 'Mar', revenue: 1462500, deals: 13, target: 1500000 }, // ₹14.6L
      { month: 'Apr', revenue: 1800000, deals: 16, target: 1650000 }, // ₹18L
      { month: 'May', revenue: 2100000, deals: 18, target: 1650000 }, // ₹21L
      { month: 'Jun', revenue: 2325000, deals: 20, target: 1875000 }  // ₹23.25L
    ],
    pipelineData: [
      { stage: 'Lead', count: 45, value: 5062500, conversion: 68 },      // ₹50.6L
      { stage: 'Qualified', count: 32, value: 3600000, conversion: 75 }, // ₹36L
      { stage: 'Proposal', count: 18, value: 2025000, conversion: 61 },  // ₹20.25L
      { stage: 'Negotiation', count: 12, value: 1350000, conversion: 83 }, // ₹13.5L
      { stage: 'Closed Won', count: 8, value: 900000, conversion: 100 }   // ₹9L
    ],
    topPerformers: [
      { id: 1, name: 'Priya Sharma', revenue: 3637500, deals: 23, conversion: 28.5, avatar: null }, // ₹36.4L
      { id: 2, name: 'Arjun Patel', revenue: 3150000, deals: 19, conversion: 31.2, avatar: null },  // ₹31.5L
      { id: 3, name: 'Sneha Reddy', revenue: 2850000, deals: 18, conversion: 26.8, avatar: null },  // ₹28.5L
      { id: 4, name: 'Vikram Singh', revenue: 2625000, deals: 16, conversion: 24.1, avatar: null }, // ₹26.25L
      { id: 5, name: 'Kavya Nair', revenue: 2212500, deals: 14, conversion: 22.9, avatar: null }   // ₹22.1L
    ],
    activityMetrics: {
      totalCalls: 1248,
      callsChange: 15.3,
      totalEmails: 3456,
      emailsChange: 8.7,
      totalMeetings: 234,
      meetingsChange: 12.1,
      responseRate: 68.5,
      responseChange: -3.2
    },
    geographicData: [
      { region: 'North America', revenue: 1200000, deals: 68, percentage: 49 },
      { region: 'Europe', revenue: 750000, deals: 42, percentage: 31 },
      { region: 'Asia Pacific', revenue: 350000, deals: 28, percentage: 14 },
      { region: 'Latin America', revenue: 150000, deals: 18, percentage: 6 }
    ],
    industryBreakdown: [
      { industry: 'Technology', revenue: 980000, deals: 45, growth: 18.5 },
      { industry: 'Healthcare', revenue: 650000, deals: 32, growth: 12.3 },
      { industry: 'Finance', revenue: 420000, deals: 28, growth: 8.7 },
      { industry: 'Manufacturing', revenue: 280000, deals: 22, growth: 15.2 },
      { industry: 'Retail', revenue: 120000, deals: 15, growth: -5.1 }
    ]
  });

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdated(new Date());
      showToast('success', 'Analytics data refreshed successfully');
    } catch (error) {
      showToast('error', 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data
  const handleExport = () => {
    showToast('info', 'Preparing analytics export...');
    // Simulate export
    setTimeout(() => {
      showToast('success', 'Analytics report exported successfully');
    }, 1500);
  };

  // Get trend icon and color
  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
              <p className="text-gray-600 text-base">
                Track performance, monitor KPIs, and gain insights into your sales operations
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  loading={isLoading}
                  disabled={isLoading}
                  size="sm"
                  className="border-gray-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExport} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Date Range:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {periods.map(period => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedPeriod === period.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="secondary" size="sm" className="border-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {formatCurrency(analyticsData.overview.totalRevenue)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${analyticsData.overview.revenueChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {getTrendIcon(analyticsData.overview.revenueChange)}
                  {formatPercentage(analyticsData.overview.revenueChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                vs previous period
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Deals Closed</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.overview.totalDeals.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${analyticsData.overview.dealsChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {getTrendIcon(analyticsData.overview.dealsChange)}
                  {formatPercentage(analyticsData.overview.dealsChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                vs previous period
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.overview.conversionRate}%
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${analyticsData.overview.conversionChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {getTrendIcon(analyticsData.overview.conversionChange)}
                  {formatPercentage(analyticsData.overview.conversionChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                vs previous period
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Deal Size</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {formatCurrency(analyticsData.overview.avgDealSize)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${analyticsData.overview.avgDealChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {getTrendIcon(analyticsData.overview.avgDealChange)}
                  {formatPercentage(analyticsData.overview.avgDealChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                vs previous period
              </div>
            </div>
          </Card>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Revenue Performance Chart */}
          <Card className="xl:col-span-2 bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Performance</h3>
                  <p className="text-sm text-gray-600 mt-1">Monthly revenue vs targets</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Actual</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">Target</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const maxRevenue = Math.max(...analyticsData.revenueChart.map(d => Math.max(d.revenue, d.target)));
                  return analyticsData.revenueChart.map((data, index) => (
                    <div key={data.month} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-900 w-12">{data.month}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Briefcase className="w-3 h-3" />
                          {data.deals} deals
                        </div>
                      </div>
                      <div className="relative" id="revenue-progress-container">
                        <div className="w-full bg-gray-200 rounded h-4" id="progress-track">
                          <div
                            id={`progress-bar-${data.month}`}
                            className="revenue-progress-bar bg-blue-500 h-4 rounded flex items-center justify-end pr-2"
                            style={{ width: `${Math.min((data.revenue / maxRevenue) * 100, 100)}%` }}
                          >
                            <span className="progress-percentage text-white text-xs font-medium">
                              {Math.round((data.revenue / data.target) * 100)}%
                            </span>
                          </div>
                          <div
                            className="progress-target absolute top-0 h-4 w-0.5 bg-gray-400"
                            style={{ left: `${Math.min((data.target / maxRevenue) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(analyticsData.revenueChart.reduce((sum, item) => sum + item.revenue, 0))}
                    </div>
                    <div className="text-xs text-gray-600">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {analyticsData.revenueChart.reduce((sum, item) => sum + item.deals, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Total Deals</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.round((analyticsData.revenueChart.reduce((sum, item) => sum + item.revenue, 0) /
                        analyticsData.revenueChart.reduce((sum, item) => sum + item.target, 0)) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Target Achievement</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sales Pipeline */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
                <p className="text-sm text-gray-600 mt-1">Deals by stage</p>
              </div>

              <div className="space-y-4">
                {analyticsData.pipelineData.map((stage, index) => (
                  <div key={stage.stage} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-orange-500' :
                              index === 2 ? 'bg-yellow-500' :
                                index === 3 ? 'bg-blue-500' :
                                  'bg-green-500'
                          }`}></div>
                        <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                      </div>
                      <span className="text-xs text-gray-500">{stage.count} deals</span>
                    </div>
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className={`h-2 rounded ${index === 0 ? 'bg-red-500' :
                              index === 1 ? 'bg-orange-500' :
                                index === 2 ? 'bg-yellow-500' :
                                  index === 3 ? 'bg-blue-500' :
                                    'bg-green-500'
                            }`}
                          style={{ width: `${stage.conversion}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{formatCurrency(stage.value)}</span>
                      <span className="font-medium text-gray-900">{stage.conversion}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(analyticsData.pipelineData.reduce((sum, stage) => sum + stage.value, 0))}
                </div>
                <div className="text-xs text-gray-600">Total Pipeline Value</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Performance & Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Top Sales Reps */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Sales Reps</h3>
                  <p className="text-sm text-gray-600 mt-1">Performance leaderboard</p>
                </div>
                <Button variant="secondary" size="sm" className="border-gray-300">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {analyticsData.topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-500' :
                              'bg-blue-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{performer.name}</div>
                        <div className="text-sm text-gray-600">
                          {performer.deals} deals • {performer.conversion}% win rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(performer.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Sales Activities */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Activities</h3>
                <p className="text-sm text-gray-600 mt-1">Team engagement metrics</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Calls Made</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {analyticsData.activityMetrics.totalCalls.toLocaleString()}
                  </div>
                  <div className={`text-sm ${getTrendColor(analyticsData.activityMetrics.callsChange)}`}>
                    {formatPercentage(analyticsData.activityMetrics.callsChange)} from last month
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Emails Sent</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {analyticsData.activityMetrics.totalEmails.toLocaleString()}
                  </div>
                  <div className={`text-sm ${getTrendColor(analyticsData.activityMetrics.emailsChange)}`}>
                    {formatPercentage(analyticsData.activityMetrics.emailsChange)} from last month
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Meetings</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {analyticsData.activityMetrics.totalMeetings.toLocaleString()}
                  </div>
                  <div className={`text-sm ${getTrendColor(analyticsData.activityMetrics.meetingsChange)}`}>
                    {formatPercentage(analyticsData.activityMetrics.meetingsChange)} from last month
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Response Rate</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {analyticsData.activityMetrics.responseRate}%
                  </div>
                  <div className={`text-sm ${getTrendColor(analyticsData.activityMetrics.responseChange)}`}>
                    {formatPercentage(analyticsData.activityMetrics.responseChange)} from last month
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Geographic & Industry Analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Geographic Performance */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Performance</h3>
                <p className="text-sm text-gray-600 mt-1">Revenue distribution by region</p>
              </div>

              <div className="space-y-4">
                {analyticsData.geographicData.map((region, index) => (
                  <div key={region.region} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-purple-500' :
                                'bg-orange-500'
                          }`}></div>
                        <div>
                          <span className="font-medium text-gray-900">{region.region}</span>
                          <div className="text-xs text-gray-500">{region.deals} deals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(region.revenue)}</div>
                        <div className="text-xs text-gray-500">{region.percentage}% of total</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={`h-2 rounded ${index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-purple-500' :
                                'bg-orange-500'
                          }`}
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(analyticsData.geographicData.reduce((sum, region) => sum + region.revenue, 0))}
                    </div>
                    <div className="text-xs text-gray-600">Global Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {analyticsData.geographicData.reduce((sum, region) => sum + region.deals, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Total Deals</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Industry Analysis */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Industry Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">Performance by industry vertical</p>
              </div>

              <div className="space-y-4">
                {analyticsData.industryBreakdown.map((industry, index) => (
                  <div key={industry.industry} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-indigo-100' :
                            index === 1 ? 'bg-teal-100' :
                              index === 2 ? 'bg-rose-100' :
                                index === 3 ? 'bg-amber-100' :
                                  'bg-slate-100'
                          }`}>
                          <Briefcase className={`w-4 h-4 ${index === 0 ? 'text-indigo-600' :
                              index === 1 ? 'text-teal-600' :
                                index === 2 ? 'text-rose-600' :
                                  index === 3 ? 'text-amber-600' :
                                    'text-slate-600'
                            }`} />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{industry.industry}</span>
                          <div className="text-xs text-gray-500">{industry.deals} deals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(industry.revenue)}</div>
                        <div className={`text-xs flex items-center gap-1 ${getTrendColor(industry.growth)}`}>
                          {getTrendIcon(industry.growth)}
                          {formatPercentage(industry.growth)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={`h-2 rounded ${index === 0 ? 'bg-indigo-500' :
                            index === 1 ? 'bg-teal-500' :
                              index === 2 ? 'bg-rose-500' :
                                index === 3 ? 'bg-amber-500' :
                                  'bg-slate-500'
                          }`}
                        style={{ width: `${(industry.revenue / 1000000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;