import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* Instruments */
const URL = process.env.NEXT_PUBLIC_VENDOR_API;
export const renewalSlice = createApi({
    reducerPath: 'renewalRequestApi',
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
    }),
    endpoints: () => ({}),
});