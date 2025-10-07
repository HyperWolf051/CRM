import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  getPasswordError,
  getEmailError
} from '../validation';

describe('validateEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
    expect(validateEmail('123@numbers.com')).toBe(true);
  });

  it('returns false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test.example.com')).toBe(false);
    expect(validateEmail('test @example.com')).toBe(false);
    expect(validateEmail('test@example')).toBe(false);
  });

  it('returns false for empty or null values', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});

describe('validatePassword', () => {
  it('returns true for valid passwords', () => {
    expect(validatePassword('Password1')).toBe(true);
    expect(validatePassword('MySecure123')).toBe(true);
    expect(validatePassword('ComplexP@ss1')).toBe(true);
    expect(validatePassword('UPPERCASE123')).toBe(true);
  });

  it('returns false for passwords without minimum length', () => {
    expect(validatePassword('Pass1')).toBe(false);
    expect(validatePassword('Abc123')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  it('returns false for passwords without uppercase letter', () => {
    expect(validatePassword('password123')).toBe(false);
    expect(validatePassword('lowercase1')).toBe(false);
  });

  it('returns false for passwords without number', () => {
    expect(validatePassword('Password')).toBe(false);
    expect(validatePassword('NoNumbers')).toBe(false);
  });

  it('returns false for empty or null values', () => {
    expect(validatePassword('')).toBe(false);
    expect(validatePassword(null)).toBe(false);
    expect(validatePassword(undefined)).toBe(false);
  });
});

describe('validatePhone', () => {
  it('returns true for valid phone numbers', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('12345678901')).toBe(true); // with country code
    expect(validatePhone('(123) 456-7890')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
    expect(validatePhone('+1 123 456 7890')).toBe(true);
    expect(validatePhone('123.456.7890')).toBe(true);
  });

  it('returns false for invalid phone numbers', () => {
    expect(validatePhone('123456789')).toBe(false); // too short
    expect(validatePhone('123456789012')).toBe(false); // too long
    expect(validatePhone('abc-def-ghij')).toBe(false); // no digits
  });

  it('returns false for empty or null values', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone(null)).toBe(false);
    expect(validatePhone(undefined)).toBe(false);
  });
});

describe('validateRequired', () => {
  it('returns true for non-empty values', () => {
    expect(validateRequired('text')).toBe(true);
    expect(validateRequired('   text   ')).toBe(true); // trimmed
    expect(validateRequired(123)).toBe(true);
    expect(validateRequired(0)).toBe(true);
    expect(validateRequired(false)).toBe(true);
    expect(validateRequired([])).toBe(true);
    expect(validateRequired({})).toBe(true);
  });

  it('returns false for empty string values', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false); // only whitespace
  });

  it('returns false for null or undefined values', () => {
    expect(validateRequired(null)).toBe(false);
    expect(validateRequired(undefined)).toBe(false);
  });
});

describe('getPasswordError', () => {
  it('returns null for valid passwords', () => {
    expect(getPasswordError('Password1')).toBe(null);
    expect(getPasswordError('MySecure123')).toBe(null);
  });

  it('returns appropriate error messages', () => {
    expect(getPasswordError('')).toBe('Password is required');
    expect(getPasswordError(null)).toBe('Password is required');
    expect(getPasswordError('short')).toBe('Password must be at least 8 characters');
    expect(getPasswordError('nouppercase1')).toBe('Password must contain at least 1 uppercase letter');
    expect(getPasswordError('NoNumbers')).toBe('Password must contain at least 1 number');
  });

  it('returns first error encountered', () => {
    // Should return length error first
    expect(getPasswordError('abc')).toBe('Password must be at least 8 characters');
    
    // Should return uppercase error when length is ok but no uppercase
    expect(getPasswordError('password1')).toBe('Password must contain at least 1 uppercase letter');
    
    // Should return number error when length and uppercase are ok but no number
    expect(getPasswordError('Password')).toBe('Password must contain at least 1 number');
  });
});

describe('getEmailError', () => {
  it('returns null for valid emails', () => {
    expect(getEmailError('test@example.com')).toBe(null);
    expect(getEmailError('user.name@domain.co.uk')).toBe(null);
  });

  it('returns appropriate error messages', () => {
    expect(getEmailError('')).toBe('Email is required');
    expect(getEmailError(null)).toBe('Email is required');
    expect(getEmailError('invalid-email')).toBe('Please enter a valid email address');
    expect(getEmailError('test@')).toBe('Please enter a valid email address');
  });
});