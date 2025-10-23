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
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-white focus:ring-blue-500 hover:shadow-lg',
    ghost: 'bg-transparent text-gray-700 hover:text-white focus:ring-blue-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
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
  
  // Background slide animation based on variant
  const getBackgroundSlide = () => {
    switch (variant) {
      case 'primary':
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 
                          transform translate-y-full group-hover:translate-y-0 
                          transition-transform duration-200 ease-out"></div>
        );
      case 'secondary':
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                          transform -translate-x-full group-hover:translate-x-0 
                          transition-transform duration-200 ease-out"></div>
        );
      case 'ghost':
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 
                          transform scale-0 group-hover:scale-100 
                          transition-transform duration-200 ease-out rounded-xl"></div>
        );
      case 'danger':
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 
                          transform translate-x-full group-hover:translate-x-0 
                          transition-transform duration-200 ease-out"></div>
        );
      default:
        return null;
    }
  };

  return (
    <Component {...componentProps}>
      {/* Background slide animation */}
      {getBackgroundSlide()}
      
      {/* Content with z-index to appear above background */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : icon ? (
          <span className="flex items-center">{icon}</span>
        ) : null}
        {children}
      </span>
    </Component>
  );
};

export default Button;
