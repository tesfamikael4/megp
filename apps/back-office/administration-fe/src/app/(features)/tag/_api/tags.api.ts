import { Tag } from '@/models/Tag';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const tagsApi = entityApi.entitySliceApi['tags'];

export const tagSliceApi: typeof EntitySliceApi = createEntitySlice<Tag>(
  tagsApi as any,
  'tags',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = tagSliceApi;
