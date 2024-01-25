import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetApi = createApi({
  reducerPath: 'budgetYearApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getBudgetYear: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `procurement-requisition-activities/annualProcurementPlan${q}`,
          method: 'GET',
        };
      },
    }),
    getActivities: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `procurement-requisition-activities/annualProcurementPlanActivities/${id}${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetBudgetYearQuery,
  useLazyGetBudgetYearQuery,
  useLazyGetActivitiesQuery,
  useGetActivitiesQuery,
} = budgetApi;
