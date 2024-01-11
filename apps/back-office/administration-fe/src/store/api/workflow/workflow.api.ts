import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'planningApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_WORKFLOW_API ?? '/workflow/api/',
    baseUrl: '/workflow/api/',
  }),
  endpoints: (builder) => ({
    getActivities: builder.query<any, { workFlowId: string }>({
      query: (payload) => `roles/list/${payload.workFlowId}`,
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
} = workflowApi;
