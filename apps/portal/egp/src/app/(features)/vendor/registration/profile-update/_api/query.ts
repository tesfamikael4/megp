import {
  GetFormResponse,
  AddFormRequest,
  AddFormRequestData,
  GetApproveVendorInfoResponse,
} from '@/models/vendorRegistration';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getApproveVendorInfo: builder.query<GetApproveVendorInfoResponse, any>({
      query: () => `/vendor-registrations/get-vendor-information`,
    }),
    saveAsDraftApproveVendorInfo: builder.mutation<any, AddFormRequest>({
      query: (data) => ({
        url: '/vendor-registrations/add-vendor-update-information',
        method: 'POST',
        body: data,
      }),
    }),
    updateSaveAsDraftApproveVendorInfo: builder.mutation<any, AddFormRequest>({
      query: (data) => ({
        url: '/vendor-registrations/submit-vendor-update-information',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetApproveVendorInfoQuery,
  useSaveAsDraftApproveVendorInfoMutation,
  useUpdateSaveAsDraftApproveVendorInfoMutation,
} = vendorRegistrationQuery;
