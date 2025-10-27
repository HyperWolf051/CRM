import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validateRequired } from '@/utils/validation';
import { AlertCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const { showToast } = useToast();

  // Redirect to appropriate dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Determine redirect path based on user role and dashboard type
      let redirectPath = '/app/dashboard'; // Default
      
      if (user.role === 'recruiter' || user.dashboardType === 'recruiter') {
        redirectPath = '/app/recruiter/dashboard';
      } else if (user.dashboardType === 'crm' || user.role === 'admin') {
        redirectPath = '/app/dashboard';
      }
      
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle filling test credentials
  const handleFillCredentials = (email, password) => {
    setFormData({ email, password });
    setErrors({ email: '', password: '' });
  };

  // Copy credentials to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', 'Copied to clipboard!');
    } catch (err) {
      showToast('error', 'Failed to copy to clipboard');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showToast('success', 'Login successful! Welcome back.');
        
        // The useEffect will handle the redirect based on user role
        // No need to manually navigate here as the user state will be updated
        // and the useEffect will trigger the appropriate redirect
      } else {
        showToast('error', result.error);
      }
    } catch {
      showToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5v3m0 0v3m0-3h3m-3 0h-3" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Pro</h1>
            <p className="text-sm text-gray-500">Business Management Suite</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600">Welcome back! Please sign in to your account</p>
        </div>


      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="patricia@ryker.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.email}
          />
        </div>

        {/* Password Field */}
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.password}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label 
            className="flex items-center cursor-pointer group"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                rememberMe 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 group-hover:border-blue-400'
              }`}>
                {rememberMe && (
                  <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Remember me
            </span>
          </label>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 font-semibold px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>


      </form>

      {/* Demo Credentials Collapsible Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-amber-900">Demo Credentials</h4>
                <p className="text-xs text-amber-700">Click to view test accounts</p>
              </div>
            </div>
            {showDemoCredentials ? (
              <ChevronUp className="w-5 h-5 text-amber-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600" />
            )}
          </button>

          {showDemoCredentials && (
            <div className="mt-3 bg-white border border-amber-200 rounded-xl p-4 animate-fade-in">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-blue-900 text-sm">Admin Dashboard</div>
                      <div className="text-blue-700 text-xs">Full access to all features</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFillCredentials('admin@crm.com', 'admin123')}
                      className="text-blue-600 hover:bg-blue-200"
                    >
                      Use Account
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-800">Email: admin@crm.com</span>
                      <button
                        onClick={() => copyToClipboard('admin@crm.com')}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-800">Password: admin123</span>
                      <button
                        onClick={() => copyToClipboard('admin123')}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-green-900 text-sm">Recuiter Dashboard</div>
                      <div className="text-green-700 text-xs">Limited access for testing</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFillCredentials('demo@crm.com', 'demo123')}
                      className="text-green-600 hover:bg-green-200"
                    >
                      Use Account
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-800">Email: demo@crm.com</span>
                      <button
                        onClick={() => copyToClipboard('demo@crm.com')}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-800">Password: demo123</span>
                      <button
                        onClick={() => copyToClipboard('demo123')}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Note */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need access to the system?
          </p>
          <p className="text-xs text-gray-500">
            Contact your administrator to create your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
