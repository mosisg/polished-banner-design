
import React, { memo } from 'react';
import { Info } from 'lucide-react';
import PlanCard, { PlanCardSkeleton } from '@/components/ui/PlanCard';
import { MobilePlan } from '@/types/mobile';

interface ResultsListProps {
  filteredPlans: MobilePlan[];
  isLoading?: boolean;
}

const ResultsList = ({ filteredPlans, isLoading = false }: ResultsListProps) => {
  // Show skeletons when loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlanCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPlans.length > 0 ? (
        filteredPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
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

export default memo(ResultsList);
