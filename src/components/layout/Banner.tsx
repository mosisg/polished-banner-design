
import React from 'react';
import BannerContent from './banner/BannerContent';
import BannerIllustration from './banner/BannerIllustration';
import PlanCarousel from './banner/PlanCarousel';
import { plans } from './banner/BannerData';

const Banner = () => {
  return (
    <div className="w-full pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <BannerContent />
          <BannerIllustration />
        </div>

        {/* Plan Carousel */}
        <PlanCarousel plans={plans} />
      </div>
    </div>
  );
};

export default Banner;
