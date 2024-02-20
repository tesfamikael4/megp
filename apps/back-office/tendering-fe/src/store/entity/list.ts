import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'spd',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'administrative-compliance',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'tender',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'preference-margins',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'documentary-evidence',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'qualification',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'technical-scoring',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
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
