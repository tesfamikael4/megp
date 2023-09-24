import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';

export const organizationTypeApi = createApi({
  reducerPath: 'organizationTypeApi',
  refetchOnFocus: true,
  tagTypes: ['organizationType', 'organizationType'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getOrganizationType: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'organizationTypes/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['organizationType'],
    }),
    getOrganizationTypeById: builder.query<any, string>({
      query: (id) => ({
        url: `/organizationTypes/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['organizationType'],
    }),
    addOrganizationType: builder.mutation<any, any>({
      query: (organizationType) => {
        return {
          url: 'organizationTypes/create',
          method: 'POST',
          body: organizationType,
        };
      },

      invalidatesTags: ['organizationType'],
    }),
    updateOrganizationType: builder.mutation<any, any>({
      query: (updatedorganizationType) => {
        return {
          url: `organizationTypes/update/${updatedorganizationType.id}`,
          method: 'PATCH',
          body: updatedorganizationType,
        };
      },
      invalidatesTags: ['organizationType', 'organizationType'],
    }),
    deleteOrganizationType: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `organizationTypes/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['organizationType'],
    }),
  }),
});

export const {
  useAddOrganizationTypeMutation,
  useUpdateOrganizationTypeMutation,
  useGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeQuery,
  useGetOrganizationTypeQuery,
  useDeleteOrganizationTypeMutation,
} = organizationTypeApi;
