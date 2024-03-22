import { ApprovedVendorResponse } from '@/models/approved-vendor-response';
import { Report } from '@/models/report';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';

export const reportsApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query<Report, any>({
      query: () => ({
        url: `reports/get-dashboard-report`,
        method: 'GET',
      }),
    }),
    getVendors: build.query<
      { items: any[]; total: number },
      CollectionQuery | undefined
    >({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `application-execution/get-vendors${q}`,
          method: 'GET',
        };
      },
    }),
    getApprovedVendorById: build.query<ApprovedVendorResponse, { id: string }>({
      query: ({ id }) => ({
        url: `vendor-registrations/get-approved-vendor-byId/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetVendorsQuery,
  useLazyGetVendorsQuery,
  useGetApprovedVendorByIdQuery,
} = reportsApi;
