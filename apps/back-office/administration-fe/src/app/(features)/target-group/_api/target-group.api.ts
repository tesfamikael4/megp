import { TargetGroup } from '@/models/target-group';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const targetGroupsApi = entityApi.entitySliceApi['Target-groups'];

export const targetGroupSliceApi: typeof EntitySliceApi =
  createEntitySlice<TargetGroup>(targetGroupsApi as any, 'Target-groups');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = targetGroupSliceApi;
