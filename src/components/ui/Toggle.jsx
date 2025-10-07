const Toggle = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  label,
  description,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-primary-500' : 'bg-gray-200'}
        `}
        {...props}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label className="block text-sm font-medium text-gray-900 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;