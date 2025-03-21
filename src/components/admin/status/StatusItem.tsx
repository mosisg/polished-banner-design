
import React from 'react';
import StatusBadge from './StatusBadge';

interface StatusItemProps {
  label: string;
  status: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>
      <StatusBadge status={status} />
    </div>
  );
};

export default StatusItem;
