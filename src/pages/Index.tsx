
import React, { useState, lazy, Suspense } from 'react';
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

// Lazy loaded chat component
const CustomerSupportChat = lazy(() => import('@/components/support/CustomerSupportChat'));

/**
 * Index page component - Homepage of the application
 */
const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { showExitPopup } = useExitIntent();
  const { showFeedback, comparisonSectionRef } = useFeedbackTrigger();
  
  return (
    <>
      <IndexPageHead />
      
      {/* Marketing Popups - lazy loaded */}
      <MarketingPopups 
        showExitPopup={showExitPopup}
        showFeedback={showFeedback}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <NotificationBar />
        
        <main className="flex-1">
          <h1 className="sr-only">ComparePrix - Comparateur de forfaits mobiles et box internet en France</h1>
          
          {/* Hero Banner Section */}
          <HeroSection />
          
          {/* Customer support button */}
          <ChatSupportButton onClick={() => setChatOpen(prev => !prev)} />
          
          {/* Chat component - lazy loaded */}
          <Suspense fallback={null}>
            <CustomerSupportChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </Suspense>
          
          <Separator />
          
          {/* Content sections - lazy loaded with suspense */}
          <LazySectionsLoader onComparisonSectionMount={comparisonSectionRef} />
          
          <TrustBadges />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
