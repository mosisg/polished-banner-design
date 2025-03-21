
import React from 'react';
import Banner from '@/components/layout/Banner';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 to-purple-600/5">
      {/* Background Elements - optimized for rendering */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
      <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
      <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 will-change-transform"></div>
      
      <Banner />
    </section>
  );
};

export default HeroSection;
