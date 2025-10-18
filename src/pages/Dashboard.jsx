import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Briefcase,
  Phone,
  ChevronLeft,
  ChevronRight,
  Zap,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  Edit,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  RefreshCw
} from 'lucide-react';

// Enhanced Components
import { BarChart, PieChart, ChartControls } from '../components/ui/Chart';
import EnhancedHeader from '../components/dashboard/EnhancedHeader';
import AdvancedMetricCard from '../components/dashboard/AdvancedMetricCard';
import DealPipelineStep from '../components/dashboard/DealPipelineStep';
import InteractiveCalendar from '../components/dashboard/InteractiveCalendar';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import CandidateCard from '../components/dashboard/CandidateCard';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState('30D');
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);
  const [isDealsLoading, setIsDealsLoading] = useState(false); // Separate loading for deals
  const [currentPipelineStep, setCurrentPipelineStep] = useState(2);
  const [shouldAnimateChart, setShouldAnimateChart] = useState(true); // Control chart animations

  // Enhanced chart data with more details
  const salesData = [
    { label: 'Jan', value: 45, color: 'fill-blue-500', details: 'Revenue: $45k, Profit: $12k' },
    { label: 'Feb', value: 58, color: 'fill-blue-600', details: 'Revenue: $58k, Profit: $18k' },
    { label: 'Mar', value: 38, color: 'fill-blue-400', details: 'Revenue: $38k, Profit: $8k' },
    { label: 'Apr', value: 72, color: 'fill-blue-700', details: 'Revenue: $72k, Profit: $22k' },
    { label: 'May', value: 52, color: 'fill-blue-500', details: 'Revenue: $52k, Profit: $15k' },
    { label: 'Jun', value: 41, color: 'fill-blue-400', details: 'Revenue: $41k, Profit: $11k' }
  ];



  const statusData = [
    { label: 'Active', value: 45, color: 'text-green-500' },
    { label: 'Pending', value: 23, color: 'text-yellow-500' },
    { label: 'Closed', value: 12, color: 'text-blue-500' },
    { label: 'Lost', value: 8, color: 'text-red-500' }
  ];

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

  // Calendar events data
  const calendarEvents = [
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
  ];

  // Enhanced candidate data
  const candidateDetails = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'Senior React Developer',
      address: 'San Francisco, CA',
      status: 'Available',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      rating: 4.8,
      interviews: 2,
      salary: '$120,000'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      role: 'UX/UI Designer',
      address: 'New York, NY',
      status: 'Interviewed',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      rating: 4.6,
      interviews: 1,
      salary: '$95,000'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      role: 'Backend Engineer',
      address: 'Austin, TX',
      status: 'Hired',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      rating: 4.9,
      interviews: 3,
      salary: '$110,000'
    }
  ];

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

  const handleChartExport = () => {
    console.log('Exporting chart data...');
    // Implement export functionality
  };

  const handleChartRefresh = () => {
    setIsLoading(true);
    // Disable animation temporarily, then re-enable to trigger fresh animation
    // This ensures chart only animates on explicit refresh, not on other data updates
    setShouldAnimateChart(false);
    
    setTimeout(() => {
      setIsLoading(false);
      // Re-enable animation to trigger the chart animation
      setShouldAnimateChart(true);
    }, 500);
  };

  const handleBarClick = (data, index) => {
    console.log('Bar clicked:', data, index);
  };



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

  const handleCandidateAction = (action, candidate) => {
    console.log(`${action} candidate:`, candidate);
    switch (action) {
      case 'view':
        navigate(`/app/candidates/${candidate.id}`);
        break;
      case 'edit':
        navigate(`/app/candidates/${candidate.id}/edit`);
        break;
      case 'contact':
        // Open email client or contact modal
        break;
      case 'schedule':
        navigate('/app/calendar');
        break;
    }
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

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <EnhancedHeader />
      
      {/* Main Dashboard Content - Full Width (Day 1 & 2 Updates) */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-6 auto-rows-min w-full">
          
          {/* Enhanced Metrics Row - Full Width */}
          <div className="lg:col-span-12 xl:col-span-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
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
                loading={isLoading}
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

          {/* Enhanced Charts Row - 2 Column Layout */}
          <div className="lg:col-span-12 xl:col-span-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Interactive Monthly Changes Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <ChartControls
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  onExport={handleChartExport}
                  onRefresh={handleChartRefresh}
                />
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Monthly Changes</h2>
                    <p className="text-sm text-gray-500">Revenue trends with smooth growth animations</p>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5%
                  </div>
                </div>
                
                <BarChart 
                  key={`chart-${shouldAnimateChart}`}
                  data={salesData} 
                  height={250} 
                  onBarClick={handleBarClick}
                  animate={shouldAnimateChart}
                  className="mb-4" 
                />
                
                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-lg font-bold text-blue-600">$306k</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">$86k</div>
                    <div className="text-xs text-gray-500">Total Profit</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Deal Pipeline */}
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

          {/* Content Row - Calendar and Activity */}
          <div className="lg:col-span-8 xl:col-span-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Enhanced Interactive Calendar */}
              <InteractiveCalendar
                events={calendarEvents}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                currentDate={currentCalendarDate}
                onDateChange={setCurrentCalendarDate}
              />

              {/* Enhanced Activity Timeline */}
              <ActivityTimeline
                activities={recentActivity}
                onActivityClick={handleActivityClick}
              />
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-4 xl:col-span-6">
            <QuickActionsPanel onActionClick={handleQuickAction} />
          </div>

          {/* Bottom Row - Enhanced Candidate Grid */}
          <div className="lg:col-span-12 xl:col-span-16">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Top Candidates
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {candidateDetails.length} active candidates in pipeline
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 group">
                    <Filter className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:scale-105">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </button>
                </div>
              </div>
              
              {/* Enhanced Candidate Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {candidateDetails.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onView={() => handleCandidateAction('view', candidate)}
                    onEdit={() => handleCandidateAction('edit', candidate)}
                    onContact={() => handleCandidateAction('contact', candidate)}
                    onSchedule={() => handleCandidateAction('schedule', candidate)}
                  />
                ))}
              </div>
              
              {/* Show More Button */}
              <div className="text-center pt-6 border-t border-gray-200 mt-6">
                <button 
                  onClick={() => navigate('/app/candidates')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Candidates →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;