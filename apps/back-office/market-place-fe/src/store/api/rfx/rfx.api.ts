import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rfxApi = createApi({
  reducerPath: 'rfxApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api/'),
  endpoints: (builder) => ({
    getCatalogueItems: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfx-catalogue${q}` };
      },
    }),
  }),
});

export const { useLazyGetCatalogueItemsQuery } = rfxApi;
