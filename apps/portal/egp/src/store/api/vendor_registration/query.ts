import { vendorRegistrationSlice } from './slice';
export const apiVendorRegistrationQuery =
  vendorRegistrationSlice.injectEndpoints({
    endpoints: (builder) => ({
      saveForm: builder.query<any, any>({
        query: (data) => ({
          url: `/add-vendor-information`, // Include parameters in the URL
          method: 'POST', // Adjust the HTTP method as needed
          body: data,
        }),
      }),
      getFormById: builder.query<{ userId: string }, any>({
        query: (payload) => ({
          url: `/get-vendor-by-userId/`, // Include parameters in the URL
          method: 'POST', // Adjust the HTTP method as needed
          params: payload,
        }),
      }),
    }),
    // overrideExisting: true,
  });

export const { useLazySaveFormQuery, useGetFormByIdQuery } =
  apiVendorRegistrationQuery;

//  # Selector
