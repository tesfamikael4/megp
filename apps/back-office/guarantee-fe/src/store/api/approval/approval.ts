import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';
// const URL = process.env.NEXT_PUBLIC_IAM_API ?? '/infrastructure/api';

export const guaranteeApprovalApi = createApi({
  reducerPath: 'guaranteeApi',
  tagTypes: ['Steps', 'Approval'],
  refetchOnFocus: true,
  // baseQuery: baseQuery(URL),
  baseQuery: baseQuery(
    'https://dev-bo.megp.peragosystems.com/infrastructure/api' ??
      '/infrastructure/api',
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
} = guaranteeApprovalApi;
