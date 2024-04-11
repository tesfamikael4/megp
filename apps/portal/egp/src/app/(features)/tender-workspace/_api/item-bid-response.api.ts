import { ItemBidResponse } from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const ItemBidResponseApi = createApi({
  reducerPath: 'ItemBidResponseApi',
  tagTypes: ['technical-bid-response'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    saveTechnicalBidResponse: builder.mutation<any, any>({
      query: (data: ItemBidResponse) => ({
        url: `bid-item-responses/technical-response`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['technical-bid-response'],
    }),
    saveFinancialBidResponse: builder.mutation<any, any>({
      query: (data: ItemBidResponse) => ({
        url: `bid-registrations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['technical-bid-response'],
    }),
  }),
});

export const {
  useSaveFinancialBidResponseMutation,
  useSaveTechnicalBidResponseMutation,
} = ItemBidResponseApi;
