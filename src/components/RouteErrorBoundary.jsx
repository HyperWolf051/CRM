/**
 * Route Error Boundary for handling route-specific errors
 * and providing graceful fallbacks for last page memory system
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { handleRouteError, getDefaultDashboard } from '@/utils/routePermissions';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      redirectTo: null,
      shouldRefresh: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Handle the error and determine appropriate fallback
    const { userRole, currentPath } = this.props;
    const errorHandling = handleRouteError(error, currentPath, userRole);

    this.setState({
      error,
      errorInfo,
      redirectTo: errorHandling.redirectTo,
      shouldRefresh: errorHandling.shouldRefresh
    });

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[RouteErrorBoundary] Caught error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.shouldRefresh) {
      window.location.reload();
    } else {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        redirectTo: null,
        shouldRefresh: false
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // If we have a redirect target, navigate there
      if (this.state.redirectTo) {
        return <Navigate to={this.state.redirectTo} replace />;
      }

      // Otherwise show error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              {this.state.shouldRefresh 
                ? 'Failed to load page resources. Please refresh the page.'
                : 'An error occurred while loading this page. You can try again or return to the dashboard.'
              }
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {this.state.shouldRefresh ? 'Refresh Page' : 'Try Again'}
              </button>
              
              {!this.state.shouldRefresh && (
                <Navigate to={getDefaultDashboard(this.props.userRole || 'user')} replace />
              )}
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper to provide auth context
const RouteErrorBoundaryWrapper = ({ children, ...props }) => {
  const { user } = useAuth();
  
  return (
    <RouteErrorBoundary userRole={user?.role} {...props}>
      {children}
    </RouteErrorBoundary>
  );
};

export default RouteErrorBoundaryWrapper;