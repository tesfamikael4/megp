import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sectorApi = createApi({
  reducerPath: 'sectorApi',
  refetchOnFocus: true,
  tagTypes: ['sectors', 'sector'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getSectors: builder.query<any, any>({
      query: (data) => ({
        url: 'organizationSectors/get-all',
        method: 'GET',
        params: data,
      }),

      providesTags: ['sectors'],
    }),
    getSectorById: builder.query<any, string>({
      query: (id) => ({
        url: `organizationSectors/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['sector'],
    }),
    addSector: builder.mutation<any, any>({
      query: (sector) => {
        return {
          url: 'organizationSectors/create',
          method: 'POST',
          body: sector,
        };
      },

      invalidatesTags: ['sectors'],
    }),
    updateSectors: builder.mutation<any, any>({
      query: (sector) => {
        return {
          url: `/organizationSectors/update/${sector.id}`,
          method: 'PATCH',
          body: sector,
        };
      },
      invalidatesTags: ['sector', 'sectors'],
    }),
    deleteSectors: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `organizationSectors/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['sectors'],
    }),
  }),
});

export const {
  useLazyGetSectorsQuery,
  useGetSectorsQuery,
  useGetSectorByIdQuery,
  useLazyGetSectorByIdQuery,
  useAddSectorMutation,
  useDeleteSectorsMutation,
  useUpdateSectorsMutation,
} = sectorApi;
