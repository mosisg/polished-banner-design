
import React from 'react';
import { Wifi } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface WifiTypeFilterProps {
  wifiTypes: string[];
  selectedWifiTypes: string[];
  handleWifiTypeChange: (type: string) => void;
}

const WifiTypeFilter = ({ wifiTypes, selectedWifiTypes, handleWifiTypeChange }: WifiTypeFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Wifi className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Technologie WiFi</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {wifiTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`wifi-${type}`}
              checked={selectedWifiTypes.includes(type)}
              onCheckedChange={() => handleWifiTypeChange(type)}
            />
            <label
              htmlFor={`wifi-${type}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WifiTypeFilter;
