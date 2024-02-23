import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'apps',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'budgets',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'pre-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'pre-procurement-mechanism',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'pre-budget-plan-items',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'pre-budget-plan-timelines',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'post-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'post-procurement-mechanism',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'post-budget-plan-items',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'notes',
    baseUrl:
      process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api',
  },

  {
    entity: 'procurement-requisitions',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'post-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-requisition-activities',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'post-procurement-mechanism',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-requisition-items',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'user',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'procurement-mechanisms',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'procurement-requisition-officer-assignments',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'annual-procurement-plan-activities',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'procurement-requisition-timelines',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
  {
    entity: 'procurement-requisition-disbursements',
    baseUrl:
      process.env.NEXT_PUBLIC_PLANNING_API ?? '/procurement-requisition/api',
  },
];
