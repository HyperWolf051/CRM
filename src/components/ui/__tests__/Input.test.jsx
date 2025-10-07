import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { User } from 'lucide-react';
import Input from '../Input';

describe('Input', () => {
  it('renders with basic props', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    
    const input = screen.getByLabelText('Email');
    const label = screen.getByText('Email');
    
    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('type', 'text'); // default type
  });

  it('renders without label', () => {
    render(<Input placeholder="No label input" />);
    
    const input = screen.getByPlaceholderText('No label input');
    expect(input).toBeInTheDocument();
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" label="Password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" label="Age" />);
    expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Test" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('displays controlled value', () => {
    render(<Input label="Test" value="controlled value" onChange={() => {}} />);
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveValue('controlled value');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email format" />);
    
    const input = screen.getByLabelText('Email');
    const errorMessage = screen.getByText('Invalid email format');
    
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveClass('border-red-500');
  });

  it('does not show error styling when no error', () => {
    render(<Input label="Email" />);
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveClass('border-gray-300');
    expect(input).not.toHaveClass('border-red-500');
  });

  it('renders with icon', () => {
    render(<Input label="User" icon={<User data-testid="user-icon" />} />);
    
    const input = screen.getByLabelText('User');
    const icon = screen.getByTestId('user-icon');
    
    expect(icon).toBeInTheDocument();
    expect(input).toHaveClass('pl-10'); // padding for icon
  });

  it('handles disabled state', () => {
    render(<Input label="Disabled" disabled />);
    
    const input = screen.getByLabelText('Disabled');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-50');
  });

  it('generates correct id from label', () => {
    render(<Input label="Full Name" />);
    
    const input = screen.getByLabelText('Full Name');
    const label = screen.getByText('Full Name');
    
    expect(input).toHaveAttribute('id', 'full-name');
    expect(label).toHaveAttribute('for', 'full-name');
  });

  it('uses provided id over generated one', () => {
    render(<Input label="Test" id="custom-id" />);
    
    const input = screen.getByLabelText('Test');
    const label = screen.getByText('Test');
    
    expect(input).toHaveAttribute('id', 'custom-id');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('uses name attribute for id when no label', () => {
    render(<Input name="username" placeholder="Username" />);
    
    const input = screen.getByPlaceholderText('Username');
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('links error message with input via aria-describedby', () => {
    render(<Input label="Email" error="Required field" />);
    
    const input = screen.getByLabelText('Email');
    const errorId = input.getAttribute('aria-describedby');
    const errorMessage = screen.getByText('Required field');
    
    expect(errorId).toBeTruthy();
    expect(errorMessage).toHaveAttribute('id', errorId);
  });

  it('applies custom className', () => {
    render(<Input label="Test" className="custom-wrapper" />);
    
    const wrapper = screen.getByLabelText('Test').closest('.custom-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} label="Test" />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through additional props', () => {
    render(<Input label="Test" data-testid="custom-input" maxLength={10} />);
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('maxLength', '10');
  });
});