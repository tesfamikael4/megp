import { baseQuery } from '@/store/base-query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { encodeCollectionQuery } from '@megp/entity';
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
  }),
});

export const unitApi = createApi({
  reducerPath: 'units',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getUintById: builder.query<any, string>({
      query: (id) => `unit/list/${id}`,
    }),
  }),
});

export const { useGetUintByIdQuery, useLazyGetUintByIdQuery } = unitApi;
export const { useOrganizationsQuery, useLazyOrganizationsQuery } =
  organazationApi;
