import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetApi = createApi({
  reducerPath: 'budgetYearApi',
  refetchOnFocus: true,
  tagTypes: ['pr-files'],
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
          url: `annual-procurement-plans${q}`,
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
          url: `annual-procurement-plan-activities/list/${id}${q}`,
          method: 'GET',
        };
      },
    }),
    upload: builder.mutation<any, any>({
      query: (data) => ({
        url: 'procurement-requisition-documents/upload',
        method: 'POST',
        body: data,
      }),
    }),

    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'procurement-requisition-documents/pre-signed-put-url',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['pr-files'],
    }),

    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `procurement-requisition-documents/list/${id}`,
      }),
      providesTags: ['pr-files'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `procurement-requisition-documents/download/${id}`,
      }),
      providesTags: ['pr-files'],
    }),
  }),
});

export const {
  useGetBudgetYearQuery,
  useLazyGetBudgetYearQuery,
  useLazyGetActivitiesQuery,
  useGetActivitiesQuery,
  useUploadMutation,
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} = budgetApi;
