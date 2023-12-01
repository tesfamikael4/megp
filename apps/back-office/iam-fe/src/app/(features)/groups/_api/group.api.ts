import { Group } from '@/models/group';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const groupApi = entityApi.entitySliceApi['group'];

export const groupSliceApi: typeof EntitySliceApi = createEntitySlice<Group>(
  groupApi as any,
  'Groups',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
  useLazyListByIdQuery,
} = groupSliceApi;
