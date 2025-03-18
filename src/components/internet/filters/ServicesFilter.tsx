
import React from 'react';
import { Monitor } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const ServicesFilter = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Monitor className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Services inclus</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="tv-included" />
          <label
            htmlFor="tv-included"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            TV incluse
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="calls-included" />
          <label
            htmlFor="calls-included"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Appels illimités
          </label>
        </div>
      </div>
    </div>
  );
};

export default ServicesFilter;
