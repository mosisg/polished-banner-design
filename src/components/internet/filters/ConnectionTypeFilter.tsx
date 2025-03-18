
import React from 'react';
import { Router } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConnectionType } from '@/types/internet';

interface ConnectionTypeFilterProps {
  connectionType: ConnectionType;
  setConnectionType: (value: ConnectionType) => void;
}

const ConnectionTypeFilter = ({ connectionType, setConnectionType }: ConnectionTypeFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Router className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Type de connexion</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={connectionType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setConnectionType('all')}
        >
          Tous
        </Button>
        <Button
          variant={connectionType === 'fibre' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setConnectionType('fibre')}
        >
          Fibre
        </Button>
        <Button
          variant={connectionType === 'adsl' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setConnectionType('adsl')}
        >
          ADSL
        </Button>
        <Button
          variant={connectionType === 'box4g' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setConnectionType('box4g')}
        >
          Box 4G/5G
        </Button>
      </div>
    </div>
  );
};

export default ConnectionTypeFilter;
