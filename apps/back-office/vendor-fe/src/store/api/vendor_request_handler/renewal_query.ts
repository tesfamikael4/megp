import { VendorRequests } from './type';
import { renewalSlice } from './renewal_slice';
export const apiRenewaltQuery = renewalSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendorRequests: builder.query<any, VendorRequests>({
      query: (payload) => ({
        url: `api/ApplicationExecution/get-currunt-tasks/${payload.serviceKey}`, // Include parameters in the URL
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllVendorRequestsQuery } = apiRenewaltQuery;
