import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useApiError } from './useApiError';

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleError, executeWithErrorHandling } = useApiError();

  // Fetch all contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/contacts');
      // Handle both direct array and API response format
      const contactsData = response.data?.data || response.data || [];
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to fetch contacts';
      setError(errorMessage);
      setContacts([]); // Set empty array on error
      handleError(err, { defaultMessage: 'Failed to load contacts' });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Create a new contact
  const createContact = useCallback(async (contactData) => {
    try {
      const response = await executeWithErrorHandling(
        () => api.post('/contacts', contactData),
        {
          successMessage: 'Contact created successfully!',
          errorMessage: 'Failed to create contact',
          enableRetry: true
        }
      );
      const newContact = response.data?.data || response.data;
      
      // Add to local state
      setContacts(prev => [newContact, ...prev]);
      
      return { success: true, data: newContact };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

  // Update an existing contact
  const updateContact = useCallback(async (contactId, contactData) => {
    try {
      const response = await executeWithErrorHandling(
        () => api.put(`/contacts/${contactId}`, contactData),
        {
          successMessage: 'Contact updated successfully!',
          errorMessage: 'Failed to update contact',
          enableRetry: true
        }
      );
      const updatedContact = response.data?.data || response.data;
      
      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact._id === contactId ? updatedContact : contact
        )
      );
      
      return { success: true, data: updatedContact };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

  // Delete a contact
  const deleteContact = useCallback(async (contactId) => {
    try {
      await executeWithErrorHandling(
        () => api.delete(`/contacts/${contactId}`),
        {
          successMessage: 'Contact deleted successfully!',
          errorMessage: 'Failed to delete contact',
          enableRetry: true
        }
      );
      
      // Remove from local state
      setContacts(prev => prev.filter(contact => contact._id !== contactId));
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

  // Get a single contact by ID
  const getContact = useCallback(async (contactId) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      const contactData = response.data?.data || response.data;
      return { success: true, data: contactData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch contact';
      console.error('Contact fetch error:', err);
      return { success: false, error: message };
    }
  }, []);

  // Search/filter contacts
  const searchContacts = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/contacts', {
        params: { search: query }
      });
      const contactsData = response.data?.data || response.data || [];
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to search contacts';
      setError(errorMessage);
      setContacts([]); // Set empty array on error
      handleError(err, { defaultMessage: 'Failed to search contacts' });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Initial fetch on mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    getContact,
    searchContacts,
  };
};

export default useContacts;