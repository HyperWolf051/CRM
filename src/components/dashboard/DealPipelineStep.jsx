import {
  Check,
  TrendingUp,
  DollarSign,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";

const DealPipelineStep = ({
  steps,
  currentStep,
  onStepClick,
  onRefresh,
  showCounts = true,
  loading = false,
}) => {
  const dealDetails = [
    {
      id: 1,
      client: "TechCorp Inc.",
      value: "$45,000",
      stage: "Lead",
      progress: 15,
      daysInStage: 3,
      contact: "Sarah Johnson",
      priority: "high",
    },
    {
      id: 2,
      client: "StartupXYZ",
      value: "$32,000",
      stage: "Qualified",
      progress: 35,
      daysInStage: 7,
      contact: "Mike Chen",
      priority: "medium",
    },
    {
      id: 3,
      client: "Global Tech",
      value: "$78,000",
      stage: "Proposal",
      progress: 65,
      daysInStage: 12,
      contact: "Emma Wilson",
      priority: "high",
    },
    {
      id: 4,
      client: "Innovate Solutions",
      value: "$25,000",
      stage: "Negotiation",
      progress: 85,
      daysInStage: 5,
      contact: "David Park",
      priority: "low",
    },
    {
      id: 5,
      client: "Future Corp",
      value: "$55,000",
      stage: "Closed",
      progress: 100,
      daysInStage: 0,
      contact: "Lisa Zhang",
      priority: "high",
    },
  ];

  const totalPipelineValue = dealDetails.reduce((sum, deal) => {
    return sum + parseInt(deal.value.replace(/[$,]/g, ""));
  }, 0);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Deal Pipeline</h3>
          <p className="text-sm text-gray-500">
            Track deals through your sales process
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {steps.reduce((sum, step) => sum + step.count, 0)} active deals
            </div>
            <div className="text-xs text-green-600 font-medium">
              ${totalPipelineValue.toLocaleString()} pipeline value
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="relative p-2 text-gray-600 hover:text-white rounded-lg transition-all duration-200 
                         disabled:opacity-50 overflow-hidden group hover:shadow-md"
              title="Refresh deals"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""} relative z-10 transition-colors duration-200`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                              transform scale-0 group-hover:scale-100 group-disabled:scale-0
                              transition-transform duration-200 ease-out rounded-lg"></div>
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="relative mb-6">
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
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <div
                  className={`text-sm font-medium ${
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </div>
                {showCounts && (
                  <div
                    className={`text-xs mt-1 px-2 py-1 rounded-full ${
                      step.count > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.count} deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deal Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">
            Recent Deal Activity
          </h4>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>+12% this week</span>
          </div>
        </div>

        {/* Deal Cards */}
        <div className="space-y-3 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="flex items-center space-x-2 text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Refreshing deals...</span>
              </div>
            </div>
          )}
          {dealDetails.slice(0, 4).map((deal) => (
            <div
              key={deal.id}
              className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-gray-900">{deal.client}</div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                      deal.priority
                    )}`}
                  >
                    {deal.priority}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {deal.value}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{deal.contact}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {deal.daysInStage} days in {deal.stage}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-600">
                  {deal.stage}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${deal.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {deal.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="pt-4 border-t border-gray-200">
          <button className="relative w-full text-center text-sm text-blue-600 hover:text-white font-medium 
                             py-3 rounded-lg transition-all duration-200 overflow-hidden group
                             border border-blue-200 hover:border-blue-500 hover:shadow-md">
            <span className="relative z-10">View All Deals ({dealDetails.length}) →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                            transform -translate-y-full group-hover:translate-y-0 
                            transition-transform duration-200 ease-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealPipelineStep;
