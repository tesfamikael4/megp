import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getTenderSpdApi = createApi({
  reducerPath: 'getTenderSpdApi',
  tagTypes: ['tender-spd'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    tenderSpd: builder.query<any, any>({
      query: (tenderId: string) => {
        let q = '';
        return {
          url: `/tender-spd/${tenderId}`,
          method: 'GET',
        };
      },
      providesTags: ['tender-spd'],
    }),
  }),
});

export const { useTenderSpdQuery } = getTenderSpdApi;
