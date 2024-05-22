import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { encodeCollectionQuery } from '@megp/entity';
const URL =
  process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/';
export const itemMasterApi = createApi({
  reducerPath: 'itemMasterApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/item-masters${q}`,
          method: 'GET',
        };
      },
    }),
    getClassifications: builder.query({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/classifications${q}`,
          method: 'GET',
        };
      },
    }),
    readItem: builder.query({
      query: (id: string) => `/item-masters/${id}`,
    }),
  }),
});

export const {
  useReadItemQuery,
  useLazyReadItemQuery,
  useGetItemsQuery,
  useLazyGetItemsQuery,
  useGetClassificationsQuery,
  useLazyGetClassificationsQuery,
} = itemMasterApi;
