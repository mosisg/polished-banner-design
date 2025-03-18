
import React from 'react';
import { Phone } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface OperatorsFilterProps {
  operators: string[];
  selectedOperators: string[];
  handleOperatorChange: (operator: string) => void;
}

const OperatorsFilter = ({ operators, selectedOperators, handleOperatorChange }: OperatorsFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Phone className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Opérateurs</h3>
      </div>
      <div className="space-y-2">
        {operators.map((operator) => (
          <div key={operator} className="flex items-center space-x-2">
            <Checkbox
              id={`operator-${operator}`}
              checked={selectedOperators.includes(operator)}
              onCheckedChange={() => handleOperatorChange(operator)}
            />
            <label
              htmlFor={`operator-${operator}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
