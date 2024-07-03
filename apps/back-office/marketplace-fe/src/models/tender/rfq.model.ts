export interface RFQ {
  id: string;
  name: string;
  description: string;
  procurementReferenceNumber: string;
  budgetAmount: number;
  budgetAmountCurrency: string;
  budgetCode: string;
  prId: string;
  organizationId: string;
  marketEstimate: number;
  marketEstimateCurrency: string;
  status: Status;
  metadata: { [key: string]: any };
  isOpen: boolean;
  procuredBy: 'auctioning' | 'purchasing';
}

export type Status = 'draft' | 'submitted' | 'approved';
