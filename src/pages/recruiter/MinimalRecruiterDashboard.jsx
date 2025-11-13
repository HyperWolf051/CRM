import { Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MinimalMetricCard from '@/components/recruitment/MinimalMetricCard';
import PipelineChart from '@/components/recruitment/PipelineChart';
import RecentCandidatesWidget from '@/components/recruitment/RecentCandidatesWidget';
import UpcomingInterviewsWidget from '@/components/recruitment/UpcomingInterviewsWidget';
import ActivityTimelineWidget from '@/components/recruitment/ActivityTimelineWidget';
import { useRecruitmentMetrics, useRecruitmentPipeline, useRecentActivity } from '@/hooks/useRecruitment';

/**
 * MinimalRecruiterDashboard Component
 * 
 * A deliberately understated dashboard following human-crafted design principles:
 * - Clean white backgrounds with subtle shadows
 * - No colorful gradients or flashy animations
 * - Asymmetric layouts with organic spacing
 * - Simple, functional buttons
 * - Monochromatic status indicators
 */
export default function MinimalRecruiterDashboard() {
  const navigate = useNavigate();

  const { metrics, loading: metricsLoading } = useRecruitmentMetrics();
  const { pipelineData, loading: pipelineLoading } = useRecruitmentPipeline();
  const { recentCandidates, upcomingInterviews, recentActivities, loading: activityLoading } = useRecentActivity();

  // Handler functions for widget actions
  const handleViewCandidate = (candidateId) => {
    navigate(`/app/recruiter/candidates/${candidateId}`);
  };

  const handleScheduleInterview = (candidateId) => {
    navigate(`/app/recruiter/interviews/schedule/${candidateId}`);
  };

  const handleSendEmail = (candidateId) => {
    navigate(`/app/recruiter/candidates/${candidateId}/email`);
  };

  const handleJoinInterview = (interviewId) => {
    window.open(`/app/recruiter/interviews/${interviewId}/join`, '_blank');
  };

  const handleRescheduleInterview = (interviewId) => {
    navigate(`/app/recruiter/interviews/${interviewId}/reschedule`);
  };

  return (
    <div className="space-y-23">
      {/* Header with asymmetric spacing */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'calc(1.5rem + 1px)' }}>
        <div>
          <h1 className="text-2xl font-bold text-minimal-text-black">Recruitment Dashboard</h1>
          <p className="text-minimal-text-medium italic">Welcome back! Here&apos;s your recruitment overview.</p>
        </div>
        <div className="text-sm text-minimal-text-light">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Cards with organic spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-17">
        <MinimalMetricCard
          title="Total Candidates"
          value={metrics?.totalCandidates || 0}
          trend={metrics?.trends?.candidates}
          icon={Users}
          sparklineData={metrics?.sparklineData?.candidates || []}
          description="Active candidates in pipeline"
          loading={metricsLoading}
        />

        <MinimalMetricCard
          title="Active Jobs"
          value={metrics?.activeJobs || 0}
          trend={metrics?.trends?.jobs}
          icon={Briefcase}
          sparklineData={metrics?.sparklineData?.jobs || []}
          description="Open positions to fill"
          loading={metricsLoading}
        />

        <MinimalMetricCard
          title="Interviews Scheduled"
          value={metrics?.interviewsScheduled || 0}
          trend={metrics?.trends?.interviews}
          icon={Calendar}
          sparklineData={metrics?.sparklineData?.interviews || []}
          description="Upcoming interviews this week"
          loading={metricsLoading}
        />

        <MinimalMetricCard
          title="Offers Made"
          value={metrics?.offersExtended || 0}
          trend={metrics?.trends?.offers}
          icon={FileText}
          sparklineData={metrics?.sparklineData?.offers || []}
          description="Pending candidate offers"
          loading={metricsLoading}
        />
      </div>

      {/* Main Content Grid with asymmetric spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-23">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2">
          <PipelineChart data={pipelineData} loading={pipelineLoading} />
        </div>

        {/* Recent Activity Widgets */}
        <div className="space-y-23">
          <RecentCandidatesWidget
            candidates={recentCandidates}
            loading={activityLoading}
            onViewCandidate={handleViewCandidate}
            onScheduleInterview={handleScheduleInterview}
            onSendEmail={handleSendEmail}
          />

          <UpcomingInterviewsWidget
            interviews={upcomingInterviews}
            loading={activityLoading}
            onJoinInterview={handleJoinInterview}
            onRescheduleInterview={handleRescheduleInterview}
            onViewAllInterviews={() => navigate('/app/recruiter/calendar')}
          />
        </div>
      </div>

      {/* Activity Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-23">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimelineWidget
            activities={recentActivities}
            loading={activityLoading}
            maxItems={6}
          />
        </div>

        {/* Quick Actions - Minimal Style */}
        <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card p-17">
          <h3 className="text-lg font-semibold text-minimal-text-dark mb-17">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-13">
            <button
              onClick={() => navigate('/app/recruiter/candidates/add')}
              className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150"
            >
              <Users className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Add Candidate</span>
            </button>
            
            <button
              onClick={() => navigate('/app/recruiter/jobs/add')}
              className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150"
            >
              <Briefcase className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Post Job</span>
            </button>
            
            <button 
              onClick={() => navigate('/app/recruiter/calendar')}
              className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150"
            >
              <Calendar className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Schedule Interview</span>
            </button>
            
            <button
              onClick={() => navigate('/app/recruiter/reports')}
              className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150"
            >
              <FileText className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
