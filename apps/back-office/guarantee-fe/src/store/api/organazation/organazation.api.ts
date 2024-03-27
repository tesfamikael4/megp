import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_IAM_API ?? '/organizations/api';

export const organazationApi = createApi({
  reducerPath: 'organizations',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    organizations: builder.query({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/organizations${q}`,
          method: 'GET',
        };
      },
    }),
    getOrganazation: builder.query<any, string>({
      query: (id) => `organizations/${id}`,
    }),
  }),
});

export const {
  useOrganizationsQuery,
  useLazyOrganizationsQuery,
  useGetOrganazationQuery,
  useLazyGetOrganazationQuery,
} = organazationApi;
