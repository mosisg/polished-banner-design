
import React from 'react';
import { Plan } from './types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  isActive?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isActive = false }) => {
  return (
    <div 
      className={cn(
        "w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col h-full transform transition-all duration-300",
        isActive ? "scale-105 shadow-xl border-2 border-primary/50" : "border border-border"
      )}
    >
      <div className="text-lg font-bold mb-2">{plan.name}</div>
      <div className="text-muted-foreground text-sm mb-3">
        Opérateur: <span className="font-medium text-foreground">{plan.operator}</span>
      </div>
      
      <div className="text-3xl font-bold my-4">
        {plan.price}<span className="text-sm font-normal">/mois</span>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-3 text-center text-primary font-bold mb-4">
        {plan.data} - {plan.coverage}
      </div>
      
      <ul className="space-y-2 mb-6 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={cn(
          "w-full mt-auto",
          isActive ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"
        )}
      >
        Voir l'offre
      </Button>
    </div>
  );
};

export default React.memo(PlanCard);
