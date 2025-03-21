
import React from 'react';
import BannerContent from './banner/BannerContent';
import BannerIllustration from './banner/BannerIllustration';
import PlanCarousel from './banner/PlanCarousel';
import { plans } from './banner/BannerData';
import { useIsMobile } from '@/hooks/use-mobile';

const Banner = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full pt-24 md:pt-28 lg:pt-36 pb-6 md:pb-10 lg:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <BannerContent />
          <div className="hidden md:block">
            <BannerIllustration />
          </div>
        </div>

        {/* Plan Carousel */}
        <div className="mt-6 md:mt-10 lg:mt-12">
          <PlanCarousel plans={plans} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
