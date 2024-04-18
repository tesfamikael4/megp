import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getRegistrationApi = createApi({
  reducerPath: 'getRegistrationApi',
  tagTypes: ['bid-registration'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    registrations: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/bid-registrations/my-registered-bids/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-registration'],
    }),
    tenderDetail: builder.query<any, any>({
      query: (id: string) => {
        let q = '';
        return {
          url: `/tenders/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-registration'],
    }),
    getAllLots: builder.query<any, any>({
      query: (id: string) => {
        let q = '';
        return {
          url: `/lots/list/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-registration'],
    }),

    getLot: builder.query<any, any>({
      query: (id: string) => {
        let q = '';
        return {
          url: `/lots/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-registration'],
    }),
    getLots: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/lots/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-registration'],
    }),
  }),
});

export const {
  useLazyRegistrationsQuery,
  useTenderDetailQuery,
  useGetAllLotsQuery,
  useLazyGetAllLotsQuery,
  useGetLotQuery,
  useLazyGetLotQuery,
  useLazyGetLotsQuery,
} = getRegistrationApi;
