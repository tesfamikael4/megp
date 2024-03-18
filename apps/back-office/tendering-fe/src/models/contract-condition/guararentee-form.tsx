export interface GuaranteesForm {
  guaranteeType:
    | 'Advance Payment Guarantee'
    | 'Performance Guarantee'
    | 'Retention Guarantee';
  guaranteeRequired: boolean;
  guaranteePercentage: number;
  currency: string;
  guaranteeForm:
    | 'Bank Guarantee'
    | 'Insurance Guarantee'
    | 'Letter of Credit'
    | 'Certified Cheque'
    | 'Cash';
  validityPeriod: number;
}
