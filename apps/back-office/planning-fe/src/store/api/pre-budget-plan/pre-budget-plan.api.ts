import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  tagTypes: [
    'pre-budget-plan-items',
    'pre-budget-plan',
    'post-budget-plan',
    'pre-budget-timeline',
    'pre-budget-requisitioner',
  ],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    getPreBudgetPlans: builder.query<any, null>({
      query: () => 'pre-budget-plans/get-with-app',
      providesTags: ['pre-budget-plan'],
    }),
    getPreBudgetPlan: builder.query<any, string>({
      query: (id: string) => `pre-budget-plans/${id}`,
    }),
    approvePreBudget: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `pre-budget-plans/initiate-workflow`,
        method: 'POST',
        body: { name: 'preBudgetApproval', id: id },
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
    createPreActivityTimeline: builder.mutation<any, any[]>({
      query: (timeline: any[]) => ({
        url: `pre-budget-plan-timelines/bulk-create`,
        method: 'POST',
        body: { timeline },
      }),
      invalidatesTags: ['pre-budget-timeline'],
    }),
    getPreBudgetTimeline: builder.query<any, string>({
      query: (id: string) => `pre-budget-plan-timelines/list/${id}`,
      providesTags: ['pre-budget-timeline'],
    }),
    getPreBudgetRequisitioner: builder.query<any, string>({
      query: (id: string) => `pre-budget-requisitioner/list/${id}`,
      providesTags: ['pre-budget-requisitioner'],
    }),

    createPreBudgetRequisitioner: builder.mutation<any, any>({
      query: (data) => ({
        url: 'pre-budget-requisitioner/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pre-budget-requisitioner'],
    }),
  }),
});

export const {
  useLazyGetPreBudgetTimelineQuery,
  useCreatePreBudgetRequisitionerMutation,
  useLazyGetPreBudgetRequisitionerQuery,
  useGetPreBudgetPlansQuery,
  useLazyGetPreBudgetPlansQuery,
  useCreateMultipleItemsMutation,
  useApprovePreBudgetMutation,
  useCreateAppMutation,
  useCreatePreActivityTimelineMutation,
  useGetPreBudgetPlanQuery,
} = preBudgetPlanApi;
