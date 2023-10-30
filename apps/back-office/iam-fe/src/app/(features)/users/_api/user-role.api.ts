import { Role } from '@/models/role';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const userRoleApi = entityApi.entitySliceApi['user-role'];

export const userRoleSliceApi: typeof EntitySliceApi = createEntitySlice<Role>(
  userRoleApi as any,
  'user-role',
  'user',
  'unit',
);

export const { useRelationMutation, useLazySecondRelationQuery } =
  userRoleSliceApi;
