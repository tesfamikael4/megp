import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'spd',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'administrative-compliance',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'eqc-preliminary-examinations',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'eqc-qualifications',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'eqc-technical-scorings',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'eqc-preference-margins',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'tenders',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'lots',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'lots/split-items',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'items',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-technical-requirements',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'spd-contract-forms',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'preference-margins',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'spd-professional-settings',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'documentary-evidence',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-bill-of-materials',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-labors',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-materials',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-equipments',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-fees',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bid-securities',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-documents',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'sor-reimburseable-expenses',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'qualification',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'technical-scoring',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'spd-bid-form',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-requisitions',
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api',
  },
  {
    entity: 'procurement-requisition-mechanisms',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-technical-teams',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'procurement-mechanisms',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bds-awards',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bds-evaluations',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bds-preparations',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bds-submissions',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'bds-generals',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'tender-spd',
    baseUrl: process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api',
  },
  {
    entity: 'guarantees',
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api',
  },
];
