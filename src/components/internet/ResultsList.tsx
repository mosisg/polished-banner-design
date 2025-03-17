
import React from 'react';
import { Info } from 'lucide-react';
import BoxCard from '@/components/ui/BoxCard';
import { InternetBox } from '@/types/internet';

interface ResultsListProps {
  filteredBoxes: InternetBox[];
}

const ResultsList = ({ filteredBoxes }: ResultsListProps) => {
  return (
    <div className="space-y-6">
      {filteredBoxes.length > 0 ? (
        filteredBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
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

export default ResultsList;
