// src/hooks/useFocusTrap.js
import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the element that had focus before modal opened
    previousFocusRef.current = document.activeElement;

    // Get all focusable elements inside the modal
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    setTimeout(() => {
      firstElement?.focus();
    }, 50);

    // Handle Tab key to trap focus
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab (going backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (going forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    //return focus to previous element when modal closes
    return () => {
      document.removeEventListener('keydown', handleTab);
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}