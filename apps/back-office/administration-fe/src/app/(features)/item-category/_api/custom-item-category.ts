import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getParentApi = createApi({
  reducerPath: 'getParentApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    getParent: builder.query<any, any>({
      query: () => ({
        url: 'item-categories',
      }),
    }),
    getACategory: builder.query<any, string>({
      query: (id) => ({
        url: `item-categories/${id}`,
      }),
    }),
  }),
});

export const {
    useLazyGetParentQuery,
    useLazyGetACategoryQuery
} = getParentApi;
