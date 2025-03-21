
import React, { memo } from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import PromotionalBadge from './PromotionalBadge';
import FloatingOffer from './FloatingOffer';

// Optimized banner illustration component that reduces unnecessary re-renders
const BannerIllustration: React.FC = () => {
  return (
    <motion.div 
      className="flex justify-center md:justify-end relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.2, 
        duration: 0.4,
        type: "tween", // Using tween instead of spring for better performance
      }}
      style={{ 
        willChange: 'transform, opacity',
        contain: 'layout paint style', // Add content containment for better performance
      }}
      aria-hidden="true" // This is decorative, not essential for understanding page content
    >
      <div 
        className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center p-4"
        style={{ 
          willChange: 'transform',
          contain: 'paint style', 
        }}
      >
        <Smartphone className="w-40 h-40 text-white" />
        <PromotionalBadge discount="-40%" className="-top-4 -right-4" />
      </div>
      
      <FloatingOffer 
        title="Forfait 5G" 
        price="9,99€" 
        originalPrice="19,99€" 
        position="top-left" 
      />
      
      <FloatingOffer 
        title="Box Fibre" 
        price="22,99€" 
        originalPrice="42,99€" 
        position="bottom-right" 
        delay={0.3} // Reduced delay time for better performance
      />
    </motion.div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(BannerIllustration);
