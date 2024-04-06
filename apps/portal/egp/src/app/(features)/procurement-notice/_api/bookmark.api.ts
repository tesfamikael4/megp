import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const bookmarkApi = createApi({
  reducerPath: 'bookmarkApi',
  tagTypes: ['bookmark'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    bookmark: builder.mutation<any, any>({
      query: (data: { tenderId: string }) => ({
        url: `bid-bookmarks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bookmark'],
    }),
  }),
});

export const { useBookmarkMutation } = bookmarkApi;
