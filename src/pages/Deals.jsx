import { useState } from 'react';
import { Plus, Filter, Search, Download, Eye, Edit, Trash2, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useDeals } from '../hooks/useDeals';
import useContacts from '../hooks/useContacts';
import { validateRequired } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export default function Deals() {
  const { deals, loading, updateDealStage, createDeal } = useDeals();
  const { contacts } = useContacts();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    contactId: '',
    probability: '',
    expectedCloseDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deal stages with enhanced styling
  const dealStages = [
    { id: 'all', name: 'All', count: deals?.length || 0, color: 'bg-gray-100 text-gray-800' },
    { id: 'discovery', name: 'Discovery', count: deals?.filter(d => d.stage === 'discovery').length || 0, color: 'bg-blue-100 text-blue-800' },
    { id: 'qualified', name: 'Qualified', count: deals?.filter(d => d.stage === 'qualified').length || 0, color: 'bg-purple-100 text-purple-800' },
    { id: 'proposal', name: 'Proposal', count: deals?.filter(d => d.stage === 'proposal').length || 0, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'negotiation', name: 'Negotiation', count: deals?.filter(d => d.stage === 'negotiation').length || 0, color: 'bg-orange-100 text-orange-800' },
    { id: 'closed-won', name: 'Won', count: deals?.filter(d => d.stage === 'closed-won').length || 0, color: 'bg-green-100 text-green-800' },
    { id: 'closed-lost', name: 'Lost', count: deals?.filter(d => d.stage === 'closed-lost').length || 0, color: 'bg-red-100 text-red-800' },
  ];

  // Filter deals based on search and stage
  const filteredDeals = deals?.filter(deal => {
    const matchesSearch = (deal.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (deal.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (deal.assignee?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  }) || [];

  // Calculate metrics
  const totalValue = deals?.reduce((sum, deal) => sum + deal.value, 0) || 0;
  const wonDeals = deals?.filter(d => d.stage === 'closed_won') || [];
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = deals?.length ? totalValue / deals.length : 0;

  const handleDealMove = async (dealId, newStage) => {
    try {
      await updateDealStage(dealId, newStage);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsDetailsModalOpen(true);
  };

  const handleCreateDeal = () => {
    setFormData({
      name: '',
      value: '',
      contactId: '',
      probability: '',
      expectedCloseDate: '',
      notes: '',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validateRequired(formData.title)) {
      errors.title = 'Deal title is required';
    }

    if (!validateRequired(formData.value)) {
      errors.value = 'Deal value is required';
    } else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      errors.value = 'Deal value must be a positive number';
    }

    if (!validateRequired(formData.contactId)) {
      errors.contactId = 'Contact is required';
    }

    if (formData.probability && (isNaN(formData.probability) || formData.probability < 0 || formData.probability > 100)) {
      errors.probability = 'Probability must be between 0 and 100';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedContact = contacts.find(c => c.id === formData.contactId);
      const dealData = {
        title: formData.title,
        value: parseFloat(formData.value),
        contactId: formData.contactId,
        contactName: selectedContact?.name || '',
        contactAvatar: selectedContact?.avatar,
        stage: 'discovery', // New deals start as discovery
        probability: formData.probability ? parseInt(formData.probability) : null,
        expectedCloseDate: formData.expectedCloseDate || null,
        notes: formData.notes || null,
      };

      await createDeal(dealData);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedContact = selectedDeal ? contacts.find(c => c.id === selectedDeal.contactId) : null;

  // Keyboard shortcuts
  useKeyboardShortcut('d', () => {
    // Open Add Deal modal when "d" is pressed
    handleCreateDeal();
  });

  // Deals Table Component
  const DealsTable = ({ deals, loading, onDealClick, contacts }) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Deal</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Stage</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Probability</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Expected Close</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => {
              const contact = contacts.find(c => c.id === deal.contactId);
              return (
                <tr
                  key={deal.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onDealClick(deal)}
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{deal.title}</div>
                      <div className="text-sm text-gray-500">ID: {deal.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={contact?.avatar}
                        name={contact?.name || deal.contactName}
                        size="sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{deal.contactName}</div>
                        <div className="text-sm text-gray-500">{contact?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(deal.value)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        deal.stage === 'closed-won' ? 'success' :
                          deal.stage === 'closed-lost' ? 'danger' :
                            deal.stage === 'negotiation' ? 'warning' :
                              deal.stage === 'proposal' ? 'info' : 'default'
                      }
                    >
                      {deal.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-900">
                      {deal.probability ? `${deal.probability}%` : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-900">
                      {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDealClick(deal);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                        className="p-1 text-gray-400 hover:text-green-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Metrics */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Deals Pipeline
            </h1>
            <p className="text-gray-600 mt-1">Manage your sales opportunities and track performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('kanban')}
              className="px-4 py-2"
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
              className="px-4 py-2"
            >
              Table
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateDeal}
            >
              Add Deal
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{deals?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Won Deals</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(wonValue)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgDealSize)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {dealStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedStage === stage.id
                    ? stage.color + ' shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {stage.name} ({stage.count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
              <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>
          </div>

          {/* Content Area */}
          {viewMode === 'kanban' ? (
            <KanbanBoard
              deals={filteredDeals}
              loading={loading}
              onDealMove={handleDealMove}
              onDealClick={handleDealClick}
            />
          ) : (
            <DealsTable
              deals={filteredDeals}
              loading={loading}
              onDealClick={handleDealClick}
              contacts={contacts}
            />
          )}
        </div>
      </div>

      {/* Create Deal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deal"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Deal Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={formErrors.title}
            placeholder="Enter deal title"
          />

          <Input
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            error={formErrors.value}
            placeholder="0.00"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => handleInputChange('contactId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${formErrors.contactId ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} - {contact.email}
                </option>
              ))}
            </select>
            {formErrors.contactId && (
              <p className="mt-1 text-sm text-red-600">{formErrors.contactId}</p>
            )}
          </div>

          <Input
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={(e) => handleInputChange('probability', e.target.value)}
            error={formErrors.probability}
            placeholder="0-100"
          />

          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about this deal..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Create Deal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deal Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Deal Details"
      >
        {selectedDeal && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedDeal.title}
              </h3>
              <div className="text-2xl font-bold text-primary-600 mb-4">
                {formatCurrency(selectedDeal.value)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {selectedDeal.stage.replace('_', ' ')}
                </span>
              </div>

              {selectedDeal.probability && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability
                  </label>
                  <p className="text-sm text-gray-900">{selectedDeal.probability}%</p>
                </div>
              )}

              {selectedDeal.expectedCloseDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Close Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {selectedContact && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={selectedContact.avatar}
                    name={selectedContact.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedContact.name}</p>
                    <p className="text-sm text-gray-600">{selectedContact.email}</p>
                    {selectedContact.company && (
                      <p className="text-sm text-gray-600">{selectedContact.company}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedDeal.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedDeal.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}