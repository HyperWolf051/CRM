import { Users, Briefcase, Calendar, TrendingUp, UserCheck, Clock } from 'lucide-react';
import MetricCard from '@/components/recruitment/MetricCard';
import PipelineChart from '@/components/recruitment/PipelineChart';
import { useRecruitmentMetrics, useRecruitmentPipeline, useRecentActivity } from '@/hooks/useRecruitment';

export default function RecruiterDashboard() {
  const { metrics, loading: metricsLoading } = useRecruitmentMetrics();
  const { pipelineData, loading: pipelineLoading } = useRecruitmentPipeline();
  const { recentCandidates, upcomingInterviews, loading: activityLoading } = useRecentActivity();

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      new: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interviewed: 'bg-amber-100 text-amber-800',
      selected: 'bg-cyan-100 text-cyan-800',
      placed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || statusClasses.new;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your recruitment overview.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 metrics-grid-mobile sm:metrics-grid-tablet">
        <MetricCard
          title="Total Candidates"
          value={metrics?.totalCandidates || 0}
          trend={metrics?.trends?.candidates}
          icon={Users}
          color="blue"
          sparklineData={metrics?.sparklineData?.candidates || []}
          description="Active candidates in pipeline"
          loading={metricsLoading}
        />
        
        <MetricCard
          title="Active Jobs"
          value={metrics?.activeJobs || 0}
          trend={metrics?.trends?.jobs}
          icon={Briefcase}
          color="green"
          sparklineData={metrics?.sparklineData?.jobs || []}
          description="Open positions to fill"
          loading={metricsLoading}
        />
        
        <MetricCard
          title="Interviews Scheduled"
          value={metrics?.interviewsScheduled || 0}
          trend={metrics?.trends?.interviews}
          icon={Calendar}
          color="amber"
          sparklineData={metrics?.sparklineData?.interviews || []}
          description="Upcoming interviews this week"
          loading={metricsLoading}
        />
        
        <MetricCard
          title="Offers Made"
          value={metrics?.offersExtended || 0}
          trend={metrics?.trends?.offers}
          icon={UserCheck}
          color="purple"
          sparklineData={metrics?.sparklineData?.offers || []}
          description="Pending candidate offers"
          loading={metricsLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PipelineChart data={pipelineData} />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Candidates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Candidates</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {candidate.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {candidate.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(candidate.status)}`}>
                      {candidate.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(candidate.appliedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {interview.candidateName}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      interview.type === 'video' ? 'bg-blue-100 text-blue-800' :
                      interview.type === 'phone' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{interview.position}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatDateTime(interview.dateTime)}
                    </p>
                    <div className="flex space-x-2">
                      <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                        Join
                      </button>
                      <button className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add Candidate</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <Briefcase className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Schedule Interview</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}