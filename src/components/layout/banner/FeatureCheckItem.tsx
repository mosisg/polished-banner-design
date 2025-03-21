
import React from 'react';

interface FeatureCheckItemProps {
  text: string;
}

const FeatureCheckItem: React.FC<FeatureCheckItemProps> = ({ text }) => {
  return (
    <div className="flex items-center">
      <span className="bg-primary/20 p-1 rounded-full mr-1 text-primary">✓</span>
      {text}
    </div>
  );
};

export default React.memo(FeatureCheckItem);
