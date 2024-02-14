export interface SpecialConditionOfContract {
  id?: string;
  lotId?: string;
  spdBdsId?: string;
  category: string;
  itbReference: string;
  attribute: string;
  value: any;
  mandate: string;
  inputType: string;
  order: number;
  description: string;
  readOnly: boolean;
  isRequired: boolean;
  dependency?: any[];
  prefix?: string;
}
export const Liability = ['Unlimited', 'Limited'];
export const PaymentBasis = [
  'Deliverable-Based (has Defined Deliverables',
  'Deliverable-Based (doesn`t have defined deliverables',
  'Period-Based',
  'Defined Deliverables and Periodic Based',
];
export const PaymentFrequency = [
  'Once',
  'Monthly',
  'Quarterly',
  'Semi-Annually',
  'Annually',
];
