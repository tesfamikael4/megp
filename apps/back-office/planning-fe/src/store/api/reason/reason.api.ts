import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const reasonApi = createApi({
  reducerPath: 'reasonApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/planning/api/',
  ),
  endpoints: (builder) => ({
    addJustification: builder.mutation<any, any>({
      query: (data) => ({
        url: `reasons`,
        method: 'POST',
        body: data,
      }),
    }),
    getJustification: builder.query<any, string>({
      query: (id) => `reasons/${id}`,
    }),
  }),
});

export const { useAddJustificationMutation, useLazyGetJustificationQuery } =
  reasonApi;
