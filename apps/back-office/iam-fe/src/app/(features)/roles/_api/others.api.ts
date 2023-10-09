import { Mandate } from '@/models/mandate';
import { mandateApi } from '@/store/api/other/mandate.api';

const organizationMandateApi = mandateApi.injectEndpoints({
  endpoints: (build) => ({
    getPermissionByOrganizationId: build.query<any, string>({
      query: (id) => ({
        url: `permissions/get-all-under-organization/${id}`,
        method: 'GET',
      }),
    }),
    getRolePermissions: build.query<any, any>({
      query: (id) => ({
        url: `roles/${id}?includes[0]=rolePermissions`,
        method: 'GET',
      }),
    }),
    assignPermisionToRole: build.mutation<any, { data: any; idParse: string }>({
      query: ({ data, idParse }) => {
        return {
          url: `roles/assign-permissions/${idParse}`,
          method: 'POST',
          body: data,
        };
      },
      // invalidatesTags: ['roles'],
    }),
  }),
});

export const {
  useAssignPermisionToRoleMutation,
  useGetPermissionByOrganizationIdQuery,
  useGetRolePermissionsQuery,
} = organizationMandateApi;
