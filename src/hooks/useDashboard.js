import { useState, useEffect } from 'react';
import api from '../utils/api';

const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard/metrics');
      setMetrics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard metrics');
      console.error('Dashboard metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};

export default useDashboard;