
import React, { useEffect, useState } from 'react';
import MarketingPopup from './MarketingPopup';

const FeedbackTrigger = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const comparisonSection = document.getElementById('comparison-section');
      if (comparisonSection) {
        const rect = comparisonSection.getBoundingClientRect();
        
        // When the user has scrolled past the comparison section
        if (rect.bottom < 0) {
          // Check if we haven't shown the feedback popup in this session
          const feedbackShown = sessionStorage.getItem('feedback-shown');
          
          if (!feedbackShown) {
            setShowFeedback(true);
            sessionStorage.setItem('feedback-shown', 'true');
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  if (!showFeedback) return null;
  
  return (
    <MarketingPopup 
      type="feedback" 
      autoShow={true}
    />
  );
};

export default FeedbackTrigger;
