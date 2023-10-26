import { Permission } from '@/models/permission';
import { permissionApi } from '@/store/api/other/permission.api';

const permissionsApi = permissionApi.injectEndpoints({
  endpoints: (build) => ({
    getpermissionByApplicationId: build.query<any, string>({
      query: (id) => {
        return {
          url: `/permissions/get-all-under-application/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['permissions'],
    }),
    createPermission: build.mutation<any, Permission>({
      query: (data) => {
        return {
          url: `/permissions`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['permissions'],
    }),
    deletePermission: build.mutation<any, string>({
      query: (id) => {
        return {
          url: `/permissions/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['permissions'],
    }),
  }),
});

export const {
  useGetpermissionByApplicationIdQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;
