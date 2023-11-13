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
    entity: 'procurement-method',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
];
