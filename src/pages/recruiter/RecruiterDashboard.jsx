import { Users, Briefcase, Calendar, TrendingUp, UserCheck, Clock } from 'lucide-react';
import MetricCard from '@/components/recruitment/MetricCard';
import PipelineChart from '@/components/recruitment/PipelineChart';
import RecentCandidatesWidget from '@/components/recruitment/RecentCandidatesWidget';
import UpcomingInterviewsWidget from '@/components/recruitment/UpcomingInterviewsWidget';
import ActivityTimelineWidget from '@/components/recruitment/ActivityTimelineWidget';
import { useRecruitmentMetrics, useRecruitmentPipeline, useRecentActivity } from '@/hooks/useRecruitment';

export default function RecruiterDashboard() {
  const { metrics, loading: metricsLoading } = useRecruitmentMetrics();
  const { pipelineData, loading: pipelineLoading } = useRecruitmentPipeline();
  const { recentCandidates, upcomingInterviews, recentActivities, loading: activityLoading } = useRecentActivity();

  // Handler functions for widget actions
  const handleViewCandidate = (candidateId) => {
    console.log('View candidate:', candidateId);
    // TODO: Navigate to candidate detail page or open modal
  };

  const handleScheduleInterview = (candidateId) => {
    console.log('Schedule interview for candidate:', candidateId);
    // TODO: Open interview scheduling modal
  };

  const handleSendEmail = (candidateId) => {
    console.log('Send email to candidate:', candidateId);
    // TODO: Open email composition modal
  };

  const handleJoinInterview = (interviewId) => {
    console.log('Join interview:', interviewId);
    // TODO: Open video call or redirect to meeting link
  };

  const handleRescheduleInterview = (interviewId) => {
    console.log('Reschedule interview:', interviewId);
    // TODO: Open reschedule modal
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
          <PipelineChart data={pipelineData} loading={pipelineLoading} />
        </div>

        {/* Recent Activity Widgets */}
        <div className="space-y-6">
          {/* Recent Candidates Widget */}
          <RecentCandidatesWidget
            candidates={recentCandidates}
            loading={activityLoading}
            onViewCandidate={handleViewCandidate}
            onScheduleInterview={handleScheduleInterview}
            onSendEmail={handleSendEmail}
          />

          {/* Upcoming Interviews Widget */}
          <UpcomingInterviewsWidget
            interviews={upcomingInterviews}
            loading={activityLoading}
            onJoinInterview={handleJoinInterview}
            onRescheduleInterview={handleRescheduleInterview}
          />
        </div>
      </div>

      {/* Activity Timeline - Full Width */}
      <div className="mt-6">
        <ActivityTimelineWidget
          activities={recentActivities}
          loading={activityLoading}
          maxItems={6}
        />
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