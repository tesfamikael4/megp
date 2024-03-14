import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const prApi = createApi({
  reducerPath: 'prApi',
  tagTypes: ['items', 'timelines', 'requisitioner'],
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
      invalidatesTags: ['items'],
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
  }),
});

export const {
  useCreateMultipleItemsMutation,
  useCreatePrTimelineMutation,
  useGetPrTimelineQuery,
  useLazyGetPrTimelineQuery,
  useGetPrItemsQuery,
  useLazyGetPrItemsQuery,
  useGetSubmittedPrQuery,
  useLazyGetSubmittedPrQuery,
  useCreateRequisitionerMutation,
  useGetRequisitionerQuery,
  useLazyGetRequisitionerQuery,
} = prApi;
