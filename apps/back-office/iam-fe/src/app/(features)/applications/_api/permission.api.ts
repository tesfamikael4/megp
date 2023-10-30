import { Permission } from '@/models/permission';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
export const permissionApi = entityApi.entitySliceApi['permissions'];

export const permissionSliceApi: typeof EntitySliceApi =
  createEntitySlice<Permission>(permissionApi as any, 'Permissions');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListByIdQuery,
  useListByAppIdQuery,
  useLazyListByAppIdQuery,
} = permissionSliceApi;
