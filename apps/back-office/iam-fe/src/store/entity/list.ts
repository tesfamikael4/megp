import { EntityStoreConfig } from '@megp/entity';

export const ENTITY_LIST: EntityStoreConfig[] = [
  {
    entity: 'group',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'organizations',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'organization-sector',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'organization-type',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'unit-type',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'unit',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'user',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'roles',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'my-mandate',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'mandates',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'applications',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'user-unit',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'user-groups',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'user-role',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'organization-mandates',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'role-permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
  {
    entity: 'mandate-permissions',
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api',
  },
];
