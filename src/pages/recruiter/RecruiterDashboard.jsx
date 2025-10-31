import { Users, Briefcase, Calendar, TrendingUp, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '@/components/recruitment/MetricCard';
import PipelineChart from '@/components/recruitment/PipelineChart';
import RecentCandidatesWidget from '@/components/recruitment/RecentCandidatesWidget';
import UpcomingInterviewsWidget from '@/components/recruitment/UpcomingInterviewsWidget';
import ActivityTimelineWidget from '@/components/recruitment/ActivityTimelineWidget';
import { useRecruitmentMetrics, useRecruitmentPipeline, useRecentActivity } from '@/hooks/useRecruitment';

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const { metrics, loading: metricsLoading } = useRecruitmentMetrics();
  const { pipelineData, loading: pipelineLoading } = useRecruitmentPipeline();
  const { recentCandidates, upcomingInterviews, recentActivities, loading: activityLoading } = useRecentActivity();

  // Handler functions for widget actions
  const handleViewCandidate = (candidateId) => {
    // Navigate to candidate detail page
    navigate(`/app/recruiter/candidates/${candidateId}`);
  };

  const handleScheduleInterview = (candidateId) => {
    // Navigate to interview scheduling page
    navigate(`/app/recruiter/interviews/schedule/${candidateId}`);
  };

  const handleSendEmail = (candidateId) => {
    // Navigate to email composition page
    navigate(`/app/recruiter/candidates/${candidateId}/email`);
  };

  const handleJoinInterview = (interviewId) => {
    // Open video call or redirect to meeting link
    window.open(`/app/recruiter/interviews/${interviewId}/join`, '_blank');
  };

  const handleRescheduleInterview = (interviewId) => {
    // Navigate to reschedule page
    navigate(`/app/recruiter/interviews/${interviewId}/reschedule`);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your recruitment overview.</p>
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

      {/* Quick Actions with Enhanced Hover Animations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/app/recruiter/candidates/add'}
            className="relative flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
            <Users className="w-5 h-5 text-blue-600 relative z-10 transition-colors duration-300 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-white">Add Candidate</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
          </button>
          <button className="relative flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 hover:border-green-400 hover:shadow-lg">
            <Briefcase className="w-5 h-5 text-green-600 relative z-10 transition-colors duration-300 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-white">Post Job</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
          </button>
          <button className="relative flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 hover:border-purple-400 hover:shadow-lg">
            <Calendar className="w-5 h-5 text-purple-600 relative z-10 transition-colors duration-300 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-white">Schedule Interview</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
          </button>
          <button className="relative flex items-center justify-center space-x-2 p-4 border-2 border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 hover:border-amber-400 hover:shadow-lg">
            <TrendingUp className="w-5 h-5 text-amber-600 relative z-10 transition-colors duration-300 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-white">View Reports</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
}