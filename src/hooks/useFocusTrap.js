import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = 
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    // Store the element that had focus before modal opened
    previousFocusRef.current = document.activeElement;

    // Helper to get focusable elements at the time Tab is pressed
    // This handles dynamically added/removed elements (e.g. conditional fields)
    const getFocusableElements = () => 
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));

    // Focus first element when modal opens
    const initialFocusables = getFocusableElements();
    setTimeout(() => {
      initialFocusables[0]?.focus();
    }, 50);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      // Re-query DOM on each Tab press to catch dynamic elements
      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

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
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      // Return focus to previous element when modal closes
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}