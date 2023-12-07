import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetsApi = createApi({
  reducerPath: 'budgetsApi',
  tagTypes: ['budgets'],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    bulkCreate: builder.mutation<any, any>({
      query: (data) => ({
        url: 'budgets/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['budgets'],
    }),
  }),
});

export const { useBulkCreateMutation } = budgetsApi;
