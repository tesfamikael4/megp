import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rmsApi = createApi({
  reducerPath: 'rmsApi',
  tagTypes: ['rms'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RMS_API ?? '/rms/api/'),
  endpoints: (builder) => ({
    getTendersAndRFXs: builder.query<any, CollectionQuery>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/tender-notices${q}`,
          method: 'GET',
        };
      },
      providesTags: ['rms'],
    }),
    getRFX: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/tenders/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['rms'],
    }),
  }),
});

export const {
  useGetTendersAndRFXsQuery,
  useLazyGetTendersAndRFXsQuery,
  useGetRFXQuery,
} = rmsApi;
