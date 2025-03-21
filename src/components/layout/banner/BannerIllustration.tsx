
import React from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div 
          className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl"
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 5, 
            ease: "easeInOut" 
          }}
          style={{ willChange: 'transform' }}
        >
          -40%
        </motion.div>
      </div>
      <motion.div 
        className="absolute top-1/4 -left-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut" 
        }}
        style={{ willChange: 'transform' }}
      >
        <span className="text-primary font-bold">Forfait 5G</span>
        <div className="text-sm">9,99€ <span className="line-through text-muted-foreground">19,99€</span></div>
      </motion.div>
      <motion.div 
        className="absolute bottom-1/4 -right-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "easeInOut", 
          delay: 1 
        }}
        style={{ willChange: 'transform' }}
      >
        <span className="text-purple-600 font-bold">Box Fibre</span>
        <div className="text-sm">22,99€ <span className="line-through text-muted-foreground">42,99€</span></div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(BannerIllustration);
