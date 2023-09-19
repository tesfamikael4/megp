/* Core */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* Instruments */

export const vendorRegistrationSlice = createApi({
  reducerPath: 'vendorRegistrationApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.8.122:3000/api/VendorRegistrations',
  }),
  // refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
});
