
import React from 'react';
import { motion } from 'framer-motion';

interface PromotionalBadgeProps {
  discount: string;
  className?: string;
}

const PromotionalBadge: React.FC<PromotionalBadgeProps> = ({ discount, className = '' }) => {
  return (
    <motion.div 
      className={`absolute bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl ${className}`}
      animate={{ rotate: [0, 10, 0, -10, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 5, 
        ease: "easeInOut" 
      }}
      style={{ willChange: 'transform' }}
    >
      {discount}
    </motion.div>
  );
};

export default React.memo(PromotionalBadge);
