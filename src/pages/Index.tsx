import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/layout/Footer';
import NotificationBar from '@/components/layout/NotificationBar';
import TrustBadges from '@/components/layout/TrustBadges';
import MarketingPopup from '@/components/marketing/MarketingPopup';
import CustomerSupportChat from '@/components/support/CustomerSupportChat';
import { MessageCircle, Star } from 'lucide-react';

// Import des sections
import MobileSection from '@/components/home/MobileSection';
import InternetSection from '@/components/home/InternetSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import BlogSection from '@/components/home/BlogSection';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  // Structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://compareprix.fr/",
    "name": "ComparePrix - Comparateur de forfaits mobiles en France",
    "description": "Trouvez et comparez les meilleurs forfaits mobiles en France. Économisez sur votre forfait avec notre comparateur de prix indépendant.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://compareprix.fr/mobile?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  // Exit intent detection for exit popup
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

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>ComparePrix - Comparez les meilleurs forfaits mobiles en France</title>
        <meta name="description" content="Trouvez et comparez les meilleurs forfaits mobiles en France. Économisez sur votre forfait avec notre comparateur de prix indépendant." />
        <link rel="canonical" href="https://compareprix.fr/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
          
          {/* Customer support button - fixed to bottom right */}
          <div className="fixed bottom-5 right-5 z-40">
            <button 
              onClick={() => setChatOpen(prev => !prev)}
              className="bg-primary text-white shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-medium transition-all hover:bg-primary/90"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Assistance client</span>
            </button>
          </div>
          
          {/* Chat component */}
          <CustomerSupportChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          
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

// Component to handle exit intent popup
const ExitPopup = () => {
  const [showPopup, setShowPopup] = React.useState(false);
  
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

// Component to show feedback popup after scrolling to a certain point
const FeedbackTrigger = () => {
  const [showFeedback, setShowFeedback] = React.useState(false);
  
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

export default Index;
