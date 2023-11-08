import { Tag } from '@/models/Tag';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const tagApi = entityApi.entitySliceApi['tag'];

export const tagSliceApi: typeof EntitySliceApi = createEntitySlice<Tag>(
  tagApi as any,
  'tags',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = tagSliceApi;
