import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userRoleBaseUrl } from './base-urls';

export const assignRoleApi = createApi({
  reducerPath: 'assignRoleApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: userRoleBaseUrl,
  }),
  tagTypes: ['UserRole', 'UserRoles'],
  endpoints: (builder) => ({
    assignRoles: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `${data.userId}`,
          method: 'POST',
          body: data.roles,
        };
      },
    }),
  }),
});

export const { useAssignRolesMutation } = assignRoleApi;
