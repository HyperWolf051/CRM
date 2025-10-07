/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validates password strength
 * Requirements: minimum 8 characters, at least 1 uppercase letter, at least 1 number
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
export const validatePassword = (password) => {
  if (!password) return false;
  
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasMinLength && hasUppercase && hasNumber;
};

/**
 * Validates phone number format
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Valid if 10 or 11 digits (with country code)
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
};

/**
 * Validates that a field is not empty
 * @param {any} value - Value to validate
 * @returns {boolean} - True if field has a value
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Get password validation error message
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getPasswordError = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  return null;
};

/**
 * Get email validation error message
 * @param {string} email - Email to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getEmailError = (email) => {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return null;
};
