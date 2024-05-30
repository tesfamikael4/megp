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
  status: TenderStatusEnum;
  metadata: { [key: string]: any };
}

export enum TenderStatusEnum {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  SENT_FOR_REVIEW = 'SENT_FOR_REVIEW',
  REVIEWED = 'REVIEWED',
  APPROVAL = 'APPROVAL',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ADJUSTED = 'ADJUSTED',
  CANCELED = 'CANCELED',
  RE_ADVERTISED = 'RE-ADVERTISED',
}

export enum ItemStatusEnum {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  RE_ADVERTISED = 'RE-ADVERTISED',
}

export enum LotStatusEnum {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  RE_ADVERTISED = 'RE-ADVERTISED',
}
