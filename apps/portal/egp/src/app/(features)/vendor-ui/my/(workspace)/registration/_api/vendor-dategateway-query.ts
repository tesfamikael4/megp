import {
  GetFPPADataResponse,
  GetMBRSDataResponse,
  GetNCICDataResponse,
} from '@/models/vendorRegistration';
import { vendorDataGetawayApi } from '@/store/api/vendor_registration/api';

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
