/**
 * Accessibility utility functions and helpers
 */

/**
 * Check if an element has proper focus indicators
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export const hasFocusIndicator = (element) => {
  const computedStyle = window.getComputedStyle(element, ':focus');
  return (
    computedStyle.outline !== 'none' ||
    computedStyle.boxShadow !== 'none' ||
    computedStyle.border !== computedStyle.getPropertyValue('border')
  );
};

/**
 * Check if an element has proper ARIA labels
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export const hasAriaLabel = (element) => {
  return !!(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim()
  );
};

/**
 * Check if form inputs have proper error associations
 * @param {HTMLInputElement} input 
 * @returns {boolean}
 */
export const hasProperErrorAssociation = (input) => {
  const describedBy = input.getAttribute('aria-describedby');
  if (!describedBy) return true; // No error, so it's fine
  
  const errorElement = document.getElementById(describedBy);
  return !!(errorElement && errorElement.getAttribute('role') === 'alert');
};

/**
 * Check if navigation has proper current page indicators
 * @param {HTMLElement} nav 
 * @returns {boolean}
 */
export const hasProperCurrentPageIndicator = (nav) => {
  const currentItems = nav.querySelectorAll('[aria-current="page"]');
  return currentItems.length <= 1; // Should have at most one current page
};

/**
 * Check if interactive elements are keyboard accessible
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export const isKeyboardAccessible = (element) => {
  const tagName = element.tagName.toLowerCase();
  const tabIndex = element.getAttribute('tabindex');
  
  // Naturally focusable elements
  const naturallyFocusable = ['a', 'button', 'input', 'select', 'textarea'];
  if (naturallyFocusable.includes(tagName)) {
    return tabIndex !== '-1';
  }
  
  // Elements with explicit tabindex
  return tabIndex !== null && tabIndex !== '-1';
};

/**
 * Run basic accessibility checks on the current page
 * @returns {Object} Results of accessibility checks
 */
export const runAccessibilityChecks = () => {
  const results = {
    focusableElements: [],
    missingAriaLabels: [],
    improperErrorAssociations: [],
    keyboardInaccessible: [],
    multipleCurrentPages: false,
  };

  // Check all interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex], [role="button"], [role="menuitem"]'
  );

  interactiveElements.forEach(element => {
    // Check if focusable
    if (isKeyboardAccessible(element)) {
      results.focusableElements.push(element);
    } else {
      results.keyboardInaccessible.push(element);
    }

    // Check ARIA labels for icon-only buttons
    if (element.tagName.toLowerCase() === 'button' && !element.textContent?.trim()) {
      if (!hasAriaLabel(element)) {
        results.missingAriaLabels.push(element);
      }
    }

    // Check form inputs
    if (element.tagName.toLowerCase() === 'input') {
      if (!hasProperErrorAssociation(element)) {
        results.improperErrorAssociations.push(element);
      }
    }
  });

  // Check navigation current page indicators
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!hasProperCurrentPageIndicator(nav)) {
      results.multipleCurrentPages = true;
    }
  });

  return results;
};

/**
 * Log accessibility check results to console
 * @param {Object} results 
 */
export const logAccessibilityResults = (results) => {
  console.group('🔍 Accessibility Check Results');
  
  console.log(`✅ Focusable elements found: ${results.focusableElements.length}`);
  
  if (results.missingAriaLabels.length > 0) {
    console.warn(`⚠️ Elements missing ARIA labels: ${results.missingAriaLabels.length}`);
    results.missingAriaLabels.forEach(el => console.warn('Missing ARIA label:', el));
  } else {
    console.log('✅ All icon-only buttons have ARIA labels');
  }
  
  if (results.improperErrorAssociations.length > 0) {
    console.warn(`⚠️ Inputs with improper error associations: ${results.improperErrorAssociations.length}`);
    results.improperErrorAssociations.forEach(el => console.warn('Improper error association:', el));
  } else {
    console.log('✅ All form inputs have proper error associations');
  }
  
  if (results.keyboardInaccessible.length > 0) {
    console.warn(`⚠️ Keyboard inaccessible elements: ${results.keyboardInaccessible.length}`);
    results.keyboardInaccessible.forEach(el => console.warn('Not keyboard accessible:', el));
  } else {
    console.log('✅ All interactive elements are keyboard accessible');
  }
  
  if (results.multipleCurrentPages) {
    console.warn('⚠️ Multiple current page indicators found in navigation');
  } else {
    console.log('✅ Navigation has proper current page indicators');
  }
  
  console.groupEnd();
};