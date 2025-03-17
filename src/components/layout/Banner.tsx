
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlanCard from '@/components/ui/PlanCard';
import { cn } from '@/lib/utils';

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
    <div className="w-full pt-24 pb-12 lg:pt-32 lg:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Title */}
        <div className="text-center mb-8 animate-slide-down">
          <span className="inline-block text-sm font-medium py-1 px-3 rounded-full bg-muted mb-3">
            Comparateur de forfaits
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="block md:inline">Trouvez votre </span>
            <span className="text-gradient-blue-purple">nouveau</span>
            <br className="md:hidden" />
            <span className="text-gradient-purple-pink"> forfait mobile</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-slow">
            Nous comparons au quotidien 
            <span className="font-medium text-foreground"> plus de 100 forfaits </span>
            mobile et Box Internet pour vous aider à trouver celui qu'il vous faut.
          </p>
        </div>

        {/* Plan Carousel */}
        <div className="relative mt-12 px-4 sm:px-0">
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
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button 
            className="bg-gradient-blue-purple hover:bg-gradient-purple-pink text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 h-auto"
          >
            Comparer les forfaits
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
