import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/models/user/user';
import { userBaseUrl } from './base-urls';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { CollectionQuery } from '@/shared/core/models';

export const userApi = createApi({
  reducerPath: 'userApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  tagTypes: ['User', 'Users', 'userUnits', 'userRoles'],

  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: '/users/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['Users'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/get/${id}`,
      providesTags: ['User'],
    }),
    addNewUser: builder.mutation<any, any>({
      query: (newuser) => {
        return {
          url: `/users/create`,
          method: 'POST',
          body: {
            ...newuser,
            superTokenUserId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
          },
        };
      },
      invalidatesTags: ['User', 'Users'],
    }),

    updateUser: builder.mutation<any, any>({
      query: (user) => {
        return {
          url: `users/update/${user.id}`,
          method: 'PATCH',
          body: {
            ...user,
            superTokenUserId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
          },
        };
      },
      invalidatesTags: ['User', 'Users'],
      //invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    userActivation: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/users/activation/${id}`,
          method: 'PATCH',
        };
      },
      invalidatesTags: ['User', 'Users'],
      //invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `users/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['User', 'Users'],
    }),

    // unit Assignment

    getUnitByUserId: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/users/get/${id}?includes[0]=userUnits.unit`,
          method: 'GET',
        };
      },
      providesTags: ['userUnits'],
    }),

    AssignUnitToUser: builder.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `/users/assign-units/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['userUnits'],
    }),

    // role assignment

    getRoleByUserId: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/users/get/${id}?includes[0]=userRoles.role`,
          method: 'GET',
        };
      },
      providesTags: ['userRoles'],
    }),

    AssignRoleToUser: builder.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `/users/assign-roles/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['userRoles'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useLazyGetUserByIdQuery,
  useUserActivationMutation,

  useGetUnitByUserIdQuery,
  useAssignUnitToUserMutation,

  useGetRoleByUserIdQuery,
  useAssignRoleToUserMutation,
} = userApi;
