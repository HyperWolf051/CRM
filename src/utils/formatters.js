/**
 * Formats a number as currency (USD by default)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string or Date object to a readable format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'medium' (default: 'medium')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
  };
  
  return new Intl.DateTimeFormat('en-US', options[format] || options.medium).format(dateObj);
};

/**
 * Formats a phone number to a standard format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digitsOnly.length === 10) {
    // Format as (123) 456-7890
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    // Format as +1 (123) 456-7890
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  // Return original if format is unrecognized
  return phone;
};

/**
 * Formats a date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateObj, 'short');
};

/**
 * Formats a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats a percentage value
 * @param {number} value - Value to format (0-100 or 0-1)
 * @param {boolean} isDecimal - Whether the value is in decimal form (0-1)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, isDecimal = false) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(1)}%`;
};
/**
 * Formats a number as compact currency (e.g., $1.2M, $500K)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted compact currency string
 */
export const formatCompactCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};