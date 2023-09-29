import { EntityStoreConfig } from "@megp/core-fe";

export const ENTITY_LIST: EntityStoreConfig[] = [
    {
        entity: 'group',
        baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/api/iam'
    }
]