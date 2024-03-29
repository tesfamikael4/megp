import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const postBudgetPlanApi = createApi({
  reducerPath: 'postBudgetPlanApi',
  tagTypes: [
    'post-budget-plan',
    'post-budget-timeline',
    'post-budget-requisitioner',
    'post-budget-disbursement',
    'post-budget-activity-files',
  ],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    getPostBudgetPlans: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `post-budget-plans/get-with-app${q}`, method: 'GET' };
      },
      providesTags: ['post-budget-plan'],
    }),
    getPostBudgetPlan: builder.query<any, string>({
      query: (id: string) => `post-budget-plans/${id}`,
      providesTags: ['post-budget-plan'],
    }),
    approvePostBudget: builder.mutation<any, any>({
      query: (data: { id: string; itemName: string }) => ({
        url: `post-budget-plans/initiate-workflow`,
        method: 'POST',
        body: { name: 'postBudgetApproval', ...data },
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
    getPostBudgetRequisitioner: builder.query<any, string>({
      query: (id: string) => `post-budget-requisitioner/list/${id}`,
      providesTags: ['post-budget-requisitioner'],
    }),

    createPostBudgetRequisitioner: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budget-requisitioner/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['post-budget-requisitioner'],
    }),

    getPostBudgetDisbursement: builder.query<any, string>({
      query: (id: string) => `post-budge-plan-disbursements/list/${id}`,
      providesTags: ['post-budget-disbursement'],
    }),

    createPostBudgetDisbursement: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budge-plan-disbursements/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['post-budget-disbursement'],
    }),
    getPostBudgetPlanAnalytics: builder.query<any, string>({
      query: (id: string) => `post-budget-plans/get-analytics/${id}`,
      providesTags: ['post-budget-plan'],
    }),
    getPostBudgetPlanReport: builder.query<any, string>({
      query: (id: string) => `post-budget-plans/get-report/${id}`,
      providesTags: ['post-budget-plan'],
    }),

    addBudget: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budget-plan-activities/add-budget',
        method: 'POST',
        body: data,
      }),
    }),
    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budget-activity-documents/pre-signed-put-url',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['post-budget-activity-files'],
    }),
    deleteDocument: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `post-budget-activity-documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['post-budget-activity-files'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `post-budget-activity-documents/download/${id}`,
      }),
      providesTags: ['post-budget-activity-files'],
    }),
  }),
});

export const {
  useLazyGetPostBudgetRequisitionerQuery,
  useCreatePostBudgetRequisitionerMutation,
  useCreatePostBudgetDisbursementMutation,
  useLazyGetPostBudgetDisbursementQuery,

  useLazyGetPostBudgetPlansQuery,
  useGetPostBudgetPlansQuery,
  useCreateMultipleItemsMutation,
  useApprovePostBudgetMutation,
  useCreatePostActivityTimelineMutation,
  useGetPostBudgetPlanQuery,
  useLazyGetPostBudgetTimelineQuery,
  useLazyGetPostBudgetPlanAnalyticsQuery,
  useAddBudgetMutation,
  useGetPostBudgetPlanReportQuery,
  useLazyGetPostBudgetPlanReportQuery,
  usePreSignedUrlMutation,
  useDeleteDocumentMutation,
  useLazyDownloadFilesQuery,
} = postBudgetPlanApi;
