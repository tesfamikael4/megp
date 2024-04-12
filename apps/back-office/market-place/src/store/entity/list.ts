import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'item-masters',
    baseUrl: process.env.NEXT_PUBLIC_MARKET_PLACE_API ?? '/MARKET_PLACE/api/',
  },
];
