/**
 * Error Boundary specifically for Last Page Memory System
 * Handles errors related to route tracking, storage, and page restoration
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { handleRouteError, getDefaultDashboard, logRouteError } from '@/utils/routePermissions';
import storageManager from '@/utils/storageManager';

class LastPageMemoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      redirectTo: null,
      shouldRefresh: false,
      errorCount: 0,
      lastErrorTime: 0,
      isRecovering: false
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
    const now = Date.now();
    const timeSinceLastError = now - this.state.lastErrorTime;
    
    // Reset error count if it's been more than 5 minutes since last error
    const errorCount = timeSinceLastError > 5 * 60 * 1000 ? 1 : this.state.errorCount + 1;

    // Handle the error and determine appropriate fallback
    const { userRole, currentPath, onError } = this.props;
    const errorHandling = handleRouteError(error, currentPath, userRole);

    // Log comprehensive error information
    const errorContext = {
      path: currentPath,
      userRole,
      errorCount,
      component: 'LastPageMemoryErrorBoundary',
      errorInfo: errorInfo?.componentStack
    };

    logRouteError(error, errorContext);

    // Notify parent component of error if callback provided
    if (onError && typeof onError === 'function') {
      try {
        onError(error, errorContext);
      } catch (callbackError) {
        console.error('[LastPageMemoryErrorBoundary] Error in onError callback:', callbackError);
      }
    }

    // Attempt recovery for certain error types
    this.attemptRecovery(error, errorHandling);

    this.setState({
      error,
      errorInfo,
      redirectTo: errorHandling.redirectTo,
      shouldRefresh: errorHandling.shouldRefresh,
      errorCount,
      lastErrorTime: now
    });
  }

  attemptRecovery = (error, errorHandling) => {
    try {
      // Clear potentially corrupted storage for storage-related errors
      if (errorHandling.shouldClearStorage || 
          error.name === 'QuotaExceededError' || 
          error.message?.includes('storage') ||
          errorHandling.type === 'data_corruption') {
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[LastPageMemoryErrorBoundary] Attempting storage recovery');
        }

        // Clear last page memory storage
        try {
          const storage = storageManager.getActiveStorage();
          if (storage) {
            // Remove all last page memory entries
            const keysToRemove = [];
            for (let i = 0; i < storage.length; i++) {
              const key = storage.key(i);
              if (key && key.includes('lastVisitedPage')) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(key => storage.removeItem(key));
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`[LastPageMemoryErrorBoundary] Cleared ${keysToRemove.length} storage entries`);
            }
          }
        } catch (storageError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[LastPageMemoryErrorBoundary] Storage recovery failed:', storageError);
          }
        }
      }

      // For chunk loading errors, we might want to clear module cache
      if (error.name === 'ChunkLoadError') {
        if (process.env.NODE_ENV === 'development') {
          console.log('[LastPageMemoryErrorBoundary] Chunk load error detected, suggesting refresh');
        }
      }

    } catch (recoveryError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[LastPageMemoryErrorBoundary] Recovery attempt failed:', recoveryError);
      }
    }
  };

  handleRetry = () => {
    if (this.state.shouldRefresh) {
      // Force page refresh for chunk loading errors
      window.location.reload();
    } else {
      // Reset error state to retry rendering
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        redirectTo: null,
        shouldRefresh: false,
        isRecovering: true
      });

      // Reset recovery flag after a short delay
      setTimeout(() => {
        this.setState({ isRecovering: false });
      }, 1000);
    }
  };

  handleNavigateToSafety = () => {
    const { userRole } = this.props;
    const safePath = getDefaultDashboard(userRole || 'user');
    
    // Clear error state and navigate
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      redirectTo: safePath,
      shouldRefresh: false
    });
  };

  render() {
    if (this.state.hasError) {
      // If we have a redirect target, navigate there
      if (this.state.redirectTo && !this.state.isRecovering) {
        return <Navigate to={this.state.redirectTo} replace />;
      }

      // Show error UI with recovery options
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Navigation Error
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-4">
              {this.getErrorMessage()}
            </p>

            {this.state.errorCount > 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Multiple errors detected. Some features may be temporarily unavailable.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRecovering}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {this.state.isRecovering ? 'Recovering...' : 
                 this.state.shouldRefresh ? 'Refresh Page' : 'Try Again'}
              </button>
              
              <button
                onClick={this.handleNavigateToSafety}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Error Count:</strong> {this.state.errorCount}
                  </div>
                  <div>
                    <strong>Current Path:</strong> {this.props.currentPath}
                  </div>
                  <div>
                    <strong>User Role:</strong> {this.props.userRole}
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  getErrorMessage() {
    const { error, shouldRefresh, errorCount } = this.state;

    if (shouldRefresh) {
      return 'Failed to load page resources. Please refresh the page to continue.';
    }

    if (error?.name === 'ChunkLoadError') {
      return 'Failed to load application resources. A page refresh should resolve this issue.';
    }

    if (error?.message?.includes('storage') || error?.name === 'QuotaExceededError') {
      return 'Storage issue detected. We\'ve cleared some data to help resolve the problem.';
    }

    if (error?.message?.includes('permission') || error?.message?.includes('unauthorized')) {
      return 'You don\'t have permission to access this page. Redirecting to a safe location.';
    }

    if (errorCount > 3) {
      return 'Multiple navigation errors occurred. Some features may be temporarily limited.';
    }

    return 'A navigation error occurred. You can try again or return to the dashboard.';
  }
}

// HOC wrapper to provide auth context and current path
const LastPageMemoryErrorBoundaryWrapper = ({ children, onError, ...props }) => {
  const { user } = useAuth();
  const currentPath = window.location.pathname;
  
  return (
    <LastPageMemoryErrorBoundary 
      userRole={user?.role} 
      currentPath={currentPath}
      onError={onError}
      {...props}
    >
      {children}
    </LastPageMemoryErrorBoundary>
  );
};

export default LastPageMemoryErrorBoundaryWrapper;