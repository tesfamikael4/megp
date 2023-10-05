import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organization',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organization-sector',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organization-type',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'unit-type',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'unit',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'user',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'role',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'my-mandate',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'mandate',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
];
