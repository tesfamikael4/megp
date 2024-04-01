import { baseQuery } from '@/store/base-query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workflowIamApi = createApi({
  reducerPath: 'workflowIamApi',
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
    getPermissions: builder.query<any, { id: string }>({
      query: (payload) => `permissions/organization/${payload.id}`,
    }),
  }),
});

export const {
  useLazyGetGroupsQuery,
  useLazyGetRolesQuery,
  useLazyGetUsersQuery,
  useGetPermissionsQuery,
  useLazyGetPermissionsQuery,
} = workflowIamApi;
