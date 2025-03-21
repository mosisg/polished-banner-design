
import React from 'react';
import { Euro } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

const PriceRangeFilter = ({ priceRange, setPriceRange }: PriceRangeFilterProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Euro className="h-4 w-4 text-primary" />
          <h3 className="text-sm md:text-base font-medium">Budget maximum</h3>
        </div>
        <Badge variant="outline" className="text-xs md:text-sm font-semibold">
          {priceRange[0]}€/mois
        </Badge>
      </div>
      <Slider
        defaultValue={[20]}
        max={50}
        step={1}
        value={priceRange}
        onValueChange={setPriceRange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0€</span>
        <span>10€</span>
        <span>25€</span>
        <span>50€</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
