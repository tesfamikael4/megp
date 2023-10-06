import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'price',
    baseUrl: process.env.NEXT_PUBLIC_VENDOR_API ?? '/api/vendors',
  },
];
