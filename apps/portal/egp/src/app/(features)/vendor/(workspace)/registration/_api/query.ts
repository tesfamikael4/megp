import { paymentApi } from './payment.api';
import { vendorDataGetawayQuery } from './vendor-dategateway-query';
import { vendorRegistrationQuery } from './vendor-regitration-query.api';

export const {
  useGetFormQuery,
  useGetVendorQuery,
  useLazyGetVendorOnDemandQuery,
  useGetVendorInfoQuery,
  useGetInvoiceQuery,
  useCreateVendorIdMutation,
  useAddFormMutation,
  useGetForRenewalVendorQuery,
  useGetApproveVendorInfoQuery,
  useLazyGetApproveVendorInfoQuery,
  useGetCertificateInformationQuery,
  useGetVendorStatusQuery,
  useGetApprovedVendorInfoQuery,
  useAddAdditionalServiceMutation,
  useGetInvoiceByUserIdQuery,
  useGetApplicationListQuery,
  useGetMyDraftServicesQuery,
} = vendorRegistrationQuery;

export const {
  useGetBankListQuery,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
  useGetActivitiesProgressQuery,
  useLazyUploadPaymentSlipQuery,
  useLazyUploadSupportingDocQuery,
  useLazyGetPaymentSlipQuery,
  useGetRenewalInvoiceQuery,
  usePostRenewalInvoiceMutation,
  useGetServicePriceRangeQuery,
  useLazyGetServicePriceRangeQuery,
  useGenerateInvoiceForAdditionalServiceMutation,
} = paymentApi;

export const {
  useLazyGetMRADataQuery,
  useLazyGetMBRSDataQuery,
  useLazyGetFPPADataQuery,
  useLazyGetNCICDataQuery,
} = vendorDataGetawayQuery;
