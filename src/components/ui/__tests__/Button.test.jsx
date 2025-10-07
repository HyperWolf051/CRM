import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { User } from 'lucide-react';
import Button from '../Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-primary-500'); // primary variant
    expect(button).toHaveClass('px-4 py-2'); // md size
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('border border-gray-300 bg-white');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5 text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-base');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-lg');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} loading>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with icon', () => {
    render(<Button icon={<User data-testid="user-icon" />}>With Icon</Button>);
    
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders icon-only button with aria-label', () => {
    render(<Button icon={<User data-testid="user-icon" />} aria-label="User button" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'User button');
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as different component when "as" prop is provided', () => {
    render(<Button as="a" href="/test">Link Button</Button>);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).not.toHaveAttribute('type'); // type should not be added to non-button elements
  });

  it('sets correct type attribute for button elements', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('warns when icon-only button lacks aria-label', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<Button icon={<User />} />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Button with icon but no text should have an aria-label prop for accessibility'
    );
    
    consoleSpy.mockRestore();
  });
});