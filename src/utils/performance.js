// Performance monitoring utilities

export const measurePerformance = (name, fn) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    const measureName = `${name}-measure`;
    
    performance.mark(startMark);
    const result = fn();
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
    }
    
    // Clean up marks and measures
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
    
    return result;
  }
  
  return fn();
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Web Vitals monitoring (optional)
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      // web-vitals not available, skip
    });
  }
};