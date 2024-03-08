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
  PostForRenewalVendorResponse,
  PostForRenewalVendorRequest,
  RenewalInvoiceRenewalVendorResponse,
  RenewalInvoiceRenewalVendorRequest,
  GetCertificateInformationResponse,
  AreasOfBusinessInterestType,
} from '@/models/vendorRegistration';
import { PaymentReceiptItem } from '@/shared/schema/paymentReceiptItemSchema';
import {
  IPaymentSlipUploadResponseSchema,
  IPaymentSlipUploadSchema,
} from '@/shared/schema/paymentSlipUploadSchema';
import { ISupportingDocUploadSchema } from '@/shared/schema/supportingDocUploadSchema';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from '@/store/api/vendor_registration/api';

export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<GetFormResponse, { flag?: string }>({
      query: ({ flag }) => {
        return {
          url: `/vendor-registrations/get-isr-vendor-by-userId`,
          params: { flag },
        };
      },
    }),

    getVendorOnDemand: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-by-userId`,
    }),
    getVendorInfo: builder.query<GetVendorInfoResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-info-by-userId`,
    }),
    getApprovedVendorInfo: builder.query<GetVendorInfoResponse, any>({
      query: () =>
        `/vendor-registrations/get-approved-isr-vendor-info-by-userId`,
    }),
    getApproveVendorInfo: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-vendor-information`,
    }),
    getForm: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-vendor-by-vendorId`,
    }),
    getInvoice: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-isr-vendor-invoice-by-userId`,
    }),
    getForRenewalVendor: builder.query<GetForRenewalVendorResponse, any>({
      query: () => `/vendor-registrations/get-approved-vendor-service-byUserId`,
    }),
    postRenewalVendor: builder.query<GetForRenewalVendorResponse, string[]>({
      query: (data) => ({
        url: `/vendor-registrations/submit-service-renewal`,
        method: 'POST',
        body: data,
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
    getInvoiceByUserId: builder.query<RenewalInvoiceRenewalVendorResponse, any>(
      {
        query: () => ({
          url: `/vendor-registrations/get-invoice-by-userId`,
          method: 'GET',
          // body: data,
        }),
      },
    ),
    getVendorStatus: builder.query<
      {
        status: 'Submitted' | 'Draft' | 'Initial' | 'Completed' | 'Approved';
        initial: { status: string; level: string };
      },
      any
    >({
      query: () => ({
        url: `/vendor-registrations/get-application-status-by-userId`,
      }),
    }),
    getPendingApplications: builder.query<any, any>({
      query: () => ({
        url: `/vendor-registrations/get-pending-vendor-applications`,
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
          url: `upload/upload-payment-receipt-new/${data.transactionNumber}/${data.invoiceId}/${data.serviceId}`,
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
    getCertificateInformation: builder.query<
      GetCertificateInformationResponse,
      void
    >({
      query() {
        return {
          url: `vendor-registrations/get-certificate-informations`,
          method: 'GET',
        };
      },
    }),
    addAdditionalService: builder.mutation<any, AreasOfBusinessInterestType[]>({
      query: (data) => ({
        url: `vendor-registrations/add-service`,
        method: 'POST',
        body: data,
      }),
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
  useLazyGetVendorOnDemandQuery,
  useGetVendorInfoQuery,
  useGetInvoiceQuery,
  useCreateVendorIdMutation,
  useAddFormMutation,
  useGetBankListQuery,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
  useGetActivitiesProgressQuery,
  useLazyUploadPaymentSlipQuery,
  useLazyUploadSupportingDocQuery,
  useLazyGetPaymentSlipQuery,
  useGetForRenewalVendorQuery,
  useGetRenewalInvoiceQuery,
  usePostRenewalInvoiceMutation,
  useGetApproveVendorInfoQuery,
  useLazyGetApproveVendorInfoQuery,
  useGetCertificateInformationQuery,
  useGetVendorStatusQuery,
  useGetApprovedVendorInfoQuery,
  useAddAdditionalServiceMutation,
  useGetInvoiceByUserIdQuery,
} = vendorRegistrationQuery;

export const {
  useLazyGetMRADataQuery,
  useLazyGetMBRSDataQuery,
  useLazyGetFPPADataQuery,
  useLazyGetNCICDataQuery,
} = vendorDataGetawayQuery;
