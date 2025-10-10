import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validateRequired } from '@/utils/validation';

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

        {/* Social Login Options */}
        <div className="mb-6">
          <div className="flex space-x-3 mb-4">
            <button className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="patricia@ryker.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`
              w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.email
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
              }
              ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`
              w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.password
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
              }
              ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white text-sm
            bg-blue-600 hover:bg-blue-700 transition-all duration-200
            ${isSubmitting
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:shadow-lg active:transform active:scale-[0.98]'
            }
            focus:outline-none focus:ring-4 focus:ring-blue-500/25
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : (
            'Next'
          )}
        </button>
      </form>

      {/* Test Credentials Section */}
      <div className="mt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-800">Demo Accounts</h4>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleFillCredentials('admin@crm.com', 'admin123')}
              className="w-full p-2 bg-white border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors text-sm"
            >
              <div className="font-medium text-gray-900">Admin User</div>
              <div className="text-gray-500 text-xs">admin@crm.com / admin123</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('demo@crm.com', 'demo123')}
              className="w-full p-2 bg-white border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors text-sm"
            >
              <div className="font-medium text-gray-900">Demo User</div>
              <div className="text-gray-500 text-xs">demo@crm.com / demo123</div>
            </button>
          </div>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have a CRM account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
