import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'taxonomy',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/api/administration',
  },
];
