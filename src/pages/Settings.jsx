import { useState, useEffect } from 'react';
import { User, Lock, Bell, Moon, Sun, Palette } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Toggle from '@/components/ui/Toggle';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validateRequired, getEmailError, validatePassword, getPasswordError } from '@/utils/validation';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // User Information form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordFormErrors, setPasswordFormErrors] = useState({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences form state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    language: 'en',
    darkMode: false
  });
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
      
      // Initialize preferences if available
      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          pushNotifications: user.preferences.pushNotifications ?? false,
          marketingEmails: user.preferences.marketingEmails ?? false,
          language: user.preferences.language ?? 'en',
          darkMode: user.preferences.darkMode ?? false
        });
      }
    }
  }, [user]);

  // Handle user form input changes
  const handleUserFormChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (userFormErrors[field]) {
      setUserFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate user form
  const validateUserForm = () => {
    const errors = {};
    
    if (!validateRequired(userForm.name)) {
      errors.name = 'Name is required';
    }
    
    const emailError = getEmailError(userForm.email);
    if (emailError) {
      errors.email = emailError;
    }
    
    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle user information save
  const handleSaveUserInfo = async (e) => {
    e.preventDefault();
    
    if (!validateUserForm()) {
      return;
    }
    
    setIsUpdatingUser(true);
    
    try {
      const result = await updateUser({
        name: userForm.name,
        email: userForm.email,
        avatar: userForm.avatar
      });
      
      if (result.success) {
        showToast('success', 'User information updated successfully');
      } else {
        showToast('error', result.error || 'Failed to update user information');
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Handle password form input changes
  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (passwordFormErrors[field]) {
      setPasswordFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!validateRequired(passwordForm.currentPassword)) {
      errors.currentPassword = 'Current password is required';
    }
    
    const newPasswordError = getPasswordError(passwordForm.newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }
    
    if (!validateRequired(passwordForm.confirmPassword)) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast('success', 'Password updated successfully');
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      showToast('error', message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle preferences change
  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  // Handle preferences save
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    
    setIsUpdatingPreferences(true);
    
    try {
      await api.put('/users/me/preferences', preferences);
      showToast('success', 'Preferences updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update preferences';
      showToast('error', message);
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* User Information Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSaveUserInfo} className="space-y-6">
          {/* Avatar Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <Avatar 
                src={userForm.avatar} 
                name={userForm.name} 
                size="lg" 
              />
              <div className="flex-1">
                <Input
                  placeholder="Avatar URL (optional)"
                  value={userForm.avatar}
                  onChange={(e) => handleUserFormChange('avatar', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL to your profile picture or leave empty to use initials
                </p>
              </div>
            </div>
          </div>

          {/* Name and Email Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={userForm.name}
              onChange={(e) => handleUserFormChange('name', e.target.value)}
              error={userFormErrors.name}
              placeholder="Enter your full name"
            />
            
            <Input
              label="Email Address"
              type="email"
              value={userForm.email}
              onChange={(e) => handleUserFormChange('email', e.target.value)}
              error={userFormErrors.email}
              placeholder="Enter your email address"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              loading={isUpdatingUser}
              disabled={isUpdatingUser}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-600">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                error={passwordFormErrors.currentPassword}
                placeholder="Enter your current password"
              />
            </div>
            
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
              error={passwordFormErrors.newPassword}
              placeholder="Enter your new password"
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
              error={passwordFormErrors.confirmPassword}
              placeholder="Confirm your new password"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least 1 uppercase letter</li>
              <li>• Contains at least 1 number</li>
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              variant="danger"
              loading={isUpdatingPassword}
              disabled={isUpdatingPassword}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Preferences Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
            <p className="text-sm text-gray-600">Customize your experience</p>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-6">
          {/* Notification Settings */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <Toggle
                checked={preferences.emailNotifications}
                onChange={(value) => handlePreferenceChange('emailNotifications', value)}
                label="Email Notifications"
                description="Receive email notifications for important updates"
              />
              
              <Toggle
                checked={preferences.pushNotifications}
                onChange={(value) => handlePreferenceChange('pushNotifications', value)}
                label="Push Notifications"
                description="Receive browser push notifications"
              />
              
              <Toggle
                checked={preferences.marketingEmails}
                onChange={(value) => handlePreferenceChange('marketingEmails', value)}
                label="Marketing Emails"
                description="Receive emails about new features and updates"
              />
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Language & Region</h3>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </h3>
            <div className="space-y-4">
              <Toggle
                checked={isDarkMode}
                onChange={setIsDarkMode}
                label="Dark Mode"
                description="Use dark theme throughout the application (Coming Soon)"
                icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              />
              <Toggle
                checked={preferences.darkMode}
                onChange={(value) => handlePreferenceChange('darkMode', value)}
                label="Auto Dark Mode"
                description="Automatically switch based on system preference (Coming Soon)"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              loading={isUpdatingPreferences}
              disabled={isUpdatingPreferences}
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;