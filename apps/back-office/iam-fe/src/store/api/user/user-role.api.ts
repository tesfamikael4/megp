import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserRole } from '@/models/user/user-role';
import { Role } from '@/models/user/role';

export const userRoleApi = createApi({
  reducerPath: 'userRoleApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3030/userrole',
  }),
  tagTypes: ['UserRole', 'UserRoles'],
  endpoints: (builder) => ({
    getUserRole: builder.query<UserRole[], null>({
      query: () => '',
      providesTags: ['UserRoles'],
    }),
    getUserRoles: builder.query<UserRole[], string>({
      query: (userId) => `?userId=${userId}`,
      providesTags: ['UserRoles'],
    }),
    getUserRoleById: builder.query<UserRole, { id: string }>({
      query: (id) => `${id}`,
      providesTags: ['UserRole'],
    }),

    addNewUserRole: builder.mutation<any, any>({
      query: (newuserrole) => {
        return {
          url: ``,
          method: 'POST',
          body: newuserrole,
        };
      },
      invalidatesTags: ['UserRole', 'UserRole'],
    }),

    deleteUserRole: builder.mutation<string, any>({
      query: (id: string) => {
        return {
          url: `${id}`,
          method: 'DELETE',
          body: {},
        };
      },
      invalidatesTags: ['UserRole', 'UserRole'],
    }),
  }),
});

export const {
  useGetUserRoleQuery,
  useLazyGetUserRoleQuery,
  useGetUserRoleByIdQuery,
  useAddNewUserRoleMutation,
  useLazyGetUserRolesQuery,
  useDeleteUserRoleMutation,
} = userRoleApi;
