import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    // process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api/',
    'https://dev-bo.megp.peragosystems.com/infrastructure/api/',
  ),
  endpoints: (builder) => ({
    getWorkflowInstance: builder.query<any, string>({
      query: (id: string) => `instance/${id}`,
    }),
    getCurrentWorkflowInstance: builder.query<any, any>({
      query: (data) => ({
        url: `instance/findCurrentInstanceByItemId`,
        method: 'GET',
        body: data,
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
} = workflowApi;
