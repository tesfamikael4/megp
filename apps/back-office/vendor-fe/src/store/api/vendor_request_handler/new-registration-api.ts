import { VendorRequests, Data } from './type';
import { VendorRequest } from './type';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';

export const newRegistrationSlice = createApi({
  reducerPath: 'vendorRequestApi',
  refetchOnFocus: true,
  tagTypes: ['Tasks'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'),
  endpoints: (builder) => ({
    getApplicationRequestDetailById: builder.query<any, VendorRequest>({
      query: (payload) => ({
        url: `application-execution/get-currunt-task-detail/${payload.instanceId}`,
        method: 'GET',
      }),
      providesTags: ['Tasks'],
    }),
    goToNextState: builder.mutation<any, any>({
      query: (data) => ({
        url: `application-execution/goto-next-step`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tasks'],
    }),
    getAllVendorRequests: builder.query<
      Data,
      VendorRequests & { collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ serviceKey, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;

          return {
            url: `application-execution/get-currunt-tasks/${serviceKey}${q}`,
            method: 'GET',
          };
        } else {
          return {
            url: `application-execution/get-currunt-tasks/${serviceKey}`,
            method: 'GET',
          };
        }
      },
      providesTags: ['Tasks'],
    }),
    getVendor: builder.query<any, { id: string }>({
      query: (payload) => ({
        url: `vendor-registrations/get-vendor-by-vendorId/${payload.id}`,
      }),
    }),
    getInvoice: builder.query({
      query: () => ({
        url: `application-execution/get-invoices`,
        method: 'GET',
      }),
    }),
    pickTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `application-execution/pick-task`,
        method: 'POST',
        body: data,
      }),
    }),
    unpickTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `application-execution/unpick-task`,
        method: 'POST',
        body: data,
      }),
    }),
    generateCertificate: builder.mutation<
      any,
      { vendorId: string; instanceId: string }
    >({
      query: (payload) => ({
        url: `certificates/generate-certeficate/${payload.vendorId}/${payload.instanceId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAllVendorRequestsQuery,
  useGetApplicationRequestDetailByIdQuery,
  useLazyGetAllVendorRequestsQuery,
  useGetInvoiceQuery,
  useGoToNextStateMutation,
  usePickTaskMutation,
  useUnpickTaskMutation,
  useGetVendorQuery,
  useLazyGetVendorQuery,
  useGenerateCertificateMutation,
} = newRegistrationSlice;
