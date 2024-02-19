import {
  GetForRenewalVendorResponse,
  PostForRenewalVendorRequest,
} from '@/models/vendorRegistration';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const vendorUpgradeApi = createApi({
  reducerPath: 'vendorUpgradeApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    requestUpgradeInvoice: builder.mutation<any, any>({
      query: (data) => ({
        url: `/invoices/generate-upgrade-invoice`,
        method: 'POST',
        body: data,
      }),
    }),
    getMyInvoice: builder.query<any, any>({
      query: () => `/invoices/get-my-upgrade-invoice`,
    }),
    getMyApprovedServices: builder.query<any, any>({
      query: () => `/vendor-registrations/get-my-approved-services`,
    }),
    uploadPaymentReceiptUpgrade: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        formData.append('attachmentUrl', data.file);
        formData.append('transactionNumber', data.transactionNumber);
        formData.append('invoiceIds', JSON.stringify(data.invoiceIds));
        return {
          url: `vendor-registrations/upgrade-service`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useRequestUpgradeInvoiceMutation,
  useGetMyInvoiceQuery,
  useLazyGetMyInvoiceQuery,
  useUploadPaymentReceiptUpgradeMutation,
  useGetMyApprovedServicesQuery,
} = vendorUpgradeApi;
