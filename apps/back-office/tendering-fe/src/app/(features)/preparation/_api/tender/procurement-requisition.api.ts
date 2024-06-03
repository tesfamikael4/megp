import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const procurementRequisitionApi = createApi({
  reducerPath: 'procurementRequisitionApi',
  tagTypes: ['procurement-requisition'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    getApprovedPR: builder.query<any, any>({
      query: (args: {
        whereFrom: 'tender' | 'pr';
        collectionQuery: CollectionQuery;
      }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }

        return {
          url:
            args.whereFrom === 'tender'
              ? `/tenders/re-advertise-tenders${q}`
              : `/procurement-requisitions/get-procurement-requisitions-for-tenders${q}`,
          method: 'GET',
        };
      },
      providesTags: ['procurement-requisition'],
    }),
    getPRDetail: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/procurement-requisitions/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['procurement-requisition'],
    }),
    getAnalytics: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/procurement-mechanisms/list/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['procurement-requisition'],
    }),
  }),
});

export const {
  useLazyGetApprovedPRQuery,
  useLazyGetPRDetailQuery,
  useGetPRDetailQuery,
  useLazyGetAnalyticsQuery,
} = procurementRequisitionApi;

export const readvertTendersApi = createApi({
  reducerPath: 'readvertTendersApi',
  tagTypes: ['readvert-tender'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getReAdvertTender: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }

        return {
          url: `/tenders/re-advertise-tenders${q}`,
          method: 'GET',
        };
      },
      providesTags: ['readvert-tender'],
    }),
    createFromTender: builder.mutation<any, any>({
      query: (data: { id: string }) => ({
        url: `/tenders/re-advertise-tender`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['readvert-tender'],
    }),
    createFromLot: builder.mutation<any, any>({
      query: (data: { id: string; name: string }) => ({
        url: `/lots/re-advertise-lot`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['readvert-tender'],
    }),
    createFromItem: builder.mutation<any, any>({
      query: (data: { id: string; name: string }) => ({
        url: `/items/re-advertise-item`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['readvert-tender'],
    }),
  }),
});

export const {
  useLazyGetReAdvertTenderQuery,
  useCreateFromTenderMutation,
  useCreateFromLotMutation,
  useCreateFromItemMutation,
} = readvertTendersApi;
