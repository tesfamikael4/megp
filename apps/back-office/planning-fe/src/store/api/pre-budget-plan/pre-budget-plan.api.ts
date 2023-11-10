import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPreBudgetPlans: builder.query<any, null>({
      query: () => 'pre-budget-plans/get-with-app',
    }),
  }),
});

export const { useGetPreBudgetPlansQuery } = preBudgetPlanApi;
