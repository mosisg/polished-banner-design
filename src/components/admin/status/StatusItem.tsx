
import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusItemProps {
  label: string;
  status: boolean;
  description?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status, description }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="font-medium">{label}</span>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <StatusBadge status={status} />
    </div>
  );
};

export default StatusItem;
