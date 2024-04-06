import { GetFormResponse } from '@/models/vendorRegistration';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getApproveVendorInfo: builder.query<GetFormResponse, any>({
      query: () => `/vendor-registrations/get-vendor-information`,
    }),
  }),
});

export const { useGetApproveVendorInfoQuery } = vendorRegistrationQuery;
