import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

// Layouts (keep these as regular imports since they're used immediately)
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const ContactDetails = lazy(() => import('@/pages/ContactDetails'));
const Deals = lazy(() => import('@/pages/Deals'));
const Companies = lazy(() => import('@/pages/Companies'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Candidates = lazy(() => import('@/pages/Candidates'));
const AddCandidate = lazy(() => import('@/pages/AddCandidate'));
const Settings = lazy(() => import('@/pages/Settings'));
const Team = lazy(() => import('@/pages/Team'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));

// Components (keep these as regular imports since they're used immediately)
import ProtectedRoute from '@/components/ProtectedRoute';
import RootRedirect from '@/components/RootRedirect';
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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Root redirect */}
                <Route path="/" element={<RootRedirect />} />
                
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>
                
                {/* Protected app routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="candidates/add" element={<AddCandidate />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="contacts/:id" element={<ContactDetails />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="analytics" element={<ComingSoon title="Analytics" description="Advanced reporting and business insights" />} />
                  <Route path="email" element={<ComingSoon title="Email" description="Integrated email management system" />} />
                  <Route path="calls" element={<ComingSoon title="Calls" description="Call tracking and management" />} />
                  <Route path="documents" element={<ComingSoon title="Documents" description="Document storage and management" />} />
                  <Route path="goals" element={<ComingSoon title="Goals" description="Set and track your business goals" />} />
                  <Route path="projects" element={<ComingSoon title="Projects" description="Project management and collaboration" />} />
                  <Route path="team" element={<Team />} />
                  <Route path="automation" element={<ComingSoon title="Automation" description="Workflow automation and triggers" />} />
                  <Route path="settings" element={<Settings />} />
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
