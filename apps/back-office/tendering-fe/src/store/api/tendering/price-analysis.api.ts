import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const priceAnalysis = createApi({
  reducerPath: 'priceAnalysis',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['currency', 'formula'],
  endpoints: (builder) => ({
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/financial-price-analysis/bidders-status/${lotId}${q}`,
        };
      },
    }),
    getBidderItems: builder.query<any, any>({
      query: ({ lotId, bidderId }) => {
        return {
          url: `/financial-price-analysis/bidder-offered-items/${lotId}/${bidderId}`,
        };
      },
    }),

    saveMarketPriceAnalysis: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/financial-price-analysis/bulk-create`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLazyGetPassedBiddersQuery,
  useLazyGetBidderItemsQuery,
  useSaveMarketPriceAnalysisMutation,
} = priceAnalysis;
