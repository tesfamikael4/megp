import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const measurementsApi = createApi({
  reducerPath: 'measurementsApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
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
