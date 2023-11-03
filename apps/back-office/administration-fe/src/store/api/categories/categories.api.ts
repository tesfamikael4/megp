import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config/env';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://dev-bo.megp.peragosystems.com/administration/api/',
    baseUrl: config.ENV_ADMINISTRATION_API ?? '/administration/api/',
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<any, null>({
      query: () => 'item-Categories/get-trees',
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
