
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { lazyLoad } from '@/utils/lazyLoad';

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

// Lazy loaded components with named chunks
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
  return (
    <>
      <Suspense fallback={<SectionFallback />}>
        <MobileSection />
      </Suspense>
      
      <Suspense fallback={<SectionFallback />}>
        <InternetSection />
      </Suspense>
      
      {/* Comparison section with ID for feedback trigger */}
      <div id="comparison-section" ref={onComparisonSectionMount}>
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
    </>
  );
};

export default LazySectionsLoader;
