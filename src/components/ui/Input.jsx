import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  disabled = false,
  className = '',
  id,
  name,
  ...props 
}, ref) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = error ? `${inputId}-error` : undefined;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : 'false'}
          className={`
            w-full px-4 py-3 border rounded-xl text-base bg-white/70 backdrop-blur-sm
            transition-all duration-200 transform
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white focus:shadow-lg
            hover:border-gray-400 hover:shadow-md hover:bg-white/90
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            placeholder:text-gray-400
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/50 bg-red-50/50' : 'border-gray-300'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
