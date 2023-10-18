import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'plan-initiations',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'prebudget-plans',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
  {
    entity: 'prebudget-items',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/api/planning',
  },
];
