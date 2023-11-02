import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'item-masters',
    baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    // baseUrl: 'http://196.189.118.110:31419/api/',
  },
  {
    entity: 'taxonomy',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
  {
    entity: 'tag',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
];
