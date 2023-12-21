import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postBudgetPlanApi = createApi({
  reducerPath: 'postBudgetPlanApi',
  tagTypes: ['post-budget-plan', 'post-budget-timeline'],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPostBudgetPlans: builder.query<any, null>({
      query: () => 'post-budget-plans/get-with-app',
      providesTags: ['post-budget-plan'],
    }),
    getPostBudgetPlan: builder.query<any, string>({
      query: (id: string) => `post-budget-plans/${id}`,
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
    createPostActivityTimeline: builder.mutation<any, any[]>({
      query: (timeline: any[]) => ({
        url: `post-budget-plan-timelines/bulk-create`,
        method: 'POST',
        body: { timeline },
      }),
      invalidatesTags: ['post-budget-timeline'],
    }),
    getPostBudgetTimeline: builder.query<any, string>({
      query: (id: string) => `post-budget-plan-timelines/list/${id}`,
      providesTags: ['post-budget-timeline'],
    }),
  }),
});

export const {
  useGetPostBudgetPlansQuery,
  useLazyGetPostBudgetPlansQuery,
  useCreateMultipleItemsMutation,
  useApprovePostBudgetMutation,
  useCreatePostActivityTimelineMutation,
  useGetPostBudgetPlanQuery,
  useLazyGetPostBudgetTimelineQuery,
} = postBudgetPlanApi;
