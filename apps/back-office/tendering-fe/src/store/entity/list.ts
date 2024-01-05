import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'procurement-requisitions',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/api/tendering',
  },
  {
    entity: 'post-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/tendering',
  },
  {
    entity: 'procurement-requisition-activities',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/api/tendering',
  },
  {
    entity: 'post-procurement-mechanism',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'procurement-requisition-items',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/api/planning',
  },
  {
    entity: 'user',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'procurement-requisition-mechanisms',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/api/tendering',
  },
  {
    entity: 'procurement-requisition-officer-assignments',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/api/tendering',
  },
];
