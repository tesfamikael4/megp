import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  tagTypes: ['pre-budget-plan-items'],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPreBudgetPlans: builder.query<any, null>({
      query: () => 'pre-budget-plans/get-with-app',
    }),
    createMultipleItems: builder.mutation<any, any>({
      query: (data) => ({
        url: 'pre-budget-plan-items/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pre-budget-plan-items'],
    }),
  }),
});

export const { useGetPreBudgetPlansQuery, useCreateMultipleItemsMutation } =
  preBudgetPlanApi;
