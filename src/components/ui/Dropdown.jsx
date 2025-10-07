import { useState, useEffect, useRef } from 'react';

const Dropdown = ({ 
  trigger, 
  items = [],
  className = '',
  align = 'left',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  
  const alignments = {
    left: 'left-0',
    right: 'right-0',
  };
  
  const alignClass = alignments[align] || alignments.left;
  
  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => 
            prev < items.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => 
            prev > 0 ? prev - 1 : items.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            items[focusedIndex].onClick?.();
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
        default:
          break;
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, items]);
  
  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex].focus();
    }
  }, [focusedIndex]);
  
  const handleItemClick = (item) => {
    item.onClick?.();
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };
  
  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  };
  
  const handleTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };
  
  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      {...props}
    >
      <div 
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`
            absolute z-50 mt-2 
            min-w-[12rem] py-1
            bg-white rounded-md shadow-lg 
            border border-gray-200
            animate-slide-down
            ${alignClass}
          `}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <button
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2 text-left text-sm
                transition-colors duration-150
                flex items-center gap-2
                focus:outline-none focus:bg-gray-100
                ${item.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${focusedIndex === index ? 'bg-gray-100' : ''}
                ${item.danger ? 'text-red-600 hover:bg-red-50 focus:bg-red-50' : ''}
              `}
              role="menuitem"
              tabIndex={-1}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      

    </div>
  );
};

export default Dropdown;
