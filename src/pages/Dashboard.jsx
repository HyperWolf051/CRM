import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  Users,
  Target
} from 'lucide-react';

// Enhanced Components
// Chart components removed as part of Revenue Trend removal
import EnhancedHeader from '../components/dashboard/EnhancedHeader';
import AdvancedMetricCard from '../components/dashboard/AdvancedMetricCard';
import DealPipelineStep from '../components/dashboard/DealPipelineStep';
import InteractiveCalendar from '../components/dashboard/InteractiveCalendar';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [isDealsLoading, setIsDealsLoading] = useState(false); // Separate loading for deals
  const [currentPipelineStep, setCurrentPipelineStep] = useState(2);

  // Sales data removed as part of Revenue Trend chart removal





  // Pipeline steps data
  const pipelineSteps = [
    { label: 'Lead', count: 45 },
    { label: 'Qualified', count: 32 },
    { label: 'Proposal', count: 18 },
    { label: 'Negotiation', count: 12 },
    { label: 'Closed', count: 8 }
  ];

  // Sparkline data for metric cards
  const weeklyBalanceSparkline = [15, 18, 12, 20, 25, 22, 20];
  const activeJobsSparkline = [20, 22, 18, 24, 26, 24, 24];
  const candidatesSparkline = [45, 48, 42, 47, 49, 46, 47];

  // Calendar events state
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      title: 'Interview - Sarah Johnson',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      time: '2:00 PM',
      color: 'bg-blue-500',
      type: 'interview'
    },
    {
      id: 2,
      title: 'Team Meeting',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      color: 'bg-green-500',
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Client Call',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '3:30 PM',
      color: 'bg-purple-500',
      type: 'call'
    }
  ]);



  // Enhanced activity data
  const getTimeAgo = (hoursAgo) => {
    const now = new Date();
    const activityTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const recentActivity = [
    {
      id: 1,
      message: 'Sarah Johnson was added as a candidate',
      time: getTimeAgo(2),
      type: 'candidate',
      user: 'John Doe',
      metadata: { location: 'San Francisco, CA' }
    },
    {
      id: 2,
      message: 'Client call scheduled with TechCorp',
      time: getTimeAgo(4),
      type: 'meeting',
      user: 'Uroos Khan',
      metadata: { participants: 3, location: 'Virtual' }
    },
    {
      id: 3,
      message: 'Interview completed for Michael Chen',
      time: getTimeAgo(24),
      type: 'interview',
      user: 'Sarah Smith',
      metadata: { location: 'Conference Room A' }
    },
    {
      id: 4,
      message: 'New Senior Developer job posting published',
      time: getTimeAgo(48),
      type: 'job',
      user: 'System'
    },
    {
      id: 5,
      message: 'Deal closed with StartupXYZ - $50k',
      time: getTimeAgo(72),
      type: 'deal',
      user: 'Mike Johnson'
    }
  ];

  // Event handlers
  const handleMetricClick = (metric) => {
    console.log('Metric clicked:', metric);
    // Navigate to detailed view
  };

  // Chart-related handlers removed as part of Revenue Trend chart removal



  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    navigate('/app/calendar');
  };

  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
    navigate('/app/calendar');
  };

  const handleActivityClick = (activity) => {
    console.log('Activity clicked:', activity);
  };

  const handleEventAdd = (newEvent) => {
    setCalendarEvents(prevEvents => [...prevEvents, newEvent]);
    console.log('New event added:', newEvent);
  };



  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    switch (action.id) {
      case 'add-candidate':
        navigate('/app/candidates');
        break;
      case 'post-job':
        navigate('/app/deals');
        break;
      case 'schedule-meeting':
        navigate('/app/calendar');
        break;
      case 'send-email':
        // Open email composer
        break;
      default:
        console.log('Action not implemented:', action.id);
    }
  };

  const handlePipelineStepClick = (stepIndex) => {
    setCurrentPipelineStep(stepIndex);
  };

  const handleDealsRefresh = () => {
    setIsDealsLoading(true);
    // Simulate deals refresh without affecting chart animations
    setTimeout(() => {
      setIsDealsLoading(false);
    }, 1000);
  };

  // Time range handler removed as part of Revenue Trend chart removal

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <EnhancedHeader />
      
      {/* Main Dashboard Content - Full Width with Optimized Spacing */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-4 lg:gap-6 auto-rows-min w-full">
          
          {/* Enhanced Metrics Row - Full Width with Optimized Spacing */}
          <div className="lg:col-span-12 xl:col-span-16 mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              
              {/* Weekly Balance Card */}
              <AdvancedMetricCard
                title="Weekly Balance"
                value="$20k"
                trend={12}
                comparison="vs $17.8k last week"
                icon={DollarSign}
                color="from-blue-600 via-blue-700 to-blue-800"
                onClick={() => handleMetricClick('weekly-balance')}
                sparklineData={weeklyBalanceSparkline}
                loading={false}
              />

              {/* Active Jobs Card */}
              <AdvancedMetricCard
                title="Active Jobs"
                value="24"
                trend={8}
                comparison="3 new this week"
                icon={Briefcase}
                color="from-orange-500 via-orange-600 to-orange-700"
                onClick={() => handleMetricClick('active-jobs')}
                sparklineData={activeJobsSparkline}
                loading={isDealsLoading}
              />

              {/* New Candidates Card */}
              <AdvancedMetricCard
                title="New Candidates"
                value="47"
                trend={-5}
                comparison="vs 49 last week"
                icon={Users}
                color="from-emerald-600 via-emerald-700 to-emerald-800"
                onClick={() => handleMetricClick('candidates')}
                sparklineData={candidatesSparkline}
                loading={false} // Candidates not affected by deals refresh
              />

              {/* Pipeline Conversion Card */}
              <AdvancedMetricCard
                title="Pipeline Conversion"
                value="18%"
                trend={3}
                comparison="vs 15% last month"
                icon={Target}
                color="from-purple-600 via-purple-700 to-purple-800"
                onClick={() => handleMetricClick('conversion')}
                sparklineData={[12, 15, 13, 18, 16, 18, 18]}
                loading={isDealsLoading}
              />
            </div>
          </div>

          {/* Enhanced Charts Row - Activity Feed | Deal Pipeline (2-column layout) */}
          <div className="lg:col-span-12 xl:col-span-16 mb-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              
              {/* Enhanced Activity Timeline - Now spans half the width */}
              <div className="lg:col-span-1">
                <ActivityTimeline
                  activities={recentActivity}
                  onActivityClick={handleActivityClick}
                />
              </div>

              {/* Enhanced Deal Pipeline - Now spans half the width */}
              <div className="lg:col-span-1">
                <DealPipelineStep
                  steps={pipelineSteps}
                  currentStep={currentPipelineStep}
                  onStepClick={handlePipelineStepClick}
                  onRefresh={handleDealsRefresh}
                  showCounts={true}
                  loading={isDealsLoading}
                />
              </div>
            </div>
          </div>

          {/* Content Row - Wider Calendar (Day 4 Optimization) */}
          <div className="lg:col-span-8 xl:col-span-11">
            <InteractiveCalendar
              events={calendarEvents}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onEventAdd={handleEventAdd}
              currentDate={currentCalendarDate}
              onDateChange={setCurrentCalendarDate}
            />
          </div>

          {/* Sidebar - Compact Quick Actions */}
          <div className="lg:col-span-4 xl:col-span-5">
            <QuickActionsPanel onActionClick={handleQuickAction} />
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;