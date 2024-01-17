import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgeCategoryApi = createApi({
  reducerPath: 'budegeCategoryApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  }),
  endpoints: (builder) => ({
    getOrgType: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `organization-type/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetOrgTypeQuery, useLazyGetOrgTypeQuery } = budgeCategoryApi;
