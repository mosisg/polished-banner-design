
export interface Plan {
  id: number;
  name: string;
  data: string;
  price: string;
  features: string[];
  operator: string; // Changed from optional to required
  coverage: string; // Changed from optional to required
  operatorLogo?: string; // Keep this optional property for PlanCard
}
