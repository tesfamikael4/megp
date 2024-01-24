import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'planningApi',
  refetchOnFocus: true,
  tagTypes: ['Steps', 'activity', 'Activities'],
  baseQuery: baseQuery(
    // baseUrl: process.env.NEXT_PUBLIC_WORKFLOW_API ?? '/workflow/api/',
    process.env.NEXT_PUBLIC_WORKFLOW_API ?? '/infrastructure/api/',
  ),
  endpoints: (builder) => ({
    getActivities: builder.query<any, { workFlowId: string }>({
      query: (payload) => `roles/list/${payload.workFlowId}`,
    }),
    addActivity: builder.mutation<any, any>({
      query: (data) => ({
        url: `activities`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['activity', 'Activities'],
    }),
    createSteps: builder.mutation<any, any>({
      query: (data) => ({
        url: `steps/bulk-create`,
        method: 'POST',
        body: data,
      }),
    }),
    createDefaultSteps: builder.mutation<any, any>({
      query: (data) => ({
        url: `default-steps/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Steps'],
    }),
    getDefaultSteps: builder.query<any, { activityId: string }>({
      query: (payload) => `default-steps/order/${payload.activityId}`,
      providesTags: ['Steps'],
    }),
    getSteps: builder.query<any, { activityId: string }>({
      query: (payload) => `steps/list/${payload.activityId}`,
    }),
    addPermissions: builder.mutation<any, any>({
      query: (data) => ({
        url: `permissions/bulk-create`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyGetActivitiesQuery,
  useCreateStepsMutation,
  useCreateDefaultStepsMutation,
  useAddPermissionsMutation,
  useGetDefaultStepsQuery,
  useAddActivityMutation,
} = workflowApi;
