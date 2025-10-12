import { Check } from 'lucide-react';

const DealPipelineStep = ({ 
  steps, 
  currentStep, 
  onStepClick,
  showCounts = true 
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900">Deal Pipeline</h3>
      <div className="text-sm text-gray-500">
        {steps.reduce((sum, step) => sum + step.count, 0)} total deals
      </div>
    </div>
    
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200"></div>
      <div 
        className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => onStepClick(index)}
          >
            {/* Step Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
            }`}>
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <div className="mt-3 text-center">
              <div className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </div>
              {showCounts && (
                <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                  step.count > 0 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.count} deals
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DealPipelineStep;