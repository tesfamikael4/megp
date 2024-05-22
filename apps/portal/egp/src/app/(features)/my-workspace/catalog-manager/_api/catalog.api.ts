import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { listenerCancelled } from '@reduxjs/toolkit/dist/listenerMiddleware/exceptions';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getCatalogApi = createApi({
  reducerPath: 'getCatalogApi',
  tagTypes: ['catalog', 'specificationTemplate', 'files'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    listCatalogs: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/product-catalogs/with-images/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['catalog'],
    }),

    getTemplate: builder.query<any, string>({
      query: (id) => ({
        url: `specification-templates/item/${id}`,
      }),
      providesTags: ['specificationTemplate'],
    }),
    createCatalog: builder.mutation<any, any>({
      query: (data) => ({
        url: `product-catalogs`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['catalog'],
    }),
    updateCatalog: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `product-catalogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['catalog'],
    }),
    deleteCatalog: builder.mutation<any, string>({
      query: (id) => ({
        url: `product-catalogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['catalog'],
    }),
    readCatalog: builder.query<any, string>({
      query: (id: string) => ({
        url: `product-catalogs/${id}`,
        method: 'GET',
      }),
      providesTags: ['catalog'],
    }),
    // images
    upload: builder.mutation<any, any>({
      query: (data) => ({
        url: 'product-catalog-images/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['files'],
    }),

    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'procurement-requisition-documents/pre-signed-put-url',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['files'],
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
  useLazyListCatalogsQuery,
  useListCatalogsQuery,
  useGetTemplateQuery,
  useLazyGetTemplateQuery,

  // catalog
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useReadCatalogQuery,
  useLazyReadCatalogQuery,
  useDeleteCatalogMutation,

  // Images

  useUploadMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
  useDeleteFileMutation,

  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
  useGetRegionsQuery,
  useLazyGetRegionsQuery,
} = getCatalogApi;
