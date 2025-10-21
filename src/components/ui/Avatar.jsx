import { useState, memo, useMemo } from 'react';

const Avatar = memo(({ 
  src, 
  name = '', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };
  
  const sizeClass = sizes[size] || sizes.md;
  
  // Memoize expensive calculations
  const initials = useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, [name]);
  
  const backgroundColor = useMemo(() => {
    if (!name) return 'bg-gray-400';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }, [name]);
  
  const showImage = src && !imageError;
  
  return (
    <div 
      className={`
        ${sizeClass} 
        rounded-full 
        flex items-center justify-center 
        font-medium text-white
        overflow-hidden
        ${!showImage ? backgroundColor : 'bg-gray-200'}
        ${className}
      `}
      {...props}
    >
      {showImage ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
});

export default Avatar;
