import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const approveTenderApi = createApi({
  reducerPath: 'approveTenderApi',
  tagTypes: ['spd'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    approveTender: builder.mutation<any, any>({
      query: (data: { id: string; status: string }) => ({
        url: `tenders/change-status`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spd'],
    }),
    generateBid: builder.mutation<any, any>({
      query: (data: { id: string }) => ({
        url: `tenders/generate-tender-document`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spd'],
    }),
  }),
});

export const { useApproveTenderMutation, useGenerateBidMutation } =
  approveTenderApi;
