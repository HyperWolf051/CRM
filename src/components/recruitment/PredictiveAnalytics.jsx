import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  Brain
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LineChart } from '@/components/ui/Chart';
import { formatPercentage, formatIndianCurrency } from '@/utils/formatters';

const PredictiveAnalytics = ({ 
  predictions = [], 
  timeRange = '6m', 
  confidenceLevel = 80,
  onDrillDown = () => {} 
}) => {
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Sample predictive data if none provided
  const defaultPredictions = [
    {
      id: 'placement-success',
      title: 'Placement Success Rate',
      currentValue: 68.2,
      predictedValue: 75.8,
      confidence: 85,
      trend: 'increasing',
      timeframe: '6 months',
      factors: [
        { factor: 'Improved screening process', impact: 15 },
        { factor: 'Better client matching', impact: 12 },
        { factor: 'Enhanced candidate experience', impact: 8 }
      ],
      chartData: [
        { label: 'Jan', value: 65.2, predicted: 66.1 },
        { label: 'Feb', value: 67.1, predicted: 68.3 },
        { label: 'Mar', value: 68.2, predicted: 70.5 },
        { label: 'Apr', value: null, predicted: 72.1 },
        { label: 'May', value: null, predicted: 74.2 },
        { label: 'Jun', value: null, predicted: 75.8 }
      ]
    },
    {
      id: 'time-to-hire',
      title: 'Time to Hire Optimization',
      currentValue: 18.5,
      predictedValue: 14.2,
      confidence: 78,
      trend: 'decreasing',
      timeframe: '6 months',
      factors: [
        { factor: 'Automated screening', impact: -20 },
        { factor: 'Faster client feedback', impact: -15 },
        { factor: 'Streamlined interviews', impact: -12 }
      ],
      chartData: [
        { label: 'Jan', value: 22.3, predicted: 21.1 },
        { label: 'Feb', value: 19.8, predicted: 18.9 },
        { label: 'Mar', value: 18.5, predicted: 16.8 },
        { label: 'Apr', value: null, predicted: 15.9 },
        { label: 'May', value: null, predicted: 15.1 },
        { label: 'Jun', value: null, predicted: 14.2 }
      ]
    },
    {
      id: 'revenue-forecast',
      title: 'Revenue Forecast',
      currentValue: 2850000,
      predictedValue: 3650000,
      confidence: 82,
      trend: 'increasing',
      timeframe: '6 months',
      factors: [
        { factor: 'Higher placement rates', impact: 25 },
        { factor: 'Premium client acquisition', impact: 18 },
        { factor: 'Increased fee structure', impact: 12 }
      ],
      chartData: [
        { label: 'Jan', value: 2200000, predicted: 2350000 },
        { label: 'Feb', value: 2650000, predicted: 2780000 },
        { label: 'Mar', value: 2850000, predicted: 3100000 },
        { label: 'Apr', value: null, predicted: 3250000 },
        { label: 'May', value: null, predicted: 3450000 },
        { label: 'Jun', value: null, predicted: 3650000 }
      ]
    }
  ];

  const activePredictions = predictions.length > 0 ? predictions : defaultPredictions;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatValue = (value, type) => {
    if (type === 'revenue-forecast') {
      return formatIndianCurrency(value);
    }
    if (type === 'time-to-hire') {
      return `${value} days`;
    }
    return `${value}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
            <p className="text-sm text-gray-600">AI-powered insights and forecasting</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
          <Zap className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activePredictions.map((prediction) => (
          <Card 
            key={prediction.id} 
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedPrediction(prediction);
              onDrillDown(prediction);
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {prediction.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(prediction.trend)}
                    <span className="text-xs text-gray-500">{prediction.timeframe}</span>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getConfidenceColor(prediction.confidence)}`}
                >
                  {prediction.confidence}% confidence
                </Badge>
              </div>

              {/* Current vs Predicted Values */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatValue(prediction.currentValue, prediction.id)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatValue(prediction.predictedValue, prediction.id)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className={`text-sm font-medium ${
                    prediction.trend === 'increasing' ? 'text-green-600' : 
                    prediction.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {prediction.trend === 'increasing' ? '+' : ''}
                    {formatPercentage(
                      ((prediction.predictedValue - prediction.currentValue) / prediction.currentValue) * 100
                    )}
                  </span>
                </div>
              </div>

              {/* Key Factors */}
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Key Factors</h5>
                <div className="space-y-1">
                  {prediction.factors.slice(0, 2).map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate">{factor.factor}</span>
                      <span className={`font-medium ${
                        factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {factor.impact > 0 ? '+' : ''}{factor.impact}%
                      </span>
                    </div>
                  ))}
                  {prediction.factors.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{prediction.factors.length - 2} more factors
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal/Expanded Card */}
      {selectedPrediction && (
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {selectedPrediction.title} - Detailed Analysis
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Forecast for the next {selectedPrediction.timeframe}
                </p>
              </div>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Trend Analysis</h5>
                <LineChart
                  data={selectedPrediction.chartData.map(item => ({
                    label: item.label,
                    value: item.predicted,
                    actual: item.value
                  }))}
                  height={250}
                  showTooltip={true}
                  animate={true}
                />
              </div>

              {/* Factors & Insights */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Impact Factors</h5>
                  <div className="space-y-3">
                    {selectedPrediction.factors.map((factor, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {factor.factor}
                          </span>
                          <span className={`text-sm font-semibold ${
                            factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {factor.impact > 0 ? '+' : ''}{factor.impact}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2">
                          <div
                            className={`h-2 rounded ${
                              factor.impact > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.abs(factor.impact) * 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Model Confidence</h5>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Prediction Accuracy</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedPrediction.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={`h-2 rounded ${
                          selectedPrediction.confidence >= 80 ? 'bg-green-500' :
                          selectedPrediction.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedPrediction.confidence}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedPrediction.confidence >= 80 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : selectedPrediction.confidence >= 70 ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Info className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-xs text-gray-600">
                        {selectedPrediction.confidence >= 80 ? 'High confidence prediction' :
                         selectedPrediction.confidence >= 70 ? 'Moderate confidence prediction' :
                         'Low confidence prediction'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PredictiveAnalytics;