
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to trigger feedback popup when a specific element is scrolled past
 */
export const useFeedbackTrigger = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Callback ref for the comparison section
  const comparisonSectionRef = useCallback((node: HTMLDivElement | null) => {
    // Only set up if feedback hasn't been shown this session and we have a node
    if (!node || sessionStorage.getItem('feedback-shown')) return;
    
    const observer = new IntersectionObserver((entries) => {
      // When the comparison section completely exits the viewport (scrolled past)
      if (entries[0] && !entries[0].isIntersecting) {
        setShowFeedback(true);
        sessionStorage.setItem('feedback-shown', 'true');
        observer.disconnect();
      }
    }, { threshold: 0 });
    
    observer.observe(node);
    
    // Cleanup
    return () => observer.disconnect();
  }, []);

  return { showFeedback, comparisonSectionRef };
};
