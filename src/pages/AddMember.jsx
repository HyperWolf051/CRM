import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Shield, Calendar, Clock,
  Star, Award, Briefcase, GraduationCap, Save, X, Plus, Trash2,
  Upload, Eye, EyeOff, Copy, AlertCircle, CheckCircle, ArrowLeft,
  Users, Globe, Target, Zap, FileText, Camera, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import { useToast } from '../context/ToastContext';

const AddMember = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    
    // Work Information
    role: 'User',
    department: 'General',
    manager: '',
    startDate: '',
    contractType: 'Full-time',
    salary: '',
    
    // Location & Schedule
    location: '',
    timezone: 'America/New_York',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    
    // Performance & Skills
    performanceRating: 3.0,
    skills: [],
    certifications: [],
    
    // Personal Information
    birthday: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    
    // System Settings
    status: 'active',
    permissions: [],
    notes: '',
    
    // Profile
    avatar: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Configuration data
  const roles = [
    { id: 'Admin', name: 'Admin', icon: Shield, color: 'text-purple-600', permissions: ['all'] },
    { id: 'Manager', name: 'Manager', icon: Users, color: 'text-blue-600', permissions: ['candidates', 'deals', 'companies', 'reports', 'team'] },
    { id: 'User', name: 'User', icon: User, color: 'text-green-600', permissions: ['candidates', 'deals', 'companies'] },
    { id: 'Viewer', name: 'Viewer', icon: Eye, color: 'text-gray-600', permissions: ['view'] }
  ];

  const departments = [
    'General', 'Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Management', 'Operations', 'Customer Success'
  ];

  const contractTypes = [
    'Full-time', 'Part-time', 'Contract', 'Intern', 'Consultant', 'Freelance'
  ];

  const timezones = [
    'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'UTC'
  ];

  const relationshipTypes = [
    'Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Colleague', 'Other'
  ];

  // Form steps
  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Work Details', icon: Briefcase },
    { id: 3, title: 'Skills & Performance', icon: Star },
    { id: 4, title: 'Personal & Emergency', icon: Heart },
    { id: 5, title: 'System & Permissions', icon: Shield }
  ];

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
        break;
      case 2:
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        break;
      case 3:
        if (formData.performanceRating < 0 || formData.performanceRating > 5) {
          newErrors.performanceRating = 'Rating must be between 0 and 5';
        }
        break;
      case 4:
        // Optional validations for personal info
        break;
      case 5:
        // System settings validation
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const generateEmployeeId = () => {
    const prefix = formData.department.substring(0, 2).toUpperCase();
    const number = Math.floor(Math.random() * 9000) + 1000;
    handleInputChange('employeeId', `${prefix}${number}`);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to create the user
      console.log('Creating user:', formData);
      
      showToast('success', `Team member ${formData.name} has been created successfully!`);
      navigate('/team');
    } catch (error) {
      showToast('error', 'Failed to create team member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
            currentStep >= step.id
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 text-gray-400'
          }`}>
            <step.icon className="w-5 h-5" />
          </div>
          <div className="ml-3 hidden sm:block">
            <p className={`text-sm font-medium ${
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Step {step.id}
            </p>
            <p className={`text-xs ${
              currentStep >= step.id ? 'text-blue-500' : 'text-gray-400'
            }`}>
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <Button variant="secondary" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID *
          </label>
          <div className="flex gap-2">
            <Input
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              placeholder="Enter employee ID"
              error={errors.employeeId}
            />
            <Button
              variant="secondary"
              onClick={generateEmployeeId}
              title="Generate ID"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => {
              handleInputChange('role', e.target.value);
              const selectedRole = roles.find(r => r.id === e.target.value);
              if (selectedRole) {
                handleInputChange('permissions', selectedRole.permissions);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager
          </label>
          <Input
            value={formData.manager}
            onChange={(e) => handleInputChange('manager', e.target.value)}
            placeholder="Enter manager name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            error={errors.startDate}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Type
          </label>
          <select
            value={formData.contractType}
            onChange={(e) => handleInputChange('contractType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {contractTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Salary
          </label>
          <Input
            type="number"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            placeholder="Enter annual salary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter work location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Hours
          </label>
          <div className="flex gap-2">
            <Input
              type="time"
              value={formData.workingHours.start}
              onChange={(e) => handleNestedInputChange('workingHours', 'start', e.target.value)}
            />
            <span className="flex items-center text-gray-500">to</span>
            <Input
              type="time"
              value={formData.workingHours.end}
              onChange={(e) => handleNestedInputChange('workingHours', 'end', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Performance Rating
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={formData.performanceRating}
            onChange={(e) => handleInputChange('performanceRating', parseFloat(e.target.value))}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(formData.performanceRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 font-medium">{formData.performanceRating.toFixed(1)}/5</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add a certification"
            onKeyPress={(e) => e.key === 'Enter' && addCertification()}
          />
          <Button onClick={addCertification} variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.certifications.map(cert => (
            <div
              key={cert}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-green-800">{cert}</span>
              </div>
              <button
                onClick={() => removeCertification(cert)}
                className="text-green-600 hover:text-green-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birthday
        </label>
        <Input
          type="date"
          value={formData.birthday}
          onChange={(e) => handleInputChange('birthday', e.target.value)}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name
            </label>
            <Input
              value={formData.emergencyContact.name}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
              placeholder="Enter contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <Input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
              placeholder="Enter contact phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select relationship</option>
              {relationshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes about this team member..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Status
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === 'active'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="mr-2"
            />
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
            Active
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={formData.status === 'inactive'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="mr-2"
            />
            <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
            Inactive
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generate Login Password
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={generatedPassword}
              placeholder="Click generate to create password"
              readOnly
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            onClick={generatePassword}
            title="Generate password"
          >
            <Zap className="w-4 h-4" />
          </Button>
          {generatedPassword && (
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword);
                showToast('success', 'Password copied to clipboard');
              }}
              title="Copy password"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
        {generatedPassword && (
          <p className="text-sm text-gray-600 mt-2">
            Make sure to share this password securely with the new team member.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions Summary
        </label>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Role: {formData.role}</span>
          </div>
          <div className="text-sm text-gray-600">
            This role includes access to: {formData.permissions.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/team')}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Team Member</h1>
            <p className="text-gray-600 mt-2">Create a new team member account with complete profile information</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {renderStepIndicator()}

            <div className="min-h-[500px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <Button variant="secondary" onClick={prevStep}>
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/team')}
                >
                  Cancel
                </Button>
                
                {currentStep < steps.length ? (
                  <Button onClick={nextStep}>
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Member
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddMember;