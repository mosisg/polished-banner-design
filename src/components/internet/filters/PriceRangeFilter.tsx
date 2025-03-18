
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

const PriceRangeFilter = ({ priceRange, setPriceRange }: PriceRangeFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v12M15 9h-6M15 15h-6"/>
          </svg>
          <h3 className="font-medium">Budget maximum</h3>
        </div>
        <Badge variant="outline" className="font-semibold">
          {priceRange[0]}€/mois
        </Badge>
      </div>
      <Slider
        defaultValue={[30]}
        max={60}
        step={1}
        value={priceRange}
        onValueChange={setPriceRange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0€</span>
        <span>20€</span>
        <span>40€</span>
        <span>60€</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
