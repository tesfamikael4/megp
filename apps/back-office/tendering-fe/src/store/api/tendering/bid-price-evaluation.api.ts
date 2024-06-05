import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const bidPriceEvaluation = createApi({
  reducerPath: 'bidPriceEvaluation',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['currency', 'formula', 'unitPrice', 'formula-implementation'],
  endpoints: (builder) => ({
    createConversionRate: builder.mutation<any, any>({
      query: (data) => ({
        url: `/exchange-rate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['currency'],
    }),
    getConversionRateByLotId: builder.query<any, any>({
      query: (lotId) => `/exchange-rate/list/${lotId}`,
      providesTags: ['currency'],
    }),
    createRuleEquation: builder.mutation<any, any>({
      query: (data) => ({
        url: `/formula-units`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['formula'],
    }),
    getRulesByLotId: builder.query<any, any>({
      query: (lotId) => `/formula-units/list/${lotId}`,
      providesTags: ['formula'],
    }),
    getItems: builder.query<any, any>({
      query: ({
        lotId,
        collectionQuery,
      }: {
        lotId: string;
        collectionQuery?: CollectionQuery;
      }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/financial-bid-price-assessment/get-items-by-lotId/${lotId}${q}`,
        };
      },
    }),
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, itemId, collectionQuery, team = 'member' }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/financial-bid-price-assessment/bidders-status/${lotId}/${itemId}?${q}`,
        };
      },
    }),
    createApplicableRuleForBidder: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: '/formula-implementation',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['formula-implementation'],
    }),
    deleteApplicableRuleForBidder: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/formula-implementation/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['formula-implementation'],
    }),
    getCanAssess: builder.query<any, any>({
      query: (lotId) => `/financial-bid-price-assessment/can-assess/${lotId}`,
      providesTags: ['currency', 'formula'],
    }),
    getHasUnitPrice: builder.query<any, any>({
      query: ({ lotId, itemId, bidderId }) =>
        `/financial-bid-price-assessment/has-formula/${lotId}/${itemId}/${bidderId}`,
      providesTags: ['unitPrice'],
    }),
    createUnitPrice: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/formula-implementation/create-unit-price`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['unitPrice'],
    }),
    getRulesByBidderId: builder.query<any, any>({
      query: ({ lotId, itemId, bidderId }) =>
        `/formula-implementation/formula-implementation-status/${lotId}/${itemId}/${bidderId}`,
      providesTags: ['formula-implementation'],
    }),
    getBidderSummary: builder.query<any, any>({
      query: ({ lotId, itemId, bidderId }) =>
        `/formula-implementation/get-summary/${lotId}/${itemId}/${bidderId}`,
      providesTags: ['formula-implementation', 'unitPrice'],
    }),
    saveBidPrice: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: '/formula-implementation/save-result',
          method: 'POST',
          body: data,
        };
      },
    }),
    completeBidPriceEvaluation: builder.mutation<any, any>({
      query: (data: {
        lotId: string;
        bidderId: string;
        isTeamLead: boolean;
      }) => {
        return {
          url: `/formula-implementation/complete-bidder-evaluation`,
          method: 'POST',
          body: data,
        };
      },
    }),

    submitBidPriceEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/financial-bid-price-assessment/submit`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCreateConversionRateMutation,
  useGetConversionRateByLotIdQuery,
  useCreateRuleEquationMutation,
  useLazyGetRulesByLotIdQuery,
  useGetRulesByLotIdQuery,
  useLazyGetItemsQuery,
  useLazyGetPassedBiddersQuery,
  useCreateApplicableRuleForBidderMutation,
  useLazyGetCanAssessQuery,
  useLazyGetHasUnitPriceQuery,
  useGetHasUnitPriceQuery,
  useCreateUnitPriceMutation,
  useGetRulesByBidderIdQuery,
  useDeleteApplicableRuleForBidderMutation,
  useGetBidderSummaryQuery,
  useCompleteBidPriceEvaluationMutation,
  useSaveBidPriceMutation,
  useSubmitBidPriceEvaluationMutation,
} = bidPriceEvaluation;
