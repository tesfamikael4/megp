import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const poApi = createApi({
  reducerPath: 'poApi',
  refetchOnFocus: true,
  tagTypes: ['files', 'item'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    upload: builder.mutation<any, any>({
      query: (data) => ({
        url: 'po-attachment/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['files'],
    }),

    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'po-attachment/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['files'],
    }),

    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `po-attachment/list/${id}`,
      }),
      providesTags: ['files'],
    }),

    deleteFile: builder.mutation<any, any>({
      query: (id) => ({
        url: `po-attachment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['files'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `po-attachment/download/${id}`,
      }),
      providesTags: ['files'],
    }),

    itemBulkCreate: builder.mutation<any, any>({
      query: (data) => ({
        url: `/item-shipments/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['item'],
    }),

    itemListShipment: builder.query<any, any>({
      query: (id: string) => ({
        url: `/item-shipments/${id}`,
      }),
      providesTags: ['item'],
    }),

    listPoItemList: builder.query<any, any>({
      query: (id: string) => ({
        url: `/po-items/list/${id}`,
      }),
      providesTags: ['item'],
    }),
  }),
});

export const {
  useUploadMutation,
  useLazyGetFilesQuery,
  useLazyDownloadFilesQuery,
  useDownloadFilesQuery,
  usePreSignedUrlMutation,
  useDeleteFileMutation,

  // item shipment
  useItemBulkCreateMutation,
  useItemListShipmentQuery,
  useLazyItemListShipmentQuery,

  // item po
  useListPoItemListQuery,
  useLazyListPoItemListQuery,
} = poApi;
