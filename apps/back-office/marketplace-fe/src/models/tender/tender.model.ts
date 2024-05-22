export interface Tender {
  id: string;
  name: string;
  description: string;
  procurementReferenceNo: string;
  budgetAmount: number;
  budgetAmountCurrency: string;
  budgetCode: string;
  prId: string;
  organizationId: string;
  marketEstimate: number;
  marketEstimateCurrency: string;
  status: Status;
  metadata: { [key: string]: any };
}

export type Status = 'draft' | 'submitted' | 'approved';
