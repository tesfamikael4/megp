import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';

export const planningApprovalApi = createApi({
  reducerPath: 'planningApi',
  tagTypes: ['Steps', 'Approval'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api',
  ),
  endpoints: (builder) => ({
    getDefaultSteps: builder.query<any, { activityId: string }>({
      query: (payload) => `default-steps/order/${payload.activityId}`,
      providesTags: ['Steps'],
    }),
    getSteps: builder.query<any, { activityId: string }>({
      query: (payload) => `steps/order-steps/${payload.activityId}`,
      providesTags: ['Steps'],
    }),
    createSteps: builder.mutation<any, any>({
      query: (data) => ({
        url: `steps/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Steps'],
    }),
    initiateWorkflow: builder.mutation<
      any,
      { name: string; activityId: string; id: string }
    >({
      query: (data) => ({
        url: `instance/initiate`,
        method: 'POST',
        body: data,
      }),
    }),
    getCurrentStep: builder.query<any, { activityId: string }>({
      query: (payload) => `findCurrentInstance/${payload.activityId}`,
      providesTags: ['Approval'],
    }),
  }),
});

export const {
  useCreateStepsMutation,
  useInitiateWorkflowMutation,
  useGetCurrentStepQuery,
  useGetDefaultStepsQuery,
  useGetStepsQuery,
} = planningApprovalApi;
