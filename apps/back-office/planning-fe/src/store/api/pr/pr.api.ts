import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const prApi = createApi({
  reducerPath: 'prApi',
  tagTypes: ['items', 'timelines', 'requisitioner', 'pr'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    createMultipleItems: builder.mutation<any, any>({
      query: (data) => ({
        url: 'procurement-requisition-items/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['items', 'pr'],
    }),

    createPrTimeline: builder.mutation<any, any[]>({
      query: (data: any[]) => ({
        url: `procurement-requisition-timelines/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['timelines'],
    }),

    getPrTimeline: builder.query<any, any>({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/procurement-requisition-timelines/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),

    getPrItems: builder.query<any, any>({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/procurement-requisition-items/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    deleteItem: builder.mutation<any, any>({
      query: (id) => ({
        url: `procurement-requisition-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['items'],
    }),
    updateItem: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `procurement-requisition-items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['items'],
    }),
    getSubmittedPr: builder.query<any, any>({
      query: (itemId: string) => `documents/getDocumentByItemId/${itemId}`,
    }),

    createRequisitioner: builder.mutation<any, any>({
      query: (data) => ({
        url: `Procurement-requisition-technical-teams/bulk-assign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['requisitioner'],
    }),
    getRequisitioner: builder.query<any, string>({
      query: (id: string) =>
        `Procurement-requisition-technical-teams/list/${id}`,
    }),
    approvePr: builder.mutation<any, any>({
      query: (data: { id: string; itemName: string }) => ({
        url: `procurement-requisitions/initiate-workflow`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pr'],
    }),
    read: builder.query<any, any>({
      query: (id) => ({
        url: `procurement-requisitions/${id}`,
        method: 'GET',
      }),
      providesTags: ['pr'],
    }),
    getAnalytics: builder.query<any, string>({
      query: (key) => ({
        url: `/procurement-requisitions/get-analytics/${key}`,
        method: 'GET',
      }),
    }),
    getBudget: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/procurement-requisitions/get-current-budgets${q}`,
          method: 'GET',
        };
      },
    }),
    getTargetGroup: builder.query<any, any>({
      query: (id) => ({
        url: `procurement-requisitions/${id}/target-group-percentage`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateMultipleItemsMutation,
  useCreatePrTimelineMutation,
  useGetPrTimelineQuery,
  useLazyGetPrTimelineQuery,
  useGetPrItemsQuery,
  useLazyGetPrItemsQuery,
  useDeleteItemMutation,
  useUpdateItemMutation,
  useGetSubmittedPrQuery,
  useLazyGetSubmittedPrQuery,
  useCreateRequisitionerMutation,
  useGetRequisitionerQuery,
  useLazyGetRequisitionerQuery,

  useApprovePrMutation,
  useReadQuery,
  useLazyReadQuery,

  useGetAnalyticsQuery,
  useLazyGetAnalyticsQuery,
  useLazyGetTargetGroupQuery,

  useGetBudgetQuery,
  useLazyGetBudgetQuery,
} = prApi;
