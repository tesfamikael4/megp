import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';
export const administrationApi = createApi({
  reducerPath: 'administrationApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    getRegions: builder.query<any, any>({
      query: () => 'regions',
    }),
    getDistricts: builder.query<any, string>({
      query: (id: string) => `districts/list/${id}`,
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
  useGetRegionsQuery,
  useLazyGetRegionsQuery,
} = administrationApi;
