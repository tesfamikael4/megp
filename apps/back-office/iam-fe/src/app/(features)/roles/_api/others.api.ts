import { orgPermissionApi } from '@/store/api/other/org-permission.api';

const organizationMandateApi = orgPermissionApi.injectEndpoints({
  endpoints: (build) => ({
    getPermissionByOrganizationId: build.query<any, string>({
      query: (id) => ({
        url: `permissions/organization/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPermissionByOrganizationIdQuery } = organizationMandateApi;
