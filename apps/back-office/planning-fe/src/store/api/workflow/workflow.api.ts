import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    // baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
    'https://dev-bo.megp.peragosystems.com/workflow/api/',
  ),
  endpoints: (builder) => ({
    getWorkflowInstance: builder.query<any, string>({
      query: (id: string) => `instance/${id}`,
    }),
  }),
});

export const { useGetWorkflowInstanceQuery } = workflowApi;
