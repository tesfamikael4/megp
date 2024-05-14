import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/';

export const guaranteeApi = createApi({
  reducerPath: 'guarantee-requests',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getGuarantees: builder.query({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/bid-guarantees/fetch-bid-guarantees${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetGuaranteesQuery, useLazyGetGuaranteesQuery } =
  guaranteeApi;
