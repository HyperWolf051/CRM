import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useApiError } from './useApiError';

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleError, executeWithErrorHandling } = useApiError();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to fetch contacts';
      setError(errorMessage);
      handleError(err, { defaultMessage: 'Failed to load contacts' });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

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
      const newContact = response.data;
      setContacts(prev => [newContact, ...prev]);
      return { success: true, data: newContact };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

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
      const updatedContact = response.data;
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? updatedContact : contact
      ));
      return { success: true, data: updatedContact };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

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
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.userMessage || err.message };
    }
  }, [executeWithErrorHandling]);

  const getContact = useCallback(async (contactId) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch contact';
      console.error('Contact fetch error:', err);
      return { success: false, error: message };
    }
  }, []);

  const searchContacts = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/contacts', { params: { search: query } });
      setContacts(response.data);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to search contacts';
      setError(errorMessage);
      handleError(err, { defaultMessage: 'Failed to search contacts' });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

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