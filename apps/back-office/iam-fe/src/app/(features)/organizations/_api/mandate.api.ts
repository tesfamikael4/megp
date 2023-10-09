import { Mandate } from '@/models/mandate';
import { mandateApi } from '@/store/api/other/mandate.api';

const organizationMandateApi = mandateApi.injectEndpoints({
  endpoints: (build) => ({
    getMandateByOrganization: build.query<{ items: Mandate[] }, string>({
      query: (id) => {
        return {
          url: `mandates/get-all-to-assign/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['mandates'],
    }),

    getOrganiationMandate: build.query<any, string>({
      query: (id) => {
        return {
          url: `organizations/${id}?includes[0]=organizationMandates.mandate`,
          method: 'GET',
        };
      },
      providesTags: ['mandates'],
    }),
    getMyOrgMandate: build.query<any, string>({
      query: (id) => {
        return {
          url: `organizations/${id}?includes[0]=organizationMandates.mandate`,
          method: 'GET',
        };
      },
    }),

    addOrganizationMandate: build.mutation<any, { dataSent: any; id: string }>({
      query: ({ dataSent, id }) => {
        return {
          url: `/organizations/assign-mandates/${id}`,
          method: 'POST',
          body: dataSent,
        };
      },
      invalidatesTags: ['mandates'],
    }),
  }),
});

export const {
  useGetMandateByOrganizationQuery,
  useGetMyOrgMandateQuery,
  useGetOrganiationMandateQuery,
  useAddOrganizationMandateMutation,
} = organizationMandateApi;
