export interface GuaranteesForm {
  id: string;
  guaranteeType:
    | 'Advance Payment Guarantee'
    | 'Performance Guarantee'
    | 'Retention Guarantee';
  guaranteeRequired: boolean;
  guaranteePercentage: number;
  currency: string;
  guaranteeForm: string[];
  validityPeriod: number;
}
