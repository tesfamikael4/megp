import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'procurement-requisitions',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'post-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-requisition-activities',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'post-procurement-mechanism',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-requisition-items',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'user',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'procurement-requisition-mechanisms',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-requisition-officer-assignments',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'annual-procurement-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-requisition-timelines',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-requisition-disbursements',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
];
