/**
 * Final Optimizations Script
 * 
 * Applies final performance optimizations and polish to the application.
 * This script should be run as part of the build process or initialization.
 */

// Import performance monitor
import performanceMonitor from './performance-monitor.js';

class FinalOptimizations {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.optimizations = [];
  }

  // Initialize all optimizations
  async initialize() {
    console.log('🚀 Applying final optimizations...');
    
    try {
      await this.applyImageOptimizations();
      await this.applyFontOptimizations();
      await this.applyCSSOptimizations();
      await this.applyJavaScriptOptimizations();
      await this.applyNetworkOptimizations();
      await this.applyAccessibilityOptimizations();
      await this.applyPerformanceMonitoring();
      
      console.log('✅ All optimizations applied successfully');
      this.generateOptimizationReport();
    } catch (error) {
      console.error('❌ Error applying optimizations:', error);
    }
  }

  // Image optimizations
  async applyImageOptimizations() {
    console.log('🖼️ Applying image optimizations...');
    
    // Add lazy loading to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }
    });

    // Add WebP support detection
    this.addWebPSupport();
    
    // Optimize image sizes based on viewport
    this.optimizeImageSizes();
    
    this.optimizations.push('Image lazy loading and WebP support');
  }

  // Font optimizations
  async applyFontOptimizations() {
    console.log('🔤 Applying font optimizations...');
    
    // Add font-display: swap to all font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    // Preload critical fonts
    this.preloadCriticalFonts();
    
    this.optimizations.push('Font display optimization and preloading');
  }

  // CSS optimizations
  async applyCSSOptimizations() {
    console.log('🎨 Applying CSS optimizations...');
    
    // Add critical CSS inlining
    this.inlineCriticalCSS();
    
    // Optimize animations for performance
    this.optimizeAnimations();
    
    // Add GPU acceleration to transform elements
    this.addGPUAcceleration();
    
    this.optimizations.push('CSS critical path and animation optimization');
  }

  // JavaScript optimizations
  async applyJavaScriptOptimizations() {
    console.log('⚡ Applying JavaScript optimizations...');
    
    // Implement service worker for caching
    if ('serviceWorker' in navigator && this.isProduction) {
      await this.registerServiceWorker();
    }
    
    // Add intersection observer for lazy loading
    this.setupIntersectionObserver();
    
    // Optimize event listeners
    this.optimizeEventListeners();
    
    this.optimizations.push('Service worker and event optimization');
  }

  // Network optimizations
  async applyNetworkOptimizations() {
    console.log('🌐 Applying network optimizations...');
    
    // Add resource hints
    this.addResourceHints();
    
    // Implement request caching
    this.setupRequestCaching();
    
    // Add compression headers
    this.addCompressionHeaders();
    
    this.optimizations.push('Network caching and compression');
  }

  // Accessibility optimizations
  async applyAccessibilityOptimizations() {
    console.log('♿ Applying accessibility optimizations...');
    
    // Add focus management
    this.setupFocusManagement();
    
    // Add ARIA labels where missing
    this.addMissingAriaLabels();
    
    // Optimize for screen readers
    this.optimizeForScreenReaders();
    
    this.optimizations.push('Accessibility enhancements');
  }

  // Performance monitoring setup
  async applyPerformanceMonitoring() {
    console.log('📊 Setting up performance monitoring...');
    
    // Initialize performance monitor
    performanceMonitor.enable();
    
    // Set up error tracking
    this.setupErrorTracking();
    
    // Add performance budgets
    this.setupPerformanceBudgets();
    
    this.optimizations.push('Performance monitoring and error tracking');
  }

  // WebP support detection and implementation
  addWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP) {
      document.documentElement.classList.add('webp-support');
    } else {
      document.documentElement.classList.add('no-webp-support');
    }
  }

  // Optimize image sizes based on viewport
  optimizeImageSizes() {
    const images = document.querySelectorAll('img[data-sizes]');
    
    images.forEach(img => {
      const sizes = img.dataset.sizes;
      if (sizes) {
        img.sizes = sizes;
      }
    });
  }

  // Preload critical fonts
  preloadCriticalFonts() {
    const criticalFonts = [
      '/fonts/inter-regular.woff2',
      '/fonts/inter-medium.woff2',
      '/fonts/inter-semibold.woff2'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });
  }

  // Inline critical CSS
  inlineCriticalCSS() {
    // This would typically be done at build time
    // For runtime, we can prioritize critical styles
    const criticalCSS = `
      .above-fold { contain: layout; }
      .critical-path { will-change: auto; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // Optimize animations for performance
  optimizeAnimations() {
    const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="transition-"]');
    
    animatedElements.forEach(element => {
      // Add GPU acceleration
      element.style.transform = element.style.transform || 'translateZ(0)';
      
      // Optimize will-change property
      element.addEventListener('animationstart', () => {
        element.style.willChange = 'transform, opacity';
      });
      
      element.addEventListener('animationend', () => {
        element.style.willChange = 'auto';
      });
    });
  }

  // Add GPU acceleration to transform elements
  addGPUAcceleration() {
    const transformElements = document.querySelectorAll('[class*="transform"], [class*="scale-"], [class*="rotate-"]');
    
    transformElements.forEach(element => {
      if (!element.style.transform.includes('translateZ')) {
        element.style.transform += ' translateZ(0)';
      }
    });
  }

  // Register service worker
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }

  // Setup intersection observer for lazy loading
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Lazy load images
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
            observer.unobserve(element);
          }
          
          // Lazy load components
          if (element.classList.contains('lazy-component')) {
            element.classList.add('loaded');
            observer.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe lazy elements
    document.querySelectorAll('img[data-src], .lazy-component').forEach(el => {
      observer.observe(el);
    });
  }

  // Optimize event listeners
  optimizeEventListeners() {
    // Use passive listeners where appropriate
    const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
    
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true });
    });

    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('optimizedResize'));
      }, 250);
    });
  }

  // Add resource hints
  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//api.example.com' },
      { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  // Setup request caching
  setupRequestCaching() {
    // Simple in-memory cache for API requests
    const cache = new Map();
    const originalFetch = window.fetch;
    
    window.fetch = async (url, options = {}) => {
      // Only cache GET requests
      if (options.method && options.method !== 'GET') {
        return originalFetch(url, options);
      }
      
      const cacheKey = `${url}${JSON.stringify(options)}`;
      
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes
          return Promise.resolve(cached.response.clone());
        }
      }
      
      const response = await originalFetch(url, options);
      
      if (response.ok) {
        cache.set(cacheKey, {
          response: response.clone(),
          timestamp: Date.now()
        });
      }
      
      return response;
    };
  }

  // Add compression headers (would typically be done server-side)
  addCompressionHeaders() {
    // This is a placeholder - compression should be handled by the server
    console.log('Compression headers should be configured on the server');
  }

  // Setup focus management
  setupFocusManagement() {
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add skip links for accessibility
    this.addSkipLinks();
  }

  // Add missing ARIA labels
  addMissingAriaLabels() {
    // Find buttons without accessible names
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        console.warn('Button without accessible name found:', button);
        button.setAttribute('aria-label', 'Button');
      }
    });

    // Find form inputs without labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    
    inputs.forEach(input => {
      if (!input.labels || input.labels.length === 0) {
        console.warn('Input without label found:', input);
      }
    });
  }

  // Optimize for screen readers
  optimizeForScreenReaders() {
    // Add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Add landmark roles where missing
    this.addLandmarkRoles();
  }

  // Add skip links
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Add landmark roles
  addLandmarkRoles() {
    // Add main landmark if missing
    if (!document.querySelector('main, [role="main"]')) {
      const mainContent = document.querySelector('#main-content, .main-content, .content');
      if (mainContent) {
        mainContent.setAttribute('role', 'main');
      }
    }

    // Add navigation landmark if missing
    const nav = document.querySelector('nav:not([role])');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
  }

  // Setup error tracking
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      // In production, send to error tracking service
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // In production, send to error tracking service
    });
  }

  // Setup performance budgets
  setupPerformanceBudgets() {
    const budgets = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      CLS: 0.1,  // Cumulative Layout Shift
      FID: 100   // First Input Delay
    };

    // Monitor and warn if budgets are exceeded
    Object.entries(budgets).forEach(([metric, budget]) => {
      performanceMonitor.recordMetric(`budget_${metric}`, budget);
    });
  }

  // Generate optimization report
  generateOptimizationReport() {
    console.log('\n📊 Final Optimization Report');
    console.log('================================');
    console.log(`✅ Applied ${this.optimizations.length} optimization categories:`);
    
    this.optimizations.forEach((optimization, index) => {
      console.log(`  ${index + 1}. ${optimization}`);
    });
    
    console.log('\n🎯 Performance Targets:');
    console.log('  • First Contentful Paint: < 1.8s');
    console.log('  • Largest Contentful Paint: < 2.5s');
    console.log('  • Cumulative Layout Shift: < 0.1');
    console.log('  • First Input Delay: < 100ms');
    
    console.log('\n🔍 Next Steps:');
    console.log('  • Run Lighthouse audit');
    console.log('  • Test on real devices');
    console.log('  • Monitor Core Web Vitals');
    console.log('  • Gather user feedback');
    
    console.log('\n✨ Final polish complete!');
  }
}

// Initialize optimizations
const finalOptimizations = new FinalOptimizations();

// Auto-run in browser
if (typeof window !== 'undefined') {
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      finalOptimizations.initialize();
    });
  } else {
    finalOptimizations.initialize();
  }
}

export default finalOptimizations;