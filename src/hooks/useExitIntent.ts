
import { useState, useEffect } from 'react';

/**
 * Hook to detect exit intent (mouse leaving the window from the top)
 */
export const useExitIntent = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // If the mouse leaves from the top of the document
      if (e.clientY <= 0) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          // Check if the user already saw the popup or if it's been more than a week
          const exitPopupShown = localStorage.getItem('popup-exit');
          const exitPopupDate = localStorage.getItem('popup-exit-date');
          
          const now = new Date().getTime();
          const weekInMs = 7 * 24 * 60 * 60 * 1000;
          
          // If never shown or shown more than a week ago
          if (!exitPopupShown || (exitPopupDate && now - parseInt(exitPopupDate) > weekInMs)) {
            setShowExitPopup(true);
            localStorage.setItem('popup-exit-date', now.toString());
          }
        }, 100);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return { showExitPopup };
};
