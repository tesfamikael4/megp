import { Role } from '@/models/role';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const roleApi = entityApi.entitySliceApi['roles'];

export const roleSliceApi: typeof EntitySliceApi = createEntitySlice<Role>(
  roleApi as any,
  'roles',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListByIdQuery,
} = roleSliceApi;
