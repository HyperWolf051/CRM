const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  ...props 
}) => {
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const paddingClass = paddingSizes[padding] || paddingSizes.md;
  
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-150 hover:shadow-md hover:border-gray-300 ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
