
import React from 'react';
import { Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface SpeedRangeFilterProps {
  speedRange: number[];
  setSpeedRange: (value: number[]) => void;
}

const SpeedRangeFilter = ({ speedRange, setSpeedRange }: SpeedRangeFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Download className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Débit maximal</h3>
        </div>
        <Badge variant="outline" className="font-semibold">
          {speedRange[0] < 1000 ? `${speedRange[0]} Mb/s` : `${speedRange[0]/1000} Gb/s`}
        </Badge>
      </div>
      <Slider
        defaultValue={[1000]}
        max={8000}
        step={100}
        value={speedRange}
        onValueChange={setSpeedRange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>100 Mb/s</span>
        <span>1 Gb/s</span>
        <span>4 Gb/s</span>
        <span>8 Gb/s</span>
      </div>
    </div>
  );
};

export default SpeedRangeFilter;
