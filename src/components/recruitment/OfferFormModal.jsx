import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Building2, 
  Award, 
  Shield, 
  Clock,
  Flag,
  FileText,
  Plus,
  Minus
} from 'lucide-react';

const initialFormData = {
  candidateId: '',
  jobId: '',
  position: '',
  department: '',
  startDate: '',
  salary: {
    base: '',
    currency: 'USD',
    frequency: 'annual'
  },
  benefits: {
    healthInsurance: false,
    dentalInsurance: false,
    retirement401k: false,
    paidTimeOff: 0,
    flexibleSchedule: false,
    remoteWork: false,
    stockOptions: {
      granted: false,
      vesting: ''
    }
  },
  bonuses: {
    signing: '',
    performance: '',
    annual: ''
  },
  expiryDate: '',
  notes: '',
  priority: 'medium'
};

// Mock data - in real app, these would come from API
const mockCandidates = [
  { id: '1', name: 'John Smith', email: 'john@example.com', position: 'Software Engineer' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', position: 'Product Manager' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', position: 'UX Designer' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', position: 'Data Scientist' }
];

const mockJobs = [
  { id: '1', title: 'Senior Software Engineer', client: 'TechCorp Inc.', department: 'Engineering' },
  { id: '2', title: 'Product Manager', client: 'InnovateLabs', department: 'Product' },
  { id: '3', title: 'UX Designer', client: 'DesignStudio', department: 'Design' },
  { id: '4', title: 'Data Scientist', client: 'DataDriven Solutions', department: 'Analytics' }
];

export default function OfferFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  candidateId = null, 
  jobId = null, 
  existingOffer = null 
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      if (existingOffer) {
        // Edit mode - populate with existing data
        setFormData({
          candidateId: existingOffer.candidateId,
          jobId: existingOffer.jobId,
          position: existingOffer.offerDetails.position,
          department: existingOffer.offerDetails.department,
          startDate: existingOffer.offerDetails.startDate.toISOString().split('T')[0],
          salary: existingOffer.offerDetails.salary,
          benefits: existingOffer.offerDetails.benefits,
          bonuses: existingOffer.offerDetails.bonuses || { signing: '', performance: '', annual: '' },
          expiryDate: existingOffer.timeline.expiryDate?.toISOString().split('T')[0] || '',
          notes: existingOffer.notes || '',
          priority: existingOffer.priority
        });
      } else {
        // Create mode - use provided IDs or reset
        setFormData({
          ...initialFormData,
          candidateId: candidateId || '',
          jobId: jobId || ''
        });
      }
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen, existingOffer, candidateId, jobId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
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

  const handleBenefitToggle = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [benefit]: !prev.benefits[benefit]
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.candidateId) newErrors.candidateId = 'Please select a candidate';
      if (!formData.jobId) newErrors.jobId = 'Please select a job';
      if (!formData.position) newErrors.position = 'Position is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
    }

    if (step === 2) {
      if (!formData.salary.base || formData.salary.base <= 0) {
        newErrors['salary.base'] = 'Base salary is required and must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const offerData = {
        ...formData,
        startDate: new Date(formData.startDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        salary: {
          ...formData.salary,
          base: parseFloat(formData.salary.base)
        },
        bonuses: {
          signing: formData.bonuses.signing ? parseFloat(formData.bonuses.signing) : 0,
          performance: formData.bonuses.performance ? parseFloat(formData.bonuses.performance) : 0,
          annual: formData.bonuses.annual ? parseFloat(formData.bonuses.annual) : 0
        }
      };

      await onSubmit(offerData);
      onClose();
    } catch (error) {
      console.error('Failed to submit offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCandidate = mockCandidates.find(c => c.id === formData.candidateId);
  const selectedJob = mockJobs.find(j => j.id === formData.jobId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {existingOffer ? 'Edit Job Offer' : 'Create Job Offer'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Basic Information' :
                currentStep === 2 ? 'Compensation & Benefits' :
                'Review & Submit'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-gray-50">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Candidate Selection */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      Candidate
                    </label>
                    <select
                      value={formData.candidateId}
                      onChange={(e) => handleInputChange('candidateId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.candidateId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={!!candidateId}
                    >
                      <option value="">Select a candidate</option>
                      {mockCandidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} - {candidate.email}
                        </option>
                      ))}
                    </select>
                    {errors.candidateId && (
                      <p className="mt-1 text-sm text-red-600">{errors.candidateId}</p>
                    )}
                  </div>

                  {/* Job Selection */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Job Position
                    </label>
                    <select
                      value={formData.jobId}
                      onChange={(e) => {
                        const job = mockJobs.find(j => j.id === e.target.value);
                        handleInputChange('jobId', e.target.value);
                        if (job) {
                          handleInputChange('position', job.title);
                          handleInputChange('department', job.department);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.jobId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={!!jobId}
                    >
                      <option value="">Select a job</option>
                      {mockJobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} - {job.client}
                        </option>
                      ))}
                    </select>
                    {errors.jobId && (
                      <p className="mt-1 text-sm text-red-600">{errors.jobId}</p>
                    )}
                  </div>

                  {/* Position Title */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Award className="w-4 h-4 mr-2" />
                      Position Title
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.position ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="w-4 h-4 mr-2" />
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Engineering"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Flag className="w-4 h-4 mr-2" />
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Offer Expiry */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Offer Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Leave empty for no expiry date
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Compensation & Benefits */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Salary Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Salary Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Salary
                      </label>
                      <input
                        type="number"
                        value={formData.salary.base}
                        onChange={(e) => handleNestedInputChange('salary', 'base', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors['salary.base'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 120000"
                      />
                      {errors['salary.base'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['salary.base']}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.salary.currency}
                        onChange={(e) => handleNestedInputChange('salary', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="annual"
                          checked={formData.salary.frequency === 'annual'}
                          onChange={(e) => handleNestedInputChange('salary', 'frequency', e.target.value)}
                          className="mr-2"
                        />
                        Annual
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="monthly"
                          checked={formData.salary.frequency === 'monthly'}
                          onChange={(e) => handleNestedInputChange('salary', 'frequency', e.target.value)}
                          className="mr-2"
                        />
                        Monthly
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bonuses */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Bonuses (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signing Bonus
                      </label>
                      <input
                        type="number"
                        value={formData.bonuses.signing}
                        onChange={(e) => handleNestedInputChange('bonuses', 'signing', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 10000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Performance Bonus
                      </label>
                      <input
                        type="number"
                        value={formData.bonuses.performance}
                        onChange={(e) => handleNestedInputChange('bonuses', 'performance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 15000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Bonus
                      </label>
                      <input
                        type="number"
                        value={formData.bonuses.annual}
                        onChange={(e) => handleNestedInputChange('bonuses', 'annual', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 20000"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Benefits Package
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.healthInsurance}
                          onChange={() => handleBenefitToggle('healthInsurance')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">Health Insurance</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.dentalInsurance}
                          onChange={() => handleBenefitToggle('dentalInsurance')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">Dental Insurance</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.retirement401k}
                          onChange={() => handleBenefitToggle('retirement401k')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">401(k) Retirement Plan</span>
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.flexibleSchedule}
                          onChange={() => handleBenefitToggle('flexibleSchedule')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">Flexible Schedule</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.remoteWork}
                          onChange={() => handleBenefitToggle('remoteWork')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">Remote Work Options</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paid Time Off (days per year)
                    </label>
                    <input
                      type="number"
                      value={formData.benefits.paidTimeOff}
                      onChange={(e) => handleNestedInputChange('benefits', 'paidTimeOff', parseInt(e.target.value) || 0)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="365"
                    />
                  </div>

                  {/* Stock Options */}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.benefits.stockOptions.granted}
                        onChange={() => handleNestedInputChange('benefits', 'stockOptions', {
                          ...formData.benefits.stockOptions,
                          granted: !formData.benefits.stockOptions.granted
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-sm font-medium text-gray-700">Stock Options</span>
                    </label>
                    
                    {formData.benefits.stockOptions.granted && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vesting Schedule
                        </label>
                        <input
                          type="text"
                          value={formData.benefits.stockOptions.vesting}
                          onChange={(e) => handleNestedInputChange('benefits', 'stockOptions', {
                            ...formData.benefits.stockOptions,
                            vesting: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 4 years with 1 year cliff"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Offer Summary</h3>
                  
                  {/* Candidate & Job Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Candidate</h4>
                      {selectedCandidate && (
                        <div className="text-sm text-gray-600">
                          <p>{selectedCandidate.name}</p>
                          <p>{selectedCandidate.email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Position</h4>
                      <div className="text-sm text-gray-600">
                        <p>{formData.position}</p>
                        <p>{formData.department}</p>
                        {selectedJob && <p>{selectedJob.client}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Compensation Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Compensation Package</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Salary:</span>
                        <span className="font-medium">
                          {formData.salary.base ? `${parseFloat(formData.salary.base).toLocaleString()} ${formData.salary.currency} (${formData.salary.frequency})` : 'Not specified'}
                        </span>
                      </div>
                      
                      {formData.bonuses.signing && (
                        <div className="flex justify-between">
                          <span>Signing Bonus:</span>
                          <span>{parseFloat(formData.bonuses.signing).toLocaleString()} {formData.salary.currency}</span>
                        </div>
                      )}
                      
                      {formData.bonuses.performance && (
                        <div className="flex justify-between">
                          <span>Performance Bonus:</span>
                          <span>{parseFloat(formData.bonuses.performance).toLocaleString()} {formData.salary.currency}</span>
                        </div>
                      )}
                      
                      {formData.bonuses.annual && (
                        <div className="flex justify-between">
                          <span>Annual Bonus:</span>
                          <span>{parseFloat(formData.bonuses.annual).toLocaleString()} {formData.salary.currency}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits Summary */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Benefits</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(formData.benefits).map(([key, value]) => {
                        if (key === 'stockOptions') return null;
                        if (key === 'paidTimeOff') {
                          return value > 0 ? (
                            <div key={key} className="flex items-center text-green-600">
                              <span>✓ {value} days PTO</span>
                            </div>
                          ) : null;
                        }
                        return value ? (
                          <div key={key} className="flex items-center text-green-600">
                            <span>✓ {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          </div>
                        ) : null;
                      })}
                      
                      {formData.benefits.stockOptions.granted && (
                        <div className="flex items-center text-green-600">
                          <span>✓ Stock Options ({formData.benefits.stockOptions.vesting || 'TBD'})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional terms, conditions, or notes for this offer..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : existingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}