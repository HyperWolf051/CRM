import { useState } from 'react';
import { Plus } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { useDeals } from '../hooks/useDeals';
import useContacts from '../hooks/useContacts';
import { validateRequired } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export default function Deals() {
  const { deals, loading, updateDealStage, createDeal } = useDeals();
  const { contacts } = useContacts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    contactId: '',
    probability: '',
    expectedCloseDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!validateRequired(formData.name)) {
      errors.name = 'Deal name is required';
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
        name: formData.name,
        value: parseFloat(formData.value),
        contactId: formData.contactId,
        contactName: selectedContact?.name || '',
        contactAvatar: selectedContact?.avatar,
        stage: 'lead', // New deals start as leads
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600">Manage your sales opportunities</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreateDeal}
        >
          Add Deal
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        <KanbanBoard
          deals={deals}
          loading={loading}
          onDealMove={handleDealMove}
          onDealClick={handleDealClick}
        />
      </div>

      {/* Create Deal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deal"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Deal Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            placeholder="Enter deal name"
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                formErrors.contactId ? 'border-red-500' : 'border-gray-300'
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
                {selectedDeal.name}
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