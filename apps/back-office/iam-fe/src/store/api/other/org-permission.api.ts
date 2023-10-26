import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const orgPermissionApi = createApi({
  reducerPath: 'orgPermissionApi',
  tagTypes: ['mandates'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/'),
  endpoints: () => ({}),
});
