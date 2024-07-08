import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderApi = createApi({
  reducerPath: 'tenderApi',
  tagTypes: ['tenders'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    listTenders: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/tenders/get-tenders-as-team-member/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['tenders'],
    }),
    detailTender: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/tenders/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['tenders'],
    }),
  }),
});

export const { useLazyListTendersQuery, useDetailTenderQuery } = tenderApi;
