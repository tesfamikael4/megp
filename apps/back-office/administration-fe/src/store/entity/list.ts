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
    entity: 'tags',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'tag',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
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
    entity: 'item-sub-category',
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
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'currencies',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'Target-groups',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'procurement-method',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'budget-categories',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'procurement-procedures',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: ' procurement-thresholds',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'regions',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'districts',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
  {
    entity: 'activities',
    baseUrl:
      process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api/',
  },
  {
    entity: 'organization-budget-category',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },

  {
    entity: 'organizations',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  },

  {
    entity: 'procurement-institution',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  },

  {
    entity: 'procurement-disposal-unit',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  },

  {
    entity: 'iPDC',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  },

  {
    entity: 'adhoc-team',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  },
  {
    entity: 'donors',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },

  {
    entity: 'contract-catalogs',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
];
