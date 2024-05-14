import { GetBidResponse } from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getBidFormApi = createApi({
  reducerPath: 'getBidFormApi',
  tagTypes: ['bid-form'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    bidForms: builder.query<any, any>({
      query: (args: { spdId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/spd-bid-forms/list/${args.spdId}/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-form'],
    }),
    bidFormDetail: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/spd-bid-forms/${id}/`,
          method: 'GET',
        };
      },
      providesTags: ['bid-form'],
    }),
    upload: builder.mutation<any, any>({
      query: (data) => ({
        url: 'bid-document-responses/upload-response',
        method: 'POST',
        body: data,
      }),
    }),

    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'bid-document-responses/upload-response',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bid-form'],
    }),

    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `bid-form/list/${id}`,
      }),
      providesTags: ['bid-form'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-document-responses/download-response`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['bid-form'],
    }),
  }),
});

export const {
  useLazyBidFormsQuery,
  useBidFormDetailQuery,
  useUploadMutation,
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} = getBidFormApi;
