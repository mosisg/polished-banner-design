
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { lazyLoad } from '@/utils/lazyLoad';
import { processInChunks } from '@/utils/performance';

// Improved component loading fallback with loading state
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

// Lazy loaded components with named chunks and memoization
const MobileSection = lazyLoad(() => import('@/components/home/MobileSection'), 'home-mobile');
const InternetSection = lazyLoad(() => import('@/components/home/InternetSection'), 'home-internet');
const ComparisonSection = lazyLoad(() => import('@/components/home/ComparisonSection'), 'home-comparison');
const BlogSection = lazyLoad(() => import('@/components/home/BlogSection'), 'home-blog');
const PartnersSection = lazyLoad(() => import('@/components/home/PartnersSection'), 'home-partners');
const TestimonialsSection = lazyLoad(() => import('@/components/home/TestimonialsSection'), 'home-testimonials');

interface LazySectionsLoaderProps {
  onComparisonSectionMount: (el: HTMLDivElement | null) => void;
}

const LazySectionsLoader = ({ onComparisonSectionMount }: LazySectionsLoaderProps) => {
  // Track which sections should be visible based on scroll position
  const [visibleSections, setVisibleSections] = useState({
    mobile: true,       // Load immediately
    internet: false,
    comparison: false,
    blog: false,
    partners: false,
    testimonials: false
  });
  
  useEffect(() => {
    // Setup intersection observer to load sections as they approach viewport
    const options = {
      rootMargin: '200px 0px', // 200px buffer for loading before visible
      threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          setVisibleSections(prev => ({
            ...prev,
            [sectionId.replace('-section', '')]: true
          }));
          
          // Stop observing after loading
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe placeholder elements for each section
    document.querySelectorAll('.section-placeholder').forEach(el => {
      observer.observe(el);
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  // After initial render, progressively load sections with a delay
  useEffect(() => {
    const progressiveLoad = async () => {
      // Wait for first paint to complete
      await new Promise(resolve => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => resolve(true), { timeout: 2000 });
        } else {
          setTimeout(() => resolve(true), 2000);
        }
      });
      
      // Start loading sections in sequence with delays
      const sections = ['internet', 'comparison', 'blog', 'partners', 'testimonials'];
      
      await processInChunks(sections, (section) => {
        setTimeout(() => {
          setVisibleSections(prev => ({
            ...prev,
            [section]: true
          }));
        }, sections.indexOf(section) * 300); // Stagger loading
        return section;
      }, 2);
    };
    
    progressiveLoad();
  }, []);
  
  return (
    <>
      {/* Mobile section - load immediately */}
      <div className="section-placeholder" id="mobile-section">
        <Suspense fallback={<SectionFallback />}>
          <section aria-labelledby="mobile-section-title">
            <MobileSection />
          </section>
        </Suspense>
      </div>
      
      {/* Internet section */}
      <div className="section-placeholder" id="internet-section">
        {visibleSections.internet && (
          <Suspense fallback={<SectionFallback />}>
            <section aria-labelledby="internet-section-title">
              <InternetSection />
            </section>
          </Suspense>
        )}
      </div>
      
      {/* Comparison section with ID for feedback trigger */}
      <div id="comparison-section" ref={onComparisonSectionMount} className="section-placeholder">
        {visibleSections.comparison && (
          <Suspense fallback={<SectionFallback />}>
            <section aria-labelledby="comparison-section-title">
              <ComparisonSection />
            </section>
          </Suspense>
        )}
      </div>
      
      {/* Blog section */}
      <div className="section-placeholder" id="blog-section">
        {visibleSections.blog && (
          <Suspense fallback={<SectionFallback />}>
            <section aria-labelledby="blog-section-title">
              <BlogSection />
            </section>
          </Suspense>
        )}
      </div>
      
      {/* Partners section */}
      <div className="section-placeholder" id="partners-section">
        {visibleSections.partners && (
          <Suspense fallback={<SectionFallback />}>
            <section aria-labelledby="partners-section-title">
              <PartnersSection />
            </section>
          </Suspense>
        )}
      </div>
      
      {/* Testimonials section */}
      <div className="section-placeholder" id="testimonials-section">
        {visibleSections.testimonials && (
          <Suspense fallback={<SectionFallback />}>
            <section aria-labelledby="testimonials-section-title">
              <TestimonialsSection />
            </section>
          </Suspense>
        )}
      </div>
    </>
  );
};

export default React.memo(LazySectionsLoader);
