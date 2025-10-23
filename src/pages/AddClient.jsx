import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Mail,
  Globe,
  Save,
  AlertCircle,
  User
} from 'lucide-react';

const AddClient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    if (!formData.primaryContactName.trim()) newErrors.primaryContactName = 'Primary contact name is required';
    if (!formData.primaryContactEmail.trim()) newErrors.primaryContactEmail = 'Primary contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.primaryContactEmail)) newErrors.primaryContactEmail = 'Email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/app/companies', {
        state: {
          message: 'Client added successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      setErrors({ submit: 'Failed to add client. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    'Information Technology', 'Banking & Financial Services', 'E-commerce',
    'Manufacturing', 'Pharmaceuticals', 'Telecommunications', 'Automotive',
    'Textiles', 'Food Technology', 'Real Estate', 'Education', 'Healthcare',
    'Conglomerate', 'Consulting', 'Media & Entertainment', 'Retail',
    'Agriculture', 'Energy & Power', 'Logistics', 'Travel & Tourism'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/companies')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Add New Client
              </h1>
              <p className="text-slate-600 text-sm">Create a comprehensive client company profile</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/app/companies')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Client</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl overflow-hidden">
          <div className="p-8 space-y-8">

            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Company Information</h2>
                  <p className="text-sm text-slate-600">Basic company details and business information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.companyName ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                      }`}
                    placeholder="Enter company name"
                    aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                  />
                  {errors.companyName && (
                    <p id="companyName-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.companyName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.industry ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                      }`}
                    aria-describedby={errors.industry ? 'industry-error' : undefined}
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p id="industry-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.industry}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                      placeholder="https://company.co.in"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 resize-none"
                  placeholder="Brief description of the company's business and services..."
                />
              </div>
            </div>

            {/* Primary Contact Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Primary Contact</h2>
                  <p className="text-sm text-slate-600">Main point of contact at the company</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryContactName}
                    onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.primaryContactName ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                      }`}
                    placeholder="Enter contact name"
                    aria-describedby={errors.primaryContactName ? 'primaryContactName-error' : undefined}
                  />
                  {errors.primaryContactName && (
                    <p id="primaryContactName-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.primaryContactName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.primaryContactEmail}
                      onChange={(e) => handleInputChange('primaryContactEmail', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200 ${errors.primaryContactEmail ? 'border-red-300 bg-red-50/50' : 'border-slate-200/50'
                        }`}
                      placeholder="contact@company.co.in"
                      aria-describedby={errors.primaryContactEmail ? 'primaryContactEmail-error' : undefined}
                    />
                  </div>
                  {errors.primaryContactEmail && (
                    <p id="primaryContactEmail-error" className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.primaryContactEmail}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.primaryContactPhone}
                    onChange={(e) => handleInputChange('primaryContactPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClient;