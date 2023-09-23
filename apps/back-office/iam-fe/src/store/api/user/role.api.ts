import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Role } from '@/models/user/role';
import { roleBaseUrl } from './base-urls';

export const roleApi = createApi({
  reducerPath: 'roleApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: roleBaseUrl,
  }),
  tagTypes: ['Role', 'Roles'],
  endpoints: (builder) => ({
    getRoles: builder.query<any, null>({
      query: () => 'get-all',
      providesTags: ['Roles'],
    }),
    getRoleById: builder.query<Role, { id: string }>({
      query: (id) => `${id}`,
      providesTags: ['Role'],
    }),

    addNewRole: builder.mutation<any, any>({
      query: (newrole) => {
        return {
          url: ``,
          method: 'POST',
          body: newrole,
        };
      },
      invalidatesTags: ['Role', 'Roles'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetRoleByIdQuery,
  useAddNewRoleMutation,
} = roleApi;
