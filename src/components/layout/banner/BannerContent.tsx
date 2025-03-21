
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import GeolocatedOffer from './GeolocatedOffer';
import FeatureCheckItem from './FeatureCheckItem';

const BannerContent: React.FC = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.span 
        className="inline-block bg-primary/20 backdrop-blur-sm text-primary px-4 py-1 rounded-full text-sm font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Meilleurs prix garantis
      </motion.span>
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Économisez sur vos <span className="text-gradient-blue-purple">forfaits</span> <span className="text-gradient-purple-pink">mobiles</span>
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl text-muted-foreground max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Comparez plus de 100 forfaits des plus grands opérateurs et économisez jusqu'à 40%
      </motion.p>
      
      {/* Offre géolocalisée */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-4"
      >
        <GeolocatedOffer />
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
          <Search className="mr-2 h-5 w-5" />
          Comparer maintenant
        </Button>
        <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Meilleures offres
        </Button>
      </motion.div>
      <motion.div 
        className="flex items-center space-x-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <FeatureCheckItem text="Comparaison gratuite" />
        <FeatureCheckItem text="100% indépendant" />
        <FeatureCheckItem text="Mis à jour quotidiennement" />
      </motion.div>
    </motion.div>
  );
};

export default BannerContent;
