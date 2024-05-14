import { Lot } from './lot';

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

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  REVISED = 'REVISED',
  PUBLISHED = 'PUBLISHED',
}
