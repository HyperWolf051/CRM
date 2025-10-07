import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, MapPin, FileText, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import useContacts from '../hooks/useContacts';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';

const ContactEditForm = ({ contact, onSubmit, onCancel, loading }) => {
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
          rows={4}
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
          Update Contact
        </Button>
      </div>
    </form>
  );
};

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getContact, updateContact, deleteContact } = useContacts();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch contact details
  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await getContact(id);
        
        if (result.success) {
          setContact(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, getContact]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      case 'lead':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'lead':
        return 'Lead';
      default:
        return 'Unknown';
    }
  };

  const handleBack = () => {
    navigate('/app/contacts');
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    setFormLoading(true);
    
    try {
      const result = await updateContact(contact.id, formData);
      
      if (result.success) {
        setContact(result.data);
        showToast('success', 'Contact updated successfully');
        setIsEditModalOpen(false);
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
    try {
      const result = await deleteContact(contact.id);
      
      if (result.success) {
        showToast('success', 'Contact deleted successfully');
        navigate('/app/contacts');
      } else {
        showToast('error', result.error);
      }
    } catch (error) {
      showToast('error', 'Failed to delete contact');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SkeletonLoader width={40} height={40} className="rounded" />
            <div>
              <SkeletonLoader width={200} height={32} className="mb-2" />
              <SkeletonLoader width={150} height={20} />
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonLoader width={80} height={40} className="rounded" />
            <SkeletonLoader width={80} height={40} className="rounded" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <SkeletonLoader width={150} height={24} className="mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <SkeletonLoader width={20} height={20} />
                    <SkeletonLoader width={200} height={20} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <SkeletonLoader width={100} height={24} className="mb-4" />
              <SkeletonLoader width="100%" height={100} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load contact
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleBack}>
            Back to Contacts
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Contact not found
  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Contact not found
        </h3>
        <p className="text-gray-500 mb-4">
          The contact you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={handleBack}>
          Back to Contacts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            icon={<ArrowLeft size={20} />}
            className="p-2"
          />
          <div className="flex items-center gap-4">
            <Avatar 
              src={contact.avatar} 
              name={contact.name} 
              size="lg" 
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {contact.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(contact.status)}>
                  {getStatusLabel(contact.status)}
                </Badge>
                <span className="text-sm text-gray-500">
                  ID: {contact.id}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleEdit}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm font-medium text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Phone</div>
                    <div className="text-sm text-gray-600">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center gap-3">
                  <Building className="text-gray-400" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Company</div>
                    <div className="text-sm text-gray-600">{contact.company}</div>
                  </div>
                </div>
              )}
              
              {contact.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Address</div>
                    <div className="text-sm text-gray-600">{contact.address}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Notes */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Notes
            </h2>
            
            {contact.notes ? (
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {contact.notes}
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic">
                No notes added yet
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Contact"
        className="max-w-2xl"
      >
        <ContactEditForm
          contact={contact}
          onSubmit={handleEditSubmit}
          onCancel={handleCloseEditModal}
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
            Are you sure you want to delete <strong>{contact.name}</strong>? 
            This action cannot be undone and will remove all associated data.
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

export default ContactDetails;