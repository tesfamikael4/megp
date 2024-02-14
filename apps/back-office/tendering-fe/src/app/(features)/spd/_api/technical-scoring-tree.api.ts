import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const technicalScoringTreeApi = createApi({
  reducerPath: 'technicalScoringTreeApi',
  tagTypes: ['spd-scoring-tree'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getTechnicalScoring: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `spd-technical-scoring${q}`,
          method: 'GET',
        };
      },
      providesTags: ['spd-scoring-tree'],
    }),
  }),
});

export const { useGetTechnicalScoringQuery, useLazyGetTechnicalScoringQuery } =
  technicalScoringTreeApi;
