import {
  BidResponse,
  GetBidResponse,
} from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const lotResponseApi = createApi({
  reducerPath: 'lotResponseApi',
  tagTypes: ['lot-bid-response'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    saveLotBidResponse: builder.mutation<any, any>({
      query: (data: BidResponse) => ({
        url: `bid-responses`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['lot-bid-response'],
    }),
    getLotBidResponse: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-responses/get-bid-response`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['lot-bid-response'],
    }),
  }),
});

export const { useSaveLotBidResponseMutation, useLazyGetLotBidResponseQuery } =
  lotResponseApi;
