export interface PaymentTermsForm {
  id: string;
  contractCurrency: string[];
  PaymentMode: 'payment method one' | 'payment method two';
  advancePaymentAllowed: boolean;
  advancePaymentLimit: number;
  paymentReleasePeriod: number;
  latePaymentPenality: number;
}
