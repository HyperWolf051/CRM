/**
 * Demo API utilities for the CRM application
 * Provides demo mode detection and mock data functionality
 */

/**
 * Check if the application is running in demo mode
 * @returns {boolean} Always returns true for this demo application
 */
export const isDemoMode = () => {
  return true; // Always in demo mode for this standalone frontend
};

/**
 * Get demo mode configuration
 * @returns {object} Demo mode settings
 */
export const getDemoConfig = () => {
  return {
    showIndicator: true,
    autoHideDelay: 3000,
    mockDataEnabled: true,
    simulateApiDelay: true
  };
};

/**
 * Simulate API delay for realistic demo experience
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {Promise} Promise that resolves after the delay
 */
export const simulateApiDelay = (delay = 500) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};