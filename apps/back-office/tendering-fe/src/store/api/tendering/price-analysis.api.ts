import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const priceAnalysis = createApi({
  reducerPath: 'priceAnalysis',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['currency', 'formula', 'complete'],
  endpoints: (builder) => ({
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/financial-price-analysis-detail/bidders-status/${lotId}${q}`,
        };
      },
    }),
    getBidderItems: builder.query<any, any>({
      query: ({ lotId, bidderId }) => {
        return {
          url: `/financial-price-analysis-detail/bidder-offered-items/${lotId}/${bidderId}`,
        };
      },
    }),

    saveMarketPriceAnalysis: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/financial-price-analysis-detail/bulk-create`,
          method: 'POST',
          body: data,
        };
      },
    }),

    completePriceAnalysis: builder.mutation<any, any>({
      query: (data: { lotId: string; bidderId: string }) => {
        return {
          url: `/financial-price-analysis-detail/complete-bidder-evaluation`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['complete'],
    }),

    submitPriceAnalysisEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/financial-price-analysis-detail/submit`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['complete'],
    }),
    getCanPriceAnalysisComplete: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/financial-price-analysis-detail/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['complete'],
    }),
  }),
});

export const {
  useLazyGetPassedBiddersQuery,
  useLazyGetBidderItemsQuery,
  useCompletePriceAnalysisMutation,
  useSaveMarketPriceAnalysisMutation,
  useSubmitPriceAnalysisEvaluationMutation,
  useLazyGetCanPriceAnalysisCompleteQuery,
} = priceAnalysis;
