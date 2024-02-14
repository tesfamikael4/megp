import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const approveSpdApi = createApi({
  reducerPath: 'approveSpdApi',
  tagTypes: ['spd'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    approveSpd: builder.mutation<any, any>({
      query: (data: { id: string; itemName: string }) => ({
        url: `spd/approve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spd'],
    }),
  }),
});

export const { useApproveSpdMutation } = approveSpdApi;
