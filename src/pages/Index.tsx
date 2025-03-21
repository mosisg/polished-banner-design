
import React, { useState, lazy, Suspense, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NotificationBar from '@/components/layout/NotificationBar';
import TrustBadges from '@/components/layout/TrustBadges';
import { Separator } from '@/components/ui/separator';
import { useExitIntent } from '@/hooks/useExitIntent';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import IndexPageHead from '@/components/home/IndexPageHead';
import HeroSection from '@/components/home/HeroSection';
import ChatSupportButton from '@/components/home/ChatSupportButton';
import MarketingPopups from '@/components/home/MarketingPopups';
import LazySectionsLoader from '@/components/home/LazySectionsLoader';

// Lazy loaded chat component with more aggressive code splitting
const CustomerSupportChat = lazy(() => 
  import(/* webpackChunkName: "support-chat" */ '@/components/support/CustomerSupportChat')
);

/**
 * Index page component - Homepage of the application
 * Optimized for performance with improved loading strategies
 */
const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { showExitPopup } = useExitIntent();
  const { showFeedback, comparisonSectionRef } = useFeedbackTrigger();
  
  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);
  
  // Memoize the close function
  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);
  
  return (
    <>
      <IndexPageHead />
      
      {/* Only render marketing popups when needed */}
      {(showExitPopup || showFeedback) && (
        <MarketingPopups 
          showExitPopup={showExitPopup}
          showFeedback={showFeedback}
        />
      )}
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <NotificationBar />
        
        <main className="flex-1">
          <h1 className="sr-only">ComparePrix - Comparateur de forfaits mobiles et box internet en France</h1>
          
          {/* Hero Banner Section - critical path, load immediately */}
          <HeroSection />
          
          {/* Only load chat component when necessary */}
          <ChatSupportButton onClick={toggleChat} />
          
          {chatOpen && (
            <Suspense fallback={null}>
              <CustomerSupportChat isOpen={chatOpen} onClose={closeChat} />
            </Suspense>
          )}
          
          <Separator />
          
          {/* Progressive loading of content sections */}
          <LazySectionsLoader onComparisonSectionMount={comparisonSectionRef} />
          
          <TrustBadges />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

// Prevent unnecessary re-renders
export default React.memo(Index);
