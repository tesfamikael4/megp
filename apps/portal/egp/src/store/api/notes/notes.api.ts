// import entityApi from '@/store/entity/api';
import { baseQuery } from '@/store/base-query';
import {
  CollectionQuery,
  createEntitySlice,
  encodeCollectionQuery,
  EntitySliceApi,
} from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? '/organizations/api';

export const noteSliceApi = createApi({
  reducerPath: 'notesApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    list: builder.query<any, CollectionQuery>({
      query: (q) => {
        const query = encodeCollectionQuery(q);
        return {
          url: `notes?q=${query}`,
        };
      },
    }),
    create: builder.mutation({
      query: (body) => ({
        url: `notes`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useListQuery, useLazyListQuery, useCreateMutation } =
  noteSliceApi;
