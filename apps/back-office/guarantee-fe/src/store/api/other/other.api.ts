import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const otherApi = createApi({
  reducerPath: 'otherApi',
  tagTypes: ['other'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_PLANNING_API ?? '/'),
  endpoints: () => ({}),
});
