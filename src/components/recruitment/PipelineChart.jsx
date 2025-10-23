import { ArrowRight } from 'lucide-react';

export default function PipelineChart({ 
  data = [], 
  orientation = 'horizontal', 
  showConversionRates = true 
}) {
  const defaultData = [
    { stage: 'Registration', count: 150, color: 'bg-blue-500', conversionRate: 100 },
    { stage: 'Resume Share', count: 120, color: 'bg-purple-500', conversionRate: 80 },
    { stage: 'Shortlisting', count: 85, color: 'bg-amber-500', conversionRate: 71 },
    { stage: 'Interview', count: 45, color: 'bg-cyan-500', conversionRate: 53 },
    { stage: 'Selection', count: 25, color: 'bg-green-500', conversionRate: 56 },
    { stage: 'Placement', count: 18, color: 'bg-emerald-600', conversionRate: 72 }
  ];

  const pipelineData = data.length > 0 ? data : defaultData;
  const maxCount = Math.max(...pipelineData.map(item => item.count));

  if (orientation === 'horizontal') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recruitment Pipeline</h3>
          <div className="text-sm text-gray-500">
            Total: {pipelineData[0]?.count || 0} candidates
          </div>
        </div>
        
        <div className="space-y-4">
          {pipelineData.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-4">
                  {showConversionRates && index > 0 && (
                    <span className="text-xs text-gray-500">
                      {stage.conversionRate}% conversion
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-900">
                    {stage.count}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${stage.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(stage.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Conversion Arrow */}
              {index < pipelineData.length - 1 && (
                <div className="flex justify-center mt-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round((pipelineData[pipelineData.length - 1]?.count / pipelineData[0]?.count) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Overall Conversion</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {pipelineData[pipelineData.length - 1]?.count || 0}
              </div>
              <div className="text-xs text-gray-500">Successful Placements</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical funnel view (for future use)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Funnel</h3>
      <div className="flex flex-col items-center space-y-2">
        {pipelineData.map((stage, index) => (
          <div key={stage.stage} className="text-center">
            <div 
              className={`${stage.color} text-white px-6 py-3 rounded-lg shadow-sm`}
              style={{ 
                width: `${Math.max(120, (stage.count / maxCount) * 300)}px`,
                clipPath: index === pipelineData.length - 1 ? 'none' : 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
              }}
            >
              <div className="font-medium">{stage.stage}</div>
              <div className="text-sm opacity-90">{stage.count}</div>
            </div>
            {index < pipelineData.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}