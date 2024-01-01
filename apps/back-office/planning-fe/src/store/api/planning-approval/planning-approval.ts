import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';

export const planningApprovalApi = createApi({
  reducerPath: 'planningApi',
  tagTypes: ['Steps', 'Approval'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    'https://dev-bo.megp.peragosystems.com/workflow/api' ?? '',
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
      query: (payload) => `instance/${payload.activityId}`,
      providesTags: ['Approval'],
    }),
    approve: builder.mutation<any, any>({
      query: (data) => ({
        url: `workflow/approve-workflow`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Approval'],
    }),
    goTo: builder.mutation<any, any>({
      query: (data) => ({
        url: `instance/goto`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Approval'],
    }),
  }),
});

export const {
  useGetStepsQuery,
  useCreateStepsMutation,
  useInitiateWorkflowMutation,
  useApproveMutation,
  useGetCurrentStepQuery,
  useGetDefaultStepsQuery,
  useGoToMutation,
} = planningApprovalApi;
