import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const bidPriceEvaluation = createApi({
  reducerPath: 'bidPriceEvaluation',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['currency', 'formulas'],
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
      invalidatesTags: ['formulas'],
    }),
  }),
});

export const {
  useCreateConversionRateMutation,
  useGetConversionRateByLotIdQuery,
  useCreateRuleEquationMutation,
} = bidPriceEvaluation;
