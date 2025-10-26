import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Users } from 'lucide-react';
import MetricCard from '../components/recruitment/MetricCard';

describe('MetricCard', () => {
  const mockProps = {
    title: 'Total Candidates',
    value: 1247,
    trend: { value: 12, direction: 'up', period: 'this month' },
    icon: Users,
    color: 'blue',
    sparklineData: [1180, 1195, 1210, 1185, 1220, 1205, 1235, 1215, 1240, 1247],
    description: 'Active candidates in pipeline'
  };

  it('renders metric card with all elements', () => {
    render(<MetricCard {...mockProps} />);
    
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('12% this month')).toBeInTheDocument();
    expect(screen.getByText('Active candidates in pipeline')).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(<MetricCard {...mockProps} loading={true} />);
    
    // Should show skeleton loading elements
    const skeletonElements = document.querySelectorAll('.bg-gray-200');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('handles missing trend data gracefully', () => {
    const propsWithoutTrend = { ...mockProps, trend: null };
    render(<MetricCard {...propsWithoutTrend} />);
    
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.queryByText('12% this month')).not.toBeInTheDocument();
  });

  it('handles missing sparkline data gracefully', () => {
    const propsWithoutSparkline = { ...mockProps, sparklineData: [] };
    render(<MetricCard {...propsWithoutSparkline} />);
    
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
  });

  it('formats numeric values correctly', () => {
    const propsWithLargeNumber = { ...mockProps, value: 1234567 };
    render(<MetricCard {...propsWithLargeNumber} />);
    
    // The toLocaleString() method formats numbers based on system locale
    // This test checks that the number is formatted correctly
    expect(screen.getByText('12,34,567')).toBeInTheDocument();
  });

  it('handles string values correctly', () => {
    const propsWithStringValue = { ...mockProps, value: 'N/A' };
    render(<MetricCard {...propsWithStringValue} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    const { container } = render(<MetricCard {...mockProps} color="green" />);
    
    const borderElement = container.querySelector('.border-l-green-500');
    expect(borderElement).toBeInTheDocument();
  });

  it('shows trend direction correctly', () => {
    const propsWithDownTrend = { 
      ...mockProps, 
      trend: { value: 5, direction: 'down', period: 'this week' }
    };
    render(<MetricCard {...propsWithDownTrend} />);
    
    expect(screen.getByText('5% this week')).toBeInTheDocument();
  });
});