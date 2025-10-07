import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useApiError } from './useApiError';

export function useDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const { handleError, executeWithErrorHandling } = useApiError();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/deals');
      setDeals(response.data);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to fetch deals';
      setError(errorMessage);
      handleError(err, { defaultMessage: 'Failed to load deals' });
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData) => {
    try {
      const response = await executeWithErrorHandling(
        () => api.post('/deals', dealData),
        {
          successMessage: 'Deal created successfully!',
          errorMessage: 'Failed to create deal',
          enableRetry: true
        }
      );
      const newDeal = response.data;
      setDeals(prev => [...prev, newDeal]);
      return newDeal;
    } catch (err) {
      throw err;
    }
  };

  const updateDeal = async (dealId, dealData) => {
    try {
      const response = await executeWithErrorHandling(
        () => api.put(`/deals/${dealId}`, dealData),
        {
          successMessage: 'Deal updated successfully!',
          errorMessage: 'Failed to update deal',
          enableRetry: true
        }
      );
      const updatedDeal = response.data;
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? updatedDeal : deal
      ));
      return updatedDeal;
    } catch (err) {
      throw err;
    }
  };

  const updateDealStage = async (dealId, newStage) => {
    try {
      // Optimistically update the UI
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      ));

      const response = await executeWithErrorHandling(
        () => api.patch(`/deals/${dealId}/stage`, { stage: newStage }),
        {
          errorMessage: 'Failed to update deal stage',
          enableRetry: true
        }
      );
      const updatedDeal = response.data;
      
      // Update with server response
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? updatedDeal : deal
      ));
      
      return updatedDeal;
    } catch (err) {
      // Revert optimistic update on error
      await fetchDeals();
      throw err;
    }
  };

  const deleteDeal = async (dealId) => {
    try {
      await executeWithErrorHandling(
        () => api.delete(`/deals/${dealId}`),
        {
          successMessage: 'Deal deleted successfully!',
          errorMessage: 'Failed to delete deal',
          enableRetry: true
        }
      );
      setDeals(prev => prev.filter(deal => deal.id !== dealId));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
  };
}