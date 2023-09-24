import { vendorRegistrationSlice } from './slice';
import { FormInitiationRequestProps } from './type';
export const apiVendorRegistrationQuery =
  vendorRegistrationSlice.injectEndpoints({
    endpoints: (builder) => ({
      saveForm: builder.query<any, any>({
        query: (data) => ({
          url: `api/VendorRegistrations/add-vendor-information`, // Include parameters in the URL
          method: 'POST', // Adjust the HTTP method as needed
          body: data,
        }),
      }),
      getFormById: builder.query<{ userId: string }, any>({
        query: (payload) => ({
          url: `api/VendorRegistrations/get-vendor-by-userId/`, // Include parameters in the URL
          method: 'POST', // Adjust the HTTP method as needed
          params: payload,
        }),
      }),
      getFormInitiationRequest: builder.query<any, FormInitiationRequestProps>({
        query: (payload) => ({
          url: `api/TinRegistrationDatabaseController/tin-registration-database-service-by-tinNumber`, // Include parameters in the URL
          method: 'GET', // Adjust the HTTP method as needed
          params: payload,
        }),
      }),
    }),
    // overrideExisting: true,
  });

export const {
  useLazySaveFormQuery,
  useGetFormByIdQuery,
  useGetFormInitiationRequestQuery,
} = apiVendorRegistrationQuery;

//  # Selector
