
import { VendorRequests, Data } from './type';
import { VendorRequest } from './type';
import { newRegistrationSlice } from './new_registration_slice';
export const apiVendorRequestQuery =
  newRegistrationSlice.injectEndpoints({
    endpoints: (builder) => ({

      getAllVendorRequests: builder.query<Data, VendorRequests>({
        query: (payload) => ({
          url: `api/ApplicationExecution/get-currunt-tasks/${payload.serviceKey}`, // Include parameters in the URL
          method: 'GET',

        }),
      }),
      getVendor: builder.query<any, { id: string }>({
        query: (payload) => ({
          url: `api/vendor-registrations/get-vendor-by-vendorId/${payload.id}`, // Include parameters in the URL
        }),
      }),
      getApplicationRequestDetailById: builder.query<any, VendorRequest>({

        query: (payload) => ({
          url: `api/ApplicationExecution/get-currunt-taskDetail/${payload.instanceId}`,
          method: 'GET',

        }),
      }),
      getInvoice: builder.query({
        query: () => ({
          url: `api/ApplicationExecution/get-invoices`,
          method: 'GET',

        }),
      }),
      goToNextState: builder.mutation<any, any>({
        query: (data) => ({
          url: `api/workflow-instances/goto-next-state`,
          method: 'POST',
          body: data,
        }),
      }),
      pickTask: builder.mutation<any, any>({
        query: (data) => ({
          url: `api/ApplicationExecution/pick-task`,
          method: 'POST',
          body: data,
        }),
      }),
      unpickTask: builder.mutation<any, any>({
        query: (data) => ({
          url: `api/ApplicationExecution/unpick-task`,
          method: 'POST',
          body: data,
        }),
      }),

    }),

  });

export const {
  useGetAllVendorRequestsQuery,
  useGetApplicationRequestDetailByIdQuery,
  useGetInvoiceQuery,
  useGoToNextStateMutation,
  usePickTaskMutation,
  useUnpickTaskMutation,
  useGetVendorQuery


} = apiVendorRequestQuery;


