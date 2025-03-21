
import React from 'react';
import { Phone } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface OperatorsFilterProps {
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
}

const OperatorsFilter = ({ 
  selectedOperators, 
  operators, 
  handleOperatorChange 
}: OperatorsFilterProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <Phone className="h-4 w-4 text-primary" />
        <h3 className="text-sm md:text-base font-medium">Opérateurs</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-1">
        {operators.map((operator) => (
          <div key={operator} className="flex items-center space-x-2">
            <Checkbox
              id={`operator-${operator}`}
              checked={selectedOperators.includes(operator)}
              onCheckedChange={() => handleOperatorChange(operator)}
            />
            <label
              htmlFor={`operator-${operator}`}
              className="text-xs md:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {operator}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorsFilter;
