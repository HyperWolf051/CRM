import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validateRequired } from '@/utils/validation';
import { AlertCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

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
        navigate('/app/dashboard');
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

        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
            </button>
            
            <button 
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>
        </div>
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
                      <div className="font-semibold text-blue-900 text-sm">Admin User</div>
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
                      <div className="font-semibold text-green-900 text-sm">Demo User</div>
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

      {/* Register Link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-4">
          Don't have a CRM account?
        </p>
        <Button
          as={Link}
          to="/register"
          variant="secondary"
          size="lg"
          className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold"
        >
          Create New Account
        </Button>
      </div>
    </div>
  );
};

export default Login;
