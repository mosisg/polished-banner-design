
import React from 'react';
import BannerContent from './banner/BannerContent';
import BannerIllustration from './banner/BannerIllustration';
import PlanCarousel from './banner/PlanCarousel';
import { plans } from './banner/BannerData';
import { useIsMobile } from '@/hooks/use-mobile';

const Banner = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full pt-20 md:pt-24 pb-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <BannerContent />
          {!isMobile && <BannerIllustration />}
        </div>

        {/* Plan Carousel */}
        <div className="mt-8 md:mt-12">
          <PlanCarousel plans={plans} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
