/**
 * Console wrapper for production builds
 * Removes console statements in production while keeping them in development
 */

const isDevelopment = import.meta.env.DEV;

export const devConsole = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Always show errors, even in production
    console.error(...args);
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default devConsole;