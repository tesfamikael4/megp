import {
  BidResponse,
  GetBidResponse,
} from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderResponseApi = createApi({
  reducerPath: 'tenderResponseApi',
  tagTypes: ['tender-bid-response'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    saveTenderBidResponse: builder.mutation<any, any>({
      query: (data: BidResponse) => ({
        url: `bid-tender-responses/create-bid-response-tender`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['tender-bid-response'],
    }),
    getTenderBidResponse: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-tender-responses/get-bid-response-tender`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['tender-bid-response'],
    }),
  }),
});

export const {
  useSaveTenderBidResponseMutation,
  useLazyGetTenderBidResponseQuery,
} = tenderResponseApi;
