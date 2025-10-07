import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast container - fixed position at top-right */}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col items-end"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={hideToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
