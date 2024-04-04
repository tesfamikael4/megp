import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const publicVendorsApi = createApi({
  reducerPath: 'publicVendorsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getVendorsList: builder.query<any, any>({
      query: () => `vendors/vendor-list?q=approved`,
    }),
    getVendorByID: builder.query<any, { vendorId: string }>({
      query: ({ vendorId }) => `vendors/get-vendor-detail/${vendorId}`,
    }),
  }),
});

export const {
  useGetVendorByIDQuery,
  useGetVendorsListQuery,
  useLazyGetVendorsListQuery,
  useLazyGetVendorByIDQuery,
} = publicVendorsApi;
