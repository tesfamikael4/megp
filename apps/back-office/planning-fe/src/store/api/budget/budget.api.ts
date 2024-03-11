import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const budgetsApi = createApi({
  reducerPath: 'budgetsApi',
  tagTypes: ['budgets'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    bulkCreate: builder.mutation<any, any>({
      query: (data) => ({
        url: 'budgets/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['budgets'],
    }),
    getBudgetSummation: builder.query<any, any>({
      query: (budgetYearId) => `budgets/summation/${budgetYearId}`,
    }),
  }),
});

export const { useBulkCreateMutation, useLazyGetBudgetSummationQuery } =
  budgetsApi;
