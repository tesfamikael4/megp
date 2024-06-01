import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';
export const administrationApi = createApi({
  reducerPath: 'administrationApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    getItemMaster: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        // return { url: `item-metadata/items${q}`, method: 'GET' };
        return { url: `item-masters${q}`, method: 'GET' };
      },
    }),
    getMeasurements: builder.query<any, null>({
      query: () => 'measurements',
    }),
    getUnitOfMeasurements: builder.query<any, string>({
      query: (id: string) => `extra-unit-of-measurements/list/${id}`,
    }),
    getTags: builder.query<any, null>({
      query: () => `tags`,
    }),
    getCurrencies: builder.query<any, null>({
      query: () => `currencies`,
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
      query: (collectionQuery: CollectionQuery) => {
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
    getClassificationPath: builder.query<any, any>({
      query: (code) => `classifications/path/${code}`,
    }),
    getDonors: builder.query<any, any>({
      query: () => `donors`,
    }),
    readDonor: builder.query<any, string>({
      query: (id) => `donors/${id}`,
    }),
  }),
});

export const {
  useGetItemMasterQuery,
  useLazyGetItemMasterQuery,
  useLazyGetUnitOfMeasurementsQuery,
  useGetClassificationsQuery,
  useLazyGetClassificationsQuery,
  useGetTagsQuery,
  useGetMeasurementsQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetCurrenciesQuery,
  useLazyGetClassificationPathQuery,
  useGetClassificationPathQuery,
  useGetDonorsQuery,

  useLazyReadDonorQuery,
} = administrationApi;
