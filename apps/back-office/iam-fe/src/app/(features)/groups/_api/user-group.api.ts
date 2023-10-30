import { Group } from '@/models/group';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const groupApi = entityApi.entitySliceApi['user-groups'];

export const groupSliceApi: typeof EntitySliceApi = createEntitySlice<Group>(
  groupApi as any,
  'user-groups',
  'user',
  'group',
);

export const {
  useRelationMutation,
  useReverseRelationMutation,
  useLazyFirstRelationQuery,
  useLazySecondRelationQuery,
} = groupSliceApi;
