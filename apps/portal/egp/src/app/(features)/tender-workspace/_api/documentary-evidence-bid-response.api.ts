import {
  BidResponse,
  GetBidResponse,
} from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const documentaryEvidenceResponseApi = createApi({
  reducerPath: 'documentaryEvidenceResponseApi',
  tagTypes: ['documentary-evidence-bid-response'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    saveDocumentaryEvidenceBidResponse: builder.mutation<any, any>({
      query: (data: BidResponse) => ({
        url: `bid-documentary-evidence--responses/create-bid-response-documentary-evidence`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['documentary-evidence-bid-response'],
    }),
    getDocumentaryEvidenceBidResponse: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-documentary-evidence-responses/download-response`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['documentary-evidence-bid-response'],
    }),
    getPresignedUrl: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-documentary-evidence-responses/download-response-by-id`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['documentary-evidence-bid-response'],
    }),
    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: '/bid-documentary-evidence-responses/upload-response',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['documentary-evidence-bid-response'],
    }),
    getDocumentaryEvidence: builder.query<any, any>({
      query: (args: { lotId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/eqc-documentary-evidences/list/${args.lotId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['documentary-evidence-bid-response'],
    }),
  }),
});

export const {
  useSaveDocumentaryEvidenceBidResponseMutation,
  useLazyGetDocumentaryEvidenceBidResponseQuery,
  useLazyGetPresignedUrlQuery,
  useLazyGetDocumentaryEvidenceQuery,
  usePreSignedUrlMutation,
} = documentaryEvidenceResponseApi;
