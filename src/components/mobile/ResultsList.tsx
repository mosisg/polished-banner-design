
import React from 'react';
import { Info } from 'lucide-react';
import PlanCard from '@/components/ui/PlanCard';
import { MobilePlan } from '@/types/mobile';

// Composant pour afficher le logo de l'opérateur
const OperatorLogo = ({ operator }: { operator: string }) => {
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
      case 'youprice':
        return '/logo-youprice.svg';
      case 'free':
      case 'free mobile':
        return '/logo-free.svg';
      default:
        return null;
    }
  };

  const logoPath = getLogoPath(operator);
  
  if (!logoPath) {
    // Si pas de logo, on affiche juste l'initiale dans un carré
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
};

interface ResultsListProps {
  filteredPlans: MobilePlan[];
}

const ResultsList = ({ filteredPlans }: ResultsListProps) => {
  return (
    <div className="space-y-6">
      {filteredPlans.length > 0 ? (
        filteredPlans.map((plan) => (
          <PlanCard key={plan.id} plan={{...plan, operatorLogo: <OperatorLogo operator={plan.operator} />}} />
        ))
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

export default ResultsList;
