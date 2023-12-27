import {
  BankNamesResponse,
  LineOfBusinessResponse,
  PriceRangeResponse,
  CreateVendorIdRequest,
  CreateVendorIdResponse,
  GetFormResponse,
  GetNCICDataResponse,
  GetFPPADataResponse,
  GetMBRSDataResponse,
  AddFormRequest,
  GetVendorInfoResponse,
  GetActivitiesProgressResponse,
  GetForRenewalVendorResponse,
} from '@/models/vendorRegistration';
import { PaymentReceiptItem } from '@/shared/schema/paymentReceiptItemSchema';
import {
  IPaymentSlipUploadResponseSchema,
  IPaymentSlipUploadSchema,
} from '@/shared/schema/paymentSlipUploadSchema';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from '@/store/api/vendor_registration/api';

export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-by-userId`,
    }),
    getVendorInfo: builder.query<GetVendorInfoResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-info-by-userId`,
    }),
    getForm: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-vendor-by-vendorId`,
    }),
    getForRenewalVendor: builder.query<GetForRenewalVendorResponse, any>({
      query: () => `/vendor-registrations/get-approved-vendor-service-byUserId`,
    }),
    getInvoice: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-invoice-by-userId`,
    }),
    getRenewalInvoice: builder.query<GetFormResponse, String[]>({
      query: (data) => ({
        url: `/vendor-registrations/get-service-invoice-for-renewal/${data.join(
          ',',
        )}`,
        method: 'GET',
      }),
    }),
    createVendorId: builder.mutation<
      CreateVendorIdResponse,
      CreateVendorIdRequest
    >({
      query: (data) => ({
        url: '/vendor-registrations/vendor-initiation',
        method: 'POST',
        body: data,
      }),
    }),
    addForm: builder.mutation<any, AddFormRequest>({
      query: (newany) => ({
        url: '/vendor-registrations/add-vendor-information',
        method: 'POST',
        body: newany,
      }),
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
    uploadPaymentSlip: builder.query<
      IPaymentSlipUploadResponseSchema,
      IPaymentSlipUploadSchema
    >({
      query(data) {
        const formData = new FormData();
        formData.append('attachmentUrl', data.file);
        return {
          url: `/upload/upload-payment-receipt/${data.transactionNumber}/${data.serviceId}/${data.invoiceId}`,
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
  }),
});

export const vendorDataGetawayQuery = vendorDataGetawayApi.injectEndpoints({
  endpoints: (builder) => ({
    getMRAData: builder.query<any, any>({
      query: (data) => ({
        url: `tax-payer/${data.tin}/${data.issuedDate}`,
        method: 'GET',
      }),
    }),
    getMBRSData: builder.query<GetMBRSDataResponse, any>({
      query: (data) => ({
        url: `customer-bussines-info/${data.tin}/BLN54321`,
        method: 'GET',
      }),
    }),
    getFPPAData: builder.query<GetFPPADataResponse, any>({
      query: (data) => ({
        url: `fppa-vendor/${data.tin}`,
        method: 'GET',
      }),
    }),
    getNCICData: builder.query<GetNCICDataResponse, any>({
      query: (data) => ({
        url: `ncic-vendors/${data.tin}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetFormQuery,
  useGetVendorQuery,
  useGetVendorInfoQuery,
  useGetInvoiceQuery,
  useCreateVendorIdMutation,
  useAddFormMutation,
  useGetBankListQuery,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
  useGetActivitiesProgressQuery,
  useLazyUploadPaymentSlipQuery,
  useLazyGetPaymentSlipQuery,
  useGetForRenewalVendorQuery,
  useLazyGetRenewalInvoiceQuery,
} = vendorRegistrationQuery;

export const {
  useLazyGetMRADataQuery,
  useLazyGetMBRSDataQuery,
  useLazyGetFPPADataQuery,
  useLazyGetNCICDataQuery,
} = vendorDataGetawayQuery;
