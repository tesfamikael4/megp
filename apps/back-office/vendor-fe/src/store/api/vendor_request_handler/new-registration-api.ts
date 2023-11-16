import { VendorRequests, Data } from './type';
import { VendorRequest } from './type';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQuery } from '@/store/base-query';

export const newRegistrationSlice = createApi({
  reducerPath: 'vendorRequestApi',
  refetchOnFocus: true,
  tagTypes: ['Tasks'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_VENDOR_API ?? '/'),
  endpoints: (builder) => ({
    getApplicationRequestDetailById: builder.query<any, VendorRequest>({
      query: (payload) => ({
        url: `api/application-execution/get-currunt-task-detail/${payload.instanceId}`,
        method: 'GET',
      }),
      providesTags: ['Tasks'],
    }),
    goToNextState: builder.mutation<any, any>({
      query: (data) => ({
        url: `api/workflow-instances/goto-next-state`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tasks'],
    }),
    getAllVendorRequests: builder.query<Data, VendorRequests>({
      query: (payload) => ({
        url: `api/application-execution/get-currunt-tasks/${payload.serviceKey}`,
        method: 'GET',
      }),
    }),
    getVendor: builder.query<any, { id: string }>({
      query: (payload) => ({
        url: `api/vendor-registrations/get-vendor-by-vendorId/${payload.id}`,
      }),
    }),
    getInvoice: builder.query({
      query: () => ({
        url: `api/application-execution/get-invoices`,
        method: 'GET',
      }),
    }),
    pickTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `api/application-execution/pick-task`,
        method: 'POST',
        body: data,
      }),
    }),
    unpickTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `api/application-execution/unpick-task`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllVendorRequestsQuery,
  useGetApplicationRequestDetailByIdQuery,
  useGetInvoiceQuery,
  useGoToNextStateMutation,
  usePickTaskMutation,
  useUnpickTaskMutation,
  useGetVendorQuery,
  useLazyGetVendorQuery,
} = newRegistrationSlice;
