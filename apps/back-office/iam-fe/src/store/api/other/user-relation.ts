import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const userRelationApi = createApi({
  reducerPath: 'userRelationApi',
  tagTypes: ['userUnit', 'userRoles', 'userGroup'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/'),
  endpoints: () => ({}),
});
