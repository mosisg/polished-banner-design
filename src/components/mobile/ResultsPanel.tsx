
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultsList from './ResultsList';
import ResultsHeader from './ResultsHeader';
import { mobilePlans } from '@/data/mobilePlans';
import type { MobilePlan } from '@/types/mobile';

interface ResultsPanelProps {
  filteredPlans: MobilePlan[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ filteredPlans }) => {
  return (
    <div className="flex-1 px-4 lg:px-6 py-6">
      <ResultsHeader />
      <ResultsList filteredPlans={filteredPlans} />
    </div>
  );
};

export default ResultsPanel;
