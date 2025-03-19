import React, { useState, useEffect, memo } from 'react';
import { Info, ThumbsUp, Zap } from 'lucide-react';
import PlanCard from '@/components/ui/PlanCard';
import { MobilePlan } from '@/types/mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const OperatorLogo = memo(({ operator }: { operator: string }) => {
  const getLogoPath = (operator: string) => {
    switch (operator.toLowerCase()) {
      case 'orange':
        return '/logo-orange.svg';
      case 'bouygues':
      case 'bouygues telecom':
        return '/logo-bouygues.svg';
      case 'coriolis':
        return '/logo-coriolis.svg';
      case 'auchan télécom':
      case 'auchan telecom':
        return '/logo-auchan-telecom.svg';
      case 'prixtel':
        return '/logo-prixtel.svg';
      case 'red':
      case 'red by sfr':
        return '/logo-red.svg';
      case 'sfr':
        return '/logo-sfr.svg';
      case 'sosh':
        return '/logo-sosh.svg';
      case 'lebara':
        return '/logo-lebara.svg';
      case 'free':
      case 'free mobile':
        return '/logo-free.svg';
      default:
        return null;
    }
  };

  const logoPath = getLogoPath(operator);
  
  if (!logoPath) {
    return (
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
        <span className="text-2xl font-bold text-primary">{operator.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center shadow-sm p-2">
      <img src={logoPath} alt={operator} className="max-h-10 max-w-12" />
    </div>
  );
});

OperatorLogo.displayName = 'OperatorLogo';

interface ResultsListProps {
  filteredPlans: MobilePlan[];
}

const ResultsList = ({ filteredPlans }: ResultsListProps) => {
  const [showPersonalizedOffer, setShowPersonalizedOffer] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const trackPlanInteraction = (planId: number, action: 'view' | 'compare' | 'select') => {
    console.log(`User ${action}ed plan ${planId}`);
    
    if (action === 'select' && Math.random() > 0.7) {
      setSelectedPlanId(planId);
      setShowPersonalizedOffer(true);
    }
  };
  
  const selectedPlan = selectedPlanId 
    ? filteredPlans.find(plan => plan.id === selectedPlanId) 
    : null;
  
  const handleClaimOffer = () => {
    setShowPersonalizedOffer(false);
    
    toast({
      title: "Offre appliquée !",
      description: "Vous bénéficiez d'une réduction spéciale sur cette offre.",
      duration: 5000,
    });
  };
  
  return (
    <div className="space-y-6">
      <Dialog open={showPersonalizedOffer} onOpenChange={setShowPersonalizedOffer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Offre personnalisée pour vous !</DialogTitle>
            <DialogDescription>
              Basée sur vos préférences de recherche
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <p className="font-medium">Offre exclusive chez {selectedPlan.operator}</p>
              </div>
              <p className="text-sm mb-3">
                Pour le forfait <span className="font-semibold">{selectedPlan.name}</span> : premier mois à 1€ au lieu de {selectedPlan.price} !
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ThumbsUp className="h-4 w-4 text-primary" />
                <span>Déjà utilisé par 127 personnes aujourd'hui</span>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setShowPersonalizedOffer(false)}>Plus tard</Button>
            <Button type="submit" onClick={handleClaimOffer}>Profiter de l'offre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredPlans.length > 0 ? (
        <>
          <div className="bg-muted/30 rounded-lg p-3 mb-4 flex items-center gap-3 text-sm">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 right-0 animate-pulse"></div>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <p className="text-muted-foreground">
              <span className="font-medium">{Math.floor(Math.random() * 20) + 30}</span> personnes consultent actuellement cette page
            </p>
          </div>

          <div className="space-y-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => trackPlanInteraction(plan.id, 'select')}
                onMouseEnter={() => trackPlanInteraction(plan.id, 'view')}
              >
                <PlanCard 
                  plan={{
                    ...plan, 
                    operatorLogo: <OperatorLogo operator={plan.operator} />
                  }} 
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-medium">Offre à durée limitée</p>
            </div>
            <p className="text-sm mb-3">
              Les opérateurs proposent actuellement des réductions de fin d'été. Ces offres expirent dans :
            </p>
            <div className="flex justify-center gap-3 mb-2">
              <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded shadow-sm">
                <span className="text-xl font-bold">2</span>
                <span className="text-xs block">jours</span>
              </div>
              <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded shadow-sm">
                <span className="text-xl font-bold">11</span>
                <span className="text-xs block">heures</span>
              </div>
              <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded shadow-sm">
                <span className="text-xl font-bold">45</span>
                <span className="text-xs block">min</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Aucun forfait trouvé</h3>
          <p className="text-muted-foreground text-center mt-1">
            Essayez d'élargir vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ResultsList);
