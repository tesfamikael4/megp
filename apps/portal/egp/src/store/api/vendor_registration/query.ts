import { vendorRegistrationSlice } from './slice';
import {
  FormInitiationRequestProps,
  FormSubmissionRequestProps,
  FormSubmissionResponseProps,
  GetApplicationByUserIdResponseProps,
} from './type';
export const apiVendorRegistrationQuery =
  vendorRegistrationSlice.injectEndpoints({
    endpoints: (builder) => ({
      saveForm: builder.query<
        FormSubmissionResponseProps,
        FormSubmissionRequestProps
      >({
        query: (data) => ({
          url: `api/VendorRegistrations/add-vendor-information`, // Include parameters in the URL
          method: 'POST', // Adjust the HTTP method as needed
          body: data,
        }),
      }),
      getFormInitiationRequest: builder.query<any, FormInitiationRequestProps>({
        query: (payload) => ({
          url: `api/TinRegistrationDatabaseController/tin-registration-database-service-by-tinNumber`, // Include parameters in the URL
          method: 'GET', // Adjust the HTTP method as needed
          params: payload,
        }),
      }),
      getApplicationByUserId: builder.query<
        GetApplicationByUserIdResponseProps,
        { userId: string }
      >({
        query: (payload) => ({
          url: `api/VendorRegistrations/get-vendor-by-userId/${payload.userId}`, // Include parameters in the URL
          method: 'GET', // Adjust the HTTP method as needed
        }),
      }),
    }),
    // overrideExisting: true,
  });

export const {
  useLazySaveFormQuery,
  useGetApplicationByUserIdQuery,
  useGetFormInitiationRequestQuery,
} = apiVendorRegistrationQuery;

//  # Selector
