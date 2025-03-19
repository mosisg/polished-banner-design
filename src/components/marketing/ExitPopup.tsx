
import React, { useEffect, useState } from 'react';
import MarketingPopup from './MarketingPopup';

const ExitPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    const handleExitIntent = () => {
      setShowPopup(true);
    };
    
    window.addEventListener('showExitPopup', handleExitIntent);
    
    return () => {
      window.removeEventListener('showExitPopup', handleExitIntent);
    };
  }, []);
  
  if (!showPopup) return null;
  
  return (
    <MarketingPopup 
      type="exit" 
      autoShow={true}
      onAction={() => window.location.href = '/mobile'}
    />
  );
};

export default ExitPopup;
