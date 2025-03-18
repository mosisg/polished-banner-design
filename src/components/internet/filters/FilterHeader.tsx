
import React from 'react';
import { Router, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilterHeaderProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const FilterHeader = ({ filtersOpen, setFiltersOpen }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center space-x-2">
        <Router className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>
      <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={() => setFiltersOpen(!filtersOpen)}>
        {filtersOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default FilterHeader;
