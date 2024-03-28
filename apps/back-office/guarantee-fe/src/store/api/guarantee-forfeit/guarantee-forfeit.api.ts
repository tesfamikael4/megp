import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL =
  process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/';

export const forfeitApi = createApi({
  reducerPath: 'guarantee-forfeits',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getGuranateeForfeits: builder.query<any, string>({
      query: (id) => `guarantee-forfeits/list/${id}`,
    }),
  }),
});

export const {
  useLazyGetGuranateeForfeitsQuery,
  useGetGuranateeForfeitsQuery,
} = forfeitApi;
