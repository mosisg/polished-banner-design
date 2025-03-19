
import React from 'react';
import { ArrowDownAZ, ArrowUpZA, Wifi } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from '@/types/internet';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsHeaderProps {
  filteredBoxesCount: number;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading?: boolean;
}

const ResultsHeader = ({ filteredBoxesCount, sortOption, setSortOption, isLoading = false }: ResultsHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-card border border-border rounded-lg shadow-sm">
        <Skeleton className="h-6 w-40 mb-3 md:mb-0" />
        <Skeleton className="h-9 w-48" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-card border border-border rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-medium">
          {filteredBoxesCount} box{filteredBoxesCount !== 1 ? 'es' : ''} trouvée{filteredBoxesCount !== 1 ? 's' : ''}
        </h2>
      </div>

      <div className="mt-3 md:mt-0">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                Prix croissant
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center">
                <ArrowUpZA className="mr-2 h-4 w-4" />
                Prix décroissant
              </div>
            </SelectItem>
            <SelectItem value="speed-asc">
              <div className="flex items-center">
                <Wifi className="mr-2 h-4 w-4" />
                Débit croissant
              </div>
            </SelectItem>
            <SelectItem value="speed-desc">
              <div className="flex items-center">
                <Wifi className="mr-2 h-4 w-4" />
                Débit décroissant
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsHeader;
