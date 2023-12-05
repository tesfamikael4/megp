import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postBudgetPlanApi = createApi({
  reducerPath: 'postBudgetPlanApi',
  tagTypes: ['post-budget-plan'],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPostBudgetPlans: builder.query<any, null>({
      query: () => 'post-budget-plans/get-with-app',
      providesTags: ['post-budget-plan'],
    }),
    approvePostBudget: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `post-budget-plans/approve-post-budget/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['post-budget-plan'],
    }),
    createMultipleItems: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budget-plan-items/bulk-create',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPostBudgetPlansQuery,
  useLazyGetPostBudgetPlansQuery,
  useCreateMultipleItemsMutation,
  useApprovePostBudgetMutation,
} = postBudgetPlanApi;
