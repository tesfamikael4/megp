/* Core */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* Instruments */
const URL = process.env.NEXT_PUBLIC_VENDOR_API;
export const vendorRegistrationSlice = createApi({
  reducerPath: 'vendorRegistrationApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  endpoints: () => ({}),
});
