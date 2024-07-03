import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getRfxsApi = createApi({
  reducerPath: 'getRfxsApi',
  tagTypes: ['open-rfxs'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    getRfxItems: builder.query<
      any,
      { collectionQuery: CollectionQuery; id: string }
    >({
      query: ({ collectionQuery, id }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-items/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['open-rfxs'],
    }),
    getRfx: builder.query<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/rfxs/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['open-rfxs'],
    }),
  }),
});

export const { useLazyGetRfxItemsQuery, useGetRfxQuery } = getRfxsApi;
