import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className = '',
  ...props 
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  // Focus trap and management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
        
        // Focus trap
        const handleTabKey = (e) => {
          if (e.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };
        
        document.addEventListener('keydown', handleTabKey);
        
        return () => {
          document.removeEventListener('keydown', handleTabKey);
        };
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      {...props}
    >
      {/* Modern Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Enhanced Modal */}
      <div 
        ref={modalRef}
        className={`
          relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20
          w-full max-h-[85vh] overflow-hidden
          animate-scale-in transform-gpu
          ${className || 'max-w-2xl'}
        `}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Enhanced Header */}
        {title && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <h2 id="modal-title" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-2 hover:bg-gray-100/50"
              aria-label="Close modal"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
        )}
        
        {/* Enhanced Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-140px)] bg-white/50">
          {children}
        </div>
        
        {/* Enhanced Footer */}
        {footer && (
          <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
