import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const adressApi = createApi({
  reducerPath: 'adressApi',
  tagTypes: ['adress'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/'),
  endpoints: () => ({}),
});
