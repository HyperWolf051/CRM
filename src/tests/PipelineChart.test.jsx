import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PipelineChart from '../components/recruitment/PipelineChart';

describe('PipelineChart', () => {
  const mockData = [
    { stage: 'Registration', count: 150, color: 'bg-blue-500', conversionRate: 100 },
    { stage: 'Resume Share', count: 120, color: 'bg-purple-500', conversionRate: 80 },
    { stage: 'Shortlisting', count: 85, color: 'bg-amber-500', conversionRate: 71 },
    { stage: 'Interview', count: 45, color: 'bg-cyan-500', conversionRate: 53 },
    { stage: 'Selection', count: 25, color: 'bg-green-500', conversionRate: 56 },
    { stage: 'Placement', count: 18, color: 'bg-emerald-600', conversionRate: 72 }
  ];

  it('renders pipeline chart with correct stages', () => {
    render(<PipelineChart data={mockData} />);
    
    // Check if all stages are rendered
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('Resume Share')).toBeInTheDocument();
    expect(screen.getByText('Shortlisting')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('Selection')).toBeInTheDocument();
    expect(screen.getByText('Placement')).toBeInTheDocument();
  });

  it('displays chart title and structure', () => {
    render(<PipelineChart data={mockData} />);
    
    // Check if main title is displayed
    expect(screen.getByText('Recruitment Pipeline')).toBeInTheDocument();
    
    // Check if total candidates text is shown (using partial text match)
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
    expect(screen.getByText(/candidates/)).toBeInTheDocument();
  });

  it('shows summary statistics section', () => {
    render(<PipelineChart data={mockData} />);
    
    // Check if summary section labels are present
    expect(screen.getByText('Overall Conversion')).toBeInTheDocument();
    expect(screen.getByText('Successful Placements')).toBeInTheDocument();
    expect(screen.getByText('Total Drop-offs')).toBeInTheDocument();
  });

  it('renders with default data when no data provided', () => {
    render(<PipelineChart />);
    
    // Should render with default data
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('Recruitment Pipeline')).toBeInTheDocument();
  });

  it('renders vertical orientation correctly', () => {
    render(<PipelineChart data={mockData} orientation="vertical" />);
    
    // Should render funnel title for vertical orientation
    expect(screen.getByText('Recruitment Funnel')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
  });

  it('hides conversion rates when disabled', () => {
    render(<PipelineChart data={mockData} showConversionRates={false} />);
    
    // Should still render the chart
    expect(screen.getByText('Recruitment Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
  });
});