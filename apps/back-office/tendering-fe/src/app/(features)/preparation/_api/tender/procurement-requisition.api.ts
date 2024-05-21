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
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/procurement-requisitions/get-procurement-requisitions-for-tenders${q}`,
          method: 'GET',
        };
      },
      providesTags: ['procurement-requisition'],
    }),
  }),
});

export const { useLazyGetApprovedPRQuery } = procurementRequisitionApi;
