import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const iamApi = createApi({
  reducerPath: 'iamApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/'),
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `user/list/${id}${q}`, method: 'GET' };
      },
    }),
    getUsersByPermission: builder.query<any, any>({
      query: ({ organizationId, collectionQuery, permissionKey }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `user/list/${organizationId}/permission/${permissionKey}${q}`,
          method: 'GET',
        };
      },
    }),
    getOrganizations: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `organizations${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useLazyGetUsersQuery,
  useLazyGetUsersByPermissionQuery,
  useLazyGetOrganizationsQuery,
} = iamApi;
