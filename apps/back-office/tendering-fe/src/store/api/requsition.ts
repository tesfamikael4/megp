import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postBudgetPlanApi = createApi({
  reducerPath: 'postBudgetPlanApi',
  tagTypes: [
    'post-budget-plan',
    'post-budget-timeline',
    'post-budget-requisitioner',
    'post-budget-disbursement',
  ],
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  }),
  endpoints: (builder) => ({
    getPostBudgetRequisitioner: builder.query<any, string>({
      query: (id: string) => `post-budget-requisitioner/list/${id}`,
      providesTags: ['post-budget-requisitioner'],
    }),

    createPostBudgetRequisitioner: builder.mutation<any, any>({
      query: (data) => ({
        url: 'post-budget-requisitioner/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['post-budget-requisitioner'],
    }),
  }),
});

export const {
  useLazyGetPostBudgetRequisitionerQuery,
  useCreatePostBudgetRequisitionerMutation,
} = postBudgetPlanApi;
