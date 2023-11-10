import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'apps',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'pre-budget-plan-activities',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'pre-budget-plan-items',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
];
