import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Service } from '@/models/service';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_VENDOR_API ?? '/api/vendors',
  }),
  endpoints: (builder) => ({
    getServices: builder.query<any, null>({
      query: () => 'bp-services/get-services',
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
