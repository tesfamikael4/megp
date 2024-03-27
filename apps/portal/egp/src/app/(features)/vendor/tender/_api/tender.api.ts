import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getTendersApi = createApi({
  reducerPath: 'getTendersApi',
  tagTypes: ['active-tender'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getTenders: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/tenders/active-tenders/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['active-tender'],
    }),
  }),
});

export const { useGetTendersQuery } = getTendersApi;
