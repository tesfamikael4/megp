import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';

export const approvedRejectedApi = createApi({
  reducerPath: 'approvedRejectedApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'),
  endpoints: (builder) => ({
    getVendors: builder.query<
      { items: any[]; total: number },
      CollectionQuery | undefined
    >({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `application-execution/get-vendors${q}`,
          method: 'GET',
        };
      },
    }),
    getVendorDetail: builder.query<any, { vendorId: string }>({
      query: ({ vendorId }) =>
        `application-execution/get-vendor-detail/${vendorId}`,
    }),
    getRejectedVendorList: builder.query<any, CollectionQuery | undefined>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }

        return {
          url: `application-execution/get-rejected-vendors${q}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        return {
          items: response?.items.map((vendor) => ({
            ...vendor,
            ...vendor.basic,
          })),
          total: response.total,
        };
      },
    }),
    getRejectedApplicationDetail: builder.query<any, { vendorId: string }>({
      query: ({ vendorId }) =>
        `application-execution/get-vendor-detail/${vendorId}`,
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorDetailQuery,
  useLazyGetVendorsQuery,
  useGetRejectedVendorListQuery,
  useLazyGetRejectedVendorListQuery,
  useLazyGetVendorDetailQuery,
  useLazyGetRejectedApplicationDetailQuery,
} = approvedRejectedApi;
