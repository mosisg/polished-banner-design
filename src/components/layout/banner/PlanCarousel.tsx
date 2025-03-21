
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plan } from './types';
import PlanCard from './PlanCard';

interface PlanCarouselProps {
  plans: Plan[];
}

const PlanCarousel: React.FC<PlanCarouselProps> = ({ plans }) => {
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
              <PlanCard plan={plan} isActive={plans.indexOf(plan) === activeSlide} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <CarouselControls 
        activeSlide={activeSlide}
        totalSlides={plans.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={setActiveSlide}
      />
    </motion.div>
  );
};

interface CarouselControlsProps {
  activeSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  activeSlide,
  totalSlides,
  onPrev,
  onNext,
  onSelect
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12 border-2 shadow-sm hover:scale-105 transition-all"
        onClick={onPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === activeSlide 
                ? "w-10 bg-primary" 
                : "bg-muted hover:bg-muted-foreground/50"
            )}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12 border-2 shadow-sm hover:scale-105 transition-all"
        onClick={onNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default PlanCarousel;
