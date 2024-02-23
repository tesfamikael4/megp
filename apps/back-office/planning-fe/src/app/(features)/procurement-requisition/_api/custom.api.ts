import { baseQuery } from '@/store/base-query';
import { CollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const customApi = createApi({
  reducerPath: 'customApi',
  tagTypes: ['pr', 'procurement-requisition-items', 'items', 'mechanism'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    createActivity: builder.mutation<any, any>({
      query: (data) => ({
        url: `procurement-requisition-activities`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pr'],
    }),

    listPrActivity: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => ({
        url: `procurement-requisition-activities/list/${id}`,
        method: 'GET',
      }),
      providesTags: ['pr'],
    }),

    listMechanismById: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => ({
        url: `procurement-requisition-mechanisms/list/${id}`,
        method: 'GET',
      }),
      providesTags: ['pr'],
    }),
    // listprById: builder.query<
    //   any,
    //   { id: string; collectionQuery: CollectionQuery | undefined }
    // >({
    //   query: ({ id, collectionQuery }) => ({
    //     url: `procurement-requisition-mechanisms/list/${id}`,
    //     method: 'GET',
    //     // body: data,
    //   }),
    //   providesTags: ['pr'],
    // }),
    createMechanism: builder.mutation<any, any>({
      query: (data) => ({
        url: `procurement-requisition-mechanisms`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['mechanism'],
    }),

    updateMechanism: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `procurement-requisition-mechanisms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['mechanism'],
    }),
    listItemById: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => ({
        url: `procurement-requisition-items/list/${id}`,
        method: 'GET',
      }),
      providesTags: ['pr', 'items'],
    }),

    createItem: builder.mutation<any, any>({
      query: (data) => ({
        url: `procurement-requisition-items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['items'],
    }),
    createPrFromPlan: builder.mutation<any, any>({
      query: (data) => ({
        url: `procurement-requisitions/pr-from-app`,
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['pr'],
    }),
  }),
});

export const {
  useCreateActivityMutation,
  useListItemByIdQuery,
  useLazyListItemByIdQuery,
  useLazyListMechanismByIdQuery,
  useCreateMechanismMutation,
  useCreatePrFromPlanMutation,
  useUpdateMechanismMutation,

  useLazyListPrActivityQuery,
  useCreateItemMutation,
  useListPrActivityQuery,
} = customApi;
