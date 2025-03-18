
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from '@/types/mobile';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultsHeaderProps {
  filteredPlansCount: number;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsHeader = ({ filteredPlansCount, sortOption, setSortOption }: ResultsHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col ${isMobile ? 'gap-3' : 'md:flex-row md:items-center justify-between gap-4'} bg-card p-3 md:p-4 rounded-lg border border-border`}>
      {!isMobile && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold">
            {filteredPlansCount} forfaits trouvés
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Comparaison mise à jour le {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      )}
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <Select 
          value={sortOption} 
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full md:w-[200px] text-sm h-9">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Prix (croissant)</SelectItem>
            <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
            <SelectItem value="data-asc">Données (croissant)</SelectItem>
            <SelectItem value="data-desc">Données (décroissant)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsHeader;
