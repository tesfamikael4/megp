import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'bid-guarantees',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/',
  },
  {
    entity: 'guarantee-forfeits',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  },
];
