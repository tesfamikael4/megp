import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const rolePermissionApi = entityApi.entitySliceApi['role-permissions'];

export const rolePermissionSliceApi: typeof EntitySliceApi = createEntitySlice(
  rolePermissionApi as any,
  'role-permissions',
  'role',
  'permission',
);

export const {
  useRelationMutation,
  useLazyFirstRelationQuery,
  useLazySecondRelationQuery,
} = rolePermissionSliceApi;
