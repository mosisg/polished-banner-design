
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, ShoppingCart, Smartphone } from 'lucide-react';
import PlanCard from '@/components/ui/PlanCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Plan {
  id: number;
  name: string;
  data: string;
  price: string;
  features: string[];
  operator?: string;
  coverage?: string;
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Forfait Essentiel",
    data: "1 Go",
    price: "1€99",
    operator: "NRJ Mobile",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement"]
  },
  {
    id: 2,
    name: "Forfait Confort",
    data: "50 Go",
    price: "7€99",
    operator: "RED by SFR",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse"]
  },
  {
    id: 3,
    name: "Forfait Premium",
    data: "100 Go",
    price: "9€99",
    operator: "Bouygues",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse", "Service client prioritaire"]
  },
  {
    id: 4,
    name: "Forfait Ultime",
    data: "150 Go",
    price: "12€99",
    operator: "Orange",
    coverage: "France et Europe",
    features: ["Appels, SMS et MMS illimités", "Internet 4G/5G", "Sans engagement", "Application TV incluse", "Service client prioritaire", "Multi-SIM incluse"]
  }
];

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === 0 ? plans.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === plans.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <div className="w-full pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
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
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-1 text-primary">✓</span>
                Comparaison gratuite
              </div>
              <div className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-1 text-primary">✓</span>
                100% indépendant
              </div>
              <div className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-1 text-primary">✓</span>
                Mis à jour quotidiennement
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center md:justify-end relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center p-4">
              <Smartphone className="w-40 h-40 text-white" />
              <motion.div 
                className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                -40%
              </motion.div>
            </div>
            <motion.div 
              className="absolute top-1/4 -left-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="text-primary font-bold">Forfait 5G</span>
              <div className="text-sm">9,99€ <span className="line-through text-muted-foreground">19,99€</span></div>
            </motion.div>
            <motion.div 
              className="absolute bottom-1/4 -right-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
            >
              <span className="text-purple-600 font-bold">Box Fibre</span>
              <div className="text-sm">22,99€ <span className="line-through text-muted-foreground">42,99€</span></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Plan Carousel */}
        <motion.div 
          className="relative mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="overflow-hidden">
            <div 
              className={cn(
                "flex transition-transform duration-500 ease-out",
                isTransitioning ? "transform" : ""
              )}
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {plans.map((plan) => (
                <div key={plan.id} className="w-full flex-shrink-0 px-4">
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-12 w-12 border-2 shadow-sm hover:scale-105 transition-all"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex space-x-2">
              {plans.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === activeSlide 
                      ? "w-10 bg-primary" 
                      : "bg-muted hover:bg-muted-foreground/50"
                  )}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-12 w-12 border-2 shadow-sm hover:scale-105 transition-all"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
