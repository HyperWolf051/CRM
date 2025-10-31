import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

// Layouts (keep these as regular imports since they're used immediately)
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import RecruiterLayout from '@/layouts/RecruiterLayout';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const ContactDetails = lazy(() => import('@/pages/ContactDetails'));
const Jobs = lazy(() => import('@/pages/Jobs'));
const Companies = lazy(() => import('@/pages/Companies'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Candidates = lazy(() => import('@/pages/Candidates'));
const AddCandidate = lazy(() => import('@/pages/AddCandidate'));
const AddClient = lazy(() => import('@/pages/AddClient'));
const AddJob = lazy(() => import('@/pages/AddJob'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Team = lazy(() => import('@/pages/Team'));
const AddMember = lazy(() => import('@/pages/AddMember'));
const EmailAutomation = lazy(() => import('@/pages/EmailAutomation'));
const ReminderSystem = lazy(() => import('@/pages/ReminderSystem'));
const AutomationDashboard = lazy(() => import('@/pages/AutomationDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));
const AnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard'));
const CSVImport = lazy(() => import('@/pages/CSVImport'));
const CSVExport = lazy(() => import('@/pages/CSVExport'));

// Recruiter pages
const RecruiterDashboard = lazy(() => import('@/pages/recruiter/RecruiterDashboard'));
const RecruiterCandidates = lazy(() => import('@/pages/recruiter/RecruiterCandidates'));
const RecruiterAddCandidate = lazy(() => import('@/pages/recruiter/RecruiterAddCandidate'));
const RecruiterClients = lazy(() => import('@/pages/recruiter/RecruiterClients'));
const RecruiterClientDetail = lazy(() => import('@/pages/recruiter/RecruiterClientDetail'));
const RecruiterAddClient = lazy(() => import('@/pages/recruiter/RecruiterAddClient'));
const RecruiterCalendar = lazy(() => import('@/pages/recruiter/RecruiterCalendar'));
const RecruiterScheduleInterview = lazy(() => import('@/pages/recruiter/RecruiterScheduleInterview'));

// Components (keep these as regular imports since they're used immediately)
import ProtectedRoute from '@/components/ProtectedRoute';
import CrmProtectedRoute from '@/components/CrmProtectedRoute';
import RecruiterProtectedRoute from '@/components/RecruiterProtectedRoute';
import RootRedirect from '@/components/RootRedirect';
import RouteTracker from '@/components/RouteTracker';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkStatus from '@/components/NetworkStatus';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import DemoModeIndicator from '@/components/DemoModeIndicator';

// Loading fallback component - memoized for performance
const PageLoader = memo(() => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <SkeletonLoader width="200px" height="24px" className="mb-4" />
      <SkeletonLoader width="300px" height="16px" className="mb-2" />
      <SkeletonLoader width="250px" height="16px" />
    </div>
  </div>
));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <DemoModeIndicator />
            <NetworkStatus />
            <RouteTracker />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Root redirect */}
                <Route path="/" element={<RootRedirect />} />
                
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>
                
                {/* Protected CRM routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <CrmProtectedRoute>
                      <DashboardLayout />
                    </CrmProtectedRoute>
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="candidates/add" element={<AddCandidate />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="contacts/:id" element={<ContactDetails />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/add" element={<AddJob />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="companies/add" element={<AddClient />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="email" element={<ComingSoon title="Email" description="Integrated email management system" />} />
                  <Route path="calls" element={<ComingSoon title="Calls" description="Call tracking and management" />} />
                  <Route path="documents" element={<ComingSoon title="Documents" description="Document storage and management" />} />
                  <Route path="goals" element={<ComingSoon title="Goals" description="Set and track your business goals" />} />
                  <Route path="projects" element={<ComingSoon title="Projects" description="Project management and collaboration" />} />
                  <Route path="team" element={<Team />} />
                  <Route path="team/add" element={<AddMember />} />
                  <Route path="automation" element={<AutomationDashboard />} />
                  <Route path="email-automation" element={<EmailAutomation />} />
                  <Route path="reminders" element={<ReminderSystem />} />
                  <Route path="csv-import" element={<CSVImport />} />
                  <Route path="csv-export" element={<CSVExport />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* Recruiter routes - Demo access only */}
                <Route path="/app/recruiter" element={
                  <RecruiterProtectedRoute>
                    <RecruiterLayout />
                  </RecruiterProtectedRoute>
                }>
                  <Route index element={<RecruiterDashboard />} />
                  <Route path="dashboard" element={<RecruiterDashboard />} />
                  <Route path="candidates" element={<RecruiterCandidates />} />
                  <Route path="candidates/add" element={<RecruiterAddCandidate />} />
                  <Route path="clients" element={<RecruiterClients />} />
                  <Route path="clients/add" element={<RecruiterAddClient />} />
                  <Route path="clients/:id" element={<RecruiterClientDetail />} />
                  <Route path="jobs" element={<ComingSoon title="Jobs" description="Job posting and management" />} />
                  <Route path="interviews" element={<ComingSoon title="Interviews" description="Interview management system" />} />
                  <Route path="offers" element={<ComingSoon title="Offers" description="Job offer management system" />} />
                  <Route path="calendar" element={<RecruiterCalendar />} />
                  <Route path="calendar/schedule" element={<RecruiterScheduleInterview />} />
                  <Route path="analytics" element={<ComingSoon title="Analytics" description="Recruitment analytics dashboard" />} />
                  <Route path="reports" element={<ComingSoon title="Reports" description="Daily reporting system" />} />
                  <Route path="csv-import" element={<CSVImport />} />
                  <Route path="csv-export" element={<CSVExport />} />
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App
