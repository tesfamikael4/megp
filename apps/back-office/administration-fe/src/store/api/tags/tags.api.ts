import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://staging.megp.peragosystems.com/administration/api/',
  }),
  endpoints: (builder) => ({
    getTags: builder.query<any, null>({
      query: () => 'tags',
    }),
  }),
});

export const { useGetTagsQuery } = tagsApi;
