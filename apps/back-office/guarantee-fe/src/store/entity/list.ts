import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'bid-guarantees',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/',
  },
  {
    entity: 'bid-guarantee-releases',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/',
  },
  {
    entity: 'bid-guarantee-forfeits',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/',
  },
  {
    entity: 'bid-guarantee-extensions',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/',
  },
];
