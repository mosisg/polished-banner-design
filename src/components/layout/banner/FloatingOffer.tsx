
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingOfferProps {
  title: string;
  price: string;
  originalPrice: string;
  position: string;
  delay?: number;
}

const FloatingOffer: React.FC<FloatingOfferProps> = ({ 
  title, 
  price, 
  originalPrice, 
  position, 
  delay = 0 
}) => {
  const positionClasses = {
    'top-left': 'top-1/4 -left-4',
    'bottom-right': 'bottom-1/4 -right-4',
  };

  const className = `absolute ${positionClasses[position as keyof typeof positionClasses]} bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3`;

  return (
    <motion.div 
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut",
        delay
      }}
      style={{ willChange: 'transform' }}
    >
      <span className={title.includes('Forfait') ? 'text-primary font-bold' : 'text-purple-600 font-bold'}>
        {title}
      </span>
      <div className="text-sm">
        {price} <span className="line-through text-muted-foreground">{originalPrice}</span>
      </div>
    </motion.div>
  );
};

export default React.memo(FloatingOffer);
