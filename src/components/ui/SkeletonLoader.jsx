const SkeletonLoader = ({ 
  width = '100%', 
  height = '1rem',
  className = '',
  ...props 
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
  
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={style}
      {...props}
    >
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-pulse {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
