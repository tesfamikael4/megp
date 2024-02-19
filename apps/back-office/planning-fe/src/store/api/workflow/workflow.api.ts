import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  tagTypes: ['Steps'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api/',
  ),
  endpoints: (builder) => ({
    getWorkflowInstance: builder.query<any, string>({
      query: (id: string) => `instance/${id}`,
    }),
    getCurrentWorkflowInstance: builder.query<
      any,
      { key: string; itemId: string }
    >({
      query: (data) => ({
        url: `instance/findCurrentInstanceByItemId/${data.key}/${data.itemId}`,
        method: 'GET',
      }),
    }),
    getSteps: builder.query<any, { key: string; itemId: string }>({
      query: (data) => ({
        url: `instance-steps/order-steps/${data.key}/${data.itemId}`,
        method: 'GET',
      }),
    }),

    getActivities: builder.query<any, any>({
      query: () => `activities`,
    }),
    canSubmit: builder.query<any, string>({
      query: (key: string) => `instance/canSubmit/${key}`,
    }),
  }),
});

export const {
  useGetWorkflowInstanceQuery,
  useGetActivitiesQuery,
  useLazyGetCurrentWorkflowInstanceQuery,
  useGetCurrentWorkflowInstanceQuery,
  useCanSubmitQuery,
  useLazyCanSubmitQuery,
  useGetStepsQuery,
  useLazyGetStepsQuery,
} = workflowApi;
