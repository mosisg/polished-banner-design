
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, Wifi, Check, Signal, MapPin } from 'lucide-react';
import type { MobilePlan } from '@/types/mobile';
import type { Plan } from '@/components/layout/banner/types';

interface PlanCardProps {
  plan: MobilePlan | Plan;
  variant?: 'default' | 'compact';
}

const PlanCard = ({ plan, variant = 'default' }: PlanCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompact = variant === 'compact';

  // Extract numeric price value for styling
  const priceValue = parseFloat(plan.price.match(/\d+\.\d+/)?.[0] || '0');
  const priceInt = Math.floor(priceValue);
  const priceDecimal = (priceValue % 1).toFixed(2).substring(2);
  
  // Check if plan has operatorLogo property (only in Plan type, not in MobilePlan)
  const hasOperatorLogo = 'operatorLogo' in plan && plan.operatorLogo;

  return (
    <div 
      className={cn(
        "max-w-full mx-auto flex overflow-hidden rounded-2xl border border-border transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in",
        isCompact ? "flex-col" : "flex-col md:flex-row"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Operator and Plan Name */}
      <div className={cn(
        "bg-gradient-to-br from-background to-muted/50 flex flex-col justify-center items-center border-b border-border",
        isCompact ? "w-full p-4" : "w-full md:w-1/5 p-4 md:p-6 md:border-b-0 md:border-r"
      )}>
        <div className="flex flex-col items-center text-center">
          {hasOperatorLogo ? (
            <div className="mb-3">
              <img src={plan.operatorLogo} alt={plan.operator} className="w-16 h-16" />
            </div>
          ) : (
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

      {/* Data amount and price */}
      <div className={cn(
        "bg-card flex justify-between items-center",
        isCompact ? "w-full p-4" : "w-full md:w-2/5 p-6 flex-col md:flex-row"
      )}>
        <div className={cn(
          isCompact ? "text-left" : "text-center md:text-left mb-4 md:mb-0"
        )}>
          <div className="flex items-center justify-center md:justify-start">
            <Wifi className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Data</span>
          </div>
          <div className={cn(
            "font-bold mt-1",
            isCompact ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            {plan.data}
          </div>
        </div>
        
        <div className={cn(
          isCompact ? "text-right" : "text-center md:text-right"
        )}>
          <div className="text-sm font-medium text-muted-foreground mb-1">Prix mensuel</div>
          <div className="flex items-center justify-center md:justify-end">
            <span className={cn(
              "font-bold",
              isCompact ? "text-2xl" : "text-3xl md:text-4xl"
            )}>{priceInt}</span>
            <span className={cn(
              "font-bold",
              isCompact ? "text-lg" : "text-xl md:text-2xl"
            )}>.{priceDecimal}€</span>
          </div>
          <div className="text-xs text-muted-foreground">/mois</div>
        </div>
      </div>

      {/* Features */}
      <div className={cn(
        "bg-muted/20 flex flex-col justify-between",
        isCompact ? "w-full p-4" : "w-full md:w-2/5 p-6"
      )}>
        <div>
          <ul className="space-y-2">
            {isCompact 
              ? plan.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))
              : plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))
            }
          </ul>
        </div>

        <div className={cn(
          isCompact ? "mt-4" : "mt-6"
        )}>
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
