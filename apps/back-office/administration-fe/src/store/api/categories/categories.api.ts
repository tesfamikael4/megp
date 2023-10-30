import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://staging.megp.peragosystems.com/administration/api/',
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<any, null>({
      query: () => 'item-Categories/get-trees',
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
