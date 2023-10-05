import { vendorRegistrationSlice } from './slice';
import {
  BankListResponse,
  FormInitiationRequest,
  FormSubmissionRequest,
  FormSubmissionResponse,
  GetApplicationByUserIdResponse,
  AreasOfBusinessInterestCategoriesListResponse,
  AreasOfBusinessInterestPriceRangeResponse,
} from './type';
export const apiVendorRegistrationQuery =
  vendorRegistrationSlice.injectEndpoints({
    endpoints: (builder) => ({
      saveForm: builder.query<FormSubmissionResponse, FormSubmissionRequest>({
        query: (data) => ({
          url: `api/VendorRegistrations/add-vendor-information`,
          method: 'POST',
          body: data,
        }),
      }),
      getFormInitiationRequest: builder.query<any, FormInitiationRequest>({
        query: (payload) => ({
          url: `api/TinRegistrationDatabaseController/tin-registration-database-service-by-tinNumber`,
          method: 'GET',
          params: payload,
        }),
      }),
      getApplicationStatusByUserId: builder.query<
        {
          createdAt: string;
          id: string;
          tin: string;
          status: string;
          name: string;
        },
        { userId: string }
      >({
        query: (payload) => ({
          url: `api/VendorRegistrations/get-vendor-by-userId/${payload.userId}`,
          method: 'GET',
        }),
      }),
      getApplicationByVendorId: builder.query<
        GetApplicationByUserIdResponse,
        { vendorId: string }
      >({
        query: (payload) => ({
          url: `api/VendorRegistrations/get-vendor-by-vendorId/${payload.vendorId}`,
          method: 'GET',
        }),
      }),
      getDraftApplicationByUserId: builder.query<
        GetApplicationByUserIdResponse,
        { vendorId: string }
      >({
        query: (payload) => ({
          url: `api/VendorRegistrations/get-vendor-information-by-vendorId/${payload.vendorId}`,
          method: 'GET',
        }),
      }),

      deleteApplicationByVendorId: builder.query<any, { vendorId: string }>({
        query: (payload) => ({
          url: `api/VendorRegistrations/delete-vendor/${payload.vendorId}`,
          method: 'DELETE',
        }),
      }),
      getBankList: builder.query<BankListResponse[], any>({
        query: () => ({
          url: `api/BankAccountDetail/fetch-bank`,
          method: 'GET',
        }),
      }),
      getAreasOfBusinessInterestCategoriesList: builder.query<
        AreasOfBusinessInterestCategoriesListResponse,
        any
      >({
        query: () => ({
          url: `api/Categories/get-all-categories`,
          method: 'GET',
        }),
      }),
      getAreasOfBusinessInterestPriceRange: builder.query<
        AreasOfBusinessInterestPriceRangeResponse,
        any
      >({
        query: () => ({
          url: `api/Service-pricing`,
          method: 'GET',
        }),
      }),
    }),
  });
export const {
  useLazySaveFormQuery,
  useGetApplicationByVendorIdQuery,
  useLazyGetFormInitiationRequestQuery,
  useLazyGetDraftApplicationByUserIdQuery,
  useGetApplicationStatusByUserIdQuery,
  useLazyDeleteApplicationByVendorIdQuery,
  useGetBankListQuery,
  useGetAreasOfBusinessInterestCategoriesListQuery,
  useGetAreasOfBusinessInterestPriceRangeQuery,
} = apiVendorRegistrationQuery;

//  # Selector
