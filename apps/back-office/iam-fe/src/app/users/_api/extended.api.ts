import { User } from '@/models/user/user';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const userApi = entityApi.entitySliceApi['user-profile'];

export const userSliceApi: typeof EntitySliceApi = createEntitySlice<User>(
  userApi as any,
  'user-profile',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = userSliceApi;
