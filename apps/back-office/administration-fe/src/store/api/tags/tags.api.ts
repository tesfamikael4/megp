import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config/env';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl: config.ENV_ADMINISTRATION_API ?? '/administration/api/',
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
