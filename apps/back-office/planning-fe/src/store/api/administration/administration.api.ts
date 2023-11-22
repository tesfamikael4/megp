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
  }),
});

export const { useGetItemMasterQuery, useLazyGetUnitOfMeasurementsQuery } =
  administrationApi;
