import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getTags: builder.query<any, null>({
      query: () => 'tags',
    }),
    getTagsByItemMaster: builder.query<any, any>({
      query: (id: string) => `extra-item-tags/list/${id}`,
    }),
  }),
});

export const { useGetTagsQuery, useLazyGetTagsByItemMasterQuery } = tagsApi;
