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
  }),
});

export const { useLazyGetReAdvertTenderQuery } = readvertTendersApi;
