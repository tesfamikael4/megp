import { EntityStoreConfig } from '@megp/entity';
import { config } from '@/config/env';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'item-masters',
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl: config.ENV_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'classifications',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'tag',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'measurements',
    baseUrl: process.env.NEXT_PUBLIC_ADMINISTRATION_API + '/api',
  },
  {
    entity: 'item-Categories',
    baseUrl: process.env.NEXT_PUBLIC_ADMINISTRATION_API + '/api',
  },
  {
    entity: 'item-Categories/get-trees',
    baseUrl: process.env.NEXT_PUBLIC_ADMINISTRATION_API + '/api',
  },
  {
    entity: 'extra-unit-of-measurements',
    baseUrl: process.env.NEXT_PUBLIC_ADMINISTRATION_API + '/api',
  },
  {
    entity: 'procurement-method',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'budget-category',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'procurement-procedures',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
];
