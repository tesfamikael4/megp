import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const taxonomiesApi = createApi({
  reducerPath: 'taxonomiesApi',
  tagTypes: ['taxonomies'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/'),
  endpoints: (build) => ({
    createTaxonomies: build.mutation({
      query: (body) => ({
        url: `taxonomies`,
        body,
        method: 'POST',
      }),
    }),
  }),
});

export const { useCreateTaxonomiesMutation } = taxonomiesApi;
