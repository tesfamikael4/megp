import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  tagTypes: ['pre-budget-plan-items', 'pre-budget-plan', 'post-budget-plan'],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPreBudgetPlans: builder.query<any, null>({
      query: () => 'pre-budget-plans/get-with-app',
      providesTags: ['pre-budget-plan'],
    }),
    approvePreBudget: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `pre-budget-plans/approve-pre-budget/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['pre-budget-plan', 'post-budget-plan'],
    }),
    createMultipleItems: builder.mutation<any, any>({
      query: (data) => ({
        url: 'pre-budget-plan-items/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pre-budget-plan-items'],
    }),
    createApp: builder.mutation<any, string>({
      query: (type: string) => ({
        url: `apps/auto-create`,
        method: 'POST',
        body: { type },
      }),
      invalidatesTags: ['pre-budget-plan'],
    }),
  }),
});

export const {
  useGetPreBudgetPlansQuery,
  useLazyGetPreBudgetPlansQuery,
  useCreateMultipleItemsMutation,
  useApprovePreBudgetMutation,
  useCreateAppMutation,
} = preBudgetPlanApi;
