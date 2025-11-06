import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Globe,
  Briefcase,
  Timer,
  Percent
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LineChart, BarChart, PieChart as PieChartComponent, ChartControls } from '@/components/ui/Chart';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatPercentage, formatNumber, formatIndianCurrency } from '@/utils/formatters';

const RecruiterAdvancedAnalytics = () => {
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('placement-success');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Advanced analytics data
  const [analyticsData, setAnalyticsData] = useState({
    // Executive KPIs
    executiveKPIs: {
      totalPlacements: 156,
      placementsChange: 12.5,
      avgTimeToHire: 18.5, // days
      timeToHireChange: -8.3,
      placementSuccessRate: 68.2, // percentage
      successRateChange: 5.7,
      totalRevenue: 2850000, // ₹28.5L
      revenueChange: 15.2,
      costPerHire: 18500, // ₹18.5K
      costPerHireChange: -12.1,
      clientSatisfaction: 4.6, // out of 5
      satisfactionChange: 0.3
    },

    // Predictive Analytics
    predictiveInsights: {
      placementForecast: [
        { month: 'Jan', predicted: 22, actual: 20, confidence: 85 },
        { month: 'Feb', predicted: 25, actual: 23, confidence: 88 },
        { month: 'Mar', predicted: 28, actual: 26, confidence: 82 },
        { month: 'Apr', predicted: 32, actual: null, confidence: 79 },
        { month: 'May', predicted: 35, actual: null, confidence: 76 },
        { month: 'Jun', predicted: 38, actual: null, confidence: 73 }
      ],
      timeToHireTrend: [
        { period: 'Q1 2024', avgDays: 22.3, predicted: 20.1 },
        { period: 'Q2 2024', avgDays: 19.8, predicted: 18.5 },
        { period: 'Q3 2024', avgDays: 18.5, predicted: 17.2 },
        { period: 'Q4 2024', avgDays: null, predicted: 16.8 }
      ],
      successRateProjection: {
        current: 68.2,
        projected3Months: 72.5,
        projected6Months: 75.8,
        confidenceLevel: 82
      }
    },

    // Industry Benchmarking
    industryBenchmarks: {
      placementRate: {
        ourRate: 68.2,
        industryAvg: 62.5,
        topPerformers: 78.3,
        bottomQuartile: 45.2
      },
      timeToHire: {
        ourTime: 18.5,
        industryAvg: 24.2,
        topPerformers: 15.8,
        bottomQuartile: 32.1
      },
      costPerHire: {
        ourCost: 18500,
        industryAvg: 22300,
        topPerformers: 16200,
        bottomQuartile: 28900
      },
      clientRetention: {
        ourRate: 89.3,
        industryAvg: 82.7,
        topPerformers: 94.1,
        bottomQuartile: 71.5
      }
    },

    // Goal Tracking
    goalTracking: {
      monthlyTargets: {
        placements: { target: 35, achieved: 28, progress: 80 },
        revenue: { target: 3500000, achieved: 2850000, progress: 81.4 },
        newClients: { target: 8, achieved: 6, progress: 75 },
        candidateRegistrations: { target: 250, achieved: 312, progress: 124.8 }
      },
      quarterlyTargets: {
        placements: { target: 100, achieved: 78, progress: 78 },
        revenue: { target: 10000000, achieved: 8200000, progress: 82 },
        clientSatisfaction: { target: 4.5, achieved: 4.6, progress: 102.2 },
        teamProductivity: { target: 85, achieved: 88.3, progress: 103.9 }
      }
    },

    // ROI Analysis
    roiAnalysis: {
      totalInvestment: 1250000, // ₹12.5L
      totalRevenue: 2850000, // ₹28.5L
      netProfit: 1600000, // ₹16L
      roi: 128, // percentage
      costBreakdown: [
        { category: 'Salaries', amount: 850000, percentage: 68 },
        { category: 'Technology', amount: 180000, percentage: 14.4 },
        { category: 'Marketing', amount: 120000, percentage: 9.6 },
        { category: 'Operations', amount: 100000, percentage: 8 }
      ],
      revenueStreams: [
        { source: 'Permanent Placements', amount: 2280000, percentage: 80 },
        { source: 'Contract Staffing', amount: 456000, percentage: 16 },
        { source: 'Consulting', amount: 114000, percentage: 4 }
      ]
    },

    // Team Performance Analytics
    teamPerformance: [
      { 
        name: 'Priya Sharma', 
        placements: 23, 
        revenue: 575000, 
        successRate: 72.5, 
        avgTimeToHire: 16.2,
        clientRating: 4.8,
        trend: 'up'
      },
      { 
        name: 'Arjun Patel', 
        placements: 19, 
        revenue: 475000, 
        successRate: 68.9, 
        avgTimeToHire: 18.1,
        clientRating: 4.6,
        trend: 'up'
      },
      { 
        name: 'Sneha Reddy', 
        placements: 18, 
        revenue: 450000, 
        successRate: 66.7, 
        avgTimeToHire: 19.3,
        clientRating: 4.5,
        trend: 'stable'
      },
      { 
        name: 'Vikram Singh', 
        placements: 16, 
        revenue: 400000, 
        successRate: 64.2, 
        avgTimeToHire: 20.8,
        clientRating: 4.3,
        trend: 'down'
      }
    ],

    // Market Intelligence
    marketIntelligence: {
      salaryTrends: [
        { role: 'Software Engineer', avgSalary: 850000, growth: 12.5, demand: 'high' },
        { role: 'Data Scientist', avgSalary: 1200000, growth: 18.3, demand: 'very-high' },
        { role: 'Product Manager', avgSalary: 1500000, growth: 8.7, demand: 'high' },
        { role: 'DevOps Engineer', avgSalary: 950000, growth: 15.2, demand: 'high' },
        { role: 'UI/UX Designer', avgSalary: 650000, growth: 6.8, demand: 'medium' }
      ],
      skillDemand: [
        { skill: 'React/Node.js', demand: 95, growth: 22.1 },
        { skill: 'Python/AI/ML', demand: 88, growth: 28.5 },
        { skill: 'Cloud (AWS/Azure)', demand: 82, growth: 19.7 },
        { skill: 'Data Analytics', demand: 76, growth: 16.3 },
        { skill: 'Mobile Development', demand: 68, growth: 8.9 }
      ]
    }
  });

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' }
  ];

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdated(new Date());
      showToast('success', 'Advanced analytics refreshed successfully');
    } catch (error) {
      showToast('error', 'Failed to refresh analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data
  const handleExport = () => {
    showToast('info', 'Preparing executive analytics report...');
    setTimeout(() => {
      showToast('success', 'Executive report exported successfully');
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

  const getBenchmarkStatus = (ourValue, industryAvg, isHigherBetter = true) => {
    const diff = ((ourValue - industryAvg) / industryAvg) * 100;
    const isGood = isHigherBetter ? diff > 0 : diff < 0;
    return {
      status: isGood ? 'above' : 'below',
      difference: Math.abs(diff),
      color: isGood ? 'text-green-600' : 'text-red-600',
      bgColor: isGood ? 'bg-green-50' : 'bg-red-50',
      icon: isGood ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Executive Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics Dashboard</h1>
              <p className="text-gray-600 text-base">
                Executive insights, predictive analytics, and strategic recruitment intelligence
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

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Placements</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.executiveKPIs.totalPlacements}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.placementsChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.placementsChange)}
                  {formatPercentage(analyticsData.executiveKPIs.placementsChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Time to Hire</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.executiveKPIs.avgTimeToHire} days
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.timeToHireChange < 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.timeToHireChange)}
                  {formatPercentage(Math.abs(analyticsData.executiveKPIs.timeToHireChange))}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.executiveKPIs.placementSuccessRate}%
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.successRateChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.successRateChange)}
                  {formatPercentage(analyticsData.executiveKPIs.successRateChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {formatIndianCurrency(analyticsData.executiveKPIs.totalRevenue)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.revenueChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.revenueChange)}
                  {formatPercentage(analyticsData.executiveKPIs.revenueChange)}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Cost per Hire</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {formatIndianCurrency(analyticsData.executiveKPIs.costPerHire)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.costPerHireChange < 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.costPerHireChange)}
                  {formatPercentage(Math.abs(analyticsData.executiveKPIs.costPerHireChange))}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Client Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">
                      {analyticsData.executiveKPIs.clientSatisfaction}/5
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  analyticsData.executiveKPIs.satisfactionChange > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {getTrendIcon(analyticsData.executiveKPIs.satisfactionChange)}
                  +{analyticsData.executiveKPIs.satisfactionChange}
                </div>
              </div>
              <div className="text-xs text-gray-500">vs previous period</div>
            </div>
          </Card>
        </div>    
    {/* Predictive Analytics & Forecasting */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Placement Forecast */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Placement Forecast</h3>
                  <p className="text-sm text-gray-600 mt-1">Predictive insights with confidence levels</p>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  AI Powered
                </Badge>
              </div>

              <div className="space-y-4">
                {analyticsData.predictiveInsights.placementForecast.map((item, index) => (
                  <div key={item.month} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900 w-12">{item.month}</span>
                        <div className="flex items-center gap-3">
                          {item.actual !== null ? (
                            <>
                              <span className="text-sm text-gray-600">Actual: {item.actual}</span>
                              <span className="text-sm text-blue-600">Predicted: {item.predicted}</span>
                            </>
                          ) : (
                            <span className="text-sm text-blue-600">Forecast: {item.predicted}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          item.confidence >= 80 ? 'bg-green-500' : 
                          item.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-gray-500">{item.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded h-3">
                        {item.actual !== null && (
                          <div
                            className="bg-gray-400 h-3 rounded"
                            style={{ width: `${(item.actual / 40) * 100}%` }}
                          />
                        )}
                        <div
                          className="bg-blue-500 h-3 rounded absolute top-0"
                          style={{ 
                            width: `${(item.predicted / 40) * 100}%`,
                            opacity: item.actual !== null ? 0.7 : 1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {analyticsData.predictiveInsights.successRateProjection.projected6Months}%
                    </div>
                    <div className="text-xs text-gray-600">Projected Success Rate (6M)</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {analyticsData.predictiveInsights.successRateProjection.confidenceLevel}%
                    </div>
                    <div className="text-xs text-gray-600">Model Confidence</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Time to Hire Trend */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Time to Hire Optimization</h3>
                  <p className="text-sm text-gray-600 mt-1">Quarterly trends and predictions</p>
                </div>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                  Trending Down
                </Badge>
              </div>

              <div className="space-y-4">
                {analyticsData.predictiveInsights.timeToHireTrend.map((item, index) => (
                  <div key={item.period} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.period}</span>
                      <div className="flex items-center gap-3 text-sm">
                        {item.avgDays && (
                          <span className="text-gray-600">Actual: {item.avgDays} days</span>
                        )}
                        <span className="text-orange-600">Target: {item.predicted} days</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded h-3">
                        {item.avgDays && (
                          <div
                            className="bg-gray-400 h-3 rounded"
                            style={{ width: `${(item.avgDays / 35) * 100}%` }}
                          />
                        )}
                        <div
                          className="bg-orange-500 h-3 rounded absolute top-0"
                          style={{ 
                            width: `${(item.predicted / 35) * 100}%`,
                            opacity: item.avgDays ? 0.7 : 1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    16.8 days
                  </div>
                  <div className="text-xs text-gray-600">Projected Q4 2024 Average</div>
                  <div className="text-xs text-green-600 mt-1">
                    ↓ 24% improvement from Q1
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Industry Benchmarking */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Industry Benchmarking</h3>
                  <p className="text-sm text-gray-600 mt-1">Compare performance against industry standards</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Above Average
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Placement Rate Benchmark */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Placement Rate</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Our Rate</span>
                      <span className="font-semibold text-blue-600">
                        {analyticsData.industryBenchmarks.placementRate.ourRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-500">
                        {analyticsData.industryBenchmarks.placementRate.industryAvg}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Top Performers</span>
                      <span className="text-green-600">
                        {analyticsData.industryBenchmarks.placementRate.topPerformers}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const benchmark = getBenchmarkStatus(
                        analyticsData.industryBenchmarks.placementRate.ourRate,
                        analyticsData.industryBenchmarks.placementRate.industryAvg,
                        true
                      );
                      return (
                        <div className={`flex items-center gap-2 text-sm ${benchmark.color}`}>
                          {benchmark.icon}
                          <span>
                            {benchmark.difference.toFixed(1)}% {benchmark.status} industry avg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Time to Hire Benchmark */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Time to Hire</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Our Time</span>
                      <span className="font-semibold text-orange-600">
                        {analyticsData.industryBenchmarks.timeToHire.ourTime} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-500">
                        {analyticsData.industryBenchmarks.timeToHire.industryAvg} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Top Performers</span>
                      <span className="text-green-600">
                        {analyticsData.industryBenchmarks.timeToHire.topPerformers} days
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const benchmark = getBenchmarkStatus(
                        analyticsData.industryBenchmarks.timeToHire.ourTime,
                        analyticsData.industryBenchmarks.timeToHire.industryAvg,
                        false
                      );
                      return (
                        <div className={`flex items-center gap-2 text-sm ${benchmark.color}`}>
                          {benchmark.icon}
                          <span>
                            {benchmark.difference.toFixed(1)}% {benchmark.status === 'above' ? 'faster than' : 'slower than'} industry avg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Cost per Hire Benchmark */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Cost per Hire</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Our Cost</span>
                      <span className="font-semibold text-purple-600">
                        {formatIndianCurrency(analyticsData.industryBenchmarks.costPerHire.ourCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-500">
                        {formatIndianCurrency(analyticsData.industryBenchmarks.costPerHire.industryAvg)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Top Performers</span>
                      <span className="text-green-600">
                        {formatIndianCurrency(analyticsData.industryBenchmarks.costPerHire.topPerformers)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const benchmark = getBenchmarkStatus(
                        analyticsData.industryBenchmarks.costPerHire.ourCost,
                        analyticsData.industryBenchmarks.costPerHire.industryAvg,
                        false
                      );
                      return (
                        <div className={`flex items-center gap-2 text-sm ${benchmark.color}`}>
                          {benchmark.icon}
                          <span>
                            {benchmark.difference.toFixed(1)}% {benchmark.status === 'above' ? 'lower than' : 'higher than'} industry avg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Client Retention Benchmark */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Client Retention</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Our Rate</span>
                      <span className="font-semibold text-green-600">
                        {analyticsData.industryBenchmarks.clientRetention.ourRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-500">
                        {analyticsData.industryBenchmarks.clientRetention.industryAvg}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Top Performers</span>
                      <span className="text-green-600">
                        {analyticsData.industryBenchmarks.clientRetention.topPerformers}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const benchmark = getBenchmarkStatus(
                        analyticsData.industryBenchmarks.clientRetention.ourRate,
                        analyticsData.industryBenchmarks.clientRetention.industryAvg,
                        true
                      );
                      return (
                        <div className={`flex items-center gap-2 text-sm ${benchmark.color}`}>
                          {benchmark.icon}
                          <span>
                            {benchmark.difference.toFixed(1)}% {benchmark.status} industry avg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Goal Tracking & ROI Analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Goal Tracking */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Goal Tracking</h3>
                  <p className="text-sm text-gray-600 mt-1">Monthly and quarterly targets progress</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Monthly</Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Quarterly</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Monthly Targets</h4>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.goalTracking.monthlyTargets).map(([key, goal]) => (
                      <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {typeof goal.achieved === 'number' && goal.achieved > 1000000 
                                ? formatIndianCurrency(goal.achieved)
                                : goal.achieved
                              }
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              / {typeof goal.target === 'number' && goal.target > 1000000 
                                ? formatIndianCurrency(goal.target)
                                : goal.target
                              }
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded h-2">
                            <div
                              className={`h-2 rounded ${
                                goal.progress >= 100 ? 'bg-green-500' :
                                goal.progress >= 80 ? 'bg-blue-500' :
                                goal.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(goal.progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs font-medium ${
                              goal.progress >= 100 ? 'text-green-600' :
                              goal.progress >= 80 ? 'text-blue-600' :
                              goal.progress >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {goal.progress.toFixed(1)}%
                            </span>
                            {goal.progress >= 100 && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quarterly Targets</h4>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.goalTracking.quarterlyTargets).map(([key, goal]) => (
                      <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {typeof goal.achieved === 'number' && goal.achieved > 1000000 
                                ? formatIndianCurrency(goal.achieved)
                                : goal.achieved
                              }
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              / {typeof goal.target === 'number' && goal.target > 1000000 
                                ? formatIndianCurrency(goal.target)
                                : goal.target
                              }
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded h-2">
                            <div
                              className={`h-2 rounded ${
                                goal.progress >= 100 ? 'bg-green-500' :
                                goal.progress >= 80 ? 'bg-purple-500' :
                                goal.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(goal.progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs font-medium ${
                              goal.progress >= 100 ? 'text-green-600' :
                              goal.progress >= 80 ? 'text-purple-600' :
                              goal.progress >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {goal.progress.toFixed(1)}%
                            </span>
                            {goal.progress >= 100 && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ROI Analysis */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ROI Analysis</h3>
                  <p className="text-sm text-gray-600 mt-1">Cost breakdown and revenue analysis</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {analyticsData.roiAnalysis.roi}% ROI
                </Badge>
              </div>

              <div className="space-y-6">
                {/* ROI Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {formatIndianCurrency(analyticsData.roiAnalysis.totalInvestment)}
                    </div>
                    <div className="text-xs text-gray-600">Total Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatIndianCurrency(analyticsData.roiAnalysis.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {formatIndianCurrency(analyticsData.roiAnalysis.netProfit)}
                    </div>
                    <div className="text-xs text-gray-600">Net Profit</div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {analyticsData.roiAnalysis.costBreakdown.map((cost, index) => (
                      <div key={cost.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">{cost.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {formatIndianCurrency(cost.amount)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({cost.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Streams */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Revenue Streams</h4>
                  <div className="space-y-2">
                    {analyticsData.roiAnalysis.revenueStreams.map((stream, index) => (
                      <div key={stream.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-green-500' :
                            index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">{stream.source}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {formatIndianCurrency(stream.amount)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({stream.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Performance & Market Intelligence */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Team Performance Analytics */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Performance Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">Individual recruiter performance comparison</p>
                </div>
                <Button variant="secondary" size="sm" className="border-gray-300">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>

              <div className="space-y-4">
                {analyticsData.teamPerformance.map((member, index) => (
                  <div key={member.name} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{member.clientRating}/5 rating</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {member.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {member.trend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Placements</div>
                        <div className="font-semibold text-gray-900">{member.placements}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="font-semibold text-gray-900">
                          {formatIndianCurrency(member.revenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Success Rate</div>
                        <div className="font-semibold text-gray-900">{member.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Time to Hire</div>
                        <div className="font-semibold text-gray-900">{member.avgTimeToHire} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Market Intelligence */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
                  <p className="text-sm text-gray-600 mt-1">Salary trends and skill demand analysis</p>
                </div>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  Live Data
                </Badge>
              </div>

              <div className="space-y-6">
                {/* Salary Trends */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Salary Trends</h4>
                  <div className="space-y-3">
                    {analyticsData.marketIntelligence.salaryTrends.map((role, index) => (
                      <div key={role.role} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{role.role}</span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                role.demand === 'very-high' ? 'bg-red-50 text-red-700' :
                                role.demand === 'high' ? 'bg-orange-50 text-orange-700' :
                                'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              {role.demand.replace('-', ' ')} demand
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {formatIndianCurrency(role.avgSalary)} avg
                          </span>
                          <span className={`flex items-center gap-1 ${getTrendColor(role.growth)}`}>
                            {getTrendIcon(role.growth)}
                            {formatPercentage(role.growth)} growth
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Demand */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Skills in Demand</h4>
                  <div className="space-y-3">
                    {analyticsData.marketIntelligence.skillDemand.map((skill, index) => (
                      <div key={skill.skill} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                          <span className="text-sm font-semibold text-blue-600">{skill.demand}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded h-2 mr-3">
                            <div
                              className="bg-blue-500 h-2 rounded"
                              style={{ width: `${skill.demand}%` }}
                            />
                          </div>
                          <span className={`text-xs flex items-center gap-1 ${getTrendColor(skill.growth)}`}>
                            {getTrendIcon(skill.growth)}
                            {formatPercentage(skill.growth)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAdvancedAnalytics;