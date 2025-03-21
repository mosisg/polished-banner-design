
import React from 'react';
import { Signal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NetworkType } from '@/types/mobile';
import { useIsMobile } from '@/hooks/use-mobile';

interface NetworkTypeFilterProps {
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
}

const NetworkTypeFilter = ({ networkType, setNetworkType }: NetworkTypeFilterProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <Signal className="h-4 w-4 text-primary" />
        <h3 className="text-sm md:text-base font-medium">Type de réseau</h3>
      </div>
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        <Button
          variant={networkType === 'all' ? 'default' : 'outline'}
          size={isMobile ? "sm" : "default"}
          onClick={() => setNetworkType('all')}
          className="text-xs md:text-sm"
        >
          Tous
        </Button>
        <Button
          variant={networkType === '4G' ? 'default' : 'outline'}
          size={isMobile ? "sm" : "default"}
          onClick={() => setNetworkType('4G')}
          className="text-xs md:text-sm"
        >
          4G
        </Button>
        <Button
          variant={networkType === '5G' ? 'default' : 'outline'}
          size={isMobile ? "sm" : "default"}
          onClick={() => setNetworkType('5G')}
          className="text-xs md:text-sm"
        >
          5G
        </Button>
      </div>
    </div>
  );
};

export default NetworkTypeFilter;
