import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function PipelineChart({ 
  data = [], 
  orientation = 'horizontal', 
  showConversionRates = true 
}) {
  const [hoveredStage, setHoveredStage] = useState(null);
  
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

  // Calculate additional metrics for tooltips
  const getStageMetrics = (stage, index) => {
    const previousStage = index > 0 ? pipelineData[index - 1] : null;
    const dropOffCount = previousStage ? previousStage.count - stage.count : 0;
    const dropOffRate = previousStage ? ((dropOffCount / previousStage.count) * 100).toFixed(1) : 0;
    
    return {
      dropOffCount,
      dropOffRate,
      percentage: ((stage.count / pipelineData[0].count) * 100).toFixed(1)
    };
  };

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
          {pipelineData.map((stage, index) => {
            const metrics = getStageMetrics(stage, index);
            const isHovered = hoveredStage === index;
            
            return (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color} transition-all duration-200 ${isHovered ? 'scale-125' : ''}`} />
                    <span className={`text-sm font-medium transition-colors duration-200 ${isHovered ? 'text-gray-900' : 'text-gray-700'}`}>
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {showConversionRates && index > 0 && (
                      <div className="flex items-center space-x-1">
                        {stage.conversionRate >= 70 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : stage.conversionRate >= 50 ? (
                          <ArrowRight className="w-3 h-3 text-amber-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${
                          stage.conversionRate >= 70 ? 'text-green-600' :
                          stage.conversionRate >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {stage.conversionRate}%
                        </span>
                      </div>
                    )}
                    <span className={`text-sm font-semibold transition-colors duration-200 ${isHovered ? 'text-gray-900' : 'text-gray-700'}`}>
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div 
                  className="relative cursor-pointer"
                  onMouseEnter={() => setHoveredStage(index)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full ${stage.color} transition-all duration-1000 ease-out relative ${isHovered ? 'shadow-lg' : ''}`}
                      style={{ width: `${(stage.count / maxCount) * 100}%` }}
                    >
                      {isHovered && (
                        <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  {/* Interactive Tooltip */}
                  {isHovered && (
                    <div className="absolute z-10 left-1/2 transform -translate-x-1/2 -top-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
                      <div className="space-y-1">
                        <div className="font-semibold">{stage.stage}</div>
                        <div>Candidates: {stage.count.toLocaleString()}</div>
                        <div>Pipeline %: {metrics.percentage}%</div>
                        {index > 0 && (
                          <>
                            <div>Conversion: {stage.conversionRate}%</div>
                            <div className="text-red-300">Drop-off: {metrics.dropOffCount} ({metrics.dropOffRate}%)</div>
                          </>
                        )}
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Conversion Arrow */}
                {index < pipelineData.length - 1 && (
                  <div className="flex justify-center mt-3 mb-2">
                    <div className={`flex items-center space-x-2 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
                      <ArrowRight className={`w-4 h-4 transition-colors duration-200 ${
                        stage.conversionRate >= 70 ? 'text-green-500' :
                        stage.conversionRate >= 50 ? 'text-amber-500' : 'text-red-500'
                      }`} />
                      {showConversionRates && (
                        <span className={`text-xs font-medium transition-colors duration-200 ${
                          stage.conversionRate >= 70 ? 'text-green-600' :
                          stage.conversionRate >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {pipelineData[index + 1]?.conversionRate}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Enhanced Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="group cursor-pointer">
              <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {Math.round((pipelineData[pipelineData.length - 1]?.count / pipelineData[0]?.count) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Overall Conversion</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {pipelineData[pipelineData.length - 1]?.count || 0}
              </div>
              <div className="text-xs text-gray-500">Successful Placements</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                {pipelineData.reduce((sum, stage, index) => {
                  if (index === 0) return sum;
                  const previous = pipelineData[index - 1];
                  return sum + (previous.count - stage.count);
                }, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Drop-offs</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Vertical funnel view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recruitment Funnel</h3>
        <div className="text-sm text-gray-500">
          Total: {pipelineData[0]?.count || 0} candidates
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-3">
        {pipelineData.map((stage, index) => {
          const metrics = getStageMetrics(stage, index);
          const isHovered = hoveredStage === index;
          const width = Math.max(120, (stage.count / maxCount) * 280);
          
          return (
            <div key={stage.stage} className="text-center">
              <div 
                className={`${stage.color} text-white px-6 py-4 rounded-lg shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isHovered ? 'shadow-lg scale-105' : ''
                }`}
                style={{ 
                  width: `${width}px`,
                  clipPath: index === pipelineData.length - 1 ? 'none' : 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
                }}
                onMouseEnter={() => setHoveredStage(index)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {isHovered && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
                )}
                <div className="relative z-10">
                  <div className="font-semibold text-lg">{stage.stage}</div>
                  <div className="text-sm opacity-90 mt-1">{stage.count.toLocaleString()} candidates</div>
                  {index > 0 && showConversionRates && (
                    <div className="text-xs opacity-80 mt-1">
                      {stage.conversionRate}% conversion
                    </div>
                  )}
                </div>
                
                {/* Interactive Tooltip for Vertical */}
                {isHovered && (
                  <div className="absolute z-20 left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
                    <div className="space-y-1">
                      <div className="font-semibold">{stage.stage}</div>
                      <div>Candidates: {stage.count.toLocaleString()}</div>
                      <div>Pipeline %: {metrics.percentage}%</div>
                      {index > 0 && (
                        <>
                          <div>Conversion: {stage.conversionRate}%</div>
                          <div className="text-red-300">Drop-off: {metrics.dropOffCount} ({metrics.dropOffRate}%)</div>
                        </>
                      )}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Arrow with Conversion Rate */}
              {index < pipelineData.length - 1 && (
                <div className={`flex items-center justify-center my-2 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
                  <div className="flex flex-col items-center">
                    <ArrowRight className={`w-5 h-5 transition-colors duration-200 ${
                      pipelineData[index + 1]?.conversionRate >= 70 ? 'text-green-500' :
                      pipelineData[index + 1]?.conversionRate >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`} />
                    {showConversionRates && (
                      <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                        pipelineData[index + 1]?.conversionRate >= 70 ? 'text-green-600' :
                        pipelineData[index + 1]?.conversionRate >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {pipelineData[index + 1]?.conversionRate}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats for Vertical */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="group cursor-pointer">
            <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {Math.round((pipelineData[pipelineData.length - 1]?.count / pipelineData[0]?.count) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Overall Conversion</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {pipelineData[pipelineData.length - 1]?.count || 0}
            </div>
            <div className="text-xs text-gray-500">Successful Placements</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
              {pipelineData.reduce((sum, stage, index) => {
                if (index === 0) return sum;
                const previous = pipelineData[index - 1];
                return sum + (previous.count - stage.count);
              }, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Drop-offs</div>
          </div>
        </div>
      </div>
    </div>
  );
}