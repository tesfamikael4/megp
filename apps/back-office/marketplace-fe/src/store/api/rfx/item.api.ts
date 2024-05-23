import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const itemOtherApi = createApi({
  reducerPath: 'itemOtherApi',
  refetchOnFocus: true,
  tagTypes: ['files'],
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    getProductCatalogues: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `product-catalogs/with-images${q}` };
      },
    }),
    getItemTemplate: builder.query<any, { id: string }>({
      query: (data) => ({
        url: `specification-templates/itemCode/${data.id}`,
        method: 'GET',
      }),
    }),
    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `product-catalog-images/list/${id}`,
      }),
      providesTags: ['files'],
    }),

    deleteFile: builder.mutation<any, any>({
      query: (id) => ({
        url: `/product-catalog-images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['files'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `product-catalog-images/download/${id}`,
      }),
      providesTags: ['files'],
    }),
    getRegions: builder.query<any, any>({
      query: () => 'regions',
    }),
    getDistricts: builder.query<any, string>({
      query: (id: string) => `districts/list/${id}`,
    }),
  }),
});

export const {
  useLazyGetItemTemplateQuery,
  useGetItemTemplateQuery,
  useLazyGetFilesQuery,
  useLazyDownloadFilesQuery,
  useLazyGetProductCataloguesQuery,
  useGetRegionsQuery,
  useLazyGetDistrictsQuery,
} = itemOtherApi;
