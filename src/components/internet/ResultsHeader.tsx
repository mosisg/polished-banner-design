
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from '@/types/internet';

interface ResultsHeaderProps {
  filteredBoxesCount: number;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsHeader = ({ filteredBoxesCount, sortOption, setSortOption }: ResultsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 rounded-lg border border-border">
      <div>
        <h2 className="text-xl font-semibold">
          {filteredBoxesCount} box internet trouvées
        </h2>
        <p className="text-sm text-muted-foreground">
          Comparaison mise à jour le {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <Select 
          value={sortOption} 
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Prix (croissant)</SelectItem>
            <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
            <SelectItem value="speed-asc">Débit (croissant)</SelectItem>
            <SelectItem value="speed-desc">Débit (décroissant)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsHeader;
