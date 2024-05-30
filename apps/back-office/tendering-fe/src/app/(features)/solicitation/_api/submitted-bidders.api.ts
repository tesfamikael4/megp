import { baseQuery } from '@/store/base-query';
import { CollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getSubmittedBiddersApi = createApi({
  reducerPath: 'getSubmittedBiddersApi',
  tagTypes: ['submitted-bidders'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getSubmittedBidders: builder.query<any, any>({
      query: (args: { tenderId: string; collectionQuery: CollectionQuery }) => {
        return {
          url: `/bid-registrations/registered-bid/${args.tenderId}`,
          method: 'GET',
        };
      },
      providesTags: ['submitted-bidders'],
    }),
  }),
});

export const { useLazyGetSubmittedBiddersQuery } = getSubmittedBiddersApi;
