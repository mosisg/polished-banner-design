
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return status ? (
    <Badge className="bg-green-500">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      Prêt
    </Badge>
  ) : (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" />
      Non configuré
    </Badge>
  );
};

export default StatusBadge;
