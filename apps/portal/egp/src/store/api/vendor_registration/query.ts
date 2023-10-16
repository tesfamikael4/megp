import {
  BankNamesResponse,
  LineOfBusinessResponse,
  PriceRangeResponse,
  CreateVendorIdRequest,
  CreateVendorIdResponse,
  GetFormRequest,
  GetFormResponse,
} from '@/models/vendorRegistration';
import { vendorRegistrationApi } from './api';

// Replace these types with your actual types for any objects

// Define your CRUD API endpoints
export const vendorRegistrationQuery = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getForm: builder.query<GetFormResponse, GetFormRequest>({
      query: (data) =>
        `/api/VendorRegistrations/get-vendor-by-vendorId/${data.vendorId}`,
    }),
    createVendorId: builder.mutation<
      CreateVendorIdResponse,
      CreateVendorIdRequest
    >({
      query: (data) => ({
        url: '/api/VendorRegistrations/vendor-initiation',
        method: 'POST',
        body: data,
      }),
    }),
    addForm: builder.mutation<any, Partial<any>>({
      query: (newany) => ({
        url: '/api/VendorRegistrations/add-vendor-information',
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

    deleteFormDraft: builder.mutation<void, number>({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
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
        url: `api/Categories/get-all-categories`,
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

export const {
  useGetFormQuery,
  useCreateVendorIdMutation,
  useAddFormMutation,
  useUpdateFormMutation,
  useDeleteFormDraftMutation,
  useGetBankListQuery,
  useGetLineOfBusinessQuery,
  useGetPriceRangeQuery,
} = vendorRegistrationQuery;
