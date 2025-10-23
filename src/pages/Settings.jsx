import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Users, 
  Palette, 
  Globe, 
  ChevronDown, 
  Download, 
  Upload, 
  Key, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Monitor, 
  Smartphone, 
  Mail, 
  Slack, 
  Github, 
  Zap,
  HardDrive,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  X,
  Search,
  Save,
  History,
  FileText,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Loader2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import { useToast } from '@/context/ToastContext';

// Utility function for debouncing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Settings = () => {
  const { showToast } = useToast();
  
  // Navigation and UI State
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Settings History
  const [settingsHistory, setSettingsHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    companyName: 'TalentHub India',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    language: 'en-IN',
    autoBackup: true,
    dataRetentionDays: 365,
    sessionTimeout: 30,
    maintenanceMode: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: 'app',
    sessionSettings: {
      maxSessions: 5,
      sessionTimeout: 30,
      requireReauth: true,
      logoutOnClose: false
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
      expirationDays: 90
    },
    trustedDevices: [],
    backupCodes: []
  });

  // Integration Settings State
  const [integrations, setIntegrations] = useState({
    emailService: {
      enabled: true,
      provider: 'sendgrid',
      apiKey: '••••••••••••••••',
      status: 'connected'
    },
    slackIntegration: {
      enabled: false,
      webhookUrl: '',
      status: 'disconnected'
    },
    githubIntegration: {
      enabled: true,
      apiKey: '••••••••••••••••',
      status: 'connected'
    },
    zapierIntegration: {
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    }
  });

  // Team Management State
  const [teamSettings, setTeamSettings] = useState({
    maxUsers: 50,
    currentUsers: 12,
    defaultRole: 'user',
    requireApproval: true,
    allowGuestAccess: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
      expirationDays: 90
    }
  });

  // Application Preferences State
  const [appPreferences, setAppPreferences] = useState({
    defaultTheme: 'light',
    defaultDashboard: 'overview',
    enableAnimations: true,
    showWelcomeScreen: true,
    compactMode: false,
    autoSave: true,
    autoSaveInterval: 30
  });

  // Loading states
  const [isUpdating, setIsUpdating] = useState({
    system: false,
    integrations: false,
    team: false,
    app: false,
    data: false
  });

  // API Keys visibility state
  const [showApiKeys, setShowApiKeys] = useState({});

  // Settings Tabs Configuration
  const settingsTabs = [
    { id: 'general', label: 'General', icon: SettingsIcon, description: 'Basic system configuration' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Security and authentication settings' },
    { id: 'integrations', label: 'Integrations', icon: Zap, description: 'Third-party service connections' },
    { id: 'team', label: 'Team', icon: Users, description: 'User management and permissions' },
    { id: 'data', label: 'Data', icon: Database, description: 'Data management and backup' },
    { id: 'preferences', label: 'Preferences', icon: Palette, description: 'Application appearance and behavior' }
  ];

  // Validation Functions
  const validateSettings = (section, data) => {
    const errors = {};
    
    switch (section) {
      case 'general':
        if (!data.companyName?.trim()) {
          errors.companyName = 'Company name is required';
        }
        if (data.dataRetentionDays < 30) {
          errors.dataRetentionDays = 'Minimum 30 days required';
        }
        if (data.sessionTimeout < 5) {
          errors.sessionTimeout = 'Minimum 5 minutes required';
        }
        break;
      case 'security':
        if (data.passwordPolicy.minLength < 6) {
          errors.minLength = 'Minimum 6 characters required';
        }
        if (data.sessionSettings.maxSessions < 1) {
          errors.maxSessions = 'At least 1 session required';
        }
        break;
      case 'team':
        if (data.maxUsers < data.currentUsers) {
          errors.maxUsers = 'Cannot be less than current users';
        }
        break;
    }
    
    return errors;
  };

  // Settings History Functions
  const logSettingChange = (section, field, oldValue, newValue) => {
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date(),
      section,
      field,
      oldValue,
      newValue,
      user: 'Current User',
      action: 'update'
    };
    
    setSettingsHistory(prev => [historyEntry, ...prev.slice(0, 49)]);
  };

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce((section, data) => {
      if (autoSave) {
        saveSettings(section, data);
      }
    }, 2000),
    [autoSave]
  );

  // Auto-save effect
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSave]);

  // Settings Import/Export Functions
  const handleExportSettings = () => {
    const settings = {
      systemConfig,
      securitySettings,
      teamSettings,
      appPreferences,
      integrations,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('success', 'Settings exported successfully');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        
        // Validate settings structure
        if (!settings.version || !settings.systemConfig) {
          throw new Error('Invalid settings file format');
        }
        
        // Apply imported settings
        setSystemConfig(settings.systemConfig);
        setSecuritySettings(settings.securitySettings || securitySettings);
        setTeamSettings(settings.teamSettings || teamSettings);
        setAppPreferences(settings.appPreferences || appPreferences);
        setIntegrations(settings.integrations || integrations);
        
        setHasUnsavedChanges(true);
        showToast('success', 'Settings imported successfully');
      } catch (error) {
        showToast('error', 'Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  // Auto-save handler
  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      showToast('success', 'Settings auto-saved');
    } catch (error) {
      showToast('error', 'Auto-save failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings function
  const saveSettings = async (section, data) => {
    const errors = validateSettings(section, data);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setIsUpdating(prev => ({ ...prev, [section]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasUnsavedChanges(false);
      showToast('success', `${section} settings saved successfully`);
      return true;
    } catch (error) {
      showToast('error', `Failed to save ${section} settings`);
      return false;
    } finally {
      setIsUpdating(prev => ({ ...prev, [section]: false }));
    }
  };

  // Handle system configuration changes
  const handleSystemConfigChange = (field, value) => {
    const oldValue = systemConfig[field];
    setSystemConfig(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    logSettingChange('general', field, oldValue, value);
  };

  // Handle integration testing
  const handleTestIntegration = async (integration) => {
    setIsLoading(true);
    try {
      // Simulate API call to test integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          status: 'connected'
        }
      }));
      
      showToast('success', `${integration} connection successful`);
    } catch (error) {
      showToast('error', `${integration} connection failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components
  const SectionHeader = ({ icon: Icon, title, description, actions }) => (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );

  const SettingToggle = ({ label, description, checked, onChange, disabled }) => (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );

  const SettingSelect = ({ label, description, value, options, onChange, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );

  // Filter settings based on search query
  const filteredTabs = settingsTabs.filter(tab => 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-2">Manage application configuration, integrations, and system preferences</p>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Unsaved changes
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowHistory(!showHistory)}
                size="sm"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                onClick={handleExportSettings}
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Navigation */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Import Settings */}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
                <Button variant="secondary" size="sm" as="span">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </label>
              
              <div className="flex items-center gap-2">
                <Toggle
                  checked={autoSave}
                  onChange={setAutoSave}
                />
                <span className="text-sm text-gray-600">Auto-save</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" role="tablist">
              {filteredTabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings History Sidebar */}
        {showHistory && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Settings History</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {settingsHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent changes</p>
                ) : (
                  settingsHistory.map(entry => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium">{entry.section} - {entry.field}</div>
                      <div className="text-gray-600">
                        {String(entry.oldValue)} → {String(entry.newValue)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div role="tabpanel" id="general-panel" aria-labelledby="general-tab">
              <Card className="shadow-lg">
                <div className="p-6">
                  <SectionHeader
                    icon={SettingsIcon}
                    title="General Configuration"
                    description="Basic system settings and preferences"
                    actions={[
                      <Button
                        key="save"
                        onClick={() => saveSettings('general', systemConfig)}
                        loading={isUpdating.system}
                        disabled={isUpdating.system}
                        size="sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    ]}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Company Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <Input
                          value={systemConfig.companyName}
                          onChange={(e) => handleSystemConfigChange('companyName', e.target.value)}
                          placeholder="Enter company name"
                          error={validationErrors.companyName}
                        />
                        {validationErrors.companyName && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.companyName}</p>
                        )}
                      </div>

                      <SettingSelect
                        label="Timezone"
                        description="Default timezone for the application"
                        value={systemConfig.timezone}
                        onChange={(e) => handleSystemConfigChange('timezone', e.target.value)}
                        options={[
                          { value: 'Asia/Kolkata', label: 'Indian Standard Time (IST)' },
                          { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
                          { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
                          { value: 'UTC', label: 'UTC' },
                          { value: 'America/New_York', label: 'Eastern Time (ET)' },
                          { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' }
                        ]}
                      />

                      <SettingSelect
                        label="Date Format"
                        description="How dates are displayed throughout the application"
                        value={systemConfig.dateFormat}
                        onChange={(e) => handleSystemConfigChange('dateFormat', e.target.value)}
                        options={[
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Indian)' },
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
                          { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (Alternative)' }
                        ]}
                      />
                    </div>

                    {/* System Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">System Preferences</h3>
                      
                      <SettingSelect
                        label="Default Currency"
                        description="Primary currency for financial data"
                        value={systemConfig.currency}
                        onChange={(e) => handleSystemConfigChange('currency', e.target.value)}
                        options={[
                          { value: 'INR', label: '🇮🇳 INR - Indian Rupee' },
                          { value: 'USD', label: '🇺🇸 USD - US Dollar' },
                          { value: 'EUR', label: '🇪🇺 EUR - Euro' },
                          { value: 'GBP', label: '🇬🇧 GBP - British Pound' },
                          { value: 'AED', label: '🇦🇪 AED - UAE Dirham' },
                          { value: 'SGD', label: '🇸🇬 SGD - Singapore Dollar' }
                        ]}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Retention (days)
                        </label>
                        <Input
                          type="number"
                          value={systemConfig.dataRetentionDays}
                          onChange={(e) => handleSystemConfigChange('dataRetentionDays', parseInt(e.target.value))}
                          min="30"
                          max="3650"
                          error={validationErrors.dataRetentionDays}
                        />
                        {validationErrors.dataRetentionDays && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.dataRetentionDays}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          How long to keep deleted records (minimum 30 days)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <Input
                          type="number"
                          value={systemConfig.sessionTimeout}
                          onChange={(e) => handleSystemConfigChange('sessionTimeout', parseInt(e.target.value))}
                          min="5"
                          max="480"
                          error={validationErrors.sessionTimeout}
                        />
                        {validationErrors.sessionTimeout && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.sessionTimeout}</p>
                        )}
                      </div>

                      <SettingToggle
                        label="Auto Backup"
                        description="Automatically backup data daily"
                        checked={systemConfig.autoBackup}
                        onChange={(value) => handleSystemConfigChange('autoBackup', value)}
                      />

                      <SettingToggle
                        label="Maintenance Mode"
                        description="Temporarily disable access for maintenance"
                        checked={systemConfig.maintenanceMode}
                        onChange={(value) => handleSystemConfigChange('maintenanceMode', value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div role="tabpanel" id="security-panel" aria-labelledby="security-tab">
              <Card className="shadow-lg">
                <div className="p-6">
                  <SectionHeader
                    icon={Shield}
                    title="Security & Authentication"
                    description="Manage security policies and authentication settings"
                    actions={[
                      <Button
                        key="save"
                        onClick={() => saveSettings('security', securitySettings)}
                        loading={isUpdating.security}
                        disabled={isUpdating.security}
                        size="sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    ]}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Two-Factor Authentication */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Two-Factor Authentication</h3>
                      
                      <SettingToggle
                        label="Enable 2FA"
                        description="Require two-factor authentication for all users"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(value) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: value }))}
                      />

                      {securitySettings.twoFactorEnabled && (
                        <SettingSelect
                          label="2FA Method"
                          description="Default two-factor authentication method"
                          value={securitySettings.twoFactorMethod}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorMethod: e.target.value }))}
                          options={[
                            { value: 'app', label: 'Authenticator App' },
                            { value: 'sms', label: 'SMS' },
                            { value: 'email', label: 'Email' }
                          ]}
                        />
                      )}
                    </div>

                    {/* Password Policy */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Password Policy</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Length
                        </label>
                        <Input
                          type="number"
                          value={securitySettings.passwordPolicy.minLength}
                          onChange={(e) => setSecuritySettings(prev => ({
                            ...prev,
                            passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
                          }))}
                          min="6"
                          max="32"
                        />
                      </div>

                      <SettingToggle
                        label="Require Uppercase"
                        description="Password must contain uppercase letters"
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onChange={(value) => setSecuritySettings(prev => ({
                          ...prev,
                          passwordPolicy: { ...prev.passwordPolicy, requireUppercase: value }
                        }))}
                      />

                      <SettingToggle
                        label="Require Numbers"
                        description="Password must contain numbers"
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onChange={(value) => setSecuritySettings(prev => ({
                          ...prev,
                          passwordPolicy: { ...prev.passwordPolicy, requireNumbers: value }
                        }))}
                      />

                      <SettingToggle
                        label="Require Symbols"
                        description="Password must contain special characters"
                        checked={securitySettings.passwordPolicy.requireSymbols}
                        onChange={(value) => setSecuritySettings(prev => ({
                          ...prev,
                          passwordPolicy: { ...prev.passwordPolicy, requireSymbols: value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div role="tabpanel" id="integrations-panel" aria-labelledby="integrations-tab">
              <Card className="shadow-lg">
                <div className="p-6">
                  <SectionHeader
                    icon={Zap}
                    title="Third-Party Integrations"
                    description="Connect with external services and APIs"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(integrations).map(([key, integration]) => (
                      <div key={key} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              integration.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {key === 'emailService' && <Mail className="w-5 h-5 text-gray-600" />}
                              {key === 'slackIntegration' && <Slack className="w-5 h-5 text-gray-600" />}
                              {key === 'githubIntegration' && <Github className="w-5 h-5 text-gray-600" />}
                              {key === 'zapierIntegration' && <Zap className="w-5 h-5 text-gray-600" />}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h3>
                              <div className="flex items-center gap-2">
                                {integration.status === 'connected' ? (
                                  <Wifi className="w-3 h-3 text-green-500" />
                                ) : (
                                  <WifiOff className="w-3 h-3 text-gray-400" />
                                )}
                                <span className={`text-xs ${
                                  integration.status === 'connected' ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {integration.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Toggle
                            checked={integration.enabled}
                            onChange={(value) => setIntegrations(prev => ({
                              ...prev,
                              [key]: { ...prev[key], enabled: value }
                            }))}
                          />
                        </div>
                        
                        {integration.enabled && (
                          <div className="space-y-3">
                            {integration.apiKey !== undefined && (
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  API Key
                                </label>
                                <div className="flex gap-2">
                                  <Input
                                    type={showApiKeys[key] ? 'text' : 'password'}
                                    value={integration.apiKey}
                                    onChange={(e) => setIntegrations(prev => ({
                                      ...prev,
                                      [key]: { ...prev[key], apiKey: e.target.value }
                                    }))}
                                    size="sm"
                                  />
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }))}
                                  >
                                    {showApiKeys[key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {integration.webhookUrl !== undefined && (
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Webhook URL
                                </label>
                                <Input
                                  value={integration.webhookUrl}
                                  onChange={(e) => setIntegrations(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key], webhookUrl: e.target.value }
                                  }))}
                                  placeholder="https://hooks.slack.com/..."
                                  size="sm"
                                />
                              </div>
                            )}
                            
                            <Button
                              size="sm"
                              onClick={() => handleTestIntegration(key)}
                              className="w-full"
                            >
                              Test Connection
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div role="tabpanel" id="preferences-panel" aria-labelledby="preferences-tab">
              <Card className="shadow-lg">
                <div className="p-6">
                  <SectionHeader
                    icon={Palette}
                    title="Application Preferences"
                    description="Customize the application experience"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Theme Settings */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Theme & Appearance</h3>
                      
                      <SettingSelect
                        label="Default Theme"
                        value={appPreferences.defaultTheme}
                        onChange={(e) => setAppPreferences(prev => ({ ...prev, defaultTheme: e.target.value }))}
                        options={[
                          { value: 'light', label: 'Light Theme' },
                          { value: 'dark', label: 'Dark Theme' },
                          { value: 'auto', label: 'Auto (System)' }
                        ]}
                      />

                      <SettingToggle
                        label="Enable Animations"
                        description="Show smooth transitions and animations"
                        checked={appPreferences.enableAnimations}
                        onChange={(value) => setAppPreferences(prev => ({ ...prev, enableAnimations: value }))}
                      />

                      <SettingToggle
                        label="Compact Mode"
                        description="Reduce spacing for more content density"
                        checked={appPreferences.compactMode}
                        onChange={(value) => setAppPreferences(prev => ({ ...prev, compactMode: value }))}
                      />
                    </div>

                    {/* Default Views */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Default Views</h3>
                      
                      <SettingSelect
                        label="Default Dashboard"
                        value={appPreferences.defaultDashboard}
                        onChange={(e) => setAppPreferences(prev => ({ ...prev, defaultDashboard: e.target.value }))}
                        options={[
                          { value: 'overview', label: 'Overview Dashboard' },
                          { value: 'sales', label: 'Sales Dashboard' },
                          { value: 'analytics', label: 'Analytics Dashboard' }
                        ]}
                      />

                      <SettingToggle
                        label="Show Welcome Screen"
                        description="Display welcome screen for new users"
                        checked={appPreferences.showWelcomeScreen}
                        onChange={(value) => setAppPreferences(prev => ({ ...prev, showWelcomeScreen: value }))}
                      />
                    </div>

                    {/* Auto-save Settings */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-gray-900">Auto-save</h3>
                      
                      <SettingToggle
                        label="Enable Auto-save"
                        description="Automatically save changes"
                        checked={appPreferences.autoSave}
                        onChange={(value) => setAppPreferences(prev => ({ ...prev, autoSave: value }))}
                      />

                      {appPreferences.autoSave && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auto-save Interval (seconds)
                          </label>
                          <Input
                            type="number"
                            value={appPreferences.autoSaveInterval}
                            onChange={(e) => setAppPreferences(prev => ({ ...prev, autoSaveInterval: parseInt(e.target.value) }))}
                            min="10"
                            max="300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!['general', 'security', 'integrations', 'preferences'].includes(activeTab) && (
            <div role="tabpanel" className="text-center py-12">
              <div className="text-gray-500">
                <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                <p>This section is under development.</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation for smaller screens */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-center">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {settingsTabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;