
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, Wifi, Check } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  data: string;
  price: string;
  features: string[];
  operator?: string;
  coverage?: string;
}

interface PlanCardProps {
  plan: Plan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="max-w-2xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Price and details */}
      <div className="w-full md:w-7/12 p-6 md:p-8 bg-gradient-to-br from-background to-muted flex flex-col">
        <div className="mb-4">
          <div className="bg-primary/10 text-primary text-sm font-medium py-1 px-3 inline-block rounded-full mb-2">
            {plan.name}
          </div>
          {plan.operator && (
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <img 
                src={`https://placehold.co/20x20/4a82ff/FFFFFF?text=${plan.operator.charAt(0)}`} 
                alt={plan.operator} 
                className="w-5 h-5 mr-2 rounded-sm"
              />
              {plan.operator}
            </div>
          )}
        </div>

        <div className="flex items-baseline mb-4">
          <div className="text-5xl md:text-6xl font-bold text-foreground mr-2">
            {plan.data}
          </div>
          {plan.coverage && (
            <span className="text-sm text-muted-foreground">
              {plan.coverage}
            </span>
          )}
        </div>

        <div className="flex items-center mt-auto">
          <div className="text-4xl font-bold mr-2">
            <span className="text-accent text-gradient-purple-pink">{plan.price.split('€')[0]}</span>
            <span className="text-lg">€{plan.price.split('€')[1]}</span>
          </div>
          <div className="text-sm text-muted-foreground">/mois</div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="w-full md:w-5/12 bg-card p-6 md:p-8 flex flex-col justify-between">
        <div>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2 mt-0.5">
                  <Check size={16} />
                </span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Button 
            className={cn(
              "w-full rounded-full transition-all duration-300",
              isHovered 
                ? "bg-gradient-purple-pink" 
                : "bg-gradient-blue-purple"
            )}
          >
            Voir l'offre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
