import { useState, useEffect } from 'react';

const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set sample metrics data
      setMetrics({
        user: {
          name: 'John Doe'
        },
        counts: {
          totalContacts: 156,
          totalDeals: 42,
          totalCompanies: 28,
          upcomingEvents: 8,
          activeDeals: 24,
          closedWonDeals: 18,
          overdueDeals: 3
        },
        dealValue: {
          totalValue: 485000,
          avgValue: 11547,
          weightedValue: 324500
        },
        contactsTrend: 12,
        dealsTrend: 8,
        revenueTrend: 15,
        conversionTrend: 5,
        revenue: 485000,
        conversionRate: 42.8
      });
    } catch (err) {
      setError('Failed to fetch dashboard metrics');
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