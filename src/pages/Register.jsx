import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validateRequired, getPasswordError } from '@/utils/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate name
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordError = getPasswordError(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(formData.name, formData.email, formData.password);

      if (result.success) {
        showToast('success', 'Account created successfully! Welcome to CRM.');
        navigate('/app/dashboard');
      } else {
        showToast('error', result.error);
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started with CRM</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<User size={20} />}
              disabled={isSubmitting}
            />

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={20} />}
              disabled={isSubmitting}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={20} />}
              disabled={isSubmitting}
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={20} />}
              disabled={isSubmitting}
            />

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>At least 8 characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
              </ul>
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
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 CRM App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
