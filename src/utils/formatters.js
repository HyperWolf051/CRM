/**
 * Formats a number as currency (INR by default for Indian market)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    const defaultSymbol = currency === 'USD' ? '$0.00' : '₹0.00';
    return defaultSymbol;
  }
  
  const locale = currency === 'USD' ? 'en-US' : 'en-IN';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string or Date object to a readable format (Indian timezone)
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
    short: { month: 'numeric', day: 'numeric', year: '2-digit', timeZone: 'Asia/Kolkata' },
    medium: { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' },
    long: { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' },
  };
  
  return new Intl.DateTimeFormat('en-IN', options[format] || options.medium).format(dateObj);
};

/**
 * Formats a phone number to Indian standard format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digitsOnly.length === 10) {
    // Format as +91 98765 43210 (Indian mobile format)
    return `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    // Already has country code
    return `+91 ${digitsOnly.slice(2, 7)} ${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    // Remove leading 0 and format
    const mobile = digitsOnly.slice(1);
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
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
 * Formats a number with Indian number system (lakhs, crores)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-IN').format(num);
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
 * Formats time to Indian Standard Time (IST)
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time string in IST
 */
export const formatTimeIST = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    hour12: true
  }).format(dateObj);
};

/**
 * Formats date and time to Indian format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTimeIST = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    hour12: true
  }).format(dateObj);
};

/**
 * Formats number in Indian numbering system with words (lakhs, crores)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number with Indian units
 */
export const formatIndianNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  if (num >= 10000000) { // 1 crore
    return `${(num / 10000000).toFixed(1)} Cr`;
  } else if (num >= 100000) { // 1 lakh
    return `${(num / 100000).toFixed(1)} L`;
  } else if (num >= 1000) { // 1 thousand
    return `${(num / 1000).toFixed(1)} K`;
  }
  
  return formatNumber(num);
};

/**
 * Formats currency in Indian format with units
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency with Indian units
 */
export const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  
  return formatCurrency(amount);
};

/**
 * Formats a number as a compact currency string (e.g., 2.5M, 1.2K).
 * Uses Intl.NumberFormat with the 'compact' notation where supported.
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @param {string} locale - Locale to format for (default: 'en-IN')
 * @returns {string} - Compact formatted currency
 */
export const formatCompactCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    // fallback similar to other formatters
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0);
    } catch (e) {
      return currency === 'INR' ? '₹0' : `0 ${currency}`;
    }
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch (e) {
    // If compact notation isn't supported in the environment, fall back to regular formatting
    return formatCurrency(amount, currency);
  }
};