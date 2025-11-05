import { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  BarChart3,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { workflowAutomationService } from '@/services/workflowAutomationService';

// Score Breakdown Component
const ScoreBreakdown = ({ breakdown, totalScore }) => {
  const maxPossibleScore = breakdown.reduce((sum, item) => sum + (item.maxScore * item.weight), 0);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
          <div className="text-sm text-gray-500">/ {Math.round(maxPossibleScore)}</div>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {item.category.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-600">
                  {item.score} / {item.maxScore} (×{item.weight})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.reasoning}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Predictions Component
const AIPredictions = ({ predictions }) => {
  const getPredictionIcon = (type) => {
    switch (type) {
      case 'placement-success': return Target;
      case 'time-to-hire': return TrendingUp;
      case 'salary-negotiation': return BarChart3;
      default: return Brain;
    }
  };

  const getPredictionColor = (probability) => {
    if (probability >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Brain className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
      </div>

      <div className="space-y-4">
        {predictions.map((prediction, index) => {
          const IconComponent = getPredictionIcon(prediction.type);
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getPredictionColor(prediction.probability)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span className="font-medium capitalize">
                    {prediction.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {prediction.type === 'time-to-hire' ? `${prediction.probability} days` : `${prediction.probability}%`}
                  </div>
                  <div className="text-xs opacity-75">
                    {prediction.confidence}% confidence
                  </div>
                </div>
              </div>
              <div className="text-sm opacity-90 mb-2">{prediction.reasoning}</div>
              <div className="flex flex-wrap gap-1">
                {prediction.factors.map((factor, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Scoring Rules Management Component
const ScoringRulesManager = ({ rules, onRuleUpdate, onRuleCreate, onRuleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'skills',
    condition: '',
    points: 10,
    weight: 1.0,
    description: '',
    isActive: true
  });

  const categories = [
    { value: 'skills', label: 'Skills' },
    { value: 'experience', label: 'Experience' },
    { value: 'education', label: 'Education' },
    { value: 'location', label: 'Location' },
    { value: 'availability', label: 'Availability' },
    { value: 'market-demand', label: 'Market Demand' },
    { value: 'referral', label: 'Referral' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      category: 'skills',
      condition: '',
      points: 10,
      weight: 1.0,
      description: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      category: rule.category,
      condition: rule.condition,
      points: rule.points,
      weight: rule.weight,
      description: rule.description,
      isActive: rule.isActive
    });
    setIsModalOpen(true);
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await onRuleUpdate(editingRule.id, formData);
      } else {
        await onRuleCreate(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Scoring Rules</h3>
        <Button
          onClick={handleCreateRule}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Add Rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map(rule => (
          <div 
            key={rule.id}
            className={`p-4 rounded-lg border ${
              rule.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className={`font-medium ${rule.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {rule.name}
                </span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {rule.category}
                </span>
                {!rule.isActive && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-600">
                  +{rule.points} pts (×{rule.weight})
                </span>
                <button
                  onClick={() => handleEditRule(rule)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => onRuleDelete(rule.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">{rule.description}</div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
              {rule.condition}
            </div>
          </div>
        ))}
      </div>

      {/* Rule Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? 'Edit Scoring Rule' : 'Create Scoring Rule'}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., React Experience Bonus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition *
            </label>
            <input
              type="text"
              value={formData.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., skills.includes('React')"
            />
            <div className="text-xs text-gray-500 mt-1">
              Use JavaScript-like expressions to define the condition
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points *
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                max="3.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what this rule does"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRule}
              className="flex-1"
              disabled={!formData.name || !formData.condition}
            >
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Main Lead Scoring Engine Component
const LeadScoringEngine = ({ candidate, onScoreUpdate, showBreakdown = true }) => {
  const [leadScore, setLeadScore] = useState(null);
  const [scoringRules, setScoringRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRulesManager, setShowRulesManager] = useState(false);

  useEffect(() => {
    loadScoringRules();
    if (candidate) {
      calculateScore();
    }
  }, [candidate]);

  const loadScoringRules = async () => {
    try {
      const rules = await workflowAutomationService.getAllScoringRules();
      setScoringRules(rules);
    } catch (error) {
      console.error('Error loading scoring rules:', error);
    }
  };

  const calculateScore = async () => {
    if (!candidate) return;
    
    setLoading(true);
    try {
      const score = await workflowAutomationService.calculateLeadScore(candidate.id, candidate);
      setLeadScore(score);
      if (onScoreUpdate) {
        onScoreUpdate(candidate.id, score);
      }
    } catch (error) {
      console.error('Error calculating score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleCreate = async (ruleData) => {
    try {
      await workflowAutomationService.createScoringRule(ruleData);
      await loadScoringRules();
      await calculateScore(); // Recalculate with new rule
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleRuleUpdate = async (ruleId, updates) => {
    try {
      await workflowAutomationService.updateScoringRule(ruleId, updates);
      await loadScoringRules();
      await calculateScore(); // Recalculate with updated rule
    } catch (error) {
      console.error('Error updating rule:', error);
    }
  };

  const handleRuleDelete = async (ruleId) => {
    try {
      await workflowAutomationService.deleteScoringRule(ruleId);
      await loadScoringRules();
      await calculateScore(); // Recalculate without deleted rule
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Hot Lead';
    if (score >= 60) return 'Warm Lead';
    return 'Cold Lead';
  };

  if (!candidate) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a candidate to view lead scoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Lead Score</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={calculateScore}
              disabled={loading}
              size="sm"
              icon={<Zap className="w-4 h-4" />}
            >
              {loading ? 'Calculating...' : 'Recalculate'}
            </Button>
            <Button
              onClick={() => setShowRulesManager(!showRulesManager)}
              variant="outline"
              size="sm"
              icon={<Settings className="w-4 h-4" />}
            >
              Rules
            </Button>
          </div>
        </div>

        {leadScore ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-3xl font-bold ${getScoreColor(leadScore.totalScore)}`}>
                  {Math.round(leadScore.totalScore)}
                </span>
                <span className="text-gray-500">/100</span>
                {getTrendIcon(leadScore.trend)}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  leadScore.totalScore >= 80 ? 'bg-green-100 text-green-800' :
                  leadScore.totalScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getScoreLabel(leadScore.totalScore)}
                </span>
                <span className="text-sm text-gray-500">
                  Last calculated: {new Date(leadScore.lastCalculated).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                {leadScore.breakdown.length} factors
              </div>
              {leadScore.previousScore && (
                <div className="text-sm text-gray-500">
                  Previous: {Math.round(leadScore.previousScore)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Click "Calculate" to generate lead score</p>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      {showBreakdown && leadScore && (
        <ScoreBreakdown 
          breakdown={leadScore.breakdown} 
          totalScore={Math.round(leadScore.totalScore)} 
        />
      )}

      {/* AI Predictions */}
      {leadScore && leadScore.aiPredictions && (
        <AIPredictions predictions={leadScore.aiPredictions} />
      )}

      {/* Scoring Rules Manager */}
      {showRulesManager && (
        <ScoringRulesManager
          rules={scoringRules}
          onRuleCreate={handleRuleCreate}
          onRuleUpdate={handleRuleUpdate}
          onRuleDelete={handleRuleDelete}
        />
      )}
    </div>
  );
};

export default LeadScoringEngine;