import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const budgeCategoryApi = createApi({
  reducerPath: 'budegeCategoryApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/'),
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
