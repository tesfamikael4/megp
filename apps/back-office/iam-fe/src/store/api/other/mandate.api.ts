import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const mandateApi = createApi({
  reducerPath: 'mandateApi',
  tagTypes: ['mandates'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/'),
  endpoints: () => ({}),
});
