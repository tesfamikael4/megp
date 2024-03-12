import {
  AddFormRequest,
  AreasOfBusinessInterestType,
  CreateVendorIdRequest,
  CreateVendorIdResponse,
  GetApplicationListResponse,
  GetCertificateInformationResponse,
  GetForRenewalVendorResponse,
  GetFormResponse,
  GetVendorInfoResponse,
  RenewalInvoiceRenewalVendorResponse,
} from '@/models/vendorRegistration';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

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
    getApplicationList: builder.query<GetApplicationListResponse[], any>({
      query: () => `/vendor-registrations/track-application`,
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
        status:
          | 'Submitted'
          | 'Draft'
          | 'Initial'
          | 'Completed'
          | 'Approved'
          | 'Pending'
          | 'Adjustment';
        initial: { status: string; level: string };
        q;
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
