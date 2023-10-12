import {
  BankNamesResponse,
  CategoriesListResponse,
  PriceRangeResponse,
  CreateVendorIdRequest,
  CreateVendorIdResponse,
  GetFormRequest,
  GetFormResponse,
} from '@/models/vendorRegistration';
import { vendorRegistrationApi } from './api';

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

    getBankList: builder.query<BankNamesResponse[], any>({
      query: () => ({
        url: `api/BankAccountDetail/fetch-bank`,
        method: 'GET',
      }),
    }),

    getCategoriesList: builder.query<CategoriesListResponse, any>({
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
  useGetBankListQuery,
  useGetCategoriesListQuery,
  useGetPriceRangeQuery,
} = vendorRegistrationQuery;
