import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Service } from '@/models/service';

export const measurementsApi = createApi({
  reducerPath: 'measurementsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://staging.megp.peragosystems.com/administration/api/',
  }),
  endpoints: (builder) => ({
    getMeasurements: builder.query<any, null>({
      query: () => 'measurements',
    }),
    getUnitOfMeasurements: builder.query<any, any>({
      query: (id) => `unit-of-measurements/list/${id}`,
    }),
  }),
});

export const { useGetMeasurementsQuery, useLazyGetUnitOfMeasurementsQuery } =
  measurementsApi;
