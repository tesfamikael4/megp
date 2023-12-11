import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const administrationApi = createApi({
  reducerPath: 'administrationApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getItemMaster: builder.query<any, null>({
      query: () => 'item-masters',
    }),
    getUnitOfMeasurements: builder.query<any, null>({
      query: (id) => `extra-unit-of-measurements/list/${id}`,
    }),
    getClassifications: builder.query<any, null>({
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
  useLazyGetUnitOfMeasurementsQuery,
  useGetClassificationsQuery,
} = administrationApi;
