import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organizations',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organizationSectors',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organizationTypes',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'unitTypes',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'units',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'users',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'roles',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'my-mandate',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'mandates',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
];
