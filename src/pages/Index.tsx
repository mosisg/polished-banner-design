
import React from 'react';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/layout/Footer';
import NotificationBar from '@/components/layout/NotificationBar';
import TrustBadges from '@/components/layout/TrustBadges';
import MarketingPopup from '@/components/marketing/MarketingPopup';
import ExitPopup from '@/components/marketing/ExitPopup';
import FeedbackTrigger from '@/components/marketing/FeedbackTrigger';
import SupportButtons from '@/components/support/SupportButtons';
import HomeStructuredData from '@/components/seo/HomeStructuredData';
import useExitIntent from '@/hooks/useExitIntent';

// Import des sections
import MobileSection from '@/components/home/MobileSection';
import InternetSection from '@/components/home/InternetSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import BlogSection from '@/components/home/BlogSection';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  // Use the exit intent hook
  useExitIntent();
  
  return (
    <>
      <HomeStructuredData />
      
      {/* Welcome Popup - for new visitors */}
      <MarketingPopup 
        type="welcome" 
        autoShow={true} 
        delay={5000} 
        onAction={() => window.location.href = '/mobile'}
      />
      
      {/* Exit Intent Popup - attached to the exit intent event */}
      <ExitPopup />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <NotificationBar />
        
        <main className="flex-1">
          {/* Nouvelle section Hero Banner inspirée de la page Téléphones */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            {/* Background Elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle"></div>
            <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
            
            <Banner />
          </section>
          
          {/* Support buttons and chat */}
          <SupportButtons />
          
          <Separator />
          
          {/* Autres sections */}
          <MobileSection />
          <InternetSection />
          
          {/* Feedback popup trigger after scrolling to comparison section */}
          <div id="comparison-section">
            <ComparisonSection />
          </div>
          
          <FeedbackTrigger />
          
          <BlogSection />
          <PartnersSection />
          <TestimonialsSection />
          <TrustBadges />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
