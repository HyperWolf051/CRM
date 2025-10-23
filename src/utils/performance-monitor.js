/**
 * Performance Monitoring Utilities
 * 
 * Utilities for monitoring and optimizing application performance
 * in production and development environments.
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                     localStorage.getItem('performance-monitoring') === 'true';
  }

  // Core Web Vitals monitoring
  initCoreWebVitals() {
    if (!this.isEnabled) return;

    // First Contentful Paint (FCP)
    this.observePaint();
    
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Input Delay (FID)
    this.observeFID();
  }

  observePaint() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime);
          console.log(`🎨 First Contentful Paint: ${Math.round(entry.startTime)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('paint', observer);
  }

  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric('LCP', lastEntry.startTime);
      console.log(`🖼️ Largest Contentful Paint: ${Math.round(lastEntry.startTime)}ms`);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.recordMetric('CLS', clsValue);
      console.log(`📐 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', observer);
  }

  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
        console.log(`⚡ First Input Delay: ${Math.round(entry.processingStart - entry.startTime)}ms`);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', observer);
  }

  // Component performance monitoring
  measureComponentRender(componentName, renderFunction) {
    if (!this.isEnabled) return renderFunction();

    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    this.recordMetric(`${componentName}_render`, renderTime);
    
    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`⚠️ Slow render detected: ${componentName} took ${Math.round(renderTime)}ms`);
    }
    
    return result;
  }

  // Memory monitoring
  monitorMemoryUsage() {
    if (!this.isEnabled || !performance.memory) return;

    const memory = performance.memory;
    const memoryInfo = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };

    this.recordMetric('memory', memoryInfo);
    
    // Warn if memory usage is high
    if (memoryInfo.used > 50) {
      console.warn(`🧠 High memory usage: ${memoryInfo.used}MB`);
    }
    
    return memoryInfo;
  }

  // Network performance monitoring
  monitorNetworkRequests() {
    if (!this.isEnabled) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          this.recordMetric('page_load', entry.loadEventEnd - entry.fetchStart);
          console.log(`🌐 Page Load Time: ${Math.round(entry.loadEventEnd - entry.fetchStart)}ms`);
        }
        
        if (entry.entryType === 'resource') {
          const resourceTime = entry.responseEnd - entry.startTime;
          
          if (resourceTime > 1000) { // Slow resource
            console.warn(`🐌 Slow resource: ${entry.name} took ${Math.round(resourceTime)}ms`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
    this.observers.set('network', observer);
  }

  // Bundle size monitoring
  async monitorBundleSize() {
    if (!this.isEnabled) return;

    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const bundleSize = Math.round(estimate.usage / 1024);
        
        this.recordMetric('bundle_size', bundleSize);
        console.log(`📦 Estimated Bundle Size: ${bundleSize}KB`);
        
        if (bundleSize > 1024) { // Larger than 1MB
          console.warn(`📦 Large bundle detected: ${bundleSize}KB`);
        }
      }
    } catch (error) {
      console.warn('Could not estimate bundle size:', error);
    }
  }

  // Animation performance monitoring
  monitorAnimationPerformance(animationName, element) {
    if (!this.isEnabled) return;

    let frameCount = 0;
    let startTime = performance.now();
    
    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed >= 1000) { // Measure for 1 second
        const fps = Math.round((frameCount * 1000) / elapsed);
        this.recordMetric(`${animationName}_fps`, fps);
        
        if (fps < 55) { // Below 55fps
          console.warn(`🎬 Low FPS detected: ${animationName} running at ${fps}fps`);
        }
        
        return;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  }

  // User interaction monitoring
  monitorUserInteractions() {
    if (!this.isEnabled) return;

    const interactionTypes = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (event) => {
        const startTime = performance.now();
        
        // Measure response time
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime;
          
          if (responseTime > 100) { // Slow response
            console.warn(`🖱️ Slow interaction response: ${type} took ${Math.round(responseTime)}ms`);
          }
        });
      }, { passive: true });
    });
  }

  // Record metric
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now()
    });
    
    // Keep only last 100 measurements
    const measurements = this.metrics.get(name);
    if (measurements.length > 100) {
      measurements.shift();
    }
  }

  // Get performance report
  getPerformanceReport() {
    const report = {};
    
    this.metrics.forEach((measurements, name) => {
      const values = measurements.map(m => m.value);
      report[name] = {
        current: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });
    
    return report;
  }

  // Performance recommendations
  getRecommendations() {
    const report = this.getPerformanceReport();
    const recommendations = [];
    
    // FCP recommendations
    if (report.FCP && report.FCP.average > 1800) {
      recommendations.push({
        type: 'FCP',
        message: 'First Contentful Paint is slow. Consider optimizing critical rendering path.',
        priority: 'high'
      });
    }
    
    // LCP recommendations
    if (report.LCP && report.LCP.average > 2500) {
      recommendations.push({
        type: 'LCP',
        message: 'Largest Contentful Paint is slow. Optimize largest element loading.',
        priority: 'high'
      });
    }
    
    // CLS recommendations
    if (report.CLS && report.CLS.average > 0.1) {
      recommendations.push({
        type: 'CLS',
        message: 'Cumulative Layout Shift is high. Reserve space for dynamic content.',
        priority: 'medium'
      });
    }
    
    // Memory recommendations
    if (report.memory && report.memory.average > 50) {
      recommendations.push({
        type: 'Memory',
        message: 'High memory usage detected. Check for memory leaks.',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  // Cleanup
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics.clear();
  }

  // Enable/disable monitoring
  enable() {
    this.isEnabled = true;
    localStorage.setItem('performance-monitoring', 'true');
  }

  disable() {
    this.isEnabled = false;
    localStorage.removeItem('performance-monitoring');
    this.cleanup();
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  performanceMonitor.initCoreWebVitals();
  performanceMonitor.monitorNetworkRequests();
  performanceMonitor.monitorUserInteractions();
  performanceMonitor.monitorBundleSize();
  
  // Monitor memory usage every 30 seconds
  setInterval(() => {
    performanceMonitor.monitorMemoryUsage();
  }, 30000);
  
  // Expose to window for debugging
  window.performanceMonitor = performanceMonitor;
}

export default performanceMonitor;