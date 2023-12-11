import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const classificationApi = createApi({
  reducerPath: 'classificationApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getClassifications: builder.query<any, null>({
      query: () => 'classifications/children',
    }),
    getClassificationPath: builder.query<any, any>({
      query: ({ code }) => ({
        url: `classifications/path/${code}`,
      }),
    }),
  }),
});

export const { useGetClassificationsQuery, useGetClassificationPathQuery } =
  classificationApi;
