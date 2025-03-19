
import { useEffect } from 'react';

const useExitIntent = () => {
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // If the mouse leaves from the top of the document
      if (e.clientY <= 0) {
        // We need to check if the user already saw the popup or if it's been more than a week
        const exitPopupShown = localStorage.getItem('popup-exit');
        const exitPopupDate = localStorage.getItem('popup-exit-date');
        
        const now = new Date().getTime();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        
        // If never shown or shown more than a week ago
        if (!exitPopupShown || (exitPopupDate && now - parseInt(exitPopupDate) > weekInMs)) {
          // Dispatch a custom event to show the exit popup
          window.dispatchEvent(new CustomEvent('showExitPopup'));
          
          // Update the timestamp
          localStorage.setItem('popup-exit-date', now.toString());
        }
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
};

export default useExitIntent;
