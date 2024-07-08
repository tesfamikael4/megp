import { ItemBidResponse } from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const submitApi = createApi({
  reducerPath: 'submitApi',
  tagTypes: ['submit'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    submit: builder.mutation<any, any>({
      query: (data: ItemBidResponse) => ({
        url: `bid-registrations/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['submit'],
    }),
  }),
});

export const { useSubmitMutation } = submitApi;
