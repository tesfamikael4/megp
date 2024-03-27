import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getBookmarkApi = createApi({
  reducerPath: 'getBookmarkApi',
  tagTypes: ['bid-bookmark'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    bookmarks: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/bid-bookmarks/my-bookmarks/${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-bookmark'],
    }),
  }),
});

export const { useLazyBookmarksQuery } = getBookmarkApi;
