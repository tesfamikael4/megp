import { CollectionQuery } from '@/shared/core/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';
import { collectionQueryBuilder } from '@/shared/core/utilities';

export const roleApi = createApi({
  reducerPath: 'roleApi',
  refetchOnFocus: true,
  tagTypes: ['roles', 'role'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getroles: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'roles/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['roles'],
    }),
    getroleById: builder.query<any, string>({
      query: (id) => ({
        url: `roles/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['role'],
    }),
    addrole: builder.mutation<any, any>({
      query: (role) => {
        return {
          url: 'roles/create',
          method: 'POST',
          body: role,
        };
      },

      invalidatesTags: ['roles'],
    }),
    updaterole: builder.mutation<any, any>({
      query: (updatedrole) => {
        return {
          url: `roles/update/${updatedrole.id}`,
          method: 'PATCH',
          body: updatedrole,
        };
      },
      invalidatesTags: ['role', 'roles'],
    }),
    deleterole: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/roles/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['roles'],
    }),

    getMandate: builder.query<any, any>({
      query: () => ({
        url: 'mandates/get-all',
        method: 'GET',
      }),
    }),

    GetMandateById: builder.query<any, any>({
      query: (id) => ({
        url: `/mandates/get/${id}`,
        method: 'GET',
      }),
    }),

    assignRoleToMandatePermissions: builder.mutation<
      any,
      { data: any; idParse: string }
    >({
      query: ({ data, idParse }) => {
        return {
          url: `roles/assign-permissions/${idParse}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['roles'],
    }),

    getRolePermissions: builder.query<any, any>({
      query: (id) => ({
        url: `roles/get/${id}?includes[0]=rolePermissions`,
        method: 'GET',
      }),
    }),

    getAllPermissions: builder.query<any, any>({
      query: () => ({
        url: `/permissions/get-all`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAssignRoleToMandatePermissionsMutation,
  useLazyGetRolePermissionsQuery,
  useLazyGetAllPermissionsQuery,

  useLazyGetMandateQuery,
  useGetMandateQuery,
  useLazyGetMandateByIdQuery,
  useLazyGetrolesQuery,
  useGetrolesQuery,
  useGetroleByIdQuery,
  useLazyGetroleByIdQuery,
  useAddroleMutation,
  useUpdateroleMutation,
  useDeleteroleMutation,
} = roleApi;
