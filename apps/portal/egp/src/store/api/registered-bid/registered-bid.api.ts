import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/';
export const bidApi = createApi({
  reducerPath: 'bidApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getRegisteredBid: builder.query<any, string>({
      query: (id) => `tenders/${id}`,
    }),
  }),
});

export const { useGetRegisteredBidQuery } = bidApi;
