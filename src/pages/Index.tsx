
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/layout/Footer';
import NotificationBar from '@/components/layout/NotificationBar';
import TrustBadges from '@/components/layout/TrustBadges';
import { MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loaded components
const CustomerSupportChat = lazy(() => import('@/components/support/CustomerSupportChat'));
const MarketingPopup = lazy(() => import('@/components/marketing/MarketingPopup'));
const MobileSection = lazy(() => import('@/components/home/MobileSection'));
const InternetSection = lazy(() => import('@/components/home/InternetSection'));
const ComparisonSection = lazy(() => import('@/components/home/ComparisonSection'));
const BlogSection = lazy(() => import('@/components/home/BlogSection'));
const PartnersSection = lazy(() => import('@/components/home/PartnersSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));

// Component loading fallback
const SectionFallback = () => (
  <div className="py-8">
    <Skeleton className="h-8 w-72 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-48 rounded-md" />
      <Skeleton className="h-48 rounded-md" />
      <Skeleton className="h-48 rounded-md" />
    </div>
  </div>
);

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
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
  
  // Exit intent detection for exit popup - optimized with debounce
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

  // Scroll-based feedback trigger with Intersection Observer
  useEffect(() => {
    // Only set up if feedback hasn't been shown this session
    const feedbackShown = sessionStorage.getItem('feedback-shown');
    if (feedbackShown) return;
    
    const observer = new IntersectionObserver((entries) => {
      // When the comparison section completely exits the viewport (scrolled past)
      if (entries[0] && !entries[0].isIntersecting) {
        setShowFeedback(true);
        sessionStorage.setItem('feedback-shown', 'true');
        observer.disconnect();
      }
    }, { threshold: 0 });
    
    const comparisonSection = document.getElementById('comparison-section');
    if (comparisonSection) {
      observer.observe(comparisonSection);
    }
    
    return () => observer.disconnect();
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
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://ygzelivzpmrxsdqljskh.supabase.co" />
        <link rel="dns-prefetch" href="https://ygzelivzpmrxsdqljskh.supabase.co" />
      </Helmet>
      
      {/* Welcome Popup - loaded only when needed */}
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
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <NotificationBar />
        
        <main className="flex-1">
          {/* Hero Banner Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            {/* Background Elements - optimized for rendering */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
            <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
            <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
            
            <Banner />
          </section>
          
          {/* Customer support button - fixed to bottom right */}
          <div className="fixed bottom-5 right-5 z-40">
            <button 
              onClick={() => setChatOpen(prev => !prev)}
              className="bg-primary text-white shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-medium transition-all hover:bg-primary/90"
              aria-label="Ouvrir le chat d'assistance"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Assistance client</span>
            </button>
          </div>
          
          {/* Chat component - lazy loaded */}
          <Suspense fallback={null}>
            <CustomerSupportChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </Suspense>
          
          <Separator />
          
          {/* Main content sections - lazy loaded with suspense */}
          <Suspense fallback={<SectionFallback />}>
            <MobileSection />
          </Suspense>
          
          <Suspense fallback={<SectionFallback />}>
            <InternetSection />
          </Suspense>
          
          {/* Comparison section with ID for feedback trigger */}
          <div id="comparison-section">
            <Suspense fallback={<SectionFallback />}>
              <ComparisonSection />
            </Suspense>
          </div>
          
          <Suspense fallback={<SectionFallback />}>
            <BlogSection />
          </Suspense>
          
          <Suspense fallback={<SectionFallback />}>
            <PartnersSection />
          </Suspense>
          
          <Suspense fallback={<SectionFallback />}>
            <TestimonialsSection />
          </Suspense>
          
          <TrustBadges />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
