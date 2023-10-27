import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const URL = process.env.NEXT_PUBLIC_VENDOR_API;
export const vendorRegistrationApi = createApi({
  reducerPath: 'vendorRegistration',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  endpoints: () => ({}),
});

const URL2 = process.env.NEXT_PUBLIC_VENDOR_DATA_GETAWAY_API;
export const vendorDataGetawayApi = createApi({
  reducerPath: 'vendorDataGetaway',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: URL2,
  }),
  endpoints: () => ({}),
});
