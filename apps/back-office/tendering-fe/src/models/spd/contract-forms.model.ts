export interface ContractForm {
  id: string;
  spdId: string;
  title: string;
  code: string;
  type: 'contract' | 'performance-guaranty' | 'advance-guaranty';
  url: any;
}
