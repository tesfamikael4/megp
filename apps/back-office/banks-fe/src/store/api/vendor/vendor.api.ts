import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const vendorApi = createApi({
  reducerPath: 'vendor-registrations',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getVendor: builder.query<any, string>({
      query: (id) => `vendor-registrations/get-approved-vendor-byId/${id}`,
    }),
  }),
});

export const { useGetVendorQuery, useLazyGetVendorQuery } = vendorApi;
