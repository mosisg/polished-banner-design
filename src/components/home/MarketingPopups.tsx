
import React, { lazy, Suspense } from 'react';

// Lazy loaded component
const MarketingPopup = lazy(() => import('@/components/marketing/MarketingPopup'));

interface MarketingPopupsProps {
  showExitPopup: boolean;
  showFeedback: boolean;
}

const MarketingPopups = ({ showExitPopup, showFeedback }: MarketingPopupsProps) => {
  return (
    <Suspense fallback={null}>
      <MarketingPopup 
        type="welcome" 
        autoShow={true} 
        delay={5000} 
        onAction={() => window.location.href = '/mobile'}
      />
      
      {/* Exit Intent Popup - conditionally rendered */}
      {showExitPopup && (
        <MarketingPopup 
          type="exit" 
          autoShow={true}
          onAction={() => window.location.href = '/mobile'}
        />
      )}
      
      {/* Feedback Popup - conditionally rendered */}
      {showFeedback && (
        <MarketingPopup 
          type="feedback" 
          autoShow={true}
        />
      )}
    </Suspense>
  );
};

export default MarketingPopups;
