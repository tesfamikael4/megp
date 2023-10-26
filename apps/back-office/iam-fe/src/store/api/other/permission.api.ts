import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  tagTypes: ['permissions'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/'),
  endpoints: () => ({}),
});
