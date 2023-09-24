import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';

export const organizationSectorApi = createApi({
  reducerPath: 'organizationSectorApi',
  refetchOnFocus: true,
  tagTypes: ['organizationSectors', 'organizationSector'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getOrganizationSectors: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'organizationSectors/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['organizationSector'],
    }),
    getOrganizationSectorById: builder.query<any, string>({
      query: (id) => ({
        url: `organizationSectors/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['organizationSector'],
    }),
    addOrganizationSector: builder.mutation<any, any>({
      query: (organizationSector) => {
        return {
          url: 'organizationSectors/create',
          method: 'POST',
          body: organizationSector,
        };
      },

      invalidatesTags: ['organizationSectors'],
    }),
    updateOrganizationSector: builder.mutation<any, any>({
      query: (updatedorganizationSector) => {
        return {
          url: `/organizationSectors/update/${updatedorganizationSector.id}`,
          method: 'PATCH',
          body: updatedorganizationSector,
        };
      },
      invalidatesTags: ['organizationSector', 'organizationSectors'],
    }),
    deleteOrganizationSector: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `organizationSectors/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['organizationSectors'],
    }),
  }),
});

export const {
  useAddOrganizationSectorMutation,
  useUpdateOrganizationSectorMutation,
  useGetOrganizationSectorByIdQuery,
  useLazyGetOrganizationSectorByIdQuery,
  useLazyGetOrganizationSectorsQuery,
  useGetOrganizationSectorsQuery,
  useDeleteOrganizationSectorMutation,
} = organizationSectorApi;
