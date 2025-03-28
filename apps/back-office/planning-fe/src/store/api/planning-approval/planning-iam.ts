import { baseQuery } from '@/store/base-query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const planningIamApi = createApi({
  reducerPath: 'planningIamApi',
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
  }),
});

export const {
  useLazyGetGroupsQuery,
  useLazyGetRolesQuery,
  useLazyGetUsersQuery,
  useLazyGetGroupQuery,
} = planningIamApi;
