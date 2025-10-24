import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * 
 * Available shortcuts in the CRM application:
 * - "/" - Focus search input on Contacts page
 * - "c" - Open Add Contact modal on Contacts page
 * - "d" - Open Add Job modal on Jobs page
 * - "1" - Navigate to Dashboard
 * - "2" - Navigate to Contacts
 * - "3" - Navigate to Jobs
 * - "4" - Navigate to Settings
 * - "Escape" - Close modals (handled by Modal component)
 * 
 * @param {string|string[]} keys - Key or array of keys to listen for (e.g., 'c', 'Escape', ['ctrl', 'c'])
 * @param {function} callback - Function to call when shortcut is pressed
 * @param {object} options - Configuration options
 * @param {boolean} options.preventDefault - Whether to prevent default behavior (default: true)
 * @param {boolean} options.stopPropagation - Whether to stop event propagation (default: true)
 * @param {boolean} options.ignoreInputs - Whether to ignore shortcuts when focused on inputs (default: true)
 * @param {boolean} options.enabled - Whether the shortcut is enabled (default: true)
 */
export function useKeyboardShortcut(keys, callback, options = {}) {
  const {
    preventDefault = true,
    stopPropagation = true,
    ignoreInputs = true,
    enabled = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Check if we should ignore this event when focused on form inputs
      if (ignoreInputs) {
        const activeElement = document.activeElement;
        const isFormElement = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable
        );
        
        if (isFormElement) return;
      }

      // Normalize keys to array
      const targetKeys = Array.isArray(keys) ? keys : [keys];
      
      // Check if the pressed key combination matches
      const matches = targetKeys.every(key => {
        const lowerKey = key.toLowerCase();
        
        switch (lowerKey) {
          case 'ctrl':
          case 'control':
            return event.ctrlKey;
          case 'alt':
            return event.altKey;
          case 'shift':
            return event.shiftKey;
          case 'meta':
          case 'cmd':
            return event.metaKey;
          case 'escape':
          case 'esc':
            return event.key === 'Escape';
          case 'enter':
            return event.key === 'Enter';
          case 'space':
            return event.key === ' ';
          case 'tab':
            return event.key === 'Tab';
          case 'backspace':
            return event.key === 'Backspace';
          case 'delete':
            return event.key === 'Delete';
          case 'arrowup':
          case 'up':
            return event.key === 'ArrowUp';
          case 'arrowdown':
          case 'down':
            return event.key === 'ArrowDown';
          case 'arrowleft':
          case 'left':
            return event.key === 'ArrowLeft';
          case 'arrowright':
          case 'right':
            return event.key === 'ArrowRight';
          default:
            // For regular keys, compare with event.key
            return event.key.toLowerCase() === lowerKey;
        }
      });

      if (matches) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        
        callbackRef.current(event);
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, preventDefault, stopPropagation, ignoreInputs, enabled]);
}

/**
 * Hook for handling multiple keyboard shortcuts
 * @param {Array} shortcuts - Array of shortcut objects with keys, callback, and options
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      shortcuts.forEach(({ keys, callback, options = {} }) => {
        const {
          preventDefault = true,
          stopPropagation = true,
          ignoreInputs = true,
          enabled = true,
        } = options;

        if (!enabled) return;

        // Check if we should ignore this event when focused on form inputs
        if (ignoreInputs) {
          const activeElement = document.activeElement;
          const isFormElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.isContentEditable
          );
          
          if (isFormElement) return;
        }

        // Normalize keys to array
        const targetKeys = Array.isArray(keys) ? keys : [keys];
        
        // Check if the pressed key combination matches
        const matches = targetKeys.every(key => {
          const lowerKey = key.toLowerCase();
          
          switch (lowerKey) {
            case 'ctrl':
            case 'control':
              return event.ctrlKey;
            case 'alt':
              return event.altKey;
            case 'shift':
              return event.shiftKey;
            case 'meta':
            case 'cmd':
              return event.metaKey;
            case 'escape':
            case 'esc':
              return event.key === 'Escape';
            case 'enter':
              return event.key === 'Enter';
            case 'space':
              return event.key === ' ';
            case 'tab':
              return event.key === 'Tab';
            case 'backspace':
              return event.key === 'Backspace';
            case 'delete':
              return event.key === 'Delete';
            case 'arrowup':
            case 'up':
              return event.key === 'ArrowUp';
            case 'arrowdown':
            case 'down':
              return event.key === 'ArrowDown';
            case 'arrowleft':
            case 'left':
              return event.key === 'ArrowLeft';
            case 'arrowright':
            case 'right':
              return event.key === 'ArrowRight';
            default:
              // For regular keys, compare with event.key
              return event.key.toLowerCase() === lowerKey;
          }
        });

        if (matches) {
          if (preventDefault) {
            event.preventDefault();
          }
          if (stopPropagation) {
            event.stopPropagation();
          }
          
          callback(event);
        }
      });
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

export default useKeyboardShortcut;