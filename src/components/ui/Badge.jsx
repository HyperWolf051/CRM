const Badge = ({ 
  variant = 'neutral', 
  children,
  className = '',
  ...props 
}) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  const variantClass = variants[variant] || variants.neutral;
  
  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-xs font-medium 
        border transition-all duration-150
        hover:shadow-sm transform hover:scale-105
        ${variantClass} 
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
