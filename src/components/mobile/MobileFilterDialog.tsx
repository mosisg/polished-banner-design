
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FilterPanel from '@/components/mobile/FilterPanel';
import { NetworkType } from '@/types/mobile';

interface MobileFilterDialogProps {
  dataRange: number[];
  setDataRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  showFiltersDialog: boolean;
  setShowFiltersDialog: (value: boolean) => void;
  filteredPlansCount: number;
  isFiltering: boolean;
}

const MobileFilterDialog = ({
  dataRange,
  setDataRange,
  priceRange,
  setPriceRange,
  networkType,
  setNetworkType,
  selectedOperators,
  operators,
  handleOperatorChange,
  showFiltersDialog,
  setShowFiltersDialog,
  filteredPlansCount,
  isFiltering
}: MobileFilterDialogProps) => {
  return (
    <div className="sticky top-16 z-10 bg-background/90 backdrop-blur-sm py-3 mb-4 flex justify-between items-center border-b border-border">
      <p className="text-sm font-medium">
        {isFiltering ? (
          <span className="animate-pulse">Filtrage en cours...</span>
        ) : (
          `${filteredPlansCount} forfaits trouvés`
        )}
      </p>
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0">
          <div className="p-0 max-h-[80vh] overflow-auto">
            <FilterPanel 
              dataRange={dataRange}
              setDataRange={setDataRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              networkType={networkType}
              setNetworkType={setNetworkType}
              selectedOperators={selectedOperators}
              operators={operators}
              handleOperatorChange={handleOperatorChange}
              filtersOpen={true}
              setFiltersOpen={() => {
                setShowFiltersDialog(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileFilterDialog;
