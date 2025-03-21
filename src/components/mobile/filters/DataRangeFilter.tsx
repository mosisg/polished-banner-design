
import React from 'react';
import { Wifi } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface DataRangeFilterProps {
  dataRange: number[];
  setDataRange: (value: number[]) => void;
}

const DataRangeFilter = ({ dataRange, setDataRange }: DataRangeFilterProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-primary" />
          <h3 className="text-sm md:text-base font-medium">Volume de données</h3>
        </div>
        <Badge variant="outline" className="text-xs md:text-sm font-semibold">
          {dataRange[0]} Go max
        </Badge>
      </div>
      <Slider
        defaultValue={[100]}
        max={300}
        step={10}
        value={dataRange}
        onValueChange={setDataRange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 Go</span>
        <span>100 Go</span>
        <span>200 Go</span>
        <span>300 Go</span>
      </div>
    </div>
  );
};

export default DataRangeFilter;
