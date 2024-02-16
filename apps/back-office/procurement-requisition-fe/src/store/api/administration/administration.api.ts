import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const administrationApi = createApi({
  reducerPath: 'administrationApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PROCUREMENT_REQUISITION_API ??
      '/procurement-requisition/api/',
  ),

  endpoints: (builder) => ({
    getItemMaster: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `item-masters${q}`, method: 'GET' };
      },
    }),
    getMeasurements: builder.query<any, null>({
      query: () => 'measurements',
    }),
    getUnitOfMeasurements: builder.query<any, string>({
      query: (id: string) => `extra-unit-of-measurements/list/${id}`,
    }),
    readUnitOfMeasurements: builder.query<any, string>({
      query: (id: string) => `extra-unit-of-measurements/${id}`,
    }),
    getTags: builder.query<any, null>({
      query: () => `tags`,
    }),
    getCategories: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `item-categories${q}`, method: 'GET' };
      },
    }),
    getClassifications: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `classifications${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetItemMasterQuery,
  useLazyGetItemMasterQuery,
  useLazyGetUnitOfMeasurementsQuery,
  useReadUnitOfMeasurementsQuery,
  useGetUnitOfMeasurementsQuery,
  useGetClassificationsQuery,
  useLazyGetClassificationsQuery,
  useGetTagsQuery,
  useGetMeasurementsQuery,
  useGetCategoriesQuery,
} = administrationApi;
