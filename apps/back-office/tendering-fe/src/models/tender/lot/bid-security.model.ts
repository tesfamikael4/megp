export interface BidSecurity {
  id: string;
  lotId: string;
  bidSecurityRequired: boolean;
  bidSecurityAmount: number;
  bidSecurityCurrency: any;
  bidSecurityForm:
    | 'declaration'
    | 'spo'
    | 'insurance letter'
    | 'Letter from small and micro enterprise';
}
