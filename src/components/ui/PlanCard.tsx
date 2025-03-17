
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, Wifi, Check, Signal, MapPin } from 'lucide-react';

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

  // Extract numeric price value for styling
  const priceValue = parseFloat(plan.price.match(/\d+\.\d+/)?.[0] || '0');
  const priceInt = Math.floor(priceValue);
  const priceDecimal = (priceValue % 1).toFixed(2).substring(2);

  return (
    <div 
      className="max-w-full mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Operator and Plan Name */}
      <div className="w-full md:w-1/5 p-4 md:p-6 bg-gradient-to-br from-background to-muted/50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border">
        <div className="flex flex-col items-center text-center">
          {plan.operator && (
            <div className="mb-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-primary">{plan.operator.charAt(0)}</span>
              </div>
            </div>
          )}
          <h3 className="font-semibold text-lg">{plan.operator}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{plan.name}</div>
          
          {plan.coverage && (
            <div className="mt-3 flex items-center bg-muted px-2 py-1 rounded text-xs font-medium">
              <Signal className="h-3 w-3 mr-1" /> {plan.coverage}
            </div>
          )}
        </div>
      </div>

      {/* Middle - Data amount and price */}
      <div className="w-full md:w-2/5 p-6 bg-card flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center justify-center md:justify-start">
            <Wifi className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Data</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold mt-1">
            {plan.data}
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-sm font-medium text-muted-foreground mb-1">Prix mensuel</div>
          <div className="flex items-center justify-center md:justify-end">
            <span className="text-3xl md:text-4xl font-bold">{priceInt}</span>
            <span className="text-xl md:text-2xl font-bold">.{priceDecimal}€</span>
          </div>
          <div className="text-xs text-muted-foreground">/mois</div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="w-full md:w-2/5 p-6 bg-muted/20 flex flex-col justify-between">
        <div>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2 mt-0.5 flex-shrink-0">
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
                ? "bg-primary" 
                : "bg-primary/90"
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
