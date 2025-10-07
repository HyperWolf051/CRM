import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, AlertCircle } from 'lucide-react';
import ContactTable from '../components/ContactTable';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import RetryButton from '../components/ui/RetryButton';
import useContacts from '../hooks/useContacts';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

const ContactForm = ({ contact, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    address: contact?.address || '',
    notes: contact?.notes || '',
    status: contact?.status || 'lead',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name *"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Enter full name"
        />
        
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="Enter email address"
        />
        
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          error={errors.phone}
          placeholder="Enter phone number"
        />
        
        <Input
          label="Company"
          value={formData.company}
          onChange={handleChange('company')}
          error={errors.company}
          placeholder="Enter company name"
        />
      </div>
      
      <Input
        label="Address"
        value={formData.address}
        onChange={handleChange('address')}
        error={errors.address}
        placeholder="Enter address"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Status
        </label>
        <select
          value={formData.status}
          onChange={handleChange('status')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={handleChange('notes')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Add any notes about this contact..."
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {contact ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};

const Contacts = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    refetch
  } = useContacts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Ref for search input to focus programmatically
  const searchInputRef = useRef(null);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query) ||
      contact.phone?.includes(query)
    );
  }, [contacts, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleContactClick = (contact) => {
    navigate(`/app/contacts/${contact.id}`);
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsCreateModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsCreateModalOpen(true);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    
    try {
      let result;
      
      if (editingContact) {
        result = await updateContact(editingContact.id, formData);
      } else {
        result = await createContact(formData);
      }
      
      if (result.success) {
        showToast('success', `Contact ${editingContact ? 'updated' : 'created'} successfully`);
        setIsCreateModalOpen(false);
        setEditingContact(null);
      } else {
        showToast('error', result.error);
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      const result = await deleteContact(contactToDelete.id);
      
      if (result.success) {
        showToast('success', 'Contact deleted successfully');
        setIsDeleteModalOpen(false);
        setContactToDelete(null);
      } else {
        showToast('error', result.error);
      }
    } catch (error) {
      showToast('error', 'Failed to delete contact');
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingContact(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  };

  // Keyboard shortcuts
  useKeyboardShortcut('/', () => {
    // Focus search input when "/" is pressed
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  });

  useKeyboardShortcut('c', () => {
    // Open Add Contact modal when "c" is pressed
    handleCreateContact();
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load contacts
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <RetryButton onRetry={refetch}>
          Try Again
        </RetryButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500">
            Manage your customer relationships and contact information
          </p>
        </div>
        <Button
          onClick={handleCreateContact}
          icon={<Plus size={20} />}
        >
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm lg:max-w-md">
        <Input
          ref={searchInputRef}
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={handleSearchChange}
          icon={<Search size={20} />}
        />
      </div>

      {/* Contacts Table */}
      <ContactTable
        contacts={filteredContacts}
        loading={loading}
        onContactClick={handleContactClick}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* Create/Edit Contact Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title={editingContact ? 'Edit Contact' : 'Create New Contact'}
        className="max-w-2xl"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Contact"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{contactToDelete?.name}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Contacts;