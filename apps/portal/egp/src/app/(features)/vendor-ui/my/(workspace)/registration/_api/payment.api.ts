import {
  AreasOfBusinessInterestType,
  BankNamesResponse,
  GetActivitiesProgressResponse,
  LineOfBusinessResponse,
  PriceRangeResponse,
  RenewalInvoiceRenewalVendorResponse,
} from '@/models/vendorRegistration';
import { PaymentReceiptItem } from '@/shared/schema/paymentReceiptItemSchema';
import {
  IPaymentSlipUploadResponseSchema,
  IPaymentSlipUploadSchema,
} from '@/shared/schema/paymentSlipUploadSchema';
import { ISupportingDocUploadSchema } from '@/shared/schema/supportingDocUploadSchema';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

export const paymentApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getServicePriceRange: builder.query<any[], { key: string }>({
      query: ({ key }) => ({
        url: `Service-pricing/get-formatted-business-classes/${key}`,
        method: 'GET',
      }),
    }),
    postRenewalInvoice: builder.mutation<any, string[]>({
      query: (data) => ({
        url: `/invoices/generate-renewal-invoice`,
        method: 'POST',
        body: data,
      }),
    }),
    getRenewalInvoice: builder.query<RenewalInvoiceRenewalVendorResponse, any>({
      query: () => ({
        url: `/invoices/get-my-renewal-invoice`,
        method: 'GET',
        // body: data,
      }),
    }),
    uploadPaymentSlip: builder.query<
      IPaymentSlipUploadResponseSchema,
      IPaymentSlipUploadSchema
    >({
      query(data) {
        const formData = new FormData();
        formData.append('attachmentUrl', data.file);
        return {
          url: `upload/upload-payment-receipt-new/${data.transactionNumber}/${data.invoiceIds}/${data.serviceId}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    uploadSupportingDoc: builder.query<
      IPaymentSlipUploadResponseSchema,
      ISupportingDocUploadSchema
    >({
      query(data) {
        const formData = new FormData();
        formData.append('attachmentUrl', data.file);
        return {
          url: `/upload/upload-supporting-document-attachment/${data.fieldName}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getPaymentSlip: builder.query<string, PaymentReceiptItem>({
      query(data) {
        return {
          url: `/upload/get-attachment-pre-signed-object/${data.attachment}`,
          method: 'GET',
          headers: {
            // Set Content-Type to image/png for PNG images
          },
        };
      },
    }),
    getBankList: builder.query<BankNamesResponse[], any>({
      query: () => ({
        url: `/BankAccountDetail/fetch-bank`,
        method: 'GET',
      }),
    }),

    getLineOfBusiness: builder.query<LineOfBusinessResponse, any>({
      query: () => ({
        url: `/Categories`,
        method: 'GET',
      }),
    }),

    getPriceRange: builder.query<PriceRangeResponse[], { type: string }>({
      query: (data) => ({
        url: `/Service-pricing/get-service-price-by-service-type/${data.type}`,
        method: 'GET',
      }),
    }),
    getActivitiesProgress: builder.query<
      GetActivitiesProgressResponse,
      { instanceId: string }
    >({
      query: (data) => ({
        url: `application-execution/get-activities-progress/${data.instanceId}`,
        method: 'GET',
      }),
    }),
    generateInvoiceForAdditionalService: builder.mutation<
      any,
      AreasOfBusinessInterestType[]
    >({
      query: (data) => ({
        url: `invoices/generate-new-registration-invoice`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});
