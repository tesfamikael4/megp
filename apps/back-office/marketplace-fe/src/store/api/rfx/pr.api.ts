import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const prApi = createApi({
  reducerPath: 'prApi',
  refetchOnFocus: true,
  tagTypes: ['pr'],
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    listPRs: builder.query<any, CollectionQuery>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `procurement-requisitions/get-procurement-requisitions-for-marketplace${q}`,
        };
      },
    }),
  }),
});

export const { useLazyListPRsQuery } = prApi;
