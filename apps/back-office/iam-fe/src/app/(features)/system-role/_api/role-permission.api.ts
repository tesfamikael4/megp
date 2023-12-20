import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const rolePermissionApi = entityApi.entitySliceApi['role-permissions'];

export const rolePermissionSliceApi: typeof EntitySliceApi = createEntitySlice(
  rolePermissionApi as any,
  'role-system-permissions',
  'role-system',
  'permission',
);

export const {
  useRelationMutation,
  useLazyFirstRelationQuery,
  useLazySecondRelationQuery,
} = rolePermissionSliceApi;
