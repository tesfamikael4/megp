import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const technicalEndorsement = createApi({
  reducerPath: 'technicalEndorsement',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['endorsement'],
  endpoints: (builder) => ({
    getLots: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `technical-endorsement/get-lots${q}`,
        };
      },
    }),
  }),
});

export const { useLazyGetLotsQuery } = technicalEndorsement;
