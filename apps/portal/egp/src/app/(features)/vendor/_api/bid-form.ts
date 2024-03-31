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
  }),
});

export const { useLazyBidFormsQuery } = getBidFormApi;
