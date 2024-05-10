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
      query: (args: { spdId; collectionQuery: CollectionQuery }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `spd-technical-scoring/list/${args.spdId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['spd-scoring-tree'],
    }),
  }),
});

export const { useGetTechnicalScoringQuery, useLazyGetTechnicalScoringQuery } =
  technicalScoringTreeApi;
