import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'item-masters',
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'classifications',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'tag',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'measurements',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'item-categories',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'item-Categories/get-trees',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'extra-unit-of-measurements',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'currencies',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
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
  {
    entity: ' procurement-thresholds',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'regions',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'districts',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
];
