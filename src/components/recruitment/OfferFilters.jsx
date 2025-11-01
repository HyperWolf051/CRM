import { useState } from 'react';
import { X, Calendar, DollarSign, User, Building2, Flag } from 'lucide-react';

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  { value: 'under-review', label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'negotiating', label: 'Negotiating', color: 'bg-amber-100 text-amber-800' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800' },
  { value: 'declined', label: 'Declined', color: 'bg-red-100 text-red-800' },
  { value: 'expired', label: 'Expired', color: 'bg-gray-100 text-gray-800' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-orange-100 text-orange-800' }
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'text-amber-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
];

// Mock data - in real app, these would come from API
const positionOptions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'DevOps Engineer',
  'Marketing Manager',
  'Sales Representative'
];

const clientOptions = [
  'TechCorp Inc.',
  'InnovateLabs',
  'DataDriven Solutions',
  'CloudFirst Technologies',
  'NextGen Systems',
  'Digital Dynamics',
  'FutureTech Solutions',
  'SmartSolutions Ltd.'
];

const recruiterOptions = [
  'John Smith',
  'Sarah Johnson',
  'Mike Chen',
  'Emily Davis',
  'Alex Rodriguez',
  'Lisa Thompson'
];

export default function OfferFilters({ filters, onFilterChange, onClearFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterUpdate = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleArrayFilterToggle = (key, value) => {
    const currentArray = localFilters[key] || [];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterUpdate(key, updatedArray);
  };

  const handleSalaryRangeChange = (field, value) => {
    const currentRange = localFilters.salaryRange || { min: '', max: '' };
    const updatedRange = { ...currentRange, [field]: value };
    handleFilterUpdate('salaryRange', updatedRange);
  };

  const handleDateRangeChange = (field, value) => {
    const currentRange = localFilters.dateRange || { start: '', end: '' };
    const updatedRange = { ...currentRange, [field]: value };
    handleFilterUpdate('dateRange', updatedRange);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: [],
      position: [],
      client: [],
      salaryRange: null,
      dateRange: null,
      priority: [],
      createdBy: []
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') return Object.values(value).some(v => v);
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filter Offers</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Flag className="w-4 h-4 mr-2" />
            Status
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {statusOptions.map((status) => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.status?.includes(status.value) || false}
                  onChange={() => handleArrayFilterToggle('status', status.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Flag className="w-4 h-4 mr-2" />
            Priority
          </label>
          <div className="space-y-2">
            {priorityOptions.map((priority) => (
              <label key={priority.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.priority?.includes(priority.value) || false}
                  onChange={() => handleArrayFilterToggle('priority', priority.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className={`text-sm font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Position Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2" />
            Position
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {positionOptions.map((position) => (
              <label key={position} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.position?.includes(position) || false}
                  onChange={() => handleArrayFilterToggle('position', position)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">{position}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Client Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Building2 className="w-4 h-4 mr-2" />
            Client
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {clientOptions.map((client) => (
              <label key={client} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.client?.includes(client) || false}
                  onChange={() => handleArrayFilterToggle('client', client)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">{client}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Created By Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2" />
            Created By
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recruiterOptions.map((recruiter) => (
              <label key={recruiter} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.createdBy?.includes(recruiter) || false}
                  onChange={() => handleArrayFilterToggle('createdBy', recruiter)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">{recruiter}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign className="w-4 h-4 mr-2" />
            Salary Range
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.salaryRange?.min || ''}
                onChange={(e) => handleSalaryRangeChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.salaryRange?.max || ''}
                onChange={(e) => handleSalaryRangeChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="text-xs text-gray-500">Annual salary in USD</div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={localFilters.dateRange?.start || ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={localFilters.dateRange?.end || ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {Object.values(localFilters).reduce((count, value) => {
                if (Array.isArray(value)) return count + value.length;
                if (value && typeof value === 'object') {
                  return count + Object.values(value).filter(v => v).length;
                }
                return count;
              }, 0)} filter(s) applied
            </span>
          </div>
        </div>
      )}
    </div>
  );
}