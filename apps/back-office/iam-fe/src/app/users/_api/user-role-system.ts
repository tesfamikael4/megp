import { Role } from '@/models/role';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const userSystemRoleApi = entityApi.entitySliceApi['user-role-systems'];

export const userSystemRoleSliceApi: typeof EntitySliceApi =
  createEntitySlice<Role>(
    userSystemRoleApi as any,
    'user-role-systems',
    'user',
    'roleSystem',
  );

export const { useRelationMutation, useLazySecondRelationQuery } =
  userSystemRoleSliceApi;
