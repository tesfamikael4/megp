import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'item-masters',
    baseUrl: process.env.NEXT_PUBLIC_MARKET_PLACE_API ?? '/MARKET_PLACE/api/',
  },
  {
    entity: 'procurement-requisition-items',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-requisitions',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-mechanisms',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'rfxs',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-procurement-technical-teams',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-items',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'product-catalogs',
    baseUrl: process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/rfx/api',
  },
  {
    entity: 'sor-documents',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-bid-qualifications',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'qualification',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-documentary-evidences',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },

  {
    entity: 'rfx-technical-requirements',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-bid-contract-conditions',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-bid-procedures',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'rfx-bid-invitations',
    baseUrl: process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api',
  },
  {
    entity: 'notes',
    baseUrl:
      process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api',
  },
];
