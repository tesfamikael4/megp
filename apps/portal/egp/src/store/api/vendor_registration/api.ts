import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const vendorRegistrationApi = createApi({
  reducerPath: 'vendorRegistration',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    cancelRegistration: builder.query({
      query: () => ({
        url: '/vendor-registrations/cancel-registration',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLazyCancelRegistrationQuery } = vendorRegistrationApi;

const URL2 = process.env.NEXT_PUBLIC_VENDOR_DATA_GETAWAY_API;
export const vendorDataGetawayApi = createApi({
  reducerPath: 'vendorDataGetaway',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL2),
  endpoints: () => ({}),
});
