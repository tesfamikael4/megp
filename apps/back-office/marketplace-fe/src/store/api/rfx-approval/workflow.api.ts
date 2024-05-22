import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  tagTypes: ['Approval'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/infrastructure/api/',
  ),
  endpoints: (builder) => ({
    getWorkflowInstance: builder.query<any, string>({
      query: (id: string) => `instance/${id}`,
    }),
    getNotes: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `notes/${q}`, method: 'GET' };
      },
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
    getCurrentWorkflowInstance: builder.query<
      any,
      { key: string; itemId: string }
    >({
      query: (data) => ({
        url: `instance/findCurrentInstanceByItemId/${data.key}/${data.itemId}`,
        method: 'GET',
      }),
      providesTags: ['Approval'],
    }),
    getSteps: builder.query<any, { key: string; itemId: string }>({
      query: (data) => ({
        url: `instance-steps/order-steps/${data.key}/${data.itemId}`,
        method: 'GET',
      }),
      providesTags: ['Approval'],
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
  useApproveMutation,
  useGoToMutation,
  useLazyGetNotesQuery,
  useGetNotesQuery,
} = workflowApi;
