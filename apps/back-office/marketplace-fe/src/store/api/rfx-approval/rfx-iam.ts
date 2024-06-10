import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rfxIamApi = createApi({
  reducerPath: 'rfxIamApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/'),
  endpoints: (builder) => ({
    getRoles: builder.query<any, { id: string }>({
      query: (payload) => `roles/list/${payload.id}`,
    }),
    getGroups: builder.query<any, { id: string }>({
      query: (payload) => `groups/list/${payload.id}`,
    }),
    getUsers: builder.query<any, { id: string }>({
      query: (payload) => `user/list/${payload.id}`,
    }),
    getGroup: builder.query<any, { userId: string }>({
      query: (payload) => `user-groups/${payload.userId}/group`,
    }),
    getUsersList: builder.query<any, any>({
      query: ({ organizationId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `user/list/${organizationId}${q}` };
      },
    }),
  }),
});

export const {
  useLazyGetGroupsQuery,
  useLazyGetRolesQuery,
  useLazyGetUsersQuery,
  useLazyGetGroupQuery,
  useLazyGetUsersListQuery,
} = rfxIamApi;
