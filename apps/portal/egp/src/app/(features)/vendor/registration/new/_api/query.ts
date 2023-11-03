import {
  BankNamesResponse,
  LineOfBusinessResponse,
  PriceRangeResponse,
  CreateVendorIdRequest,
  CreateVendorIdResponse,
  GetFormRequest,
  GetFormResponse,
  GetNCICDataResponse,
  GetFPPADataResponse,
  GetMBRSDataResponse,
} from '@/models/vendorRegistration';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from '@/store/api/vendor_registration/api';

export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getForm: builder.query<GetFormResponse, GetFormRequest>({
      query: (data) =>
        `/api/vendor-registrations/get-vendor-by-vendorId/${data.vendorId}`,
    }),
    createVendorId: builder.mutation<
      CreateVendorIdResponse,
      CreateVendorIdRequest
    >({
      query: (data) => ({
        url: '/api/vendor-registrations/vendor-initiation',
        method: 'POST',
        body: data,
      }),
    }),
    addForm: builder.mutation<any, Partial<any>>({
      query: (newany) => ({
        url: '/api/vendor-registrations/add-vendor-information',
        method: 'POST',
        body: newany,
      }),
    }),

    updateForm: builder.mutation<any, any>({
      query: (updatedany) => ({
        url: `update/${updatedany.id}`,
        method: 'PUT',
        body: updatedany,
      }),
    }),

    getBankList: builder.query<BankNamesResponse[], any>({
      query: () => ({
        url: `api/BankAccountDetail/fetch-bank`,
        method: 'GET',
      }),
    }),

    getLineOfBusiness: builder.query<LineOfBusinessResponse, any>({
      query: () => ({
        url: `api/Categories`,
        method: 'GET',
      }),
    }),

    getPriceRange: builder.query<PriceRangeResponse, any>({
      query: () => ({
        url: `api/Service-pricing`,
        method: 'GET',
      }),
    }),
  }),
});

export const vendorDataGetawayQuery = vendorDataGetawayApi.injectEndpoints({
  endpoints: (builder) => ({
    getMRAData: builder.query<any, any>({
      query: (data) => ({
        url: `tax-payer/${data.tin}/${data.issuedDate}`,
        method: 'GET',
      }),
    }),
    getMBRSData: builder.query<GetMBRSDataResponse, any>({
      query: (data) => ({
        url: `customer-bussines-info/${data.tin}/BLN54321`,
        method: 'GET',
      }),
    }),
    getFPPAData: builder.query<GetFPPADataResponse, any>({
      query: (data) => ({
        url: `fppa-vendor/${data.tin}`,
        method: 'GET',
      }),
    }),
    getNCICData: builder.query<GetNCICDataResponse, any>({
      query: (data) => ({
        url: `ncic-vendors/${data.tin}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetFormQuery,
  useCreateVendorIdMutation,
  useAddFormMutation,
  useUpdateFormMutation,
  useGetBankListQuery,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
} = vendorRegistrationQuery;

export const {
  useLazyGetMRADataQuery,
  useLazyGetMBRSDataQuery,
  useLazyGetFPPADataQuery,
  useLazyGetNCICDataQuery,
} = vendorDataGetawayQuery;
