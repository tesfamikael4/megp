import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  tagTypes: [
    'pre-budget-plan-items',
    'pre-budget-plan',
    'post-budget-plan',
    'pre-budget-timeline',
    'pre-budget-requisitioner',
    'pre-budget-activity-files',
  ],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    getPreBudgetPlans: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `pre-budget-plans/get-with-app${q}`, method: 'GET' };
      },
      providesTags: ['pre-budget-plan'],
    }),
    getPreBudgetPlan: builder.query<any, string>({
      query: (id: string) => `pre-budget-plans/${id}`,
      providesTags: ['pre-budget-plan'],
    }),
    getPreBudgetPlanAnalytics: builder.query<any, string>({
      query: (id: string) => `pre-budget-plans/get-analytics/${id}`,
      providesTags: ['pre-budget-plan-items', 'pre-budget-plan'],
    }),
    approvePreBudget: builder.mutation<any, any>({
      query: (data: { id: string; itemName: string }) => ({
        url: `pre-budget-plans/initiate-workflow`,
        method: 'POST',
        body: { name: 'preBudgetApproval', ...data },
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
    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'pre-budget-activity-documents/pre-signed-put-url',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pre-budget-activity-files'],
    }),
    deleteDocument: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `pre-budget-activity-documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['pre-budget-activity-files'],
    }),

    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `pre-budget-activity-documents/list/${id}`,
      }),
      providesTags: ['pre-budget-activity-files'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `pre-budget-activity-documents/download/${id}`,
      }),
      providesTags: ['pre-budget-activity-files'],
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
  useLazyGetPreBudgetPlanAnalyticsQuery,
  usePreSignedUrlMutation,
  useDeleteDocumentMutation,
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
} = preBudgetPlanApi;
