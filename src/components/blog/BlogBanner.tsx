
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Bookmark, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogBanner = () => {
  return (
    <div className="relative w-full mb-8 overflow-hidden rounded-2xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 opacity-90"></div>
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBhNiA2IDAgMSAxLTEyIDAgNiA2IDAgMCAxIDEyIDB6TTI0IDQ4YTYgNiAwIDEgMS0xMiAwIDYgNiAwIDAgMSAxMiAwek00OCA0OGE2IDYgMCAxIDEtMTIgMCA2IDYgMCAwIDEgMTIgMHpNMTIgMTJhNiA2IDAgMSAxLTEyIDAgNiA2IDAgMCAxIDEyIDB6TTM2IDEyYTYgNiAwIDEgMS0xMiAwIDYgNiAwIDAgMSAxMiAwek00OCAxMmE2IDYgMCAxIDEtMTIgMCA2IDYgMCAwIDEgMTIgMHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text content */}
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Actualités & Conseils
              </motion.span>
              
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Comprendre et optimiser vos <span className="text-yellow-300">forfaits</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-white/90 mb-6 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Retrouvez nos dernières analyses, guides pratiques et astuces pour faire les meilleurs choix et économiser sur vos forfaits mobiles et box internet.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90">
                  <Book className="mr-2 h-5 w-5" />
                  Tous les articles
                </Button>
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Bookmark className="mr-2 h-5 w-5" />
                  Articles populaires
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Visual element */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-8 w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-xl"></div>
                <div className="absolute -bottom-8 -left-12 w-32 h-32 bg-blue-400 rounded-full opacity-40 blur-xl"></div>
                
                {/* Content cards */}
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-4 border border-white/20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 mr-2 text-yellow-300" />
                    <span className="font-semibold text-white">Articles tendance</span>
                  </div>
                  <p className="text-white/80">Comment choisir le meilleur forfait 5G en 2024</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ml-8"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center mb-2">
                    <Book className="w-5 h-5 mr-2 text-yellow-300" />
                    <span className="font-semibold text-white">Guide pratique</span>
                  </div>
                  <p className="text-white/80">Les critères essentiels pour une box internet performante</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;
