import { Loader2 } from 'lucide-react';

const Button = ({ 
  as: Component = 'button',
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading = false, 
  disabled = false, 
  onClick, 
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  const componentProps = {
    className: `${baseStyles} ${variantClass} ${sizeClass} ${className}`,
    onClick,
    disabled: disabled || loading,
    ...props
  };
  
  // Only add type prop for button elements
  if (Component === 'button') {
    componentProps.type = type;
  }
  
  // Add aria-label for icon-only buttons (no children text)
  if (!children && ariaLabel) {
    componentProps['aria-label'] = ariaLabel;
  } else if (!children && !ariaLabel && icon) {
    console.warn('Button with icon but no text should have an aria-label prop for accessibility');
  }
  
  return (
    <Component {...componentProps}>
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}
      {children}
    </Component>
  );
};

export default Button;
