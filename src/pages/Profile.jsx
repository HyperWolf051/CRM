import { useState } from 'react';
import { User, Shield, Bell, Camera, MapPin, Phone, Mail, Calendar, Award, Lock, Smartphone, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Tab configuration
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information and settings'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password and security settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Notification preferences'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} />;
      case 'security':
        return <SecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar 
                src={user?.avatar} 
                name={user?.name || 'User'} 
                size="2xl"
                className="ring-4 ring-white/20 shadow-xl"
              />
              <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 group">
                <Camera className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user?.name || 'User Name'}</h1>
                <Badge variant="success" className="bg-green-500/20 text-green-100 border-green-400/30">
                  Premium
                </Badge>
              </div>
              <p className="text-blue-100 text-lg mb-4">Senior Sales Manager</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">127</div>
                  <div className="text-blue-200 text-sm">Deals Closed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">15</div>
                  <div className="text-blue-200 text-sm">Team Members</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">$2.4M</div>
                  <div className="text-blue-200 text-sm">Revenue</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">94%</div>
                  <div className="text-blue-200 text-sm">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Tab Navigation */}
        <Card className="mb-6 shadow-xl">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-400 hidden lg:block">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </Card>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium">{user?.name || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-medium">{user?.email || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div className="font-medium">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">San Francisco, CA</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Joined</div>
                    <div className="font-medium">January 2023</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Department</div>
                    <div className="font-medium">Sales & Marketing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bio Section */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600 leading-relaxed">
              Experienced sales professional with over 8 years in B2B sales and team management. 
              Passionate about building relationships and driving revenue growth through strategic 
              partnerships and innovative sales approaches.
            </p>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Activity Summary */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Closed deal with Acme Corp</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Updated client proposal</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Scheduled team meeting</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [securityPreferences, setSecurityPreferences] = useState({
    loginNotifications: true,
    deviceTracking: true,
    sessionTimeout: '30',
    passwordExpiry: true
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordChangeSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleSecurityPreferenceChange = (preference, value) => {
    setSecurityPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || 'bg-red-500'
    };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>

          {passwordChangeSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">Password changed successfully!</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength.strength >= 80 ? 'text-green-600' :
                        passwordStrength.strength >= 60 ? 'text-blue-600' :
                        passwordStrength.strength >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {passwordData.confirmPassword && (
                  <div className="mt-2 text-sm">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="min-w-[140px]"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                {twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Enable Two-Factor Authentication'}
              </h3>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled 
                  ? 'Your account is protected with two-factor authentication using an authenticator app.'
                  : 'Add an extra layer of security to your account by enabling two-factor authentication.'
                }
              </p>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Two-Factor Authentication Active</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your account is secured with two-factor authentication. You'll need your authenticator app to sign in.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">
                  View Recovery Codes
                </Button>
                <Button variant="secondary" size="sm">
                  Reconfigure
                </Button>
              </div>
            </div>
          )}

          {!twoFactorEnabled && (
            <div className="mt-4">
              <Button onClick={() => setTwoFactorEnabled(true)}>
                Set Up Two-Factor Authentication
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Security Preferences Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Security Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* Login Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Login Notifications</h3>
                <p className="text-sm text-gray-600">
                  Get notified when someone signs into your account from a new device or location.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={securityPreferences.loginNotifications}
                  onChange={(e) => handleSecurityPreferenceChange('loginNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Device Tracking */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Device Tracking</h3>
                <p className="text-sm text-gray-600">
                  Keep track of devices that have accessed your account and manage trusted devices.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={securityPreferences.deviceTracking}
                  onChange={(e) => handleSecurityPreferenceChange('deviceTracking', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Session Timeout */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">Session Timeout</h3>
              <p className="text-sm text-gray-600 mb-3">
                Automatically sign out after a period of inactivity for security.
              </p>
              <select
                value={securityPreferences.sessionTimeout}
                onChange={(e) => handleSecurityPreferenceChange('sessionTimeout', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Password Expiry */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Password Expiry Reminders</h3>
                <p className="text-sm text-gray-600">
                  Get reminded to change your password every 90 days for better security.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={securityPreferences.passwordExpiry}
                  onChange={(e) => handleSecurityPreferenceChange('passwordExpiry', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Security Tip</p>
                <p className="text-yellow-700">
                  For maximum security, enable two-factor authentication, use a strong unique password, 
                  and regularly review your account activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Notifications Tab Component
const NotificationsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    dealUpdates: true,
    taskReminders: true,
    teamMessages: false,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
    securityAlerts: true,
    loginNotifications: true
  });

  const [pushNotifications, setPushNotifications] = useState({
    enabled: true,
    dealUpdates: true,
    taskReminders: true,
    teamMessages: false,
    urgentAlerts: true,
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  const [marketingPreferences, setMarketingPreferences] = useState({
    productUpdates: false,
    newsletters: true,
    promotions: false,
    surveys: true,
    eventInvitations: true,
    partnerOffers: false,
    industryNews: true
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleEmailNotificationChange = (setting, value) => {
    setEmailNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePushNotificationChange = (setting, value) => {
    setPushNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleMarketingPreferenceChange = (setting, value) => {
    setMarketingPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSavePreferences = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveStatus === 'saved' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <CheckCircle className={`w-5 h-5 ${
            saveStatus === 'saved' ? 'text-green-600' : 'text-blue-600'
          }`} />
          <span className={`${
            saveStatus === 'saved' ? 'text-green-800' : 'text-blue-800'
          }`}>
            {saveStatus === 'saved' ? 'Preferences saved successfully!' : 'Saving preferences...'}
          </span>
        </div>
      )}

      {/* Email Notifications Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            {/* Deal & Task Notifications */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Deal & Task Updates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Deal Updates</div>
                    <div className="text-sm text-gray-500">Get notified when deals change status or require attention</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.dealUpdates}
                    onChange={(value) => handleEmailNotificationChange('dealUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Task Reminders</div>
                    <div className="text-sm text-gray-500">Receive reminders for upcoming and overdue tasks</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.taskReminders}
                    onChange={(value) => handleEmailNotificationChange('taskReminders', value)}
                  />
                </div>
              </div>
            </div>

            {/* Team & Communication */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Team & Communication</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Team Messages</div>
                    <div className="text-sm text-gray-500">Notifications for team chat messages and mentions</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.teamMessages}
                    onChange={(value) => handleEmailNotificationChange('teamMessages', value)}
                  />
                </div>
              </div>
            </div>

            {/* System & Security */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">System & Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">System Alerts</div>
                    <div className="text-sm text-gray-500">Important system updates and maintenance notifications</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.systemAlerts}
                    onChange={(value) => handleEmailNotificationChange('systemAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Security Alerts</div>
                    <div className="text-sm text-gray-500">Login attempts and security-related notifications</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.securityAlerts}
                    onChange={(value) => handleEmailNotificationChange('securityAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Login Notifications</div>
                    <div className="text-sm text-gray-500">Get notified of new device logins</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.loginNotifications}
                    onChange={(value) => handleEmailNotificationChange('loginNotifications', value)}
                  />
                </div>
              </div>
            </div>

            {/* Reports */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Reports</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Weekly Reports</div>
                    <div className="text-sm text-gray-500">Weekly summary of your deals and activities</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.weeklyReports}
                    onChange={(value) => handleEmailNotificationChange('weeklyReports', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Monthly Reports</div>
                    <div className="text-sm text-gray-500">Monthly performance and analytics reports</div>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications.monthlyReports}
                    onChange={(value) => handleEmailNotificationChange('monthlyReports', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Push Notifications Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
          </div>

          {/* Master Push Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div>
              <div className="font-medium text-gray-900">Enable Push Notifications</div>
              <div className="text-sm text-gray-600">Master control for all push notifications</div>
            </div>
            <ToggleSwitch
              checked={pushNotifications.enabled}
              onChange={(value) => handlePushNotificationChange('enabled', value)}
            />
          </div>

          <div className="space-y-4">
            {/* Push Notification Types */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Notification Types</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Deal Updates</div>
                    <div className="text-sm text-gray-500">Push notifications for deal status changes</div>
                  </div>
                  <ToggleSwitch
                    checked={pushNotifications.dealUpdates}
                    onChange={(value) => handlePushNotificationChange('dealUpdates', value)}
                    disabled={!pushNotifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Task Reminders</div>
                    <div className="text-sm text-gray-500">Push reminders for tasks and deadlines</div>
                  </div>
                  <ToggleSwitch
                    checked={pushNotifications.taskReminders}
                    onChange={(value) => handlePushNotificationChange('taskReminders', value)}
                    disabled={!pushNotifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Team Messages</div>
                    <div className="text-sm text-gray-500">Push notifications for team communications</div>
                  </div>
                  <ToggleSwitch
                    checked={pushNotifications.teamMessages}
                    onChange={(value) => handlePushNotificationChange('teamMessages', value)}
                    disabled={!pushNotifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Urgent Alerts</div>
                    <div className="text-sm text-gray-500">Critical notifications that bypass quiet hours</div>
                  </div>
                  <ToggleSwitch
                    checked={pushNotifications.urgentAlerts}
                    onChange={(value) => handlePushNotificationChange('urgentAlerts', value)}
                    disabled={!pushNotifications.enabled}
                  />
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quiet Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Enable Quiet Hours</div>
                    <div className="text-sm text-gray-500">Pause non-urgent notifications during specified hours</div>
                  </div>
                  <ToggleSwitch
                    checked={pushNotifications.quietHours}
                    onChange={(value) => handlePushNotificationChange('quietHours', value)}
                    disabled={!pushNotifications.enabled}
                  />
                </div>

                {pushNotifications.quietHours && pushNotifications.enabled && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiet Hours Start
                      </label>
                      <input
                        type="time"
                        value={pushNotifications.quietStart}
                        onChange={(e) => handlePushNotificationChange('quietStart', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiet Hours End
                      </label>
                      <input
                        type="time"
                        value={pushNotifications.quietEnd}
                        onChange={(e) => handlePushNotificationChange('quietEnd', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Marketing Preferences Section */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Marketing Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Product & Company Updates */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Product & Company Updates</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Product Updates</div>
                    <div className="text-sm text-gray-500">New features, improvements, and product announcements</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.productUpdates}
                    onChange={(value) => handleMarketingPreferenceChange('productUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Newsletters</div>
                    <div className="text-sm text-gray-500">Monthly newsletters with tips, insights, and updates</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.newsletters}
                    onChange={(value) => handleMarketingPreferenceChange('newsletters', value)}
                  />
                </div>
              </div>
            </div>

            {/* Promotional Content */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Promotional Content</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Promotions & Offers</div>
                    <div className="text-sm text-gray-500">Special offers, discounts, and promotional campaigns</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.promotions}
                    onChange={(value) => handleMarketingPreferenceChange('promotions', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Partner Offers</div>
                    <div className="text-sm text-gray-500">Offers and promotions from our trusted partners</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.partnerOffers}
                    onChange={(value) => handleMarketingPreferenceChange('partnerOffers', value)}
                  />
                </div>
              </div>
            </div>

            {/* Engagement & Research */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Engagement & Research</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Surveys & Feedback</div>
                    <div className="text-sm text-gray-500">Participate in surveys to help improve our products</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.surveys}
                    onChange={(value) => handleMarketingPreferenceChange('surveys', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Event Invitations</div>
                    <div className="text-sm text-gray-500">Invitations to webinars, conferences, and networking events</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.eventInvitations}
                    onChange={(value) => handleMarketingPreferenceChange('eventInvitations', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Industry News</div>
                    <div className="text-sm text-gray-500">Curated industry news and insights relevant to your role</div>
                  </div>
                  <ToggleSwitch
                    checked={marketingPreferences.industryNews}
                    onChange={(value) => handleMarketingPreferenceChange('industryNews', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Preferences Note */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-1">About Marketing Communications</p>
                <p>
                  You can unsubscribe from marketing emails at any time using the unsubscribe link 
                  in any email. Essential service communications will still be sent regardless of these preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences}
          disabled={saveStatus === 'saving'}
          className="min-w-[140px]"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;