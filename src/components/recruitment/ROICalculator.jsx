import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calculator,
  PieChart,
  BarChart3,
  Target,
  Users,
  Clock,
  Briefcase,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PieChart as PieChartComponent, BarChart } from '@/components/ui/Chart';
import { formatCurrency, formatPercentage, formatIndianCurrency } from '@/utils/formatters';

const ROICalculator = ({ 
  placements = [], 
  costs = [], 
  timeRange = '1y',
  onCalculate = () => {} 
}) => {
  const [roiMetrics, setROIMetrics] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [isCalculating, setIsCalculating] = useState(false);

  // Default data if none provided
  const defaultPlacements = [
    { id: 1, candidateName: 'John Doe', position: 'Software Engineer', salary: 1200000, fee: 120000, date: '2024-01-15', clientId: 'client1' },
    { id: 2, candidateName: 'Jane Smith', position: 'Product Manager', salary: 1800000, fee: 180000, date: '2024-02-20', clientId: 'client2' },
    { id: 3, candidateName: 'Mike Johnson', position: 'Data Scientist', salary: 1500000, fee: 150000, date: '2024-03-10', clientId: 'client1' },
    // Add more sample placements...
  ];

  const defaultCosts = [
    { category: 'Salaries & Benefits', amount: 2400000, type: 'operational' },
    { category: 'Technology & Tools', amount: 480000, type: 'operational' },
    { category: 'Marketing & Advertising', amount: 360000, type: 'marketing' },
    { category: 'Office & Infrastructure', amount: 240000, type: 'operational' },
    { category: 'Training & Development', amount: 120000, type: 'investment' },
    { category: 'Legal & Compliance', amount: 60000, type: 'operational' }
  ];

  const activePlacements = placements.length > 0 ? placements : defaultPlacements;
  const activeCosts = costs.length > 0 ? costs : defaultCosts;

  // Calculate ROI metrics
  useEffect(() => {
    calculateROI();
  }, [activePlacements, activeCosts, timeRange]);

  const calculateROI = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalRevenue = activePlacements.reduce((sum, placement) => sum + placement.fee, 0);
    const totalCosts = activeCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const netProfit = totalRevenue - totalCosts;
    const roiPercentage = ((netProfit / totalCosts) * 100);
    
    const costPerHire = totalCosts / activePlacements.length;
    const avgFeePerPlacement = totalRevenue / activePlacements.length;
    const profitMargin = (netProfit / totalRevenue) * 100;

    // Cost breakdown by category
    const costBreakdown = activeCosts.map(cost => ({
      ...cost,
      percentage: (cost.amount / totalCosts) * 100
    }));

    // Revenue by client
    const revenueByClient = activePlacements.reduce((acc, placement) => {
      acc[placement.clientId] = (acc[placement.clientId] || 0) + placement.fee;
      return acc;
    }, {});

    // Monthly revenue trend (sample data)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 450000, costs: 320000 },
      { month: 'Feb', revenue: 520000, costs: 340000 },
      { month: 'Mar', revenue: 480000, costs: 330000 },
      { month: 'Apr', revenue: 600000, costs: 350000 },
      { month: 'May', revenue: 580000, costs: 360000 },
      { month: 'Jun', revenue: 650000, costs: 370000 }
    ];

    const metrics = {
      totalRevenue,
      totalCosts,
      netProfit,
      roiPercentage,
      costPerHire,
      avgFeePerPlacement,
      profitMargin,
      costBreakdown,
      revenueByClient,
      monthlyRevenue,
      placementCount: activePlacements.length,
      avgSalaryPlaced: activePlacements.reduce((sum, p) => sum + p.salary, 0) / activePlacements.length
    };

    setROIMetrics(metrics);
    setIsCalculating(false);
    onCalculate(metrics);
  };

  const getCostCategoryColor = (category) => {
    const colors = {
      'Salaries & Benefits': 'bg-blue-500',
      'Technology & Tools': 'bg-green-500',
      'Marketing & Advertising': 'bg-purple-500',
      'Office & Infrastructure': 'bg-orange-500',
      'Training & Development': 'bg-yellow-500',
      'Legal & Compliance': 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getROIStatus = (roi) => {
    if (roi >= 200) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (roi >= 150) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (roi >= 100) return { status: 'average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating ROI metrics...</p>
        </div>
      </div>
    );
  }

  if (!roiMetrics) {
    return (
      <div className="text-center py-8">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Click calculate to analyze ROI</p>
        <Button onClick={calculateROI} className="mt-4">
          Calculate ROI
        </Button>
      </div>
    );
  }

  const roiStatus = getROIStatus(roiMetrics.roiPercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ROI Calculator</h3>
            <p className="text-sm text-gray-600">Return on investment analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'breakdown', 'trends'].map(view => (
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
          <Button onClick={calculateROI} size="sm" variant="secondary">
            Recalculate
          </Button>
        </div>
      </div>

      {selectedView === 'overview' && (
        <>
          {/* ROI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(roiMetrics.roiPercentage)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className={roiStatus.bg + ' ' + roiStatus.color}>
                  {roiStatus.status.charAt(0).toUpperCase() + roiStatus.status.slice(1)} Performance
                </Badge>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatIndianCurrency(roiMetrics.netProfit)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600">Margin:</span>
                  <span className="font-medium text-blue-600">
                    {formatPercentage(roiMetrics.profitMargin)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cost per Hire</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatIndianCurrency(roiMetrics.costPerHire)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600">Placements:</span>
                  <span className="font-medium text-purple-600">
                    {roiMetrics.placementCount}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Fee</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatIndianCurrency(roiMetrics.avgFeePerPlacement)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium text-orange-600">
                    {formatIndianCurrency(roiMetrics.totalRevenue)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue vs Costs Comparison */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Revenue vs Costs</h4>
                  <p className="text-sm text-gray-600 mt-1">Financial performance breakdown</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Profitable
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Financial Summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Total Revenue</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatIndianCurrency(roiMetrics.totalRevenue)}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded h-2">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-900">Total Costs</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatIndianCurrency(roiMetrics.totalCosts)}
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded h-2">
                      <div 
                        className="bg-red-500 h-2 rounded" 
                        style={{ width: `${(roiMetrics.totalCosts / roiMetrics.totalRevenue) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Net Profit</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatIndianCurrency(roiMetrics.netProfit)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">
                        {formatPercentage(roiMetrics.roiPercentage)} ROI
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Trend Chart */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Monthly Performance</h5>
                  <BarChart
                    data={roiMetrics.monthlyRevenue.map(month => ({
                      label: month.month,
                      value: month.revenue - month.costs,
                      details: `Revenue: ${formatIndianCurrency(month.revenue)}, Costs: ${formatIndianCurrency(month.costs)}`
                    }))}
                    height={250}
                    showTooltip={true}
                    animate={true}
                  />
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'breakdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Cost Breakdown</h4>
                  <p className="text-sm text-gray-600 mt-1">Expense distribution by category</p>
                </div>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {roiMetrics.costBreakdown.map((cost, index) => (
                  <div key={cost.category} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getCostCategoryColor(cost.category)}`}></div>
                        <span className="text-sm font-medium text-gray-900">{cost.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatIndianCurrency(cost.amount)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({cost.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={getCostCategoryColor(cost.category) + ' h-2 rounded'}
                        style={{ width: `${cost.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total Costs</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatIndianCurrency(roiMetrics.totalCosts)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue Analysis */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Revenue Analysis</h4>
                  <p className="text-sm text-gray-600 mt-1">Income sources and efficiency</p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Avg Salary Placed</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatIndianCurrency(roiMetrics.avgSalaryPlaced)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Fee Rate</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {((roiMetrics.avgFeePerPlacement / roiMetrics.avgSalaryPlaced) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Revenue Efficiency */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Revenue Efficiency</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue per Employee</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatIndianCurrency(roiMetrics.totalRevenue / 8)} {/* Assuming 8 employees */}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profit per Placement</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatIndianCurrency(roiMetrics.netProfit / roiMetrics.placementCount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cost Recovery Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {((roiMetrics.totalRevenue / roiMetrics.totalCosts) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Performance Insights</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• ROI is {roiStatus.status} compared to industry standards</div>
                    <div>• Cost per hire is optimized for current market rates</div>
                    <div>• Profit margin indicates healthy business operations</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedView === 'trends' && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">ROI Trends</h4>
                <p className="text-sm text-gray-600 mt-1">Historical performance and projections</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                Improving
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROI Trend Chart */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Monthly ROI Trend</h5>
                <BarChart
                  data={roiMetrics.monthlyRevenue.map(month => ({
                    label: month.month,
                    value: ((month.revenue - month.costs) / month.costs) * 100,
                    details: `ROI: ${(((month.revenue - month.costs) / month.costs) * 100).toFixed(1)}%`
                  }))}
                  height={250}
                  showTooltip={true}
                  animate={true}
                />
              </div>

              {/* Efficiency Metrics */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-900">Efficiency Trends</h5>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Cost Efficiency</span>
                    <span className="text-sm font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-green-500 h-2 rounded" style={{ width: '75%' }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Costs reduced by 12.5% vs last quarter</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <span className="text-sm font-semibold text-blue-600">+18.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: '85%' }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Revenue increased by 18.3% vs last quarter</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Profit Margin</span>
                    <span className="text-sm font-semibold text-purple-600">+5.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-purple-500 h-2 rounded" style={{ width: '68%' }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Margin improved by 5.7 percentage points</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ROICalculator;