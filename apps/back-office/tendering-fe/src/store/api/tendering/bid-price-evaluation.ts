import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const bidPriceEvaluation = createApi({
  reducerPath: 'bidPriceEvaluation',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['currency', 'formula'],
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
} = bidPriceEvaluation;
