
import React, { memo } from 'react';
import { Info } from 'lucide-react';
import BoxCard, { BoxCardSkeleton } from '@/components/ui/BoxCard';
import { InternetBox } from '@/types/internet';
import OptimizedImage from '@/components/ui/OptimizedImage';

// Composant pour afficher le logo de l'opérateur
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
      <OptimizedImage src={logoPath} alt={operator} width={40} height={40} className="max-h-10 max-w-12" />
    </div>
  );
});

OperatorLogo.displayName = 'OperatorLogo';

interface ResultsListProps {
  filteredBoxes: InternetBox[];
  isLoading?: boolean;
}

const ResultsList = ({ filteredBoxes, isLoading = false }: ResultsListProps) => {
  // Show skeletons when loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <BoxCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredBoxes.length > 0 ? (
        filteredBoxes.map((box) => (
          <BoxCard key={box.id} box={{...box, operatorLogo: <OperatorLogo operator={box.operator} />}} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Aucune box trouvée</h3>
          <p className="text-muted-foreground text-center mt-1">
            Essayez d'élargir vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(ResultsList);
