import { VendorRequests } from './type';
import { VendorRequest } from './type';
import { newRegistrationSlice } from './new_registration_slice';
export const apiVendorRequestQuery = newRegistrationSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendorRequests: builder.query<any, VendorRequests>({
      query: (payload) => ({
        url: `api/ApplicationExecution/get-currunt-tasks/${payload.serviceKey}`, // Include parameters in the URL
        method: 'GET',
      }),
    }),
    getApplicationRequestDetailById: builder.query<any, VendorRequest>({
      query: (payload) => ({
        url: `api/ApplicationExecution/get-currunt-taskDetail/${payload.instanceId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAllVendorRequestsQuery,
  useGetApplicationRequestDetailByIdQuery,
} = apiVendorRequestQuery;
