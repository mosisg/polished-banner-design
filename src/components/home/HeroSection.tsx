
import React from 'react';
import Banner from '@/components/layout/Banner';
import { motion } from 'framer-motion';

const BackgroundGradient: React.FC = () => {
  return (
    <>
      <motion.div 
        className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"
        animate={{ 
          x: [0, 20, 0], 
          y: [0, -20, 0], 
          scale: [1, 1.05, 1] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-70 will-change-transform"
        animate={{ 
          x: [0, -10, 0], 
          y: [0, 15, 0], 
          scale: [1, 1.03, 1] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 18,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 will-change-transform"
        animate={{ 
          x: [0, 15, 0], 
          y: [0, 10, 0], 
          scale: [1, 1.08, 1] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut",
          delay: 4
        }}
      />
    </>
  )
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 to-purple-600/5">
      {/* Background Elements with subtle animation */}
      <BackgroundGradient />
      
      <Banner />
    </section>
  );
};

export default HeroSection;
