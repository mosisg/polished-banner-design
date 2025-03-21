
import React from 'react';
import { Filter, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterHeaderProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const FilterHeader = ({ filtersOpen, setFiltersOpen }: FilterHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <h2 className="text-base md:text-lg font-semibold">Filtres</h2>
      </div>
      <div className="flex items-center gap-2">
        {isMobile && filtersOpen && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setFiltersOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
          {filtersOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FilterHeader;
