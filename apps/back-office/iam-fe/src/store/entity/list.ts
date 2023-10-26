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
  {
    entity: 'applications',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'user-unit',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'user-groups',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'user-role',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'organization-mandates',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'role-permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
  {
    entity: 'mandate-permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam',
  },
];
