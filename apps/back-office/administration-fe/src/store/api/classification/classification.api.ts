import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config/env';

export const classificationApi = createApi({
  reducerPath: 'classificationApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl: config.ENV_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getClassifications: builder.query<any, null>({
      query: () => 'classifications',
    }),
  }),
});

export const { useGetClassificationsQuery } = classificationApi;
