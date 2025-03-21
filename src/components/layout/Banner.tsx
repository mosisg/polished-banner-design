
import React from 'react';
import BannerContent from './banner/BannerContent';
import BannerIllustration from './banner/BannerIllustration';
import PlanCarousel from './banner/PlanCarousel';
import { plans } from './banner/BannerData';
import { useIsMobile } from '@/hooks/use-mobile';
import GeolocatedOffer from './banner/GeolocatedOffer';

const Banner = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full pt-20 md:pt-24 lg:pt-32 pb-6 md:pb-8 lg:pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <BannerContent />
          <div className="hidden md:block">
            <BannerIllustration />
          </div>
        </div>

        {/* Geolocated Offer */}
        <div className="mt-4 flex justify-center md:justify-end">
          <GeolocatedOffer />
        </div>

        {/* Plan Carousel */}
        <div className="mt-6 md:mt-8 lg:mt-10">
          <PlanCarousel plans={plans} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
