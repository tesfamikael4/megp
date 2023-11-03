import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config/env';

export const measurementsApi = createApi({
  reducerPath: 'measurementsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl: config.ENV_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getMeasurements: builder.query<any, null>({
      query: () => 'measurements',
    }),
    getUnitOfMeasurements: builder.query<any, any>({
      query: (id) => `extra-unit-of-measurements/list/${id}`,
    }),
  }),
});

export const { useGetMeasurementsQuery, useLazyGetUnitOfMeasurementsQuery } =
  measurementsApi;
