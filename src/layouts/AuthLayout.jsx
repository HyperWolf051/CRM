import { Outlet } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>

      {/* Right Side - Illustration/Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5v3m0 0v3m0-3h3m-3 0h-3" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">CRM Pro</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Streamline your customer relationships with our powerful, intuitive platform
            </p>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-sm text-blue-100">Contacts</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm text-blue-100">Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm text-blue-100">Automation</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-blue-200">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-blue-200">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-blue-200">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}