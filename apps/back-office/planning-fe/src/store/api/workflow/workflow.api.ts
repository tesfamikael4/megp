import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/infrastructure/api/',
    // 'https://dev-bo.megp.peragosystems.com/workflow/api/',
  ),
  endpoints: (builder) => ({
    getWorkflowInstance: builder.query<any, string>({
      query: (id: string) => `instance/${id}`,
    }),
    getActivities: builder.query<any, any>({
      query: () => `activities`,
    }),
  }),
});

export const { useGetWorkflowInstanceQuery, useGetActivitiesQuery } =
  workflowApi;
