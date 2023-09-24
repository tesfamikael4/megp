import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  refetchOnFocus: true,
  tagTypes: ['applications', 'application', 'permision', 'permisions'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getapplication: builder.query<any, any>({
      query: (data) => ({
        url: 'applications/get-all',
        method: 'GET',
        params: data,
      }),

      providesTags: ['applications'],
    }),
    getapplicationById: builder.query<any, string>({
      query: (id) => ({
        url: `applications/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['application'],
    }),
    addapplication: builder.mutation<any, any>({
      query: (application) => {
        return {
          url: 'applications/create',
          method: 'POST',
          body: application,
        };
      },

      invalidatesTags: ['applications'],
    }),
    updateapplication: builder.mutation<any, any>({
      query: (updatedapplication) => {
        return {
          url: `applications/update/${updatedapplication.id}`,
          method: 'PATCH',
          body: updatedapplication,
        };
      },
      invalidatesTags: ['applications', 'application'],
    }),
    deleteapplication: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `applications/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['applications'],
    }),

    getPermissionsByApplicationId: builder.query<any, any>({
      query: (data: { data: CollectionQuery; applicationId: string }) => ({
        url: `permissions/get-all-under-application/${data.applicationId}`,
        method: 'GET',
        params: collectionQueryBuilder(data.data),
      }),
      providesTags: ['permisions'],
    }),

    removePermission: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `permissions/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['permisions'],
    }),
    addPermission: builder.mutation<any, any>({
      query: (permision) => {
        return {
          url: `permissions/create`,
          method: 'POST',
          body: permision,
        };
      },
      invalidatesTags: ['permisions'],
    }),
    updatePermission: builder.mutation<any, any>({
      query: (permision) => {
        return {
          url: `permissions/update/${permision.id}`,
          method: 'PATCH',
          body: permision,
        };
      },
      invalidatesTags: ['permision'],
    }),
  }),
});

export const {
  useAddapplicationMutation,
  useUpdateapplicationMutation,
  useGetapplicationByIdQuery,
  useLazyGetapplicationByIdQuery,
  useLazyGetapplicationQuery,
  useGetapplicationQuery,
  useDeleteapplicationMutation,

  // permission
  useAddPermissionMutation,
  useUpdatePermissionMutation,
  useLazyGetPermissionsByApplicationIdQuery,
  useRemovePermissionMutation,
} = applicationApi;
