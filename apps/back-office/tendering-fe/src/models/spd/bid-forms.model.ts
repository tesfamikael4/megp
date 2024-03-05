export interface BidForm {
  id: string;
  spdId: string;
  title: string;
  code: string;
  type: 'technical' | 'financial' | 'bid-security';
  url: any;
}
