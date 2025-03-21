
import React from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import PromotionalBadge from './PromotionalBadge';
import FloatingOffer from './FloatingOffer';
import OptimizedImage from '@/components/ui/OptimizedImage';

const BannerIllustration: React.FC = () => {
  return (
    <motion.div 
      className="flex justify-center md:justify-end relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center p-4">
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
        delay={1} 
      />
    </motion.div>
  );
};

export default React.memo(BannerIllustration);
